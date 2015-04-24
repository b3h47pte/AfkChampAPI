// database.js
// Handles the database connection.
var db = {};
var pconfig = require('./private/privateConfig');
var config = require('./config.js');
var mysql = require('mysql');
var async = require("async");
db.cache = require('./cache');

db.connectionPool = mysql.createPool({
  connectionLimit: pconfig.db.connectionLimit,
  host: pconfig.db.host,
  port: pconfig.db.port,
  user: pconfig.db.user,
  password: pconfig.db.password,
  database: pconfig.db.mainDatabase
});

// StoreLiveUpdate is called whenever the API server receives an update from the
// server about any of the tracked games.
db.StoreLiveUpdate = function(match, data) {
  var cleanMatchString = parseInt(match).toString();
  db.connectionPool.getConnection(function(err, connection) {
    if (err) {
      console.log("STORE LIVE UPDATE ERROR: " + err);
      return;
    }
 
    // Pass to the appropriate function based on the match's game.
    // Match ID -> Series ID -> Event ID -> Game ID -> Game Shorthand
    var gameQuery = "SELECT events.gameid \
      FROM rocketelo.matches matches \
        INNER JOIN rocketelo.series series ON series.seriesid = matches.parentseriesid \
        INNER JOIN rocketelo.events events ON events.eventid = series.parenteventid \
      WHERE matches.matchid = " + cleanMatchString;

    var resultQuery = connection.query(gameQuery, function (err, rows) {
      connection.release();
      
      if (err) {
        console.log("STORE LIVE UPDATE ERROR: " + err);
        return;
      }
      
      if (rows.length == 0) {
        return; 
      }
      
      switch(rows[0].gameid) {
      case config.leagueGameId:
        db.StoreLeagueLiveUpdate(cleanMatchString, data);
        break;
      default:
        console.log("INVALID GAME ID REQUESTED: " + rows[0].gameid + " FROM MATCH ID: " + match + " (" + cleanMatchString + ")" );
        break;
      }
      
    });
  });
}

db.LaunchQuery = function(query, callback) {
  db.connectionPool.getConnection(function(err, connection) {
    if (err) {
      console.log("LAUNCH QUERY ERROR: " + err + " :::: " + query);
      return;
    }
    connection.query(query, function(err, results) {
      connection.release();
      callback(err, results);
    });
  });
}

db.GetTeamIdsForMatch = function(match, data, cachedData, cb) {
  // Find the teams assigned to this match and get their shortnames and match it up to the teams given in data.
  var teamsQuery = "SELECT teams.teamid, teams.teamshorthand \
    FROM rocketelo.match_team match_team \
      INNER JOIN rocketelo.teams teams ON teams.teamid = match_team.teamid \
    WHERE match_team.matchid = " + match;
  db.LaunchQuery(teamsQuery, function(err, result) {
    if (err) {
      console.log("GET TEAM IDS ERROR: " + err);
      return;
    }
    
    cachedData.teamIds = [];
  });
}

db.GetPlayerIdsForMatch = function(match, data, cachedData, cb) {
  var playersQuery = "";
}

db.StoreLeagueLiveUpdate = function(match, data) {
  function StoreStatUpdate() {
  
  }
  
  function StoreSetupUpdate() {
    cachedData.savedSetup = true;
    
    // Save team setups
    for (i = 0; i < 2; ++i) {
      for (j = 0; j < 3; ++j) {
        var query = "INSERT INTO league_of_legends.match_team_setup (teamid, banned_champion, parentmatchid) VALUES (?, ?, ?)";
        db.LaunchQuery(query, [cachedData.teamIds[i], cachedData.teamsetup[i][j], parseInt(match)], function(err, result) {
        });
      }
    }
    
    // Save player setups
    for (i = 0; i < 2; ++i) {
      for (j = 0; j < 5; ++j) {
        var query = "INSERT INTO league_of_legends.match_player_setup (playerid, champion, parentmatchid) VALUES (?, ?, ?)";
        db.LaunchQuery(query, [cachedData.playerIds[i][j], cachedData.playersetup[i][j], parseInt(match)], function(err, result) {
        });
      }
    }
  }
  
  function CacheSetupUpdate() {
    // ONLY STORE THIS DATA IN THE CACHE UNTIL WE'RE READY TO DUMP IT INTO THE DATABASE
    // Team Setup (Team Bans)
    cachedData.teamsetup = [];
    cachedData.teamsetup.push(data.bans[0].slice(0));
    cachedData.teamsetup.push(data.bans[1].slice(0));

    // Player Setup (Champion Pick)
    cachedData.playersetup = [];
    cachedData.playersetup.push(data.picks[0].slice(0));
    cachedData.playersetup.push(data.picks[1].slice(0));
  }
  
  function HandleUpdate() {
    // See LEAGUE_UPDATE.format as to how 'data' will have its information stored.
    if (data.mode == 0) {
      if (!cachedData.savedSetup) {
        StoreSetupUpdate();   
      }
      StoreStatUpdate(); 
    } else if (data.mode == 1) {
      CacheSetupUpdate();
    }
  }

  var cachedData = db.cache.Access(match);
  if (!cachedData) {
    var recache = db.cache.Lock(match);
    if (!recache) {
      setTimeout(function() {
        db.StoreLeagueLiveUpdate(match, data);
      }, 200);
      return;
    }
    
    cachedData = {};
    
    // Get Team ID's and Player ID's for the match
    // This information is fixed for now -- but this should eventually be adaptable based on the live stats information (AKA GET PLAYER NAMES)
    db.GetTeamIdsForMatch(match, data, cachedData, function() {
      db.GetPlayerIdsForMatch(match, data, cachedData, function(){
        db.cache.Put(match, cachedData);
        db.cache.Unlock();
        HandleUpdate();
      });
    });
  }
}

module.exports = db
