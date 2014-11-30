// database.js
// Handles the database connection.
var db = {}
var config = require('./config');
var mysql = require('mysql');
db.connectionPool = mysql.createPool({
  connectionLimit: config.db.connectionLimit;
  host: config.db.host,
  user: config.db.user,
  password: config.db.password
});

// StoreLiveUpdate is called whenever the Websocket API receives an update from the
// server about any of the tracked games.
db.StoreLiveUpdate = function(match, data) {
  db.connectionPool.getConnection(function(err, connection) {
    if (err) throw err;
 
    var queryString = "";


    connection.query(queryString, function(err, results, fields) {
      if (err) throw err;
      connection.release();
    });
  });
}

module.exports = db
