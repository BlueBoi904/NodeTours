const fs = require("fs");

const mongoose = require("mongoose");

const dotenv = require("dotenv");

const Tour = require("./../../models/tourModule");

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

//Read JSON file

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, "UTF-8")
);

//Import data into database
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log("data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//Delete All Data from collection

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("data successfully deleted!");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
