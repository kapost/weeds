var https = require("https");
var fs = require("fs");
var proxy = require("express-http-proxy");
var app = require("express")();

var host = process.env["HOST"];

app.use("/api", proxy("localhost:5002"));

app.use("/", proxy("localhost:5001", {
  forwardPath: function(req, _res) {
    return req.url.startsWith("/client") ? req.url : "/client";
  },
  decorateRequest: function(reqOpts, req) {
    reqOpts.headers["X-Forwarded-Host"] = host + ":5000";
    req.url = "/client";
    return reqOpts;
  }
}));

console.log("Proxy listening on 5000. Visit http://lvh.me:5000 after running `npm run development`");

app.listen(5000);
