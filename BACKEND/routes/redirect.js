// routes/redirect.js
const express = require('express');
const router = express.Router();

// Define route to redirect to home page
router.get('/redirect', (req, res) => {
  res.redirect('/'); // Redirect to your home page route
});

module.exports = router;
