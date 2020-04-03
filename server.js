"use strict";
const express = require("express");
var request = require("request");
var cors = require("cors");
var mysql = require("./dbconfig.js");

const firebase = require("firebase-admin");
const restApp = express();
const REST_PORT = process.env.PORT || 5000;
const bodyParser = require("body-parser");

restApp.use(bodyParser.json());
restApp.enable("trust proxy");
restApp.use(cors());

const app = firebase.initializeApp({
    apiKey: process.env.FIREBASE_KEY,
    authDomain: process.env.FIREBASE_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_SENDER_ID
});

let pool = mysql.createPool();

restApp.set("pool", pool);

const dish = require("./routes/dish");
const user = require("./routes/user");

restApp.use("/api/users", user);
restApp.use("/api/", dish);

restApp.listen(REST_PORT, () => {
    console.log(`Listening on port ${REST_PORT}`);
});

restApp.options("/*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, PUT, POST, DELETE, OPTIONS"
    );
    res.header(
        "Acess-Control-Allow-Headers",
        "Content-Type, Authorization, Content-Length, X-Requested-With"
    );
    res.send(200);
});
