const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log("DB connection successful"));

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

//New document using the Tour model

const testTour = new Tour({
  name: "The Surfer",
  rating: 45.0,
  price: 800
});

testTour
  .save()
  .then(doc => {
    console.log(doc);
  })
  .catch(err => {
    console.log("ERROR", err);
  });

const app = require("./app");

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
