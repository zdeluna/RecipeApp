const firebase = require("firebase-admin");
const { sendErrorResponse } = require("../controllers/base.js");

/*
 * Determine if the user has included a valid signed JWT in the request
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} next - next middleware function
 * @Return {Promise} 
 */

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization.replace("Bearer ", "");
    firebase
        .auth()
        .verifyIdToken(token)
        .then(function(decodedToken) {
            req.googleId = decodedToken.uid;
            next();
        })
        .catch(function(error) {
            sendErrorResponse(res, {
                statusCode: 401,
                msg: "CANNOT_AUTHENTICATE_USER"
            });
        });
};
/*
 * Check and see if the userId of the dish matches the user id of the token
 * @param {String} dish_userId - user id from the dish
 * @param {String{ userId - user id from the token
 * @Return {Promise} 
 */

const checkIfAuthorized = (dish_userId, userId) => {
    return new Promise((resolve, reject) => {
        if (dish_userId !== userId)
            return reject({
                statusCode: 403,
                msg: "NOT_AUTHORIZED"
            });
        resolve();
    });
};

module.exports = { authenticateUser, checkIfAuthorized };
