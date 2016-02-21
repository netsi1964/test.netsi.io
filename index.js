var express = require("express"),
  app = express(),
  url = require('url'),
  cookieParser = require('cookie-parser');

var netsiSuncalc = require("./netsi_suncalc.js"),
  geolocation = require("./geolocation.js");

app.set("port", (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


app.get("/", function(req, res) {

  function returnResult(options) {
    var result = netsiSuncalc(options);
    res.setHeader("Content-Type", "text/html");
    res.render('map', {
      suncalc: result,
      options: options
    });
  }

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var options = "";
  if (typeof query.lat !== "undefined" && typeof query.lng !== "undefined") {
    //console.log("User have specified a geolocation")
    returnResult({
      latitude: query.lat,
      longitude: query.lng
    });
  } else {
    //console.log("Try to find geolocation from browser")
    var ip = req.headers['X-Forwarded-For'] || req.connection.remoteAddress;
    ip = (ip.indexOf(".") === -1) ? "" : ip;
    geolocation(ip, function(userInfo) {
      options = (userInfo.status !== 'fail') ? {
        latitude: userInfo.loc.lat,
        longitude: userInfo.loc.lng
      } : "";
      returnResult(options);
    });
  }



});


app.listen(app.get('port'), function() {
  console.log("Node app is running on port", app.get("port"));
});
