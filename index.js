const express = require("express");
const cors = require("cors");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("service-review-server is running");
});

app.get("*", function (req, res) {
  res.status(404).send("service route not found");
});

app.listen(port, () => {
  console.log(`service-review-server listening on port ${port}`);
});
