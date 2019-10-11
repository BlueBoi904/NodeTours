const mongoose = require("mongoose");

const dotenv = require("dotenv");

// Catch uncaught exceptions => "Synchronous code"

process.on("uncaughtException", err => {
  console.log(err.name, err.message);
  console.log("UNHANDLED EXCEPTION: Shutting down...");
  process.exit(1);
});

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
  .then(() => console.log("DB connection successful"))
  .catch(err => {
    console.log(err);
  });

const app = require("./app");

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Catch unhandled rejections => "promise rejections"

process.on("unhandledRejection", err => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION: Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
