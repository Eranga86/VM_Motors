const mongoose = require('mongoose');

const shippingDetailsSchema = new mongoose.Schema({
  
  customerID: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  orderDate: { type: Date, default: Date.now },
  shippingAddress: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String },
  country: { type: String },
  createdAt: { type: Date, default: Date.now }
  
});

shippingDetailsSchema.statics.findByuserId = function(userId) {
    return this.find({ customerID: userId });
};

const ShippingDetails = mongoose.model('ShippingDetails', shippingDetailsSchema);



module.exports = ShippingDetails;
