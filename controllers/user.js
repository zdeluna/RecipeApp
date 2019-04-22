const userModel = require('../models/user.js');
const {sendErrorResponse} = require('./base.js');

exports.createUser = async (req, res) => {
    try {
        console.log('SERVER: Call create user function');
        const email = req.body.email;
        const userId = req.body.uid;
        const user = await userModel.createNewUser(userId, email);
        res.status(200).json('OK');
    } catch (error) {
        console.log('error');
    }
};
