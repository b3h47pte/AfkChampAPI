// database.js
// Handles the database connection.
var db = {}
var pconfig = require('./private/privateConfig');
var config = require('./config.js');
var mysql = require('mysql');
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
      WHERE matches.matchid = " + parseInt(match).toString();

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
        db.StoreLeagueLiveUpdate(match, data);
        break;
      default:
        console.log("INVALID GAME ID REQUESTED: " + rows[0].gameid + " FROM MATCH ID: " + match);
        break;
      }
      
    });
  });
}

db.StoreLeagueLiveUpdate = function(match, data) {
}

module.exports = db
