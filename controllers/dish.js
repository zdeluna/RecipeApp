const dishModel = require('../models/dish.js');
const request = require('request');
const cheerio = require('cheerio');
const {sendErrorResponse} = require('./base.js');

function createNewUser(userId, email) {
    var updates = {};
    updates['/users/' + userId] = {email: email};

    return database.update(updates);
}

const getRecipeStepsAndIngredientsFromWebPage = async url => {
    return new Promise(function(resolve, reject) {
        var json = [];
        let dishInfo = {};
        dishInfo.steps = [];
        dishInfo.ingredients = [];

        request(url, async function(error, response, html) {
            if (error) reject(error);
            var $ = cheerio.load(html);

            dishInfo.steps = await getStepsFromWebPage($);
            dishInfo.ingredients = await getIngredientsFromWebPage($);
            resolve(dishInfo);
        });
    });
};

function checkForStepsHeading(text) {
    var acceptableStepsHeading = [
        'instructions',
        'Instructions',
        'Directions',
        'directions',
    ];

    if (acceptableStepsHeading.indexOf(text) > -1) return true;
    else return false;
}

function checkForIngredientsHeading(text) {
    var acceptableIngredientsHeading = ['ingredients', 'Ingredients'];

    if (acceptableIngredientsHeading.indexOf(text) > -1) return true;
    else return false;
}

/* This function will parse a website and return the recipe steps in an array */
const getStepsFromWebPage = async $ => {
    return new Promise(function(resolve, reject) {
        var stepsArray = [];

        // Find the heading that contains instruction
        var directionsHTML = $('h1, h2, h3')
            .filter(function() {
                return checkForStepsHeading(
                    $(this)
                        .text()
                        .trim(),
                );
            })
            .parent() // Get the parent element
            .find('ul, ol') // Traverse from the parent element and search of an ordered or unordered list
            .children('li') // Find the children of the list
            // Iterate through each child element and store the text of the element and add it to the array
            .each(function(index, element) {
                // In each list item, search the instructions text.
                var listItem = $(this)
                    .text()
                    .trim();
                // Traverse starting at each list item and search for text

                var stepDescription = $(this).text();

                var step = {id: stepsArray.length, value: stepDescription};
                stepsArray.push(step);
            });

        resolve(stepsArray);
    });
};

/* This function will parse a website and return the recipe ingredients in an array */
const getIngredientsFromWebPage = async $ => {
    return new Promise(function(resolve, reject) {
        var ingredientsArray = [];

        var ingredientsHTML = $('h1, h2, h3')
            .filter(function() {
                return checkForIngredientsHeading(
                    $(this)
                        .text()
                        .trim(),
                );
            })
            .parent() // Get the parent element
            .find('ul, ol') // Traverse from the parent element and search of an ordered or unordered list
            .children() // Find the children of the list
            // Iterate through each child element and store the text of the element and add it to the array
            .each(function(index, element) {
                var ingredientDescription = $(this)
                    .text()
                    .trim();
                var ingredient = {
                    id: ingredientsArray.length,
                    value: ingredientDescription,
                };
                ingredientsArray.push(ingredient);
            });

        resolve(ingredientsArray);
    });
};

exports.createDish = async (req, res) => {
    try {
        const userId = req.params.userId;
        const dishName = req.body.name;
        const category = req.body.category;

        const dishId = dishModel.getNewDishKey();

        let newDish = {
            uid: userId,
            name: dishName,
            category: category,
            history: [],
        };

        let responseObject = {id: dishId};

        const dish = await dishModel.addDish(userId, dishId, newDish);

        res.location(
            'http://localhost:5000/api/users/' + userId + '/dish/' + dishId,
        );
        res.status(201).send(responseObject);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

exports.updateDish = async (req, res) => {
    const updatedDishFields = req.body;
    const userId = req.params.userId;
    const dishId = req.params.dishId;
    let dishInfo = {};

    // If the user is updating the url, then the steps and ingredients will be changed
    try {
        if (updatedDishFields.url) {
            dishInfo = await getRecipeStepsAndIngredientsFromWebPage(
                updatedDishFields.url,
            );

            updatedDishFields.steps = dishInfo.steps;
            updatedDishFields.ingredients = dishInfo.ingredients;

            await dishModel.saveDish(userId, dishId, updatedDishFields);
            res.status(200).send('OK');
        } else {
            await dishModel.saveDish(userId, dishId, updatedDishFields);
            res.status(200).send('OK');
        }
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

exports.getDishesOfUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const dishes = await dishModel.getAllDishesOfUser(userId);
        res.status(200).json(dishes);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

exports.getDish = async (req, res) => {
    try {
        const userId = req.params.userId;
        const dishId = req.params.dishId;
        const dish = await dishModel.getDishFromDatabase(userId, dishId);

        res.status(200).json(dish);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

exports.deleteDish = async (req, res) => {
    try {
        const userId = req.params.userId;
        const dishId = req.params.dishId;
        await dishModel.deleteDishFromDatabase(userId, dishId);
        res.status(204).end();
    } catch (error) {
        sendErrorResposne(res, error);
    }
};
