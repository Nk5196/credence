const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const User = require('../model/users');
const jwt = require('jsonwebtoken');

// router.post('/signup', async (req, res, next) => {
//     try {
//         const hashedPassword = await bcrypt.hash(req.body.password, 10);

//         const user = new User({
//             _id: new mongoose.Types.ObjectId(),
//             username: req.body.username,
//             email: req.body.email,
//             gender: req.body.gender,
//             phone: req.body.phone,
//             password: hashedPassword,
//             userType: req.body.userType,
//         });

//         const newUser = await user.save();

//         res.status(201).json({
//             newUser: newUser,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(400).json({

//             error: 'Failed to create user',
//         });
//     }
// });

// router.post('/login', async (req, res, next) => {
//     try {
//         const user = await User.findOne({ email: req.body.email }).exec();

//         if (!user) {
//             return res.status(401).json({
//                 msg: 'User not found',
//             });
//         }

//         const passwordsMatch = await bcrypt.compare(req.body.password, user.password);

//         if (!passwordsMatch) {
//             return res.status(401).json({
//                 msg: 'Incorrect password',
//             });
//         }

//         const token = jwt.sign(
//             {
//                 userId: user._id,
//                 email: user.email,
//                 userType: user.userType,
//             },
//             process.env.JWT_SECRET, // Store your secret key in an environment variable
//             {
//                 expiresIn: '24h',
//             }
//         );

//         res.status(200).json({
//             userId: user._id,
//             email: user.email,
//             userType: user.userType,
//             token: token,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({

//             error: 'Internal server error',
//         });
//     }
// });

// module.exports = router;

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
      !req.body.phone ||
      !req.body.gender ||
      !req.body.userType
    ) {
      return res.status(400).json({
        error: 'All fields are mandatory'
      });
    }
    // Check if username or email is already registered
    const existingUserByUsername = await User.findOne({ username: req.body.username }).exec()
    const existingUserByEmail = await User.findOne({ email: req.body.email }).exec()

    console.log('existingUserByUsername:', existingUserByUsername);
    console.log('existingUserByEmail:', existingUserByEmail);
    

    if (existingUserByUsername ||existingUserByEmail ) {
      return res.status(400).json({
        error: 'Username or email already exists'
      });
    }

    // Hash the password and create the new user
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: hashedPassword,
      email: req.body.email,
      phone: req.body.phone,
      gender: req.body.gender,
      userType: req.body.userType,
      class: req.body.class
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
    const user = await User.findOne({ username: req.body.username }).exec();
    if (!user) {
      return res.status(404).json({
        msg: 'User not found',
      });
    }

    // Compare plain password (for temporary migration purposes)
    if (req.body.password === user.password) {
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