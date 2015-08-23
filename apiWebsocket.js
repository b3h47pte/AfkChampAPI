// apiWebsocket.js
// Handles the Websocket API (mainly used as the method of providing live stats).
var auth = require('./auth');
var config = require('./config');
var websocket = function(app, http, db, server) {
  this.io = require('socket.io').listen(server);
  this.db = db;

  function HandleLiveStatsSocket(socket) {
    var authLevel = auth.AuthLevelEnum.NONE;

    // Identify ourselves as a client/backend/admin/whatever. Needed to make sure
    // the person on the other end is who we think they are. Also join the 
    // appropriate room as necessary.
    socket.on('identify', function(data) {
      authLevel = auth.GetAuthLevel(data);
      if (authLevel == auth.AuthLevelEnum.CLIENT) {
        if(!data.match) {
          console.log("!!! ERROR: Failed to identify due to not having a match");
          return; 
        }
        socket.join(data.match);
      }
    });

    // Once we disconnect, make sure this socket can't be used anymore.
    socket.on('disconnect', function() {
      authLevel = auth.AuthLevelEnum.NONE;
    });
  }

  this.io.on('connection', HandleLiveStatsSocket);
};

websocket.prototype.CreateNamespace = function(matchId) {
 return matchId;
}

/*
 * TODO: Refactor this code to live separately outside the websocket object...
 */
websocket.prototype.GetMatchIdFromIdentifyingData = function(eventId, gameShortname, data, callback) {
  if (gameShortname == config.leagueGameShortname) {
    this.db.GetLeagueMatchId(eventId, data, function(res) {
      if (res === null) {
        console.log("ERROR: Could not find League of Legends match from Data: " + data);
        callback(null);
      } else {
        callback(res);
      }
    });
  } else {
    console.log("Invalid Game Shortname: Game not yet supported by the Live Stats Server -- " + gameShortname);
    callback(null);
  }
}

websocket.prototype.HandleIncomingLiveStatsData = function(data) {
  // First need to make sure the data has maintained its INTEGRITY and then make sure the data comes from an AUTHENTICATED source
  var receivedSignature = data.signature;
  delete data["signature"];
  
  var receiveData = {
    "message": JSON.stringify(data),
    "signature": receivedSignature
  };
  
  if (!auth.checkAuthBackendMessage(receiveData)) {
    console.log("Invalid Message (Auth): " + JSON.stringify(data));
    return;
  }
  
  if (!data.eventId || !data.gameShortname) {
    console.log("Invalid Message (Missing General Identifying Data): " + JSON.stringify(data));
    return;
  }
  
  var sws = this;
  this.GetMatchIdFromIdentifyingData(data.eventId, data.gameShortname, data, function(matchId) {
    if (matchId === null) {
      return;
    }
    
    var socketNamespace = sws.CreateNamespace(matchId);
  
    var sendData = data;
      
    // Add extra data that the live stats can't detect (i.e. player names)
      
    // Recreate signature such that it's from the API server now.
    sendData.signature = auth.ServerSignMessageHex(JSON.stringify(sendData));
  
    // Store in DB
    sws.db.StoreLiveUpdate(matchId, sendData);
  
    // Transmit to Websockets
    sws.io.emit('liveupdate', sendData);
  });
}


module.exports = websocket;