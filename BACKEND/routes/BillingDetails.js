const express = require('express');
const router = express.Router();
const Order = require('../models/BillingDetails');


// Create a new spare part
router.post('/post', async (req, res) => {
    try {
        const order = await Order.create(req.body);
        console.log(req.body);

        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;