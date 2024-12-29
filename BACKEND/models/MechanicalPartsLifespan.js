const mongoose = require('mongoose');

const MechanicalPartsLifespanSchema = new mongoose.Schema({
  customerId: mongoose.Schema.Types.ObjectId,
  categoryId: mongoose.Schema.Types.ObjectId,
  productId: mongoose.Schema.Types.ObjectId,
  installationDate: Date,
  currentLifespan: Number,
  baseLifespan: Number,
  expirationNotificationDate: Date,
  nextSurveyDate: Date,
  notified: { type: Boolean, default: false },
  usageData: {
    busModel: { type: String },
    yearOfManufacture: { type: Number },
    VIN: { type: String },
    currentMileage: { type: Number },
    averageDailyMonthlyMileage: { type: Number },
    drivingConditions: { type: String },
    loadConditions: { type: String }
  },
  environmentalFactors: {
    environmentalConditions: { type: String }
  },
  maintenanceData: {
    maintenanceFrequency: { type: String },
    replacementQuality: { type: String }
  },
  surveyResponses: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId },
      response: { type: String }
    }
  ]
});

const MechanicalPartsLifespan = mongoose.model('MechanicalPartsLifespan', MechanicalPartsLifespanSchema);
module.exports = MechanicalPartsLifespan;
