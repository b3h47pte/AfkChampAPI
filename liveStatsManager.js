var liveStatsManager = {}
var config = require('./config');
var db = require('./database');
var http = require('http');

liveStatsManager.cache = require('./cache');

liveStatsManager.GenerateCacheKey = function(eventId, streamUrl, gameShortname) {
  return "matchid_cache_key_" + eventId + "_" + streamUrl + "_" + gameShortname;
}

// URL for the analyzer to send its information back to.
liveStatsManager.GenerateAPIReceiverUrl = function() {
  var url = "http://" + config.host + "/livestats";
  return url;
}

// Generate appropriate path (part of the URL) to send our request to on the analysis server
// such that the right stream gets run through the right analyzer.
liveStatsManager.GenerateLiveStatsPathForMatch = function(eventId, gameShortname, streamUrl, configPath) {
  var path = "/" + gameShortname + "?config=" + configPath + "&stream=" + streamUrl +
                "&apiHost=" + this.GenerateAPIReceiverUrl() + "&apiPort=" + config.port;
  if (config.debug) {
    path += "&debug=1";
  }
  return path;
}

liveStatsManager.RequestLiveStats = function(eventId, streamUrl, gameShortname) {
  // Make sure there isn't a duplicate request.
  var cacheKey = this.GenerateCacheKey(eventId, streamUrl, gameShortname);
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
  
  // EVENT OBJECT:
  //  - eventId: Event ID.
  //  - config: Where to pull the config file from. This is a remote file or a local file depending on whether or not we are running on production.
  db.GetStreamDataForLiveStatsQuery(eventId, gameShortname, streamUrl, function(event) {
    var liveStatServerHost = config.liveStatsHost;
    var liveStatServerPort = config.liveStatsPort;
    var liveStatServerPath = this.GenerateLiveStatsPathForStream(eventId, gameShortname, streamUrl, event.config);
    
    http.get({
      hostname: liveStatServerHost,
      port: liveStatServerPort,
      path: liveStatServerPath,
      agent: false
    }, function(res) {
      
    });
    
    // TODO: Check if this needs to be an actual state object
    this.cache.Put(cacheKey, 1);
    this.cache.Unlock(cacheKey);
  });
  
}

module.exports = liveStatsManager;