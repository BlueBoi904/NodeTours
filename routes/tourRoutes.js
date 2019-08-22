const express = require("express");

const tourController = require("./../controllers/tourController");

const router = express.Router();

//Param middleware
//Each router is a mini sub application for each resource
// router.param("id", tourController.checkID);

router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getALlTours);

router.route("/tour-stats").get(tourController.getTourStats);

router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
  .route("/")
  .get(tourController.getALlTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
