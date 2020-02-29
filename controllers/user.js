const {sendErrorResponse} = require('./base.js');
const userModel = require('../models/user.js');
const {getConnection} = require('../dbconfig.js');

createUser = async (req, res) => {
    try {
        const pool = await req.app.get('pool');
        const connection = await getConnection(pool);
        const email = req.body.email;
        const userId = req.body.uid;
        const user = await userModel.createUser(connection, userId, email);
        res.status(200).json('OK');
    } catch (error) {
        console.log('error' + error);
    }
};

module.exports = {createUser};
