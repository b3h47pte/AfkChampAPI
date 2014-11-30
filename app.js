// app.js
// What we run to get the program started.
var app = require('express')();
var cookieParser = require('cookie-parser')();
var bodyParser = require('body-parser');
app.use(cookieParser);
app.use(bodyParser.json());

var http = require('http').Server(app);
var websocketApi= require('./apiWebsocket')(http);

http.listen(3000, function(){
  console.log('***API Frontend Started Listening on Port 3000***');
});
