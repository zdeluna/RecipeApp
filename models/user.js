const firebase = require('../models/firebase.js');

exports.createNewUser = async (userId, email) => {
    var updates = {};
    updates['/users/' + userId] = {email: email};

    return database.update(updates);
};

/**
 * Check to see if the user Id exists in the database
 * @param {String} userId
 */

exports.checkIfUserExists = async userId => {
    return new Promise((resolve, reject) => {
        const users = database
            .child('/users/')
            .once('value')
            .then(function(snapshot) {
                return snapshot.val();
            });
        if (users.hasChild(userId)) return resolve();
        else return reject({statusCode: 404, msg: 'USER_DOES_NOT_EXIST'});
    });
};
