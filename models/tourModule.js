const mongoose = require("mongoose");
const slugify = require("slugify");
//Create a module using mongoose schema in order to perform CRUD operations
//Mongoose Schema
const tourSchema = new mongoose.Schema(
  {
    //Specify datatype expected for each field
    name: {
      type: String,
      required: [true, "A tour must have a rating"],
      unique: true,
      trim: true
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
      required: [true, "A tour must have a difficulty"]
    },
    ratingsAverage: {
      type: Number,
      default: 4.5
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"]
    },
    priceDiscount: Number,
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
    startDates: [Date]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
//Virtual property
tourSchema.virtual("durationWeeks").get(function() {
  return this.duration / 7;
});

//Document middleware: runs before .save() and .create() command
//Presave hook
tourSchema.pre("save", function(next) {
  //This keyword points to the currently processed/saved document

  //Slugify name to add slug property to each document
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

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
