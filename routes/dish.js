const express = require('express');
const router = express.Router();

const controller = require('../controllers/dish');

router.post('/users/:userId/dish', controller.createDish);

router.put('/users/:userId/dish', controller.updateDish);

router.get('/users/:usersId', controller.getDishesOfUser);

module.exports = router;
