const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const tmdb = require("./routes/tmdb");
const gameRoutes = require("./routes/gameRoutes");

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use("/TMDB", tmdb);

app.use("/gameRoutes", gameRoutes);

// 404 Handler
app.use((_req, res) => {
    res.status(404).json({ err: "Error 404: Not Found" });
  });
  
  // Error handler
  app.use((err, _req, res, _next) => {
    console.error(err);
    if (process.env.NODE_ENV === "development") {
      res.status(500).send(err.message);
    } else {
      res.status(500).json({ err: "Something went wrong" });
    }
  });
  
  module.exports = app;