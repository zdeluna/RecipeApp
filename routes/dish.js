const express = require('express');
const router = express.Router();

const controller = require('../controllers/dish');

/* Route to create a new dish */
app.post('users/:userId/dish', controller.createDish());

model.exports = router;
