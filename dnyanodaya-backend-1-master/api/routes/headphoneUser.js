const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const headphoneuser = require('../model/headphoneUser');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res, next) => {
  try {
    console.log(req.body);

    // Check for mandatory fields
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.username ||
      !req.body.password ||
      !req.body.email ||
      !req.body.phone      
    ) {
      return res.status(400).json({
        error: 'All fields are mandatory'
      });
    }
    // Check if username or email is already registered
    const existingUserByUsername = await headphoneuser.findOne({ username: req.body.username }).exec()
    const existingUserByEmail = await headphoneuser.findOne({ email: req.body.email }).exec()

    console.log('existingUserByUsername:', existingUserByUsername);
    console.log('existingUserByEmail:', existingUserByEmail);
    

    if (existingUserByUsername ||existingUserByEmail ) {
      return res.status(400).json({
        error: 'Username or email already exists'
      });
    }

    // Hash the password and create the new user
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new headphoneuser({
      _id: new mongoose.Types.ObjectId(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
     
    });

    const result = await newUser.save();

    res.status(200).json({
      new_user: result
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  }
});






router.post('/login', async (req, res, next) => {
  try {
    const user = await headphoneuser.findOne({ username: req.body.username }).exec();
    if (!user) {
      return res.status(404).json({
        msg: 'User not found',
      });
    }

    // Compare plain password (for temporary migration purposes)
    if (req.body.password === user.password) {
      console.log("inside pass match")
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          userType: user.userType,
        },
        'this is demo user api',
        {
          expiresIn: '24h',
        }
      );
      return res.status(200).json({
        userId: user._id,
        userType: user.userType,
        email: user.email,
        username: user.username,
        lastName: user.lastName,
        firstName: user.firstName,
        class: user.class,
        token: token,
      });
    }

    // Compare bcrypt-hashed password
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) {
        return res.status(500).json({
          error: 'Error comparing passwords',
        });
      }
      if (!result) {
        return res.status(401).json({
          msg: 'Password mismatch',
        });
      }
      if (result) {
        const token = jwt.sign(
          {
            userId: user._id,
            email: user.email,
            userType: user.userType,
          },
          'this is demo user api',
          {
            expiresIn: '24h',
          }
        );
        res.status(200).json({
          userId: user._id,
          userType: user.userType,
          email: user.email,
          username: user.username,
          lastName: user.lastName,
          firstName: user.firstName,
          token: token,
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      error: err,
    });
  }
});




module.exports = router;