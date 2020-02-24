require('dotenv').config();
const mysql = require('promise-mysql');

/*
exports.getAllDishes = async userId => {
    try {
        console.log('call get all dishes');
        const sql = 'SELECT * FROM dishes WHERE userId=?';
        const dishes = await pool.query(sql, [userId]);
        console.log('DISHES: ' + dishes);
        return dishes;
    } catch (error) {
        console.log(error);
    }
};

exports.addDish = async (googleId, name, category) => {
    try {
        // Get the id associated with the googleId
        const userQuery = await pool.query(
            'SELECT id FROM users WHERE googleId=?',
            [googleId],
        );
        const userId = userQuery[0].id;
        const sql =
            'INSERT INTO dishes (userId, name, category) VALUES (?, ?, ?)';
        await pool.query(sql, [userId, name, category]);
    } catch (error) {
        console.log(error);
    }
};

getDish = async dishId => {
    try {
        const dishQuery = await pool.query(
            'SELECT * FROM dishes WHERE dishId=?',
            [dishId],
        );
        const historyQuery = await pool.query(
            'SELECT date FROM history WHERE dishId=? ORDER BY date',
            [dishId],
        );

        let history = [];
        for (let i = 0; i < historyQuery.length; i++) {
            history[i] = historyQuery[i].date;
        }

        dish = dishQuery[0];
        dish.history = history;
        dish.lastMade = history[0];
        return dish;
    } catch (error) {}
};

updateDish = async (dishId, updatedDishFields) => {
    try {
        // Get the dish object then assign new properties based on properties in updatedDishFields
        const dish = await getDish(dishId);
        for (let key in updatedDishFields) {
            dish[key] = updatedDishFields[key];
        }

        const sql =
            'UPDATE dishes SET category=?, cookingTime=?, ingredients=?, lastMade=?, name=?, notes=?, steps=?, url=? WHERE dishId=?';
        await pool.query(sql, [
            dish.category,
            dish.cookingTime,
            dish.ingredients,
            dish.lastMade,
            dish.name,
            dish.notes,
            dish.steps,
            dish.url,
            dishId,
        ]);
    } catch (error) {
        console.log(error);
}
};*/
