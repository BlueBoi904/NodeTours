const express = require("express");

const tourController = require("./../controllers/tourController");

const router = express.Router();

const authController = require("./../controllers/authController");

//Param middleware

//Each router is a mini sub application for each resource

// router.param("id", tourController.checkID);

router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getALlTours);

router.route("/tour-stats").get(tourController.getTourStats);

router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);
// Run protect route middleware before allowing user to get all tours
router
  .route("/")
  .get(authController.protect, tourController.getALlTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
