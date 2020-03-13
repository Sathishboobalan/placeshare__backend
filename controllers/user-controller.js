const uuid = require("uuid/v4");

const HttpError = require("../models/http-error");

const User = require("../models/User");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Sathish",
    email: "sathishbalucs@gmail.com",
    password: "123"
  }
];

const getUsers = async (req, res, next) => {
    let users;
    try{
        users = await User.find({},'-password')
    }catch(err){
        const error = new HttpError('Fetching users failed, please try again later')
        return next(error);
    }
    res.status(200).json({users : users.map(user => user.toObject({getters:true}))});
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Logging Up failed, Please try again later!");
    return next(error);
  }
  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError("Invalid credentials, could not login now");
    return next(error);
  }
  res.json({ message: "Logged in" });
};

const signup = async (req, res, next) => {
  const { name, email, password ,places } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signin Up failed, Please try again later!");
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError("User exists already, So please login");
    return next(error);
  }
  const newUser = User({
    name,
    email,
    password,
    places,
    image:
      "https://icons.iconarchive.com/icons/icons8/android/512/Users-User-icon.png"
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError("Signin up failed, please try again later");
    return next(error);
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

exports.getUsers = getUsers;
exports.login = login;
exports.signup = signup;
