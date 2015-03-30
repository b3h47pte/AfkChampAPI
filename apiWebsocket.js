// apiWebsocket.js
// Handles the Websocket API (mainly used as the method of providing live stats).
var auth = require('./auth');
var websocket = function(app, http, db) {
  this.io = require('socket.io')(http);

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

websocket.prototype.CreateNamespace = function(eventId) {
 return eventId;
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
  
  if (!data.eventId) {
    console.log("Invalid Message (Event ID): " + JSON.stringify(data));
    return;
  }
  
  var socketNamespace = this.CreateNamespace(data.eventId);
  
  var sendData = data;  
  // Recreate signature such that it's from the API server now.
  sendData.signature = auth.ServerSignMessageHex(JSON.stringify(sendData));
  
  this.io.of(socketNamespace).emit('update', sendData);
}


module.exports = websocket;