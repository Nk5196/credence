
const mongoose = require('mongoose');
headphoneUserschema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    username:String,
    password:String,
    phone:Number,
    email:String,
    gender:String,
    firstName:String,
    lastName:String
})

module.exports = mongoose.model('headphoneuser',headphoneUserschema);