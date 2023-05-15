const express = require('express');
const router = express.Router();

// Import the identifier controller
const identifierController = require('../controllers/identifier');

// Connect the controller function to a route
router.post('/identifier', identifierController.birdQuery);

module.exports = router;