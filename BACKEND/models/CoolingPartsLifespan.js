const mongoose = require('mongoose');

const CoolingSystemLifespanSchema = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  categoryId:mongoose.Schema.Types.ObjectId,
  productId: mongoose.Schema.Types.ObjectId,
  installationDate: Date,
  currentLifespan: Number,
  baseLifespan: Number,
  expirationNotificationDate: Date,
  nextSurveyDate: Date,
  notified: { type: Boolean,  default: false },
  usageData: {
    busModel: { type: String },
    yearOfManufacture: { type: Date },
    VIN: { type: String },
    currentMileage: { type: Number },
    averageDailyMonthlyMileage: { type: Number }
  },
  environmentalFactors: {
    climate: { type: String },
    roadConditions: { type: String }
  },
  maintenanceData: {
    filterReplacements: { type: String },
    refrigerantTopUps: { type: String }
  },
  surveyResponses: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId },
      response: { type: String }
    }
  ]
});

// Define a custom static method instead of overriding `findOne`
CoolingSystemLifespanSchema.statics.findByCustomerId = function(cid) {
  return this.findOne({ customerId: cid });
};

const CoolingSystemLifespan = mongoose.model('CoolingSystemLifespan', CoolingSystemLifespanSchema);
module.exports = CoolingSystemLifespan;
