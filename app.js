// Middleware imports
const express = require("express");
const morgan = require("morgan");

const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
//Create variable called app
const app = express();

//Middleware stands between a request and response
//Use method to use middleware. Add middleware to our middleware stack

//1) Middleware
//Middleware order matters
//Gives information about the https request
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

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

// Catch all unhandled routes at the end of the middleware stack
app.all("*", (req, res, next) => {
  // const err = new Error(`Can't find '${req.originalUrl}' on this server.`);
  // err.status = "fail";
  // err.statusCode = 404;
  next(new AppError(`Can't find '${req.originalUrl}' on this server.`, 404));
});

app.use(globalErrorHandler);

//4) Start server

module.exports = app;

//What i've learned
//Added and Mounted routers
//Constructed Custom API that can handle advanced sortingand filtering

/*

Closure Definition:

An inner function always has access to the 
variables and parameters of its outer function, 
even after the outer function has returned
(finished excecuting).

Ex:

function retirement (retirementAge) {
  var a = ' years left until retirement.';
  return function(yearOfBirth){
    var age = 2016 - yearOfBirth;
    console.log((retirementAge - age) + a);
  }
}

retirementUS = retirement(66);
retirementJP = retirement(60);
retirementAU = retirement(65);

retirementAU(1990); => 39 years left until retirement.
retirementUS(1990); => 40 years left until retirement.
retirementJP(1990); => 34 years left until retirement.

*/
