const userModel = require('../models/user.js');
const {sendErrorResponse} = require('./base.js');

exports.createUser = async (req, res) => {
    try {
        const email = req.body.email;
        const userId = req.body.uid;
        const user = await userModel.createUser(email, userId);
        res.status(201).json('OK');
    } catch (error) {
        console.log('error');
    }
};
