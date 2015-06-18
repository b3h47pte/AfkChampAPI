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

db.GetLeagueMatchId = function(eventId, data, callback) {
  if(!data || !data.teams || data.teams.length != 2) {
    callback(null);
    return;
  }
  
  var team1 = data.teams[0].name;
  var team2 = data.teams[1].name;
  var matchQuery = "SELECT matches.matchid AS matchid, teams.teamshorthand AS team\
        FROM rocketelo.matches matches \
          INNER JOIN rocketelo.match_team match_team ON matches.matchid = match_team.matchid \
          INNER JOIN rocketelo.series series ON matches.parentseriesid = series.seriesid \
          INNER JOIN rocketelo.events events ON series.parenteventid = events.eventid \
          INNER JOIN rocketelo.games games ON events.gameid = games.gameid \
          INNER JOIN rocketelo.teams teams ON match_team.teamid = teams.teamid \
        WHERE events.eventid = ? AND games.gameshorthand = ?";
  db.LaunchQuery(matchQuery, [eventId.toString(), config.leagueGameShortname], function(err, result) {
    if (err) {
      console.log("Get League Match Id Error: " + err);
      callback(null);
      return;
    }
    
    var foundTeams = true;
    for (var i = 0; i < 2; ++i) {
      var found = result.some(function(ele, idx) {
        return (ele.team == data.teams[i].name);
      });
      foundTeams = foundTeams && found;
    }
    
    if (!foundTeams) {
      console.log("Get League Match Id Error: Could not find a match for these teams -- " + JSON.stringify(data.teams));
      callback(null);
      return;
    }
    
    callback(result[0].matchid);
  });
}

db.GetStreamDataForLiveStatsQuery = function(eventId, gameShortname, streamUrl, callback) {
  var eventQuery = "SELECT events.eventid AS eventId, events.configpath AS config \
        FROM rocketelo.events events \
        WHERE events.eventid = ?";
  db.LaunchQuery(eventQuery, [eventId.toString()], function(err, result) {
    if (err) {
      console.log("Generate Live Stats Path Error: " + err);
      callback(null);
    } else {
      callback(result[0]);
    }
  });
}

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

db.LaunchQuery = function(query, params, callback) {
  db.connectionPool.getConnection(function(err, connection) {
    if (err) {
      console.log("LAUNCH QUERY ERROR: " + err + " :::: " + query);
      return;
    }
    connection.query(query, params, function(err, results) {
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
  db.LaunchQuery(teamsQuery, [], function(err, result) {
    if (err) {
      console.log("GET TEAM IDS ERROR: " + err);
      return;
    }
    
    cachedData.teamIds = [];
    cachedData.teamNames = [];
    
    result.forEach(function(r, idx) {
      cachedData.teamIds.push(r.teamid);
      cachedData.teamNames.push(r.teamshorthand);
    });
    cb();
  });
}

db.GetPlayerIdsForMatch = function(match, data, cachedData, cb) {
  cachedData.playerIds = [];
  cachedData.playerNames = [];
  cachedData.teamIds.forEach(function(t, i) {
    var playersQuery = "SELECT players.playerid, players.playername \
      FROM rocketelo.match_player match_player \
        INNER JOIN rocketelo.players players ON players.playerid = match_player.playerid \
      WHERE match_player.matchid = " + match + " AND players.parentteamid = " + t.toString();
    db.LaunchQuery(playersQuery, [], function(err, result) {
      if (err) {
        console.log("GET PLAYER IDS ERROR: " + err);
        return;
      }

      cachedData.playerIds.push([]);
      cachedData.playerNames.push([]);
      
      result.forEach(function(r, idx) {
        cachedData.playerIds[i].push(r.playerid);
        cachedData.playerNames[i].push(r.playername);
      });
      cb();
    });
  });
}

db.StoreLeagueLiveUpdate = function(match, data) {
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
    
    // Get Team ID's, Player ID's for the match
    // This information is fixed for now -- but this should eventually be adaptable based on the live stats information (AKA GET PLAYER NAMES)
    db.GetTeamIdsForMatch(match, data, cachedData, function() {
      db.GetPlayerIdsForMatch(match, data, cachedData, function(){
        db.cache.Put(match, cachedData);
        db.cache.Unlock();
        HandleUpdate();
      });
    });
  } else {
    HandleUpdate();
  }
  
  function StoreStatUpdate() {
    // Create new match stat row
    var query = "INSERT INTO league_of_legends.match_stats (timestamp, parentmatchid, timetobaron, timetodragon) VALUES (?, ?, ?, ?)";
    db.LaunchQuery(query, [data.global.time, parseInt(match), data.global.timeToDragon, data.global.timeToBaron], function(err, result) {
      if (err) {
        console.log("INSERT INTO MATCH STATS ERROR: " + err);
        return;
      }
      var statId = result.insertId;
      var tasks = [];
      if (data.teams && data.teams.length > 0) {
        data.teams.forEach(function(t, i){
          tasks.push(function(callback) {
            var query = "INSERT INTO league_of_legends.match_stats_team (parentmatchstatid, kills, gold, towers, totalDragons, currentDragons, barons, inhibitors, teamid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            db.LaunchQuery(query, [statId, t.kills, t.gold, t.towers, t.totalDragons, t.currentDragons, t.barons, t.inhibitors, cachedData.teamIds[i]], function(err, result) {
              callback(err, result);
            });
          });
          
          if (t.players && t.players.length > 0) {
            t.players.forEach(function(p, j) {
              tasks.push(function(callback) {
                var query = "INSERT INTO league_of_legends.match_stats_player (parentmatchstatid, kills, deaths, assists, creeps, towers, inhibitors, barons, dragons, playerid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                db.LaunchQuery(query, [statId, p.kills, p.deaths, p.assists, p.creeps, p.towers, p.inhibs, p.barons, p.dragons, cachedData.playerIds[i][j]], function(err, result) {
                  callback(err, result);
                });
              }); 
            });
          }  
        });
      }
      
      if (data.events && data.events.length > 0) {
        data.events.forEach(function(e, i) {
          tasks.push(function(callback) {
            async.waterfall([
              function(cb) {
                var query = "INSERT INTO league_of_legends.match_event (eventtarget, eventtargetsecondary, relevantteam, killtype, timestamp, parentmatchid) VALUES (?, ?, ?, ?, ?, ?, ?)";
                db.LaunchQuery(query, [e.target, e.secondarytarget, cachedData.teamIds[e.team], e.killtype, data.global.time, parseInt(match)], function(err, result) {
                  cb(err, result);
                }); 
              },
              // Main Player
              function(inRes, cb) {
                async.parallel([
                  function(inRes, cb) {
                    var query = "INSERT INTO league_of_legends.match_event_player (matcheventid, playerid, ismainplayer) VALUES (?, ?, ?)";
                    db.LaunchQuery(query, [inRes.insertId, cachedData.playerIds[e.team][e.mainPlayer], 1], function(err, result) {
                      cb(err, result);
                    }); 
                  },
                  // Supporting Players
                  function(inRes, cb) {
                    var sp_tasks = [];
                    e.supportingPlayers.forEach(function(sp, j) {
                      sp_tasks.push(function(icb) {
                        var query = "INSERT INTO league_of_legends.match_event_player (matcheventid, playerid, ismainplayer) VALUES (?, ?, ?)";
                        db.LaunchQuery(query, [inRes.insertId, cachedData.playerIds[(e.team+1)%2][sp], 0], function(err, result) {
                          icb(err, result);
                        }); 
                      });
                    });
                    async.parallel(sp_tasks, function(err, results) {
                      cb(results);
                    });
                  }
                ], function (err, results) {
                  cb(err, results.concat([inRes]));
                });
              }
            ], function(err, results) {
              callback(err, results);
            });
          });  
        });
      }
      
      async.parallel(tasks, function(err, results) {
        if (err) {
          console.log("STORE STATE UPDATE ERROR: " + err); 
        }
      });
    });
  }
  
  function StoreSetupUpdate() {
    if(!cachedData.savedSetup) {
      return;
    }
    cachedData.savedSetup = true;
    
    // Save team setups
    for (i = 0; i < 2; ++i) {
      for (j = 0; j < 3; ++j) {
        var query = "INSERT INTO league_of_legends.match_team_setup (teamid, banned_champion, parentmatchid) VALUES (?, ?, ?)";
        db.LaunchQuery(query, [cachedData.teamIds[i], cachedData.teamsetup[i][j], parseInt(match)], function(err, result) {
          if (err) {
            console.log("SAVE TEAM SETUP ERROR: " + err);
          }
        });
      }
    }
    
    // Save player setups
    for (i = 0; i < 2; ++i) {
      for (j = 0; j < 5; ++j) {
        var query = "INSERT INTO league_of_legends.match_player_setup (playerid, champion, parentmatchid) VALUES (?, ?, ?)";
        db.LaunchQuery(query, [cachedData.playerIds[i][j], cachedData.playersetup[i][j], parseInt(match)], function(err, result) {
          if (err) {
            console.log("SAVE PLAYER SETUP ERROR: " + err);
          }
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
}

module.exports = db
