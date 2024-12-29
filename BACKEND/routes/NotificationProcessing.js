const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const notification = require('../models/Notification');

const app = express();
app.use(express.json());

app.post('/notification/displaying/:customerId', async (req, res) => {
  const customerId = req.params.customerId;
  try{
   const notifications = await findByCustomerId(customerId);
   res.json(notifications);

  } catch {

    res.json("Error in finding notifications");
  }
});



module.exports = router;