// routes/category.js
const express = require('express');
const router = express.Router();
const Category = require('../model/Category');

// Create a new category
router.post('/', async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        const savedCategory = await newCategory.save();
        res.status(201).json(savedCategory);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create a category' });
    }
});
  
// Get a list of all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

module.exports = router;
