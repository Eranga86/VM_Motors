const mongoose = require('mongoose');

const vehicleProfilesSchema = new mongoose.Schema({
  images: [
    {
      type: String, // Store image paths or URLs
      required: true
    }
  ],
  description: {
    type: String,
    required: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer', // Ensure this references a valid Customer model
    required: true
  }
});

const VehicleProfiles = mongoose.model('VehicleProfiles', vehicleProfilesSchema);

module.exports = VehicleProfiles;
