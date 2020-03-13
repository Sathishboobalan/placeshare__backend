const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const mongoose = require("mongoose");

const Place = require("../models/Place");
const User = require("../models/User");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1"
  }
];

const getPlaceById = async (req, res, next) => {
  // console.log(req.params);
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find place",
      500
    );
    return next(error);
  }
  // console.log(place.isactive)
  if (!place || !place.isactive) {
    // console.log(place.isactive)
    const error = new HttpError("No Data found for the given Id", 404);
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  console.log(userId);
  let places;
  try {
    places = await Place.find({ creator: userId });
    console.log(places);
  } catch (err) {
    const error = new HttpError(
      "Fetching place failed, Please try again later",
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find place for provided User Id", 404)
    );
  }
  res.json({
    places: places.map(place => {
      return place.toObject({ getters: true });
    })
  });
};

const createPlace = async (req, res, next) => {
  const error = validationResult(req);
  console.log(error);
  if (!error.isEmpty()) {
    throw new HttpError("Invalid input passed, PLease enter the valid Input");
  }
  const { title, description, location, address, creator } = req.body;

  const createdPlace = new Place({
    title,
    description,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/400px-Empire_State_Building_%28aerial_view%29.jpg",
    location,
    creator,
    address,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError(
      "Creating place failed, Please try again later",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find use for the given Id", 404);
    return next(error);
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    console.log(createdPlace);
    user.places.push(createdPlace);
    await user.save({session:sess})
    await sess.commitTransaction();
    // await createdPlace.save();
  } catch (err) {
    const error = new HttpError("Could not create the place", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Could not update the place", 500);
    return next(error);
  }
  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update the place",
      500
    );
    return next(error);
  }
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, Could not find place",
      500
    );
    return next(error);
  }

  if(!place){
    const error = new HttpError('Could not find place for this ID',404);
    return next(error);
  }

  try {
    // place.isactive = false;
    await place.save();
  } catch (err) {
    const error = new HttpError("Could not delete the place", 500);
    return next(error);
  }
  res.status(200).json({ message: "Deleted Successfully" });
};

exports.deletePlace = deletePlace;
exports.updatePlace = updatePlace;
exports.createPlace = createPlace;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
