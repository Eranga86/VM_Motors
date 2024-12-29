const mongoose = require('mongoose');


const cartItemSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'SparePart' },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    productImage:String,
    productName: String,
    productDescription: String,
    productPrice: Number,
    quantity: { type: Number, required: true },
    totalPrice: Number,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});



cartItemSchema.statics.findByuserId = function(userId) {
    return this.find({ userId: userId });
};
cartItemSchema.statics.findByproductId = function(productId) {
    return this.find({ productId: productId });
};


module.exports = mongoose.model('AddToCart', cartItemSchema);
