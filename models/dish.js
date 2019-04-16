const firebase = require('../models/firebase.js');

/* This function returns a new key that can be used to create a new dish */
exports.getNewDishKey = () => {
    return database.child('dishes').push().key;
};

exports.saveDish = async (userId, dishId, updatedDishFields) => {
    return firebase.database
        .child('/dishes/' + userId + '/' + dishId)
        .update(updatedDishFields);
};

exports.getAllDishesOfUser = async userId => {
    try {
        console.log(userId);
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

exports.getDishFromDatabase = async (userId, dishId) => {
    return firebase.database
        .child('/dishes/' + userId + '/' + dishId)
        .once('value')
        .then(function(snapshot) {
            return snapshot.val();
        });
};

exports.addDish = async (userId, dishId, newDish) => {
    let updates = {};
    updates['/dishes/' + userId + '/' + dishId] = newDish;

    return await firebase.database.update(updates);
};

exports.deleteDishFromDatabase = async (userId, dishId) => {
    console.log('DELETE: ' + userId + ' ' + dishId);
    let updates = {};
    updates['/dishes/' + userId + '/' + dishId] = null;
    return await firebase.database.update(updates);
};
