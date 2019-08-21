const fs = require("fs");

const Tour = require("./../models/tourModule");

exports.getALlTours = async (req, res) => {
  try {
    console.log(req.query);
    //Build Query
    //1A) Filtering
    const queryObject = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach(el => delete queryObject[el]);

    //1B) Advanced filtering <= >=
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    //2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      //Mongoose will auto sort based on the query param
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createAt");
    }

    // 3) Field limiting
    if (req.query.fields) {
      // Selecting certain field names is called projecting
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      //EXCLUDE __V FIELDS
      query = query.select("-__v");
    }

    // 4) Pagination
    const page = req.query.page * 1 || 1;

    const limit = req.query.limit * 1 || 100;

    const skip = (page - 1) * limit;
    //limit() amount of results we want in the query
    //skpi() the amount of results that should be skipped before querying data

    //page=2&limit=10, 1-10 page 1, 11-20 page 2
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error("This page does not exist.");
    }

    //Execute query
    const tours = await query;

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
