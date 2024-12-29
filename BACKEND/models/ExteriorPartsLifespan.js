const mongoose = require('mongoose');

const ExteriorPartsLifespanSchema = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  categoryId: mongoose.Schema.Types.ObjectId,
  productId: mongoose.Schema.Types.ObjectId,
  installationDate: Date,
  currentLifespan: { type: Number, default: 0 },
  baseLifespan: Number,
  expirationNotificationDate: Date,
  nextSurveyDate: Date,
  notified: { type: Boolean, default: false },
  usageData: {
    busModel: { type: String },
    yearOfManufacture: { type: Number },
    VIN: { type: String },
    currentMileage: { type: Number, default: 0 },
    averageDailyMonthlyMileage: { type: Number, default: 0 },
    
  },
  RoadCondition: {
    pavedRoadsPrecentage: { type: String },
    genralCondition: { type: String }
},
EnvironmentalExposure: {
    climate: { type: String },
    exposureTime: { type: String }
  },
  maintenanceData: {
    inspecting: { type: String },
    maintainProcedure: { type: String }
  },
  dailyOperations: {
    kilometersPerDay: { type: String },
    numberOfTrips:{ type: String }
  },
  LoadAndUsage: {
    numberOfPassengers: { type: String },
    busCondition: { type: String }
  },
  ExposureToCorrosiveMaterial: {
    busExposureToSalt: { type: String }
  },
  surveyResponses: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId },
      response: { type: String }
    }
  ]
});

// Define a custom static method instead of overriding `findOne`
ExteriorPartsLifespanSchema.statics.findByCustomerId = function(cid) {
  return this.findOne({ customerId: cid });
};

const ExteriorPartsLifespan = mongoose.model('ExteriorPartsLifespan', ExteriorPartsLifespanSchema);
module.exports = ExteriorPartsLifespan;
