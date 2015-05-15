// apiLiveStats.js
// Handles incoming/outgoing communication with the live stat server(s).
// ALL OF THIS DATA SHOULD BE AUTHENTICATED AND HAVE ITS INTEGRITY CHECKED.
var livestats = function(app, http, ws, lsMgr) {
  
  // Receive Live Stats from the Server.
  app.post('/livestats', function(req, res) {
    // Pass it to the websocket API
    ws.HandleIncomingLiveStatsData(req.body);
    res.send('');
  });
  
  // Receive request to start retrieving live stats for a stream.
  app.get('/livestats', function(req, res) {
    var matchId = req.query.matchId;
    lsMgr.RequestLiveStats(matchId);
    res.send('');
  });
};

module.exports = livestats;