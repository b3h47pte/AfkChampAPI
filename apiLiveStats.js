// apiLiveStats.js
// Handles incoming/outgoing communication with the live stat server(s).
// ALL OF THIS DATA SHOULD BE AUTHENTICATED AND HAVE ITS INTEGRITY CHECKED.
var livestats = function(app, http, ws, lsMgr) {
  
  // Receive Live Stats from the Server.
  app.post('/livestats', function(req, res) {
    // Pass it to the websocket API
    console.log("Request Query: " + req.path + " " + req.originalUrl);
    console.log(req.body);
    ws.HandleIncomingLiveStatsData(req.body);
    res.send('');
  });
  
  // Receive request to start retrieving live stats for a stream.
  app.get('/livestats', function(req, res) {
    var eventId = req.query.eventId;
    var streamUrl = req.query.streamUrl;
    var gameShortname = req.query.gameShortname;
    lsMgr.RequestLiveStats(eventId, streamUrl, gameShortname);
    res.send('');
  });
};

module.exports = livestats;