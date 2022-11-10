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

// const services = require("https://service-review-server-iota.vercel.app");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.txudmws.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("service-review");
    const servicesCollection = database.collection("services");
    const reviewsCollection = database.collection("reviews");
    // const usersCollection = database.collection("users");

    // read all services
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    // create service
    app.post("/add-service", async (req, res) => {
      const service = req.body;
      const result = await servicesCollection.insertOne(service);
      res.json(result);
    });

    app.get("/services/:_id", async (req, res) => {
      const id = req.params._id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      res.send(service);
    });

    // create review
    app.post("/add-review", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.json(result);
    });

    // read single review by id
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = reviewsCollection.find(query);
      const review = await cursor.toArray();
      res.send(review);
    });

    // read logged in user all reviews by email
    app.get("/my-reviews", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = { email: req.query.email };
      }

      // finding the service name by serviceId

      const cursor = reviewsCollection.find(query);
      const review = await cursor.toArray();

      res.send(review);
    });

    app.get("/get-review/:id", async (req, res) => {
      let query = {};
      if (req.params.id) {
        query = { _id: req.params.id };
      }
      const cursor = reviewsCollection.find(query);
      const review = await cursor.toArray();
      res.send(review);
    });

    // update service
    app.put("/get-review/:id", async (req, res) => {
      // const id = req.query.id;
      const id = req.params.id;

      const updatedService = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          review: updatedService.review,
        },
      };
      const result = await reviewsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    app.get("*", function (req, res) {
      res.status(404).send("service route not found");
    });

    // // read single service
    // app.get("/services/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const service = await servicesCollection.findOne(query);
    //   res.json(service);
    // });

    // // delete service
    // app.delete("/services/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await servicesCollection.deleteOne(query);
    //   res.json(result);
    // });
  } finally {
    // await client.close();
  }
}

run().catch((error) => console.log(error));

app.get("/", (req, res) => {
  res.send("service-review-server is running");
});

app.listen(port, () => {
  console.log(`service-review-server listening on port ${port}`);
});
