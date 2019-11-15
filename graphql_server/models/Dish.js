const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dishSchema = new Schema({
    name: String,
    cookingTime: String,
    uid: String,
    category: String,
    steps: [{id: String, value: String}],
});

module.exports = mongoose.model('Dish', dishSchema);
