const express = require('express');
const router = express.Router();
const Category = require('../models/Category');



router.post('/post', async (req, res) => {
    try {
        const category = await Category.create(req.body);
       // console.log(req.body);

        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all categories
router.get('/get', async (req, res) => {
    try {
        const category = await Category.find();
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// get products according to the category
router.get('/get_cname/:id', async (req, res) => {
    try {
      const category_Id = req.params.id;
      const product_name = await Category.findByCategoryId(category_Id);
      if (!product_name) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product_name);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;