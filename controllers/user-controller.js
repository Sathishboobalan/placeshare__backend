const uuid = require('uuid/v4');

const HttpError = require('../models/http-error');

const DUMMY_USERS = [
    {
        id : 'u1',
        name : 'Sathish',
        email : 'sathishbalucs@gmail.com',
        password : '123'
    }
]

const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const login = (req, res, next) => {
    const { email , password } = req.body;
    const identifiedUser = DUMMY_USERS.find(u => u.email === email);
    if(!identifiedUser || identifiedUser.password !== password){
        throw new HttpError('Could not find user for the given credentials',401);
    }

    res.json({message:"Logged in"})
};

const signup = (req, res, next) => {
    const { name , email , password } = req.body;

    const hasUser = DUMMY_USERS.find(p => p.email == email);

    if(hasUser){
        throw new HttpError ('Email Already exist, Sign in with your credentials' , 422 );
    }

    const newUser = {
        id : uuid(),
        name,
        email,
        password
    }
    DUMMY_USERS.push(newUser);
    res.status(201).json({user : newUser})
};


exports.getUsers = getUsers
exports.login = login
exports.signup = signup