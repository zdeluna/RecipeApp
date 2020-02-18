const mysql = require('mysql');
const database = require('./database.js');

const DISHES = 'Dishes';

exports.getAllDishes = () => {
    return new Promise(async (resolve, reject) => {
        const dishes = database.query('SELECT * FROM dishes');
        console.log(dishes);
    });
};
