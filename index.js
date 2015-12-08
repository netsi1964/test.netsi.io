var express = require("express");
var app = express();
var netsiSuncalc = require("./netsi_suncalc.js");

app.set("port", (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

app.get("/", function(request, response) {
  var result = netsiSuncalc();
  // response.setHeader("Content-Type", "text/html");
  response.send(result);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running on port", app.get("port"));
});
