const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  products: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      purchaseDate: Date,
      categoryId:mongoose.Schema.Types.ObjectId
      
    }
  ]
});

const Purchase = mongoose.model('Purchase', PurchaseSchema);

module.exports = Purchase;
