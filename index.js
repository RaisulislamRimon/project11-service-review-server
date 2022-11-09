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
    // const reviewsCollection = database.collection("reviews");
    // const usersCollection = database.collection("users");

    // read all services
    app.get("/services", async (req, res) => {
      console.log("get services");
      const query = {};
      const cursor = servicesCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    // create service
    app.post("/add-service", async (req, res) => {
      const service = req.body;
      console.log("adding new service: ", service);
      const result = await servicesCollection.insertOne(service);
      res.json(result);
    });

    app.get("/services/:_id", async (req, res) => {
      const id = req.params._id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      console.log(service);
      // const service = services.find((service) => console.log(service.id));
      res.send(service);
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

    // // update service
    // app.patch("/services/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const updatedService = req.body;
    //   const filter = { _id: ObjectId(id) };
    //   const options = { upsert: true };
    //   const updateDoc = {
    //     $set: {
    //       title: updatedService.title,
    //       description: updatedService.description,
    //       image: updatedService.image,
    //       price: updatedService.price,
    //     },
    //   };
    //   const result = await servicesCollection.updateOne(
    //     filter,
    //     updateDoc,
    //     options
    //   );
    //   res.json(result);
    // });

    // // delete service
    // app.delete("/services/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await servicesCollection.deleteOne(query);
    //   res.json(result);
    // });

    // // create review
    // app.post("/reviews", async (req, res) => {
    //   const review = req.body;
    //   const result = await reviewsCollection.insertOne(review);
    //   res.json(result);
    // });

    // // read all reviews
    // app.get("/reviews", async (req, res) => {
    //   const cursor = reviewsCollection.find({});
    //   const reviews = await cursor.toArray();
    //   res.send(reviews);
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
