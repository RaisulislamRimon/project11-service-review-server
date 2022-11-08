const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("service-review-server is running");
});

app.listen(port, () => {
  console.log(`service-review-server listening on port ${port}`);
});
