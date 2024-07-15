const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    dateOfBirth: String,
    gender: String,
    totalFees: Number,
    submittedFees: Number,
    phone: Number,
    city: String,
    rollNo:Number,
    class:Number,
    photo: String,
});


module.exports= mongoose.model('Student',studentSchema)