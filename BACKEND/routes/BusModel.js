const express = require('express');
const router = express.Router();
const BusModel = require('../models/BusModel');



router.post('/post', async (req, res) => {
    try {
        const busModel = await BusModel.create(req.body);
        console.log(req.body);

        res.status(201).json(busModel);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all bus models
router.get('/get', async (req, res) => {
    try {
        const busModels = await BusModel.find();
        res.json(busModels);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;