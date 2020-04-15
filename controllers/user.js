"use strict";
const { sendErrorResponse } = require("./base.js");
const userModel = require("../models/user.js");
const firebase = require("firebase-admin");

const createUser = async (req, res) => {
    try {
        console.log("create user");
        const pool = await req.app.get("pool");
        const email = req.body.email;
        const password = req.body.password;
        console.log(email);
        const user = await firebase
            .auth()
            .createUser({ email: email, password: password });

        let token = await firebase.auth().createCustomToken(user.uid);
        console.log(token);
        await userModel.createUser(pool, user.uid, email);

        res.status(200).json({ token: token });
    } catch (error) {
        console.log(error);
        return Error({ statusCode: 422, msg: error.message });
    }
};

module.exports = { createUser };
