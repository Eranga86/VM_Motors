const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const VehicleProfiles = require('../models/vehicleProfiles'); // Ensure correct path

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Create a new vehicle profile
router.post('/post', upload.array('images', 3), async (req, res) => {
  try {
    const { description, customerId } = req.body;

    // Check if exactly 3 images are uploaded
    if (!req.files || req.files.length !== 3) {
      return res.status(400).json({ message: 'Exactly 3 images are required' });
    }

    // Map files to the required schema
    const images = req.files.map(file => file.path);

    const vehicle = new VehicleProfiles({
      images,
      description,
      customerId
    });

    const savedVehicle = await vehicle.save();
    res.status(201).json(savedVehicle);
  } catch (err) {
    console.error('Error saving vehicle:', err.message);
    res.status(400).json({ message: err.message });
  }
});

// Update an existing vehicle profile
router.put('/edit/:id', upload.array('images', 3), async (req, res) => {
  try {
    const { description, customerId } = req.body;
    const vehicleId = req.params.id;

    // Ensure exactly 3 images are provided
    if (!req.files || req.files.length !== 3) {
      return res.status(400).json({ message: 'Exactly 3 images are required' });
    }

    const images = req.files.map(file => file.path);

    const updatedVehicle = await VehicleProfiles.findByIdAndUpdate(vehicleId, {
      description,
      customerId,
      images
    }, { new: true });

    if (!updatedVehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(updatedVehicle);
  } catch (err) {
    console.error('Error updating vehicle:', err.message);
    res.status(400).json({ message: err.message });
  }
});


router.get('/get', async (req, res) => {
    try {
      const vehicles = await VehicleProfiles.find(); // Fetch all vehicle profiles
      res.json(vehicles);
    } catch (err) {
      console.error('Error fetching vehicle profiles:', err.message);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
      await VehicleProfiles.findByIdAndDelete(id);
      res.status(200).send('Vehicle profile deleted successfully');
    } catch (error) {
      console.error('Error deleting vehicle profile:', error.message); // Add logging for debugging
      res.status(500).send('Error deleting vehicle profile');
    }
  });
  
  

module.exports = router;
