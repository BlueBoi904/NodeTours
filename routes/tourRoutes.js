const express = require("express");
const tourController = require("./../controllers/tourController");
const router = express.Router();
//Param middleware
//Each router is a mini sub application for each resource
router.param("id", tourController.checkID);

router
  .route("/")
  .get(tourController.getALlTours)
  .post(tourController.checkBody, tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
