var app = require('express')();
var cookieParser = require('cookie-parser')();
var bodyParser = require('body-parser');
app.use(cookieParser);
app.use(bodyParser.json());

var http = require('http').Server(app);
var auth = require('./auth');

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
