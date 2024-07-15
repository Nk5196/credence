const mongoose = require('mongoose');

const headphoneCorouselSchema = new mongoose.Schema({
    url: String,
    text: String
});

const HeadphoneCorousel = mongoose.model('headphoneCorousel', headphoneCorouselSchema);

module.exports = HeadphoneCorousel;