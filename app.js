// app.js
// What we run to get the program started.
var app = require('express')();
var cookieParser = require('cookie-parser')();
var bodyParser = require('body-parser');
app.use(cookieParser);
app.use(bodyParser.json());

var http = require('http').Server(app);
var database = require('./database');
var websocketApi= require('./apiWebsocket')(http, database);

app.get("/test", function(req, res) {
  database.connectionPool.getConnection(function(err, connection) {
    if(err) throw err;

    connection.query('SELECT * FROM events', function (err, rows) {
      connection.release();

      

    });
    

  });
});

http.listen(3000, function(){
  console.log('***API Frontend Started Listening on Port 3000***');
});
