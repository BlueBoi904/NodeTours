const fs = require("fs");

const Tour = require("./../models/tourModule");

exports.getALlTours = (req, res) => {
  //Send back all of the tours when someone hits this route
  res.status(200).json({
    status: "success",
    requestedAt: req.requestTime
    // results: tours.length, //Specify amount of results recieved
    // data: {
    //   tours
    // }
  });
};

exports.getTour = (req, res) => {
  //Send back specific tour when someone hits this route
  const id = req.params.id * 1;
  //Loop through the array, and find the element that has same id as the params
  // const tour = tours.find(el => el.id === id);

  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     tour
  //   }
  // });
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated tour here...>"
    }
  });
};

exports.createTour = async (req, res) => {
  //Send data from the client to the server
  //req holds all the data that was requested

  // const newTour = new Tour({
  //   ...data
  // })
  //newTour.save()

  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: "success"
    // data: {
    //   tour: newTour
    // }
  });
};

exports.deleteTour = (req, res) => {
  //204 status code means no content
  res.status(204).json({
    status: "success",
    data: null
  });
};
