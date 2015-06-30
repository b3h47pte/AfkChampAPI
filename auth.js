// auth.js
// Makes sure the given command can be executed with the given privilege.
// Also make sure we are sure of who we are communicating with (client/backend).
var config = require('./config');
var pconfig = require('./private/privateConfig');
var forge = require('node-forge');
var auth = {}
auth.GetAuthLevel = function(data) {
  if (auth.checkAuthBackendMessage(data)) {
    return auth.AuthLevelEnum.BACKEND; 
  }
  return auth.AuthLevelEnum.CLIENT;
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
  
  var checkSignature = auth.ServerSignMessageHex(data.message);
  return (checkSignature.toUpperCase() == data.signature.toUpperCase());
}

module.exports = auth;
