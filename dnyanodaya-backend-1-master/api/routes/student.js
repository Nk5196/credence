const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2
const Student = require('../model/student');
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth')
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
});


// router.get('/',async(req, res, next) => {
// //  console.log("req",req.body)
//     const totalStudent = await Student.count()
//     Student.find().sort({rollNo:1})
//     .then(result=>{
//         res.status(200).json({
//             studentData:result,
//             totalStudent:totalStudent
//         })
//     })
//     .catch(err => {
//         console.log(err);
//         res.status(500).json({
//             error:err
//         })
//     })
// });

router.get('/', async (req, res, next) => {
    try {
        // Find all students
        const students = await Student.find().sort({ rollNo: 1 });

        // Calculate the total fees and given fees
        let totalFees = 0;
        let totalGivenFees = 0;

        students.forEach(student => {
            totalFees += student.totalFees || 0; // Assuming you have a 'totalFees' property in your Student schema
            totalGivenFees += student.submittedFees || 0; // Assuming you have a 'givenFees' property in your Student schema

        });
        //     console.log("totalFees",totalFees)
        // console.log("totalGivenFees",totalGivenFees)
        const totalStudent = students.length;

        res.status(200).json({
            studentData: students,
            totalStudent: totalStudent,
            totalFees: totalFees,
            totalGivenFees: totalGivenFees,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message,
        });
    }
});


router.get('/:id', checkAuth, (req, res, next) => {

    Student.findById(req.params.id)
        .then(result => {
            res.status(200).json({
                student: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});


router.delete('/:id', (req, res, next) => {
    console.log("inside delete", req.body)
    Student.deleteOne({ _id: req.params.id })
        .then(result => {
            res.status(200).json({
                message: "successfully deleted student",
                result: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});


router.put('/:id', (req, res, next) => {
    console.log("req.body", req.body)


    if (req.body.totalFees < req.body.submittedFees) {
        return res.status(400).json({ error: 'Submitted fees cannot be greater than total fees' });
    }
    
    if (req.body.phone.length != 10) {
        return res.status(400).json({ error: 'Phone number must be 10 digits long' });
    }

    Student.findOneAndUpdate({ _id: req.params.id },
        {
            $set: {
                name: req.body.name,
                dateOfBirth: req.body.dateOfBirth,
                gender: req.body.gender,
                rollNo: req.body.rollNo,
                totalFees: req.body.totalFees,
                submittedFees: req.body.submittedFees,
                phone: req.body.phone,
                city: req.body.city,
                class: req.body.class,
                photo: req.body.photoUrl
            }
        })
        .then(result => {
            console.log("result", result)

            res.status(200).json({

                message: "successfully updated student",
                result: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

// router.delete('/:id', (req, res, next) => {
//     Student.deleteOne({ _id: req.params.id })
//         .then(result => {
//             if (result.deletedCount > 0) {
//                 res.status(200).json({
//                     message: "Successfully deleted student",
//                     result: result
//                 });
//             } else {
//                 res.status(404).json({
//                     message: "Student not found"
//                 });
//             }
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// });


// router.post('/', async (req, res, next) => {
//     try {
//         let photoUrl = null; // Initialize to null

//         if (req.files && req.files.photo) {
//             const file = req.files.photo;
//             const result = await cloudinary.uploader.upload(file.tempFilePath);
//             photoUrl = result.url;
//         }

//         const student = new Student({
//             _id: new mongoose.Types.ObjectId(),
//             name: req.body.name,
//             email: req.body.email,
//             gender: req.body.gender,
//             phone: req.body.phone,
//             photo: photoUrl // Assign the URL or null
//         });

//         const result1 = await student.save();

//         res.status(200).json({
//             newStudent: result1
//         });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'An error occurred' });
//     }
// });
router.post('/', async (req, res, next) => {
    try {
        // Validate that all required fields are filled
        const requiredFields = ['name', 'dateOfBirth', 'gender', 'rollNo', 'totalFees', 'submittedFees', 'phone', 'city', 'class'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `Please provide a valid ${field}` });
            }
        }



        // Check if a student with the same role number and class already exists
        const existingStudent = await Student.findOne({
            rollNo: req.body.rollNo,
            class: req.body.class
        });

        if (existingStudent) {
            return res.status(400).json({ error: 'Student with the same role number and class already exists' });
        }


        if (req.body.totalFees < req.body.submittedFees) {
            return res.status(400).json({ error: 'Submitted fees cannot be greater than total fees' });
        }

        if (req.body.phone.length !== 10) {
            return res.status(400).json({ error: 'Phone number must be 10 digits long' });
        }

        let photoUrl = null;
        if (req.files && req.files.photo) {
            const file = req.files.photo;
            const result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'dnyanodaya'
            });
            photoUrl = result.url;
        }

        const student = new Student({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            dateOfBirth: req.body.dateOfBirth,
            gender: req.body.gender,
            rollNo: req.body.rollNo,
            totalFees: req.body.totalFees,
            submittedFees: req.body.submittedFees,
            phone: req.body.phone,
            city: req.body.city,
            class: req.body.class,
            photo: photoUrl
        });

        const result1 = await student.save();

        res.status(200).json({
            newStudent: result1
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});




module.exports = router;
