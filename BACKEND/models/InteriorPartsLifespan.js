const mongoose = require('mongoose');

const InteriorPartsLifespanSchema = new mongoose.Schema({
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
    yearOfManufacture: { type: Number },
    VIN: { type: String },
    currentMileage: { type: Number },
    averageDailyMonthlyMileage: { type: Number },
  },
  LoadAndUsage: {
    passengerLoad: { type: String },
  },
  environmentalFactors: {
    climate: { type: String },
    roadConditions: { type: String },
  },
  maintenanceData: {
    cleaningFrequency: { type: String },
    cleaningProducts: { type: String },
    interiorPartReplacements: { type: String },
    interiorTemperature: { type: String },
    spillFrequency: { type: String },
  },
  interiorFactors: {
    wearAndTear: { type: String },
    exposureToSunlight: { type: String },
    exposureToMoisture: { type: String },
  },
  surveyResponses: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId },
      response: { type: String },
    },
  ],
});

const InteriorPartsLifespan = mongoose.model('InteriorPartsLifespan', InteriorPartsLifespanSchema);
module.exports = InteriorPartsLifespan;
