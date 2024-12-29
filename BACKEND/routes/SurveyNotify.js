const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');


router.get('/get_notifications/:customerId/:type', async (req, res) => {
  const { customerId, type,  } = req.params;
  try {
    // Find all notifications for the customer, product, and type
    const notifications = await Notification.find({
      customerId,
      type,
      viewed: false // Only fetch unread notifications
    });

    // If you need to filter notifications further based on the current date and nextSurveyDate,
    // you can add additional logic here before sending the response

    res.json(notifications); // Corrected variable name to match the fetched data
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send(error.message);
  }
});

router.get('/initial_notifications/:customerId', async (req, res) => {
  const { customerId } = req.params;
  const type = 'InitialSurvey'; // Assuming 'InitialSurvey' is the correct type
  
  try {
    // Find all notifications for the customer, matching type and unread status
    const notifications = await Notification.find({
      customerId,
      type,
      viewed: false // Only fetch unread notifications
    }).sort({ createdAt: -1 }); // Optional: Sort by createdAt descending
    
    res.json(notifications); // Send JSON response with notifications array
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send('Error fetching notifications'); // Send 500 status and error message
  }
});



router.put('/notification/viewed/:id', async (req, res) => {
  const { id } = req.params; // Rename notificationId to id to match the route parameter

  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { $set: { viewed: true } }, // Update the 'viewed' field to true
      { new: true } // Return the updated document
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found or not updated' });
    }

    res.json(updatedNotification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
