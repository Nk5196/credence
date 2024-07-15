// routes/product.js
const express = require('express');
const router = express.Router();
const Product = require('../model/Product');

// Create a new product
router.post('/', async (req, res) => {
    console.log(req.body)
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);

  } catch (error) {
    res.status(500).json({ error: 'Failed to create a product' });
  }
}); 

// Get a list of all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('category');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get a single product by ID
router.get('/:productId', async (req, res) => {
  try {
    console.log("req",req.body)
    const product = await Product.findById(req.params.productId).populate('category');
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
    } else {
      res.status(200).json(product);
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the product' });
  }
});

// Update a product by ID
router.put('/:productId', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, req.body, {
      new: true,
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the product' });
  }
});

// Delete a product by ID
router.delete('/:productId', async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.productId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the product' });
  }
});

module.exports = router;
