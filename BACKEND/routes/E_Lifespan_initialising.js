const express = require('express');
const router = express.Router();
const CoolingSystemLifespan = require('../models/ExteriorPartsLifespan.js');
const SparePart = require('../models/SparePart'); // Import SparePart model

router.post('/initialize-Exterior_lifespan', async (req, res) => {
    const { customerId, productId, categoryId, installationDate, busModel, yearOfManufacture, VIN } = req.body;

    try {
        // Fetch product including baseLifespan
        const product = await SparePart.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        // Ensure baseLifespan is fetched and assigned
        const baseLifespan = product.baselifespan;

        // Create a new CoolingSystemLifespan record
        const newLifespanRecord = new CoolingSystemLifespan({
            customerId,
            productId,
            categoryId,
            installationDate,
            baseLifespan, // Assign baseLifespan here
            currentLifespan: 0,
            expirationNotificationDate: null,
            nextSurveyDate: calculateNextSurveyDate(new Date()),
            usageData: {
                busModel,
                yearOfManufacture,
                VIN,
                currentMileage: 0,
                averageDailyMonthlyMileage: 0,
                
                
            },
            RoadCondition: {
                pavedRoadsPrecentage: '',
                genralCondition: ''
            },
            DailyOperations: {
                kilometersPerDay: '',
                numberOfTrips: ''
            },
            EnvironmentalExposure: {
                climate: 0,
                exposureTime: 0
            },
            maintenanceData: {
                inspecting: 0,
                maintainProcedure: 0
            },
            LoadAndUsage: {
                numberOfPassengers: 0,
                busCodition: 0
            },
            ExposureToCorrosiveMaterial: {
                busExposureToSalt: 0
                
            },
            
            surveyResponses: []
        });

        // Save the new record to the database
        await newLifespanRecord.save();
        res.status(201).json(newLifespanRecord); // Use status 201 for created resources
    } catch (error) {
        console.error('Error creating new lifespan record:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

function calculateNextSurveyDate(currentDate) {
    const nextDate = new Date(currentDate);
    nextDate.setMonth(nextDate.getMonth() + 1);
    return nextDate;
}

module.exports = router;
