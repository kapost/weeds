var app = require("express")();

app.get("/user", function(_req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ fakeToken: "Fake JWT" }));
});

app.get("/", function(_req, res) {
  res.send("API root");
});

app.listen(5002);
