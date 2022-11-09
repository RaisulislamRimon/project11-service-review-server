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

const services = require("https://service-review-serverce-assignment");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.txudmws.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

app.get("/", (req, res) => {
  res.send("service-review-server is running");
});

app.get("/services", (req, res) => {
  res.send(services);
});

app.get("/services/:id", (req, res) => {
  const id = req.params.id;
  console.log(id);
  const service = services.find((service) => service.id == id);
  console.log(service);
  // const service = services.find((service) => console.log(service.id));
  res.send(service);
});

app.get("*", function (req, res) {
  res.status(404).send("service route not found");
});

app.listen(port, () => {
  console.log(`service-review-server listening on port ${port}`);
});
