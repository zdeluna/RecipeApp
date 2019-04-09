const express = require('express');
const router = express.Router();

const controller = require('../controllers/dish');

router.post('/users/:userId/dish', controller.createDish);

router.put('/users/:userId/dish', controller.updateDish);

router.get('/users/:userId/dish/:dishId', controller.getDish);

router.get('/users/:userId', controller.getDishesOfUser);

module.exports = router;
