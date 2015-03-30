// apiLiveStats.js
// Handles incoming/outgoing communication with the live stat server(s).
// ALL OF THIS DATA SHOULD BE AUTHENTICATED AND HAVE ITS INTEGRITY CHECKED.
var livestats = function(app, http, ws) {
  app.post('/livestats', function(req, res) {
    // Pass it to the websocket API
    ws.HandleIncomingLiveStatsData(req.body);
    res.send('');
  });
};

module.exports = livestats;