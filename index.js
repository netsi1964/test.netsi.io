var express = require("express"),
  app = express(),
  hbs = require("express-handlebars").create(),
  fs = require("fs"),
  webshot = require("webshot"),
  cookieParser = require("cookie-parser"),
  exphbs = require("express-handlebars"),
  routeSuncalc = require("./routeSuncalc");

app.set("port", process.env.PORT || 5000);
app.use(express.static(__dirname + "/public"));
app.use("/static", express.static(__dirname + "/shoots"));
app.use(cookieParser());

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

app.get("/", routeSuncalc);

app.get("/shoot", function(req, res) {
  res.setHeader("Content-Type", "text/html");
  var context = {
    date: new Date()
  };
  hbs.render("./views/screenshoot.handlebars", context).then(function(html) {
    webshot(
      html,
      "./shoots/hello_world.png",
      {
        siteType: "html",
        req: req
      },
      function(err) {
        res.redirect("./static/hello_world.png");
      }
    );
  });
});

app.listen(app.get("port"), function() {
  console.log("Node app is running on port", app.get("port"));
});
