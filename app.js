// app.js
// What we run to get the program started.
var app = require('express')();
var cookieParser = require('cookie-parser')();
var bodyParser = require('body-parser');
var config = require('./config');
app.use(cookieParser);
app.use(bodyParser.json());

var globalCache = require('./cache');
var http = require('http').Server(app);

var database = require('./database');
var lsMgr = require('./liveStatsManager');

var ws = require('./apiWebsocket');
var websocketApi = new ws(app, http, database);

var ls = require('./apiLiveStats');
var livestatsApi = new ls(app, http, websocketApi, lsMgr);

var server = app.listen(config.port, config.host, function(){
  console.log('***API Frontend Started Listening on Port 3000***');
});
