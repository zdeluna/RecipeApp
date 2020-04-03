const express = require("express");
const router = express.Router();

const controller = require("../controllers/dish");

router.post("/users/:userId/dish", controller.createDish);

router.put("/users/:userId/dish/:dishId", controller.updateDish);

router.get("/users/:userId/dish/:dishId", controller.getDish);

router.delete("/users/:userId/dish/:dishId", controller.deleteDish);

router.get("/users/dish", controller.getDishesOfUser);

module.exports = router;
