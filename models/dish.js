const firebase = require('../models/firebase.js');
const userModel = require('../models/user.js');
const dishSQL = require('../models/sql/dishes.js');
/**
 * Check to see if the dish Id exists in the database
 * @param {String} dishId
 */

exports.checkIfDishExists = async (userId, dishId) => {
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

exports.getNewDishKey = () => {
    return firebase.database.child('dishes').push().key;
};

/**
 * Saves a user's dish to the database using the updated dish fields
 * @param {String} userId
 * @param {String} dishId
 * @param {Object} updatedDishFields
 * @Return {String}
 */

exports.saveDish = async (userId, dishId, updatedDishFields) => {
    try {
        return firebase.database
            .child('/dishes/' + userId + '/' + dishId)
            .update(updatedDishFields);
    } catch (error) {
        throw Error({statusCode: 422, msg: error.message});
    }
};

/**
 * Retrieves all of a user's dishes
 * @param {String} userId
 * @Return {Object}
 */

exports.getAllDishesOfUser = async userId => {
    try {
        return firebase.database
            .child('/dishes/' + userId)
            .once('value')
            .then(function(snapshot) {
                return snapshot.val();
            });
    } catch (error) {
        throw Error({statusCode: 422, msg: error.message});
    }
};

/**
 * Retrieves a specific dish for a user
 * @param {String} userId
 * @param {String} dishId
 * @Return {Object}
 */

exports.getDishFromDatabase = async (userId, dishId) => {
    try {
        return firebase.database
            .child('/dishes/' + userId + '/' + dishId)
            .once('value')
            .then(function(snapshot) {
                return snapshot.val();
            });
    } catch (error) {
        throw Error({statusCode: 422, msg: error.message});
    }
};

/**
 * Add a new dish to the database
 * @param {String} userId
 * @param {String} dishId
 * @param {Object} newDish
 * @Return {Object}
 */

exports.addDish = async (userId, dishId, newDish) => {
    try {
        let updates = {};
        updates['/dishes/' + userId + '/' + dishId] = newDish;

        return await firebase.database.update(updates);
    } catch (error) {
        throw Error({statusCode: 422, msg: error.message});
    }
};

/**
 * Delete a dish from the database
 * @param {String} userId
 * @param {String} dishId
 * @Return {Object}
 */

exports.deleteDishFromDatabase = async (userId, dishId) => {
    try {
        let updates = {};
        updates['/dishes/' + userId + '/' + dishId] = null;
        return await firebase.database.update(updates);
    } catch (error) {
        throw Error({statusCode: 422, msg: error.message});
    }
};
