const mongoose = require("mongoose");
const slugify = require("slugify");
// const validator = require("validator");
//Create a module using mongoose schema in order to perform CRUD operations
//Mongoose Schema
const tourSchema = new mongoose.Schema(
  {
    //Specify datatype expected for each field
    name: {
      type: String,
      required: [true, "A tour must have a rating"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less than 40 characters"],
      minlength: [10, "A tour name must have more than 10 characters"]
      // validate: [validator.isAlpha, "A tour name must only contain characters"]
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"]
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"]
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty must be either: easy, medium, or difficult"
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "A rating must be at least 1.0"],
      max: [5, " A rating must be below 5.0"]
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"]
    },
    priceDiscount: {
      type: Number,
      validate: {
        message: "Discount price ({VALUE}) should less than price",
        validator: function(val) {
          // 'this' only points to the current doc on new doc creation
          return val < this.price; //Price discount = 100, price = 200 => true
        }
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"]
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"]
    },
    images: [String],
    createAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual property
tourSchema.virtual("durationWeeks").get(function() {
  return this.duration / 7;
});

// Document middleware: runs before .save() and .create() command
// Presave hook
tourSchema.pre("save", function(next) {
  // This keyword points to the currently processed/saved document

  // Slugify name to add slug property to each document
  this.slug = slugify(this.name, { lower: true });

  next();
});

// tourSchema.pre("save", function(next) {
//   console.log("Will save document");
//   next();
// });

// tourSchema.post("save", function(doc, next) {
//   console.log(doc);
//   next();
// });

//Query middleware
//^find grabs all the strings that start with find using regex
tourSchema.pre(/^find/, function(next) {
  //'This' is now a query object
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function(next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
