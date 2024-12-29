const mongoose = require('mongoose');

const billingDetailsSchema = new mongoose.Schema({
  
  customerID: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  orderDate: { type: Date, default: Date.now },
  billingAddress: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String },
  country: { type: String },
  createdAt: { type: Date, default: Date.now }
  
});

billingDetailsSchema.statics.findByuserId = function(userId) {
    return this.find({ customerID: userId });
};

const BillingDetails = mongoose.model('BillingDetails', billingDetailsSchema);



module.exports = BillingDetails;
