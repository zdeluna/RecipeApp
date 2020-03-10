const firebase = require('../models/firebase.js');
const userModel = require('../models/user.js');
const {getConnection} = require('../dbconfig.js');
/**
 * Check to see if the dish Id exists in the database
 * @param {Pool} pool
 * @param {String} dishId
 */

const checkIfDishExists = async (pool, dishId) => {
    const connection = await getConnection(pool);

    return new Promise(async (resolve, reject) => {
        const dishQuery = await connection.query(
            'SELECT * FROM dishes WHERE dishId=?',
            [dishId],
        );
        connection.release();

        if (dishQuery.length) return resolve();
        else
            return reject({
                statusCode: 404,
                msg: 'DISH_DOES_NOT_EXIST',
            });
    });
};

/**
 * Saves a user's dish to the database using the updated dish fields
 * @param {Pool} pool
 * @param {String} dishId
 * @param {Object} updatedDishFields
 * @Return {String}
 */

const saveDish = async (pool, dishId, updatedDishFields) => {
    try {
        // Get the dish object then assign new properties based on properties in updatedDishFields
        const dish = await getDishFromDatabase(pool, dishId);
        for (let key in updatedDishFields) {
            dish[key] = updatedDishFields[key];
        }

        const connection = await getConnection(pool);

        const sql =
            'UPDATE dishes SET category=?, cookingTime=?, ingredients=?, ingredientsInSteps=?, lastMade=?, name=?, notes=?, steps=?, url=? WHERE dishId=?';
        await connection.query(sql, [
            dish.category,
            dish.cookingTime,
            JSON.stringify(dish.ingredients),
            JSON.stringify(dish.ingredientsInSteps, [
                'step',
                'ingredients',
                'id',
                'value',
            ]),
            dish.lastMade,
            dish.name,
            dish.notes,
            JSON.stringify(dish.steps),
            dish.url,
            dishId,
        ]);
        connection.release();
    } catch (error) {
        console.log(error);
        connection.release();
        throw Error({statusCode: 422, msg: error.message});
    }
};

/**
 * Retrieves all of a user's dishes
 * @param {Pool} pool
 * @param {String} googleId
 * @Return {Object}
 */

const getAllDishesOfUser = async (pool, googleId) => {
    try {
        const connection = await getConnection(pool);
        const userQuery = await connection.query(
            'SELECT id FROM users WHERE googleId=?',
            [googleId],
        );
        const userId = userQuery[0].id;
        const sql = 'SELECT * FROM dishes WHERE userId=?';
        const dishes = await connection.query(sql, [userId]);

        connection.release();

        // Convert the JSON from the database to Javascript Objects
        for (let i = 0; i < dishes.length; i++) {
            if (dishes[i].steps) dishes[i].steps = JSON.parse(dishes[i].steps);
            if (dishes[i].ingredients)
                dishes[i].ingredients = JSON.parse(dishes[i].ingredients);
            if (dishes[i].ingredientsInSteps)
                dishes[i].ingredientsInSteps = JSON.parse(
                    dishes[i].ingredientsInSteps,
                );
        }

        return dishes;
    } catch (error) {
        connection.release();

        throw Error({statusCode: 422, msg: error.message});
    }
};

/**
 * Retrieves a specific dish for a user
 * @param {String} pool
 * @param {String} dishId
 * @Return {Object}
 */

const getDishFromDatabase = async (pool, dishId) => {
    try {
        const connection = await getConnection(pool);

        const dishQuery = await connection.query(
            'SELECT * FROM dishes WHERE dishId=?',
            [dishId],
        );
        const historyQuery = await connection.query(
            'SELECT date FROM history WHERE dishId=? ORDER BY date',
            [dishId],
        );
        connection.release();

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
        console.log(error);
        connection.release();

        return Error({statusCode: 422, msg: error.message});
    }
};

/**
 * Add a new dish to the database
 * @param {Pool} pool
 * @param {String} googleId
 * @param {String} name
 * @param {String} category
 * @Return {Object}
 */

const addDish = async (pool, googleId, name, category) => {
    try {
        const connection = await getConnection(pool);
        // Get the id associated with the googleId
        const userQuery = await connection.query(
            'SELECT id FROM users WHERE googleId=?',
            [googleId],
        );
        console.log('NAME: ' + name);
        const userId = userQuery[0].id;
        const sql =
            'INSERT INTO dishes (userId, name, category) VALUES (?, ?, ?)';
        await connection.query(sql, [userId, name, category]);
        let dishId = (await connection.query('SELECT LAST_INSERT_ID()'))[0][
            'LAST_INSERT_ID()'
        ];

        connection.release();
        return dishId;
    } catch (error) {
        console.log('ERROR');
        console.log(error);
        connection.release();

        throw Error({statusCode: 422, msg: error.message});
    }
};

/**
 * Delete a dish from the database
 * @param {Pool} pool
 * @param {String} dishId
 * @Return {Object}
 */

const deleteDishFromDatabase = async (pool, dishId) => {
    try {
        const connection = await getConnection(pool);

        const deleteQuery = await connection.query(
            'DELETE FROM dishes WHERE dishId=?',
            [dishId],
        );
        connection.release();
    } catch (error) {
        connection.release();

        throw Error({statusCode: 422, msg: error.message});
    }
};

module.exports = {
    checkIfDishExists,
    saveDish,
    getAllDishesOfUser,
    getDishFromDatabase,
    addDish,
    deleteDishFromDatabase,
};
