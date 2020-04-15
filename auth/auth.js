const firebase = require("firebase-admin");
const { sendErrorResponse } = require("../controllers/base.js");
const jwt = require("jsonwebtoken");
const NodeRSA = require("node-rsa");
const serviceAccount = require("../recipeapp-4bd8d-firebase-adminsdk-o5fx6-6479659220.json");

/* Use a public key algorithm RSA */
const publicKey = new NodeRSA()
    .importKey(serviceAccount.private_key, "pkcs8-private-pem")
    .exportKey("pkcs8-public-pem");

/*
 * Determine if the user has included a valid signed JWT in the request. Firebase auth uses RS256 algorithm to sign the jwt token. 
 * Firebases uses a public/private key pair, where the private key is in the firebase credientials file and the public key is a metadata URL.
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} next - next middleware function
 * @Return {Promise} 
 */

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization.replace("Bearer ", "");

    /* Returns the decoded payload if the signature is valid using the PEM encoded public key */
    jwt.verify(token, publicKey, { algorithms: ["RS256"] }, (err, decoded) => {
        if (err) {
            sendErrorResponse(res, {
                statusCode: 401,
                msg: "CANNOT_AUTHENTICATE_USER"
            });
        } else {
            req.googleId = decoded.uid;
            next();
        }
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
