const express = require("express");
const fs = require("fs");
//Create variable called app
const app = express();

// app.get("/", (req, res) => {
//   res
//     .status(200)
//     //.json will auto create json content format which is done by express
//     .json({ message: "Hello from the server side!", app: "nodetour" });
// });
//Specify the version of the API with v1

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get("/api/v1/tours", (req, res) => {
  //Send back all of the tours when someone hits this route
  res.status(200).json({
    status: "success",
    results: tours.length, //Specify amount of results recieved
    data: {
      tours
    }
  });
});

app.post("/", (req, res) => {
  res.send("You can post to this endpoint...");
});
//Start server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
