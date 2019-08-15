const express = require("express");
const fs = require("fs");
const router = express.Router();

//Middleware order matters
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

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

router
  .route("/")
  .get(getALlTours)
  .post(createTour);

router
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
