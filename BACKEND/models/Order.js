const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerID: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    orderDate: { type: Date, default: Date.now },
    refferenceNo: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    billingAddress: { type: String, required: true },
    orderTotal: { type: Number, required: true },
    paymentMethod: { type: String, required: true, default: 'Credit Card' },
    paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Failed'], required: true, default: 'Pending' },
    orderStatus: { type: String, enum: ['Pending', 'Processing', 'Shipped'], required: true, default: 'Pending' },
    products: [{
        productID: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        productName: { type: String, required: true },
        productPrice: { type: Number, required: true },
        quantity: { type: Number, required: true }
    }]
});

orderSchema.statics.findByReferenceNo = function(refNo) {
    return this.findOne({ refferenceNo: refNo });
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
