const express = require("express");

const router = express.Router();

const placeControllers = require("../controllers/place-controller");

router.get("/:pid", placeControllers.getPlaceById);

router.get("/user/:uid", placeControllers.getPlaceByUserId);

module.exports = router;
