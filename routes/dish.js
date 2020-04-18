const { authenticateUser } = require("../auth/auth.js");
const express = require("express");
const router = express.Router();

const controller = require("../controllers/dish");

router.post("/users/dish", authenticateUser, controller.createDish);

router.put("/users/dish/:dishId", authenticateUser, controller.updateDish);

router.get("/users/dish/:dishId", authenticateUser, controller.getDish);

router.delete("/users/dish/:dishId", authenticateUser, controller.deleteDish);

router.get("/users/dish", authenticateUser, controller.getDishesOfUser);

module.exports = router;
