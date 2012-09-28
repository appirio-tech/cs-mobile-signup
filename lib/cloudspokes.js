
var request = require('request');
var util = require('util');
var querystring = require('querystring');

var Api = function(opts) {

}

Api.prototype.createAccount = function(params, callback) {

  var options = {
  	uri: process.env.CLOUDSPOKES_API_URL+ '/accounts/create',
    method: 'POST',
    body: querystring.stringify(params),
    headers: {
	    'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Token token="'+process.env.CLOUDSPOKES_API_KEY+'"'
    }
  };

  request(options, function(err, res, body){
    if(!err && res.statusCode == 200) {
      if(body) body = JSON.parse(body);
      callback(null, body);
    }
  });  

}

// exports
module.exports.init = function(opts) {
  return new Api(opts);
}