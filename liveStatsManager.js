var liveStatsManager = {}
var config = require('./config');
var db = require('./database');
var http = require('http');

liveStatsManager.cache = require('./cache');

liveStatsManager.GenerateCacheKey = function(matchId) {
  return "matchid_cache_key_" + matchId.toString();
}

// URL for the analyzer to send its information back to.
liveStatsManager.GenerateAPIReceiverUrl = function(match) {
  var url = "http://" + config.host + "/livestats";
  return url;
}

// Generate appropriate path (part of the URL) to send our request to on the analysis server
// such that the right stream gets run through the right analyzer.
liveStatsManager.GenerateLiveStatsPathForMatch = function(match) {
  var path = "/" + match.game + "?config=" + match.config + "&stream=" + match.stream +
                "&apiHost=" + this.GenerateAPIReceiverUrl(match) + "&apiPort=" + config.port +
                "&matchId=" + match.matchId.toString();
  if (config.debug) {
    path += "&debug=1";
  }
  return path;
}

liveStatsManager.RequestLiveStats = function(matchId) {
  // Make sure there isn't a duplicate request.
  var cacheKey = this.GenerateCacheKey(matchId);
  if (!this.cache.Lock(cacheKey)) {
    setTimeout(function() {
        this.RequestLiveStats(matchId);
      }, 200);
    return;
  }
  
  // A Live Stats server has already been tasked to process this stream
  if (this.cache.Access(cacheKey)) {
    return;
  }
  
  // MATCH OBJECT:
  //  - matchId: Match ID.
  //  - game: Game Name. This should be the game name stored in the database WHICH SHOULD BE EQUIVALENT TO THE GAME NAME RECOGNIZED BY THE ANALYZER.
  //  - stream: Stream URL that the analysis should grab data from.
  //  - config: Where to pull the config file from. This is a remote file or a local file depending on whether or not we are running on production.
  db.GetMatchDataForLiveStatsQuery(matchId, function(match) {
    var liveStatServerHost = config.liveStatsHost;
    var liveStatServerPort = config.liveStatsPort;
    var liveStatServerPath = this.GenerateLiveStatsPathForMatch(match);
    
    http.get({
      hostname: liveStatServerHost,
      port: liveStatServerPort,
      path: liveStatServerPath,
      agent: false
    }, function(res) {
      
    });
  });
  
}

module.exports = liveStatsManager;