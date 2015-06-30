// app.js
// What we run to get the program started.
var app = require('express')();
var cookieParser = require('cookie-parser')();
var bodyParser = require('body-parser');
var config = require('./config');
app.use(cookieParser);
app.use(bodyParser.json());
app.use(function (req, res, next) {
    // TODO: Set this properly
    res.setHeader('Access-Control-Allow-Origin', "http://127.0.0.1");
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

var server = app.listen(config.port, config.host, function(){
  console.log('***API Frontend Started Listening on Port 3000***');
});

var globalCache = require('./cache');
var http = require('http').Server(app);

var database = require('./database');
var lsMgr = require('./liveStatsManager');

var ws = require('./apiWebsocket');
var websocketApi = new ws(app, http, database, server);

var ls = require('./apiLiveStats');
var livestatsApi = new ls(app, http, websocketApi, lsMgr);
