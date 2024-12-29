const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create a new order
router.post('/post', async (req, res) => {
    try {
        const order = new Order(req.body);
        const savedOrder = await order.save();
        console.log('Saved order:', savedOrder);  // Log the saved order
        res.status(201).json(savedOrder);
    } catch (err) {
        console.error('Error saving order:', err.message);  // Log the error
        res.status(400).json({ message: err.message });
    }
});

// Get order details according to reference number
router.get('/order_details/:refNo', async (req, res) => {
    try {
        const refNo = req.params.refNo;
        const customer_order = await Order.findByReferenceNo(refNo);
        console.log('Customer order:', customer_order);  // Log the retrieved order
        if (customer_order) {
            return res.json(customer_order);
        } else {
            return res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update order status
router.put('/order_status_update/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    if (!orderStatus || !['Pending', 'Processing', 'Shipped'].includes(orderStatus)) {
        return res.status(400).json({ message: 'Invalid or missing order status' });
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { $set: { orderStatus } },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update payment status
router.put('/order_payment_status_update/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const { paymentStatus } = req.body;

    if (!paymentStatus || !['Paid', 'Pending', 'Failed'].includes(paymentStatus)) {
        return res.status(400).json({ message: 'Invalid or missing payment status' });
    }

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { $set: { paymentStatus } },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
