var cache = {};

cache.Access = function(key) {
  if (!cache.hasOwnProperty(key)) {
    return null;
  }
  cache[key].lastAccess = new Date().getTime();
  return cache[key];
}

cache.Put = function(key, value) {
  cache[key] = value;
  cache[key].lastAccess = new Date().getTime();
}

module.exports = cache;