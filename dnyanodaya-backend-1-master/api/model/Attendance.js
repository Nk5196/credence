// models/attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student', // Use the correct model name
    required: true,
  },
  date: {
    type: Date,
    // required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late'], // Add more if needed
    required: true,
  },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
