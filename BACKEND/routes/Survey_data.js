const express = require('express');
const router = express.Router();
const CoolingSystemLifespan = require('../models/CoolingPartsLifespan');
const ExteriorPartsLifespan = require('../models/ExteriorPartsLifespan.js');
const InteriorPartsLifespan  = require('../models/InteriorPartsLifespan.js');
const MechanicalPartsLifespan = require('../models/MechanicalPartsLifespan.js');

router.post('/submit-survey_CoolingParts', async (req, res) => {
  const { customerId, productId, surveyResponses } = req.body;
  console.log('customerId:', customerId);
  console.log('productId:', productId);
  console.log('surveyResponses:', surveyResponses);

  try {
    let lifespanRecord = await CoolingSystemLifespan.findOne({ customerId, productId });

    if (!lifespanRecord) {
      return res.status(404).send('Lifespan record not found');
    }

    // Push surveyResponses to an array if necessary
    // Example: lifespanRecord.surveyResponses.push(surveyResponses);

    // Process survey responses asynchronously
    await processSurveyResponses(lifespanRecord, surveyResponses, res);

  } catch (error) {
    console.error('Error processing survey responses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function processSurveyResponses(lifespanRecord, surveyResponses, res) {
  // Ensure 'res' is correctly received here if needed for responses

  // Example of lifespan adjustment logic
  let lifespanAdjustment = 0;
  console.log('Initial lifespanAdjustment:', lifespanAdjustment);

  if (surveyResponses.typeOfUsage == 'City driving') {
    lifespanAdjustment -= 10;
    console.log('Adjusted for City driving:', lifespanAdjustment);
  } else if (surveyResponses.typeOfUsage == 'Long-distance travel') {
    lifespanAdjustment += 15; // Adjusted from 10 to 15 for long-distance travel
    console.log('Adjusted for Long-distance travel:', lifespanAdjustment);
  }

  if (surveyResponses.loadConditions == 'Low') {
    lifespanAdjustment += 5;
    console.log('Adjusted for Low loadConditions:', lifespanAdjustment);
  } else if (surveyResponses.loadConditions === 'Moderate') {
    lifespanAdjustment -= 5;
    console.log('Adjusted for Moderate loadConditions:', lifespanAdjustment);
  } else if (surveyResponses.loadConditions === 'High') {
    lifespanAdjustment -= 10;
    console.log('Adjusted for High loadConditions:', lifespanAdjustment);
  }

  // Add more conditionals for other survey response fields...

  // Update lifespanRecord fields based on surveyResponses
  lifespanRecord.usageData = {
    ...lifespanRecord.usageData,
    currentMileage: surveyResponses.currentMileage,
    averageDailyMonthlyMileage: surveyResponses.averageDailyMonthlyMileage,
    typeOfUsage: surveyResponses.typeOfUsage,
    loadConditions: surveyResponses.loadConditions,
    drivingConditions: surveyResponses.drivingConditions
  };

  lifespanRecord.environmentalFactors = {
    ...lifespanRecord.environmentalFactors,
    climate: surveyResponses.climate,
    roadConditions: surveyResponses.roadConditions
  };

  lifespanRecord.maintenanceData = {
    ...lifespanRecord.maintenanceData,
    filterReplacements: surveyResponses.filterReplacements,
    refrigerantTopUps: surveyResponses.refrigerantTopUps
  };

  // Calculate currentLifespan based on baseLifespan and adjustment
  lifespanRecord.currentLifespan = calculateCurrentLifespan(lifespanRecord.baseLifespan, lifespanAdjustment);

  // Handle cases where currentLifespan might be NaN
  if (isNaN(lifespanRecord.currentLifespan)) {
    lifespanRecord.currentLifespan = 0; // Default to 0 if NaN
  }

  // Update expirationNotificationDate and nextSurveyDate
  lifespanRecord.expirationNotificationDate = new Date(
    lifespanRecord.installationDate.getTime() + lifespanRecord.currentLifespan * 365 * 24 * 60 * 60 * 1000
  );
  
  lifespanRecord.nextSurveyDate = calculateNextSurveyDate(new Date());

  // Save the updated document
  try {
    const updatedRecord = await lifespanRecord.save();
    console.log('Updated record:', updatedRecord);

    // Respond with the updated record in your API response
    res.json({ lifespanRecord: updatedRecord });
  } catch (error) {
    console.error('Error saving record:', error);
    // Handle error response appropriately
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


router.post('/submit-survey_ExteriorParts', async (req, res) => {
  const { customerId, productId, surveyResponses } = req.body;
  console.log('customerId:', customerId);
  console.log('productId:', productId);
  console.log('surveyResponses:', surveyResponses);

  try {
    let lifespanRecord = await ExteriorPartsLifespan.findOne({ customerId, productId });

    if (!lifespanRecord) {
      return res.status(404).send('Lifespan record not found');
    }

    await processSurveyResponses(lifespanRecord, surveyResponses, res);

  } catch (error) {
    console.error('Error processing survey responses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function processSurveyResponses(lifespanRecord, surveyResponses, res) {
  let lifespanAdjustment = 1; // Start with 1 for multiplication
  console.log('Initial lifespanAdjustment:', lifespanAdjustment);

  const weights = {
    dailyOperation: {
      kilometersPerDay: { A: 1.2, B: 1.1, C: 1.0, D: 0.8 },
      numberOfTrips: { A: 1.2, B: 1.1, C: 1.0, D: 0.8 }
    },
    environmentalExposure: {
      climate: { A: 0.9, B: 1.0, C: 1.2, D: 0.8 },
      exposureTime: { A: 1.0, B: 1.1, C: 1.2, D: 1.3 }
    },
    roadConditions: {
      pavedRoadsPercentage: { A: 0.7, B: 0.8, C: 0.9, D: 1.0 },
      generalCondition: { A: 1.0, B: 1.1, C: 1.2, D: 1.3 }
    },
    maintenancePractices: {
      inspectionFrequency: { A: 1.2, B: 1.1, C: 1.0, D: 0.8 },
      maintainProcedure: { A: 1.0, B: 1.1, C: 1.2, D: 1.3 }
    },
    loadUsage: {
      averagePassengers: { A: 1.2, B: 1.1, C: 1.0, D: 0.9 },
      busCondition: { A: 1.0, B: 1.1, C: 1.2, D: 1.3 }
    },
    corrosiveExposure: {
      saltExposure: { A: 1.2, B: 1.1, C: 1.0, D: 0.8 }
    }
  };

  const answers = {
    kilometersPerDay: surveyResponses.kilometersPerDay,
    numberOfTrips: surveyResponses.numberOfTrips,
    climate: surveyResponses.climate,
    exposureTime: surveyResponses.exposureTime,
    pavedRoadsPercentage: surveyResponses.pavedRoadsPrecentage, // Corrected typo here
    generalCondition: surveyResponses.genralCondition, // Corrected key name here
    inspectionFrequency: surveyResponses.inspecting, // Corrected key name here
    maintainProcedure: surveyResponses.maintainProcedure,
    averagePassengers: surveyResponses.numberOfPassengers, // Corrected key name here
    busCondition: surveyResponses.busCondition,
    saltExposure: surveyResponses.busExposureToSalt // Corrected key name here
  };

  console.log('Answers object:', answers);

  try {
    lifespanAdjustment *= weights.dailyOperation.kilometersPerDay[answers.kilometersPerDay];
    lifespanAdjustment *= weights.dailyOperation.numberOfTrips[answers.numberOfTrips];
    lifespanAdjustment *= weights.environmentalExposure.climate[answers.climate];
    lifespanAdjustment *= weights.environmentalExposure.exposureTime[answers.exposureTime];
    lifespanAdjustment *= weights.roadConditions.pavedRoadsPercentage[answers.pavedRoadsPercentage];
    lifespanAdjustment *= weights.roadConditions.generalCondition[answers.generalCondition];
    lifespanAdjustment *= weights.maintenancePractices.inspectionFrequency[answers.inspectionFrequency];
    lifespanAdjustment *= weights.maintenancePractices.maintainProcedure[answers.maintainProcedure];
    lifespanAdjustment *= weights.loadUsage.averagePassengers[answers.averagePassengers];
    lifespanAdjustment *= weights.loadUsage.busCondition[answers.busCondition];
    lifespanAdjustment *= weights.corrosiveExposure.saltExposure[answers.saltExposure];

    console.log('Final lifespanAdjustment:', lifespanAdjustment);

  } catch (error) {
    console.error('Error calculating lifespan adjustment:', error);
    return res.status(500).json({ error: 'Error calculating lifespan adjustment' });
  }

  if (isNaN(lifespanRecord.baseLifespan)) {
    return res.status(400).json({ error: 'Invalid base lifespan' });
  }

  const baseLifespan = parseFloat(lifespanRecord.baseLifespan);

  if (isNaN(baseLifespan)) {
    return res.status(400).json({ error: 'Invalid base lifespan' });
  }

  lifespanRecord.currentLifespan = calculateCurrentLifespan(baseLifespan, lifespanAdjustment);

  if (isNaN(lifespanRecord.currentLifespan)) {
    //lifespanRecord.currentLifespan = 0; // Default to 0 if NaN
  }

  lifespanRecord.usageData = {
    ...lifespanRecord.usageData,
    currentMileage: surveyResponses.currentMileage,
    averageDailyMonthlyMileage: surveyResponses.averageDailyMonthlyMileage
  };

  lifespanRecord.EnvironmentalExposure = {
    ...lifespanRecord.EnvironmentalExposure,
    climate: surveyResponses.climate,
    exposureTime: surveyResponses.exposureTime
  };

  lifespanRecord.RoadCondition = {
    ...lifespanRecord.RoadCondition,
    pavedRoadsPercentage: surveyResponses.pavedRoadsPercentage,
    generalCondition: surveyResponses.generalCondition
  };

  lifespanRecord.dailyOperations = {
    ...lifespanRecord.dailyOperations,
    kilometersPerDay: surveyResponses.kilometersPerDay,
    numberOfTrips: surveyResponses.numberOfTrips
  };

  lifespanRecord.maintenanceData = {
    ...lifespanRecord.maintenanceData,
    inspecting: surveyResponses.inspecting,
    maintainProcedure: surveyResponses.maintainProcedure
  };

  lifespanRecord.LoadAndUsage = {
    ...lifespanRecord.LoadAndUsage,
    numberOfPassengers: surveyResponses.numberOfPassengers,
    busCondition: surveyResponses.busCondition
  };

  lifespanRecord.ExposureToCorrosiveMaterial = {
    ...lifespanRecord.ExposureToCorrosiveMaterial,
    busExposureToSalt: surveyResponses.busExposureToSalt
  };

  lifespanRecord.expirationNotificationDate = new Date(
    lifespanRecord.installationDate.getTime() + lifespanRecord.currentLifespan * 365 * 24 * 60 * 60 * 1000
  );

  lifespanRecord.nextSurveyDate = calculateNextSurveyDate(new Date());

  try {
    const updatedRecord = await lifespanRecord.save();
    console.log('Updated record:', updatedRecord);
    res.json({ lifespanRecord: updatedRecord });
  } catch (error) {
    console.error('Error saving record:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}




router.post('/submit-survey_InteriorParts', async (req, res) => {
  const { customerId, productId, surveyResponses } = req.body;
  console.log('customerId:', customerId);
  console.log('productId:', productId);
  console.log('surveyResponses:', surveyResponses);

  try {
    let lifespanRecord = await InteriorPartsLifespan.findOne({ customerId, productId });

    if (!lifespanRecord) {
      return res.status(404).send('Lifespan record not found');
    }

    await processInteriorSurveyResponses(lifespanRecord, surveyResponses, res);

  } catch (error) {
    console.error('Error processing survey responses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function processInteriorSurveyResponses(lifespanRecord, surveyResponses, res) {
  let lifespanAdjustment = 1; // Start with 1 for multiplication
  console.log('Initial lifespanAdjustment:', lifespanAdjustment);

  const weights = {
    cleaningFrequency: {
      A: 1.2,
      B: 1.1,
      C: 1.0,
      D: 0.8
    },
    cleaningProducts: {
      A: 1.2,
      B: 1.1,
      C: 1.0,
      D: 0.9
    },
    passengerLoad: {
      A: 0.8,
      B: 0.9,
      C: 1.0,
      D: 1.2
    },
    interiorTemperature: {
      A: 1.2,
      B: 1.1,
      C: 1.0,
      D: 0.9
    },
    sunlightExposure: {
      A: 0.8,
      B: 0.9,
      C: 1.0,
      D: 1.1
    },
    wearAndTear: {
      A: 1.2,
      B: 1.1,
      C: 1.0,
      D: 0.8
    },
    spillFrequency: {
      A: 0.8,
      B: 0.9,
      C: 1.0,
      D: 1.1
    }
  };

  const answers = {
    cleaningFrequency: surveyResponses.cleaningFrequency,
    cleaningProducts: surveyResponses.cleaningProducts,
    passengerLoad: surveyResponses.passengerLoad,
    interiorTemperature: surveyResponses.interiorTemperature,
    sunlightExposure: surveyResponses.sunlightExposure,
    wearAndTear: surveyResponses.wearAndTear,
    spillFrequency: surveyResponses.spillFrequency
  };

  console.log('Answers object:', answers); // Log the entire answers object
  
  try {
    lifespanAdjustment *= weights.cleaningFrequency[answers.cleaningFrequency];
    lifespanAdjustment *= weights.cleaningProducts[answers.cleaningProducts];
    lifespanAdjustment *= weights.passengerLoad[answers.passengerLoad];
    lifespanAdjustment *= weights.interiorTemperature[answers.interiorTemperature];
    lifespanAdjustment *= weights.sunlightExposure[answers.sunlightExposure];
    lifespanAdjustment *= weights.wearAndTear[answers.wearAndTear];
    lifespanAdjustment *= weights.spillFrequency[answers.spillFrequency];
    console.log('lifespanAdjustment:', lifespanAdjustment);
  } catch (error) {
    console.error('Error calculating lifespan adjustment:', error);
    return res.status(500).json({ error: 'Error calculating lifespan adjustment' });
  }

  if (isNaN(lifespanRecord.baseLifespan)) {
    return res.status(400).json({ error: 'Invalid base lifespan' });
  }
  const baseLifespan = parseFloat(lifespanRecord.baseLifespan);

  if (isNaN(baseLifespan)) {
    return res.status(400).json({ error: 'Invalid base lifespan' });
  }
  lifespanRecord.currentLifespan = calculateCurrentLifespan(baseLifespan, lifespanAdjustment);
  if (isNaN(lifespanRecord.currentLifespan)) {
    lifespanRecord.currentLifespan = 0; // Default to 0 if NaN
  }

  lifespanRecord.usageData = {
    ...lifespanRecord.usageData,
    currentMileage: surveyResponses.currentMileage,
    averageDailyMonthlyMileage: surveyResponses.averageDailyMonthlyMileage
  };

  lifespanRecord.cleaningData = {
    cleaningFrequency: surveyResponses.cleaningFrequency,
    cleaningProducts: surveyResponses.cleaningProducts
  };

  lifespanRecord.passengerData = {
    passengerLoad: surveyResponses.passengerLoad
  };

  lifespanRecord.environmentalExposure = {
    interiorTemperature: surveyResponses.interiorTemperature,
    sunlightExposure: surveyResponses.sunlightExposure
  };

  lifespanRecord.wearAndTear = {
    wearAndTear: surveyResponses.wearAndTear
  };

  lifespanRecord.spillFrequency = {
    spillFrequency: surveyResponses.spillFrequency
  };

  lifespanRecord.expirationNotificationDate = new Date(
    lifespanRecord.installationDate.getTime() + lifespanRecord.currentLifespan * 365 * 24 * 60 * 60 * 1000
  );

  lifespanRecord.nextSurveyDate = calculateNextSurveyDate(new Date());

  try {
    const updatedRecord = await lifespanRecord.save();
    console.log('Updated record:', updatedRecord);
    res.json({ lifespanRecord: updatedRecord });
  } catch (error) {
    console.error('Error saving record:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


 // Adjust the path as necessary

router.post('/submit-survey_MechanicalParts', async (req, res) => {
  const { customerId, productId, surveyResponses } = req.body;
  console.log('customerId:', customerId);
  console.log('productId:', productId);
  console.log('surveyResponses:', surveyResponses);

  try {
    let lifespanRecord = await MechanicalPartsLifespan.findOne({ customerId, productId });

    if (!lifespanRecord) {
      return res.status(404).send('Lifespan record not found');
    }

    await processMechanicalSurveyResponses(lifespanRecord, surveyResponses, res);

  } catch (error) {
    console.error('Error processing survey responses:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function processMechanicalSurveyResponses(lifespanRecord, surveyResponses, res) {
  let lifespanAdjustment = 1; // Start with 1 for multiplication
  console.log('Initial lifespanAdjustment:', lifespanAdjustment);

  const weights = {
    maintenanceFrequency: {
      A: 1.2,
      B: 1.0,
      C: 0.8,
      D: 0.6
    },
    replacementQuality: {
      A: 1.2,
      B: 1.0,
      C: 0.8,
      D: 0.6
    },
    drivingConditions: {
      A: 1.2,
      B: 1.0,
      C: 0.8,
      D: 0.6
    },
    loadConditions: {
      A: 1.2,
      B: 1.0,
      C: 0.8,
      D: 0.6
    },
    environmentalConditions: {
      A: 1.2,
      B: 1.0,
      C: 0.8,
      D: 0.6
    }
  };

  const answers = {
    maintenanceFrequency: surveyResponses.maintenanceFrequency,
    replacementQuality: surveyResponses.replacementQuality,
    drivingConditions: surveyResponses.drivingConditions,
    loadConditions: surveyResponses.loadConditions,
    environmentalConditions: surveyResponses.environmentalConditions
  };

  console.log('Answers object:', answers); // Log the entire answers object
  
  try {
    lifespanAdjustment *= weights.maintenanceFrequency[answers.maintenanceFrequency];
    lifespanAdjustment *= weights.replacementQuality[answers.replacementQuality];
    lifespanAdjustment *= weights.drivingConditions[answers.drivingConditions];
    lifespanAdjustment *= weights.loadConditions[answers.loadConditions];
    lifespanAdjustment *= weights.environmentalConditions[answers.environmentalConditions];
    console.log('lifespanAdjustment:', lifespanAdjustment);
  } catch (error) {
    console.error('Error calculating lifespan adjustment:', error);
    return res.status(500).json({ error: 'Error calculating lifespan adjustment' });
  }

  if (isNaN(lifespanRecord.baseLifespan)) {
    return res.status(400).json({ error: 'Invalid base lifespan' });
  }
  const baseLifespan = parseFloat(lifespanRecord.baseLifespan);

  if (isNaN(baseLifespan)) {
    return res.status(400).json({ error: 'Invalid base lifespan' });
  }
  lifespanRecord.currentLifespan = calculateCurrentLifespan(baseLifespan, lifespanAdjustment);
  if (isNaN(lifespanRecord.currentLifespan)) {
    lifespanRecord.currentLifespan = 0; // Default to 0 if NaN
  }

  lifespanRecord.usageData = {
    ...lifespanRecord.usageData,
    currentMileage: surveyResponses.currentMileage,
    averageDailyMonthlyMileage: surveyResponses.averageDailyMonthlyMileage
  };

  lifespanRecord.maintenanceData = {
    maintenanceFrequency: surveyResponses.maintenanceFrequency,
    replacementQuality: surveyResponses.replacementQuality
  };

  lifespanRecord.operationalConditions = {
    drivingConditions: surveyResponses.drivingConditions,
    loadConditions: surveyResponses.loadConditions
  };

  // Correctly assign environmentalConditions to environmentalFactors
lifespanRecord.environmentalFactors = {
  environmentalConditions: surveyResponses.environmentalConditions
};

  lifespanRecord.expirationNotificationDate = new Date(
    lifespanRecord.installationDate.getTime() + lifespanRecord.currentLifespan * 365 * 24 * 60 * 60 * 1000
  );

  lifespanRecord.nextSurveyDate = calculateNextSurveyDate(new Date());

  try {
    const updatedRecord = await lifespanRecord.save();
    console.log('Updated record:', updatedRecord);
    res.json({ lifespanRecord: updatedRecord });
  } catch (error) {
    console.error('Error saving record:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

   
function calculateCurrentLifespan(baseLifespan, adjustment) {
  let currentLifespan = parseFloat(baseLifespan) * parseFloat(adjustment);
  if (isNaN(currentLifespan)) {
    console.error('Invalid current lifespan calculation:', { baseLifespan, adjustment });
    return 0; // Default to 0 if NaN
  }
  return currentLifespan;
}

function calculateNextSurveyDate(currentDate) {
  const nextSurveyDate = new Date(currentDate);
  nextSurveyDate.setMonth(nextSurveyDate.getMonth() + 1); // Example: next survey in 1 month
  return nextSurveyDate;
}


module.exports = router;
