const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Purchase = require('../models/Purchase'); // Ensure this is correct
const Notification = require('../models/Notification'); // Ensure this is correct

router.post('/post', async (req, res) => {
  const { customerId, products } = req.body;

  try {
    // Validate customerId
    if (!mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).send('Invalid customer ID');
    }

    // Validate each productId
    for (const product of products) {
      if (!mongoose.Types.ObjectId.isValid(product.productId)) {
        return res.status(400).send(`Invalid product ID: ${product.productId}`);
      }
    }

    // Save the purchase details for each product
    const purchase = new Purchase({
      customerId: new mongoose.Types.ObjectId(customerId),
      products: products.map(product => ({
        productId: new mongoose.Types.ObjectId(product.productId),
        categoryId: new mongoose.Types.ObjectId(product.categoryId),
        purchaseDate: new Date(),
      }))
    });

    await purchase.save();

    // Send initial survey notifications for each product
    const notifications = products.map(product => ({
      customerId: new mongoose.Types.ObjectId(customerId),
      productId: new mongoose.Types.ObjectId(product.productId),
      categoryId: new mongoose.Types.ObjectId(product.categoryId),
      type: 'InitialSurvey',
      message: `Please fill out the initial survey for your new purchase of product ${product.productId}.`,
      date: new Date(),
      viewed: false
    }));

    await Notification.insertMany(notifications);

    res.status(200).json({ message: 'Purchase and initial survey notifications saved successfully.', notifications });
  } catch (error) {
    console.error('Error saving purchase:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
