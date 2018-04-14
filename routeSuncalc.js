var url = require("url"),
  netsiSuncalc = require("./netsi_suncalc.js"),
  geolocation = require("./geolocation.js");

const returnResult = (res, options) => {
  var result = netsiSuncalc(options);
  res.setHeader("Content-Type", "text/html");
  res.render("map", {
    suncalc: result,
    options: options
  });
};

module.exports = routeSuncalc = (req, res) => {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var options = "";
  if (typeof query.lat !== "undefined" && typeof query.lng !== "undefined") {
    //console.log("User have specified a geolocation")
    returnResult(res, {
      latitude: query.lat,
      longitude: query.lng
    });
  } else {
    //console.log("Try to find geolocation from browser")
    var ip = req.headers["X-Forwarded-For"] || req.connection.remoteAddress;
    ip = ip.indexOf(".") === -1 ? "" : ip;
    console.log("You are at IP " + ip);
    geolocation(ip, function(userInfo) {
      options =
        userInfo.status !== "fail"
          ? {
              latitude: userInfo.loc.lat,
              longitude: userInfo.loc.lng
            }
          : "";
      returnResult(res, options);
    });
  }
};
