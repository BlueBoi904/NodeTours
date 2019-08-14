const express = require("express");

//Create variable called app
const app = express();

app.get("/", (req, res) => {
  res
    .status(200)
    //.json will auto create json content format which is done by express
    .json({ message: "Hello from the server side!", app: "nodetour" });
});

app.post("/", (req, res) => {
  res.send("You can post to this endpoint...");
});
//Start server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
