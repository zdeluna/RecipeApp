const firebase = require('../models/firebase.js');
const userModel = require('../models/user.js');
const dbModel = require('../models/sql/database.js');
/**
 * Check to see if the dish Id exists in the database
 * @param {String} dishId
 */

const checkIfDishExists = async (userId, dishId) => {
    return new Promise(async (resolve, reject) => {
        const snapshot = await firebase.database
            .child('/dishes/' + userId)
            .once('value');
        if (snapshot.hasChild(dishId)) return resolve();
        else
            return reject({
                statusCode: 404,
                msg: 'DISH_DOES_NOT_EXIST',
            });
    });
};

/**
 * Returns a new key that can be used to create a dish
 * @Return {String}
 */

const getNewDishKey = () => {
    return firebase.database.child('dishes').push().key;
};

/**
 * Saves a user's dish to the database using the updated dish fields
 * @param {String} userId
 * @param {String} dishId
 * @param {Object} updatedDishFields
 * @Return {String}
 */

const saveDish = async (connection, dishId, updatedDishFields) => {
    try {
        // Get the dish object then assign new properties based on properties in updatedDishFields
        const dish = await getDishFromDatabase(connection, dishId);
        for (let key in updatedDishFields) {
            dish[key] = updatedDishFields[key];
        }
        console.log('In save dish: ' + dish.steps);
        console.log(dish.steps[0]);
        const sql =
            'UPDATE dishes SET category=?, cookingTime=?, ingredients=?, lastMade=?, name=?, notes=?, steps=?, url=? WHERE dishId=?';
        await connection.query(sql, [
            dish.category,
            dish.cookingTime,
            JSON.stringify(dish.ingredients),
            dish.lastMade,
            dish.name,
            dish.notes,
            JSON.stringify(dish.steps),
            dish.url,
            dish.dishId,
        ]);
        console.log('Finished saving dish' + dish);
    } catch (error) {
        console.log(error);
        throw Error({statusCode: 422, msg: error.message});
    }
};

/**
 * Retrieves all of a user's dishes
 * @param {String} userId
 * @Return {Object}
 */

const getAllDishesOfUser = async (connection, googleId) => {
    try {
        const userQuery = await connection.query(
            'SELECT id FROM users WHERE googleId=?',
            [googleId],
        );
        const userId = userQuery[0].id;
        const sql = 'SELECT * FROM dishes WHERE userId=?';
        const dishes = await connection.query(sql, [userId]);

        // Convert the JSON from the database to Javascript Object
        for (let i = 0; i < dishes.length; i++) {
            if (dishes[i].steps) dishes[i].steps = JSON.parse(dishes[i].steps);
            if (dishes[i].ingredients)
                dishes[i].ingredients = JSON.parse(dishes[i].ingredients);
        }

        return dishes;
    } catch (error) {
        throw Error({statusCode: 422, msg: error.message});
    }
};

/**
 * Retrieves a specific dish for a user
 * @param {String} googleId
 * @param {String} dishId
 * @Return {Object}
 */

const getDishFromDatabase = async (connection, dishId) => {
    try {
        console.log('GEt dish fucntion: ' + dishId);
        const dishQuery = await connection.query(
            'SELECT * FROM dishes WHERE dishId=?',
            [dishId],
        );
        const historyQuery = await connection.query(
            'SELECT date FROM history WHERE dishId=? ORDER BY date',
            [dishId],
        );

        let history = [];
        for (let i = 0; i < historyQuery.length; i++) {
            history[i] = historyQuery[i].date;
        }
        dish = dishQuery[0];
        if (historyQuery) {
            dish.history = history;
            dish.lastMade = history[0];
        }

        if (dish.steps) dish.steps = JSON.parse(dish.steps);
        if (dish.ingredients) dish.ingredients = JSON.parse(dish.ingredients);
        if (dish.ingredientsInSteps)
            dish.ingredientsInSteps = JSON.parse(dish.ingredientsInSteps);

        return dish;
    } catch (error) {
        console.log('error from get dish function');
        console.log(error);
        return Error({statusCode: 422, msg: error.message});
    }
};

/**
 * Add a new dish to the database
 * @param {String} userId
 * @param {String} dishId
 * @param {Object} newDish
 * @Return {Object}
 */

const addDish = async (connection, googleId, name, category) => {
    try {
        // Get the id associated with the googleId
        const userQuery = await connection.query(
            'SELECT id FROM users WHERE googleId=?',
            [googleId],
        );
        const userId = userQuery[0].id;
        const sql =
            'INSERT INTO dishes (userId, name, category) VALUES (?, ?, ?)';
        const response = await connection.query(sql, [userId, name, category]);
        console.log('print response');
        return response.insertId;
    } catch (error) {
        console.log(error);
        throw Error({statusCode: 422, msg: error.message});
    }
};

/**
 * Delete a dish from the database
 * @param {String} userId
 * @param {String} dishId
 * @Return {Object}
 */

const deleteDishFromDatabase = async (userId, dishId) => {
    try {
        let updates = {};
        updates['/dishes/' + userId + '/' + dishId] = null;
        return await firebase.database.update(updates);
    } catch (error) {
        throw Error({statusCode: 422, msg: error.message});
    }
};

module.exports = {
    checkIfDishExists,
    getNewDishKey,
    saveDish,
    getAllDishesOfUser,
    getDishFromDatabase,
    addDish,
    deleteDishFromDatabase,
};
