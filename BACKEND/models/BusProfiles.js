const mongoose = require('mongoose');

const busProfilesSchema = new mongoose.Schema({
    busmodel: {
      type: mongoose.Schema.Types.ObjectId, 
         ref: 'BusModel'
    },
    description: {
        type: String
      },
      yearOfManufacture: {
        type: Date
      },
      VIN: {
        type: Number
         },
     
    image: {
        type:String
      }
    // Other relevant attributes
});

//busProfilesSchema.statics.findByCategoryId = function(categoryId) {
 // return this.find({ categoryId: categoryId });
//};
//busProfilesSchema.statics.findByProductId = function(productId) {
//  return this.find({ _id: productId });
//};




module.exports = mongoose.model('BusProfiles', busProfilesSchema);
