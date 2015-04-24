var cache = {};
var locks = {};

cache.Access = function(key) {
  if (!cache.hasOwnProperty(key)) {
    return null;
  }
  cache[key].lastAccess = new Date().getTime();
  return cache[key];
}

cache.Lock = function(key) {
  if(locks.hasOwnProperty(key)) {
    return false;
  }
  locks[key] = true;
  return true;
}

cache.Unlock = function(key) {
  if (locks.hasOwnProperty(key)) {
     delete locks[key];
  }
}

cache.Put = function(key, value) {
  cache[key] = value;
  cache[key].lastAccess = new Date().getTime();
}

module.exports = cache;