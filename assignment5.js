// https://expressjs.com/en/guide/routing.html

// REQUIRES
const express = require("express");
const app = express();
app.use(express.json());
const fs = require("fs");
const path = require("path");

// just like a simple web server like Apache web server
// we are mapping file system paths to the app's virtual paths
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/img"));
app.use("/fonts", express.static("./public/fonts"));

// load homepage
app.get("/", function (req, res) {
  let doc = fs.readFileSync(
    path.join(__dirname, "./app/html/index.html"),
    "utf8"
  );
  res.send(doc);
});

// serve the banners json file
app.get("/api/json-banners", function (req, res) {
  try {
    let jsonData = fs.readFileSync(
      path.join(__dirname, "./app/data/banners.json"),
      "utf-8"
    );
    let banners = JSON.parse(jsonData);
    res.json(banners);
  } catch (error) {
    console.error("Couldn't load banners.json");
    res.status(500).send("Couldn't load banners data");
  }
});

// serve the scores json file
app.get("/api/json-scores", function (req, res) {
  try {
    let jsonData = fs.readFileSync(
      path.join(__dirname, "./app/data/scores.json"),
      "utf8"
    );
    let scores = JSON.parse(jsonData);
    res.json(scores);
  } catch (error) {
    console.error("Couldn't read scores.json: ");
    res.status(500).send("Couldn't load scores data");
  }
});

// serve the standings table (for each sport)
app.get("/api/standings/:sport", (req, res) => {
  const sport = req.params.sport;
  try {
    let doc = fs.readFileSync(
      path.join(__dirname, `./app/data/${sport}.xml`),
      "utf-8"
    );
    res.setHeader("Content-Type", "application/xml");
    res.send(doc);
  } catch (error) {
    console.error(`Couldn't read ${sport}.xml`);
    res.status(500).send("Counldn't load standings data");
  }
});

// for resource not found (i.e., 404)
app.use(function (req, res, next) {
  res
    .status(404)
    .send(
      "<html><head><title>Page not found!</title></head><body><p>Nothing here.</p></body></html>"
    );
});

// RUN SERVER
let port = 8000;
app.listen(port, function () {
  console.log("Example app listening on port " + port + "!");
});
