const firebase = require('../models/firebase.js');
const pool = require('../models/sql/database.js');
const {getConnection} = require('../dbconfig.js');

/**
 * Create a new user in the database using the userId and email
 * @param {String} userId
 * @param {String} email
 */

const createUser = async (pool, googleId, email) => {
    try {
        const connection = await getConnection(pool);

        const sql = 'INSERT INTO users (googleId, email) VALUES (?, ?)';
        await connection.query(sql, [googleId, email]);
    } catch (error) {
        console.log(error);
    }
};

const checkIfUserExists = async (pool, googleId) => {
    return new Promise(async (resolve, reject) => {
        const connection = await getConnection(pool);

        const userQuery = await connection.query(
            'SELECT * FROM users WHERE googleId=?',
            [googleId],
        );

        if (userQuery.length) return resolve();
        else
            return reject({
                statusCode: 404,
                msg: 'USER_DOES_NOT_EXIST',
            });
    });
};

module.exports = {createUser, checkIfUserExists};
