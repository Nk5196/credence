// routes/attendanceRoutes.js
const express = require('express');
const router = express.Router();
// const Attendance = require('../models/attendance');
const Attendance = require('../model/Attendance')
const Student = require('../model/student');

// Create attendance record
router.post('/', async (req, res) => {
  try {
    const attendanceArray = req.body; // Array of objects

    const attendanceRecords = attendanceArray.map(({ studentId, date, status }) => ({
      student: studentId,
      date,
      status,
    }));
    console.log('Received attendance data:', attendanceRecords);

    // Check if attendance is already taken for the selected date
    const existingRecords = await Attendance.find({ date: { $in: attendanceRecords.map(record => record.date) } });
    
    if (existingRecords.length > 0) {
      // Attendance is already taken for one or more dates
      return res.status(400).json({
        error: 'Attendance is already taken for one or more selected dates.',
        existingRecords: existingRecords,
      });
    }

    // Insert new attendance records
    const insertedRecords = await Attendance.insertMany(attendanceRecords);
   // console.log('Inserted attendance records:', insertedRecords);

    res.status(201).json({
      message: 'Attendance records created successfully',
      records: insertedRecords,
    });
  } catch (error) {
    console.error('Error creating attendance records:', error);
    res.status(500).json({ error: 'Error creating attendance records.' });
  }
});

  
  router.get('/attendance', async (req, res) => {
    try {
      const selectedDate = req.query.date;
 // console.log("selectedDate",selectedDate)
      const attendanceRecords = await Attendance.find({ date: selectedDate });
      res.json(attendanceRecords);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching attendance records.' });
    }
  });
  
  
  
  
  
  
  
  

// Get attendance records for a specific student
// router.get('/attendance/:studentId', async (req, res) => {
//   try {
//     const studentId = req.params.studentId;
//     const attendanceRecords = await Attendance.find({ student: studentId });
//     res.json(attendanceRecords);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching attendance records.' });
//   }
// });



  


module.exports = router;
