/**
 * Send an error response using the status code and message of error object
 * @param {Model} model
 * @param {Object} errror
 */

exports.sendErrorResponse = (res, error) => {
    res.status(error.statusCode).json({errors: {msg: error.msg}});
};
