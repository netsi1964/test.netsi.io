var express = require("express");
var app = express();
var cookieParser = require('cookie-parser');

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
  var ip = req.headers['X-Forwarded-For'] || req.connection.remoteAddress;
  ip = (ip.indexOf(".") === -1) ? "" : ip;
  geolocation(ip, function() {
    var result = netsiSuncalc();
    res.setHeader("Content-Type", "text/html");
    res.send(result);
  })

});






app.listen(app.get('port'), function() {
  console.log("Node app is running on port", app.get("port"));
});
