// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imageUrls: [String],
  category: String,
  subcategory1:String,
  subcategory2:String,
  subcategory3:String,
  brand: String,
  rating: Number,
  reviews: [
    {
      user:String,
      text: String,
      rating: Number,
    },
  ],
});

module.exports = mongoose.model('Product', productSchema);
