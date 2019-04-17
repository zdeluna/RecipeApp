const firebase = require('../models/firebase.js');

/**
 * Create a new user in the database using the userId and email
 * @param {String} userId
 * @param {String} email
 */

exports.createNewUser = async (userId, email) => {
    var updates = {};
    updates['/users/' + userId] = {email: email};

    return firebase.database.update(updates);
};

/**
 * Check to see if the user Id exists in the database
 * @param {String} userId
 */

exports.checkIfUserExists = async userId => {
    return new Promise(async (resolve, reject) => {
        const snapshot = await firebase.database.child('/users/').once('value');
        if (snapshot.hasChild(userId)) return resolve();
        else
            return reject({
                statusCode: 404,
                msg: 'USER_DOES_NOT_EXIST',
            });
    });
};
