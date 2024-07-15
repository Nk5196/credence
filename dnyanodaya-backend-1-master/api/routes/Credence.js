// routes/category.js
const express = require('express');
const credence = require('../model/Credence');
const router = express.Router();
const Credence = require('../model/Credence');

// Create a new category
router.post('/', async (req, res) => {
    try {
        console.log("req.body", req.body);
        
        if (Array.isArray(req.body)) {
            const insertedCategories = await Credence.insertMany(req.body);
            res.status(201).json(insertedCategories);
        } else {
            const newCategory = new Credence(req.body);
            const savedCategory = await newCategory.save();
            res.status(201).json(savedCategory);
        }
    } catch (error) {
        console.error('Failed to create credence:', error);
        res.status(500).json({ error: 'Failed to create' });
    }
});
  
// Get a list of all categories
router.get('/', async (req, res) => {
    try {
        console.log("get")
        const categories = await Credence.find()

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch credece' });
    }
});

module.exports = router;
