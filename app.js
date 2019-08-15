const express = require("express");
const fs = require("fs");
//Create variable called app
const app = express();

//Middleware stands between a request and response
app.use(express.json());
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
// Get request
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

//Post request to add a new tour to our data

app.post("/api/v1/tours", (req, res) => {
  //Send data from the client to the server
  //req holds all the data that was requested
  const newId = tours[tours.length - 1].id + 1;
  //Take newTour and push it onto tours array
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  //Use writefile since we are inside of a callback function, we do not want to block the event loop
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      //201 status code stands for created
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour
        }
      });
    }
  );
});
//Start server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
