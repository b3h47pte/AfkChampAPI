// database.js
// Handles the database connection.
var db = {}
var pconfig = require('./private/privateConfig');
var mysql = require('mysql');
db.connectionPool = mysql.createPool({
  connectionLimit: pconfig.db.connectionLimit,
  host: pconfig.db.host,
  port: pconfig.db.port,
  user: pconfig.db.user,
  password: pconfig.db.password,
  database: pconfig.db.database
});

// StoreLiveUpdate is called whenever the API server receives an update from the
// server about any of the tracked games.
db.StoreLiveUpdate = function(match, data) {
  db.connectionPool.getConnection(function(err, connection) {
    if (err) {
      console.log("ERROR: " + err);
      return;
    }
 
    var queryString = "";
    connection.query(queryString, function(err, results, fields) {
      connection.release();
      if (err) {
        console.log("ERROR: " + err);
        return;
      }
    });
  });
}

module.exports = db
