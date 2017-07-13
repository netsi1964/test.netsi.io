var request = require('request');

module.exports = function(ip, callback) {
  var url = "http://ip-api.com/json/" + ip + "fields=258047";
  request({
    url: url,
    json: true
  }, function(error, response, body) {
    if (error) {
      console.log("Request for "+url);
      console.log("gave error "+error);
      callback(error);
    } else {
      callback(body);
    }
  });
};
