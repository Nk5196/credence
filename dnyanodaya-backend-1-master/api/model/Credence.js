
const mongoose = require('mongoose');
Credenceschema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name: String,
    img:String,
    summary: String
})

module.exports = mongoose.model('Credenceschema',Credenceschema);