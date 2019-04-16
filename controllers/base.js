/**
 * Send an error response using the status code and message of error object
 * @param {Model} model
 * @param {Object} errror
 */

exports.sendErrorResponse = (res, error) => {
    res.status(error.statusCode).json({errors: {msg: error.msg}});
};

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
