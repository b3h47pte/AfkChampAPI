// auth.js
// Makes sure the given command can be executed with the given privilege.
// Also make sure we are sure of who we are communicating with (client/backend).
var pconfig = require('./private/privateConfig');
var forge = require('node-forge');
var auth = {}
auth.GetAuthLevel = function(data) {
  if (checkAuthBackendMessage(data)) {
    return AuthLevelEnum.BACKEND; 
  }
  return AuthLevelEnum.CLIENT;
};

auth.AuthLevelEnum = Object.freeze({
  CLIENT: 0,
  BACKEND: 1,
  ADMIN: 2
});

module.exports = auth;

function checkAuthBackendMessage(data) {
  if (!data.signature || !data.message) {
    return false;
  }

  var hmac = forge.hmac.create();
  hmac.start('sha256', pconfig.backendPrivateKey);
  hmac.update(data.message);
  return (hmac.digest().toHex() == data.signature);
}

module.exports = auth;
