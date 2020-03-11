const express = require("express");

const bodyParser = require("body-parser");

const placesRouter = require("./routes/place-route");

const usersRoutes = require('./routes/user-route');

const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use("/api/places", placesRouter);

app.use("/api/users",usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find Anything for this request', 404)
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred" });
});

app.listen(5000);
