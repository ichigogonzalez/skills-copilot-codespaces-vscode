// Create Web server that allows users to create, edit, and delete comments
// User can create an account and login to see their comments
// User can only edit and delete comments that they created

// Import modules
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const uuid = require('uuid');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator');
const cors = require('cors');
const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const jwt = require('jsonwebtoken');
const { DATABASE_URL, PORT, SECRET_TOKEN } = require('./config');
const { CommentList } = require('./model');
const { User } = require('./model');
const { Comment } = require('./model');

const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

// Create BasicStrategy for passport
const basicStrategy = new BasicStrategy((username, password, callback) => {
  let user;
  User
    .findOne({ username: username })
    .exec()
    .then(_user => {
      user = _user;
      if (!user) {
        return callback(null, false, { message: 'Incorrect username.' });
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return callback(null, false, { message: 'Incorrect password.' });
      }
      else {
        return callback(null, user);
      }
    })
    .catch(err => callback(err));
});

passport.use(basicStrategy);
app.use(passport.initialize());

// Create JWTStrategy for passport
const jwtStrategy = passport.authenticate('jwt', { session: false });

// Create JWT token
function createAuthToken(user) {
  return jwt.sign({ user }, SECRET_TOKEN, {
    subject: user.username,
    expiresIn: '7d',
    algorithm: 'HS256'
  });
}

// Create endpoint for login
app.post('/api/login', passport.authenticate('basic', { session: false }), (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  res.json({ authToken });
});

// Create endpoint for register
app.post('/api/users', (req, res) => {
  const requiredFields = ['username', 'password', 'firstName', 'lastName'];
  const missingField = requiredFields.find(field => !(field in req
