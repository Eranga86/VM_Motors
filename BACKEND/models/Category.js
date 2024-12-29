
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

CategorySchema.statics.findByCategoryId = function(categoryId) {
  return this.find({ _id: categoryId });
};


module.exports = mongoose.model('Category', CategorySchema);
