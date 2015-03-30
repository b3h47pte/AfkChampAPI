// auth.js
// Makes sure the given command can be executed with the given privilege.
// Also make sure we are sure of who we are communicating with (client/backend).
var config = require('./config');
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
  NONE: 0,
  CLIENT: 1,
  BACKEND: 2,
  ADMIN: 3
});

auth.ServerSignMessageHex = function(message) {
  var hmac = forge.hmac.create();
  hmac.start('sha256', pconfig.backendPrivateKey);
  hmac.update(message);
  return hmac.digest().toHex();
};

auth.checkAuthBackendMessage = function (data) {
  if (!data.signature || !data.message) {
    return false;
  }

  var hmac = forge.hmac.create();
  var checkSignature = auth.ServerSignMessageHex(data.message);
  return (checkSignature == data.signature || !config.production);
}

module.exports = auth;
