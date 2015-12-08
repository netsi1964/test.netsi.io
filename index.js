var express = require("express");
var app = express();
var cookieParser = require('cookie-parser');

var netsiSuncalc = require("./netsi_suncalc.js");
var location = require("./location.js");

app.set("port", (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');


app.get("/", function(req, res) {
  //var result = netsiSuncalc();
  // res.setHeader("Content-Type", "text/html");
  res.render('map', {
    location: req.cookies.location
  });
  //res.send(result);
});

app.get("/location", function(req, res) {
  if (!req.cookies.location) {
    location(function(location) {
      if (!location) {
        res.status("400").json({
          error: "Could not get location"
        });
      } else {
        if (location) {
          var temp = location.loc.split(",").map(function(e) {
            return parseFloat(e);
          });
          location.loc = {"lat":temp[0], "lng":temp[1]};
        }
        res.cookie('location', location, {
          maxAge: 60 * 1000 * 60 * 24 * 3
        });
        location.fromCookie = false;
        res.json(location);
      }
    });
  } else {
    var loc = req.cookies.location;
    loc.fromCookie = true;
  }
  res.json(loc);
});



app.listen(app.get('port'), function() {
  console.log("Node app is running on port", app.get("port"));
});
