const express = require('express');
const router = express.Router();
const sQuestions = require('../models/SurveyQuestions');


// Create the questions
router.post('/post', async (req, res) => {
    try {
        const order = await sQuestions.create(req.body);
        console.log(req.body);

        res.status(201).json(order);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get('/get/:categoryId', async (req, res) => {
    try {
      const { categoryId } = req.params;
      const surveyQuestions = await sQuestions.findByCategoryId(categoryId);
      
      if (surveyQuestions.length > 0) {
        // Assuming you want to return the first match, adjust if needed
        res.json(surveyQuestions[0]);
      } else {
        res.status(404).json({ message: 'No questions found for this category.' });
      }
    } catch (error) {
      console.error('Error fetching survey questions:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });



module.exports = router;