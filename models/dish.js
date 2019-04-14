var admin = require('firebase-admin');

var serviceAccount = require('../recipeapp-4bd8d-firebase-adminsdk-2x3ae-4b33c2148d.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://recipeapp-4bd8d.firebaseio.com',
});

var database = admin.database().ref('/');

/* This function returns a new key that can be used to create a new dish */
exports.getNewDishKey = () => {
    return database.child('dishes').push().key;
};

exports.saveDish = async (userId, dishId, updatedDishFields) => {
    return database
        .child('/dishes/' + userId + '/' + dishId)
        .update(updatedDishFields);
};

exports.getAllDishesOfUser = async userId => {
    return database
        .child('/dishes/' + userId)
        .once('value')
        .then(function(snapshot) {
            return snapshot.val();
        });
};

exports.getDishFromDatabase = async (userId, dishId) => {
    return database
        .child('/dishes/' + userId + '/' + dishId)
        .once('value')
        .then(function(snapshot) {
            return snapshot.val();
        });
};

exports.addDish = async (userId, dishId, newDish) => {
    let updates = {};
    updates['/dishes/' + userId + '/' + dishId] = newDish;

    return await database.update(updates);
};

exports.deleteDishFromDatabase = async (userId, dishId) => {
    console.log('DELETE: ' + userId + ' ' + dishId);
    let updates = {};
    updates['/dishes/' + userId + '/' + dishId] = null;
    return await database.update(updates);
};
