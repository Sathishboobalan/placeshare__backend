const { check } = require("express-validator");

const express = require("express");

const router = express.Router();

const placeControllers = require("../controllers/place-controller");

router.get("/:pid", placeControllers.getPlaceById);

router.get("/user/:uid", placeControllers.getPlacesByUserId);

router.post(
  "/",
  [
    check("title")
      .not()
      .isEmpty()
  ],
  placeControllers.createPlace
);

router.patch("/:pid", placeControllers.updatePlace);

router.delete("/:pid", placeControllers.deletePlace);

module.exports = router;
