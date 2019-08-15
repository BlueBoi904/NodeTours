const express = require("express");
const fs = require("fs");
const morgan = require("morgan");
//Create variable called app
const app = express();

//Middleware stands between a request and response
//Use method to use middleware. Add middleware to our middleware stack

//1) Middleware
//Gives information about the https request
app.use(morgan("dev"));

app.use(express.json());

app.use((req, res, next) => {
  console.log("Hello from the middleware");
  next();
});

app.use((req, res, next) => {
  //Add property to our request
  req.requestTime = new Date().toISOString();
  next();
});
// The request response cycle. Middleware stands between request and response. Everything is middleware in express
//Middleware order matters
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//2) Route Handlers

const getALlTours = (req, res) => {
  console.log(req.requestTime);
  //Send back all of the tours when someone hits this route
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime,
    results: tours.length, //Specify amount of results recieved
    data: {
      tours
    }
  });
};

const getTour = (req, res) => {
  //Send back specific tour when someone hits this route
  const id = req.params.id * 1;
  //Loop through the array, and find the element that has same id as the params
  const tour = tours.find(el => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID"
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour
    }
  });
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID"
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated tour here...>"
    }
  });
};

const createTour = (req, res) => {
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
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID"
    });
  }
  //204 status code means no content
  res.status(204).json({
    status: "success",
    data: null
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined"
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined"
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined"
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined"
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined"
  });
};

// Get request for all tours
// app.get("/api/v1/tours", getALlTours);
//Use : to create a variable :id
// Use:id? for optional param
// Get specific tour
// app.get("/api/v1/tours/:id", getTour);
// //Post request to add a new tour to our data
// app.post("/api/v1/tours", createTour);
// //Patch data
// app.patch("/api/v1/tours/:id", updateTour);
// //Delete resource
// app.delete("/api/v1/tours/:id", deleteTour);

//3) Routes
app
  .route("/api/v1/tours")
  .get(getALlTours)
  .post(createTour);

app
  .route("/api/v1/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app
  .route("/api/v1/users")
  .get(getAllUsers)
  .post(createUser);

app
  .route("/api/v1/users/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);
//4) Start server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//What i've learned
