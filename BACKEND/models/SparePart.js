const mongoose = require('mongoose');

const sparePartSchema = new mongoose.Schema({
    name: {
      type: String
    },
    description: {
        type: String
      },
    price: {
        type: Number
      },
      categoryId: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'Category'
         },
      quantity: {
        type: Number
      },
      compatibility: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BusModel' }],
      baselifespan: {
        type: Number
      },
    image: {
        type:String
      }
    // Other relevant attributes
});

sparePartSchema.statics.findByCategoryId = function(categoryId) {
  return this.find({ categoryId: categoryId });
};
sparePartSchema.statics.findByProductId = function(productId) {
  return this.find({ _id: productId });
};

sparePartSchema.statics.findBaseLifespan = function(productId) {
  return this.find({ _id: productId });
};





module.exports = mongoose.model('SparePart', sparePartSchema);
