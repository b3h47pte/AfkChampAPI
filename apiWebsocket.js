// apiWebsocket.js
// Handles the Websocket API (mainly used as the method of providing live stats).
var websocket = function(http) {
  var io = require('socket.io')(http);
  io.on('connection', HandleLiveStatsSocket);
};


var auth = require('./auth');
var db = require('./database');
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

  // Update live stats for a particular match. Can only be done by the 
  // backend/admin.
  socket.on('serverUpdate', function(data) {
    if (authLevel < auth.AuthLevelEnum.BACKEND) {
      return;
    }

    // Store data in the database
    db.StoreLiveUpdate(data.match, data.content);    
  
    // Make sure data is signed as being from the API server.
    data.signature = auth.ServerSignMessageHex(data.message, pconfig.apiPrivateKey);
    socket.broadcast.to(data.match).emit('clientUpdate', data);
  });

  // Once we disconnect, make sure this socket can't be used anymore.
  socket.on('disconnect', function() {
    authLevel = auth.AuthLevelEnum.NONE;
  });
}

module.exports = websocket
