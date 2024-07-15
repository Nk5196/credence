
const mongoose = require('mongoose');
userSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    username:String,
    password:String,
    phone:Number,
    email:String,
    gender:String,
    class:Number,
    userType:String,
    firstName:String,
    lastName:String
})

module.exports = mongoose.model('User',userSchema);