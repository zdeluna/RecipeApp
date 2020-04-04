const firebase = require("firebase-admin");
const { sendErrorResponse } = require("../controllers/base.js");

/*
 * Iterate through steps and determine which ingredient is used in each step
 * @param {String} token - Signed JWT token from client
 * @Return {Promise} 
 */

const authenticateUser = (req, res, next) => {
    try {
        const token = req.headers.authorization.replace("Bearer ", "");
        firebase
            .auth()
            .verifyIdToken(token)
            .then(function(decodedToken) {
                req.googleId = decodedToken.uid;
                next();
            });
    } catch (error) {
        console.log(error);
        sendErrorResponse(res, {
            statusCode: 401,
            msg: "CANNOT_AUTHENTICATE_USER"
        });
    }
};

module.exports = { authenticateUser };
