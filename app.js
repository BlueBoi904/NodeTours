const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
//Create variable called app
const app = express();

//Middleware stands between a request and response
//Use method to use middleware. Add middleware to our middleware stack

//1) Middleware
//Middleware order matters
//Gives information about the https request
app.use(morgan("dev"));

app.use(express.json());

app.use((req, res, next) => {
  console.log("Hello from the middleware");
  next();
});

app.use((req, res, next) => {
  //Add property to our request
  req.requestTime = new Date().toISOString();
  next();
});
// The request response cycle. Middleware stands between request and response. Everything is middleware in express

//2) Route Handlers

//3) Routes
//Create a new router, use it as middleware

//Mounting a new router on a route
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);

//4) Start server

module.exports = app;
//What i've learned
//Added and Mounted routers
