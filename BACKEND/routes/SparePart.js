const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const SparePart = require('../models/SparePart');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Route to create a new spare part
router.post('/post', upload.single('image'), async (req, res) => {
  try {
    // Ensure the file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    // Extract other form data from req.body
    const { name, description, price, categoryId, quantity, compatibility,baselifespan } = req.body;

    // Validate required fields
    if (!name || !description || !price || !categoryId || !quantity || !compatibility || !baselifespan) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Read the uploaded image file and convert it to Base64
    const imageData = fs.readFileSync(req.file.path, { encoding: 'base64' });

    // Create a new spare part document with all data including the image
    const sparePart = new SparePart({
      name,
      description,
      price,
      categoryId,
      baselifespan,
      quantity,
      compatibility: compatibility.split(','), // Assuming compatibility is a comma-separated list
      image: imageData // Store Base64 encoded image data in the 'image' field
    });

    // Save the new spare part to the database
    await sparePart.save();

    // Delete the temporary file uploaded by multer
    fs.unlinkSync(req.file.path);

    res.status(201).json(sparePart);
  } catch (err) {
    // Handle and log errors
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


// Get all spare parts
router.get('/get', async (req, res) => {
    try {
        const spareParts = await SparePart.find();
        res.json(spareParts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Get all products according to the category
router.get('/get_products/:id', async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await SparePart.findByCategoryId(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// View Product
router.get('/:id', async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await SparePart.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.post('/check-compatibility', async (req, res) => {
    const { productId, selectedBusModel } = req.body;
    try {
        // Find product by productId and populate its compatible bus models
        const product = await SparePart.findOne({ _id: productId }).populate('compatibility');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Check if selectedBusModel matches any compatible bus models
        const isCompatible = product.compatibility.some(model => model._id.toString() === selectedBusModel);
        res.json({ isCompatible });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
