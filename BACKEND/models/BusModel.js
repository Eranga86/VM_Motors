const mongoose = require('mongoose');

const busModelSchema = new mongoose.Schema({
    name:{
      type: String
    } 
  });
  
  
  module.exports = mongoose.model('BusModel', busModelSchema);