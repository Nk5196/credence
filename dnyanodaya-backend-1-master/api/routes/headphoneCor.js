const express = require('express');
const router = express.Router();
const headphoneCorousel = require('../model/headphoneCor');

// GET route to fetch data
router.get('/', async (req, res, next) => {
    try {
        const corouselData = await headphoneCorousel.find();
        res.status(200).json({
            corouselData: corouselData
        });
    } catch (error) {
        next(error);
    }
});

// POST route to add data
router.post('/', async (req, res, next) => {
    try {
        // Assuming you have a request body with the data to add
        const newData = req.body; // You might want to validate and sanitize the data first

        // Create a new Corousel instance and save it to the database
        const corouselInstance = new headphoneCorousel(newData);
        await corouselInstance.save();

        res.status(201).json({
            message: 'Data added successfully',
            newData: corouselInstance
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
