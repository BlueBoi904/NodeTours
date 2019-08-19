const mongoose = require("mongoose");

//Create a module using mongoose schema in order to perform CRUD operations
//Mongoose Schema
const tourSchema = new mongoose.Schema({
  //Specify datatype expected for each field
  name: {
    type: String,
    required: [true, "A tour must have a rating"],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"]
  }
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
