const fs = require("fs");

const APIFeatures = require("./../utils/apiFeatures");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

const Tour = require("./../models/tourModule");

exports.getALlTours = async (req, res) => {
  try {
    //Execute query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    res.status(200).json({
      status: "success",
      results: tours.length, //Specify amount of results recieved
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
  //Send back all of the tours when someone hits this route
  // Will return all documents in that selection
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    //Simplifed with mongoose
    //Tour.findOne({_id: req.params.id })

    res.status(200).json({
      status: "success",
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
  //Send back specific tour when someone hits this route
  //Loop through the array, and find the element that has same id as the params
  // const tour = tours.find(el => el.id === id);
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      //Updated doc will be return by setting new: true
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: "success",
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err
    });
  }
  //Send data from the client to the server
  //req holds all the data that was requested

  // const newTour = new Tour({
  //   ...data
  // })
  //newTour.save()
};

exports.deleteTour = async (req, res) => {
  //In a RESTful API, it is common not to send back any data to the client when there was a delete operation.
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent"
    });
  }
  //204 status code means no content
};

//Aggregation pipeline
exports.getTourStats = async (req, res) => {
  try {
    //Pass in array of stages to defines steps
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          //Define id to group stats by difficulty
          _id: "$difficulty",
          numTours: { $sum: 1 },
          numOfRatings: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
      // {
      //   $match: { _id: { $ne: "easy" } }
      // }
    ]);

    res.status(200).json({
      status: "success",
      data: {
        stats
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid data sent"
    });
  }
};
