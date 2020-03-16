'use strict';
const {sendErrorResponse} = require('./base.js');
const userModel = require('../models/user.js');
const {getConnection} = require('../dbconfig.js');

const createUser = async (req, res) => {
    try {
        const pool = await req.app.get('pool');
        const email = req.body.email;
        const googleId = req.body.googleId;
        const user = await userModel.createUser(pool, googleId, email);
        res.status(200).json('OK');
    } catch (error) {
        return Error({statusCode: 422, msg: error.message});
    }
};

module.exports = {createUser};
