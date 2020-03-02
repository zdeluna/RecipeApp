const firebase = require('../models/firebase.js');
const pool = require('../models/sql/database.js');
const {getConnection} = require('../dbconfig.js');

/**
 *  Create a new user in the database using the userId and email
 *  @param {Pool} pool
 *  @param {String} googleId
 *  @param {String} email
 */

const createUser = async (pool, googleId, email) => {
    try {
        const connection = await getConnection(pool);

        const sql = 'INSERT INTO users (googleId, email) VALUES (?, ?)';
        await connection.query(sql, [googleId, email]);
        connection.release();
    } catch (error) {
        console.log(error);
    }
};

/**
 *  Check if a user exits in the database by searching for the googleId in users *  table
 *  @param {Pool} pool
 *  @param {String} googleId
 */

const checkIfUserExists = async (pool, googleId) => {
    return new Promise(async (resolve, reject) => {
        const connection = await getConnection(pool);

        const userQuery = await connection.query(
            'SELECT * FROM users WHERE googleId=?',
            [googleId],
        );
        connection.release();
        if (userQuery.length) return resolve();
        else
            return reject({
                statusCode: 404,
                msg: 'USER_DOES_NOT_EXIST',
            });
    });
};

module.exports = {createUser, checkIfUserExists};
