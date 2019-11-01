// Consulted https://github.com/davellanedam/node-express-mongodb-jwt-rest-api-skeleton/blob/master/config/mongo.js
require('dotenv').config();

const mongoose = require('mongoose');
const DB_URI = process.env.MONGO_ATLAS_URI;
module.exports = () => {
    const connectToDatabase = () => {
        mongoose.connect(
            DB_URI,
            {useNewUrlParser: true},
            error => {
                if (error) console.log('Error connecting to database');
                console.log('Connected to Server');
            },
        );
    };

    connectToDatabase();
    mongoose.connection.on('disconnected', connectToDatabase);
};
