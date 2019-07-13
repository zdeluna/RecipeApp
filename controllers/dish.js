const dishModel = require('../models/dish.js');
const userModel = require('../models/user.js');
const request = require('request');
const cheerio = require('cheerio');
const {sendErrorResponse} = require('./base.js');

/**
 * Make a http request to the url and store the steps and ingredients in an object
 * @param {String} url
 * @param {Promise}
 */

const getRecipeStepsAndIngredientsFromWebPage = async url => {
    return new Promise(async (resolve, reject) => {
        var json = [];
        let dishInfo = {};
        dishInfo.steps = [];
        dishInfo.ingredients = [];
        try {
            request(url, async function(error, response, html) {
                try {
                    if (error) reject(error);
                    var $ = cheerio.load(html);
                    dishInfo.steps = await getStepsFromWebPage($);
                    dishInfo.ingredients = await getIngredientsFromWebPage($);

                    // Copy ingredients array
                    var ingredients = dishInfo.ingredients.map(a =>
                        Object.assign({}, a),
                    );

                    dishInfo.ingredientsInSteps = await getIngredientsInSteps(
                        dishInfo.steps,
                        ingredients,
                    );
                    resolve(dishInfo);
                } catch (error) {
                    return reject(error);
                }
            });
        } catch (error) {
            console.log('reject at other function');

            reject(error);
        }
    });
};

/**
 * Check to see if the passed in text is a possible heading for steps
 * @param {String} text
 * @Return {boolean}
 */

function checkForStepsHeading(text) {
    // Remove semicolon
    text = text.replace(/:/gi, '');
    var acceptableStepsHeading = ['instructions', 'directions', 'preparation'];

    if (acceptableStepsHeading.indexOf(text) > -1) {
        return true;
    } else {
        return false;
    }
}

/**
 * Check to see if the passed in text is a possible heading for ingredients
 * @param {String} text
 * @Return {boolean}
 */

function checkForIngredientsHeading(text) {
    // Remove semicolon
    text = text.replace(/:/gi, '');

    var acceptableIngredientsHeading = ['ingredients', 'ingredients:'];

    if (acceptableIngredientsHeading.indexOf(text) > -1) {
        return true;
    } else return false;
}

/**
 * Return True if ingredient is found in step, otherwise return False
 * @param {String} step
 * @param {String} ingredient
 * @Return {Boolean}
 */

function stepHasIngredient(step, ingredient) {
    let ingredientBrokenIntoWordsArray = ingredient.split(' ');

    for (var i = 0; i < ingredientBrokenIntoWordsArray.length; i++) {
        ingredientWord = ingredientBrokenIntoWordsArray[i];

        /* Ignore all strings of length 1 */
        if (ingredientWord.length == 1) continue;
        if (step.includes(ingredientWord)) {
            return true;
        }
    }

    return false;
}

/**
 * Store an array of the filtered ingredients
 * * @param {Array} ingredients array
 * @Return {Array}filtered ingredients array
 */

function filterAllIngredients(ingredientsArray) {
    filteredIngredientsArray = [];
    for (var i = 0; i < ingredientsArray.length; i++) {
        let ingredientObject = ingredientsArray[i];
        ingredientObject.value = filterIngredient(ingredientObject.value);
        filteredIngredientsArray.push(ingredientObject);
    }
    return filteredIngredientsArray;
}

/**
 * Filter through ingredient string and remove words not used when searching through recipe steps in order to pair
 * ingredients with steps
 * @param {String} ingredient
 * @Return {String} filtered ingredient
 */

function filterIngredient(ingredient) {
    // Remove the quantity measurement from ingredient
    ingredient = ingredient.replace(
        /cup|tablespoon|teaspoon|gram|pounds| g | c | ml | oz |ounce|ml/gi,
        '',
    );

    // Remove the numbers from ingredient
    ingredient = ingredient.replace(/[0-9]/g, '');

    // Remove '() and / 'from ingredient
    ingredient = ingredient
        .replace(/"/g, '')
        .replace(/'/g, '')
        .replace(/\(|\)/g, '')
        .replace(/\//g, '');

    // Remove some common words
    ingredient = ingredient.replace(/\band\b/gi, '');
    ingredient = ingredient.replace(/\bor\b/gi, '');
    ingredient = ingredient.replace(/\bfor\b/gi, '');
    ingredient = ingredient.replace(/\bthe\b/gi, '');

    // Remove all text after a comma
    ingredient = ingredient.replace(/\,.*/, '');

    // Remove all text after a semicolon
    ingredient = ingredient.replace(/\;.*/, '');

    // Replace all double spaces with single spaces
    ingredient = ingredient.replace(/  /g, ' ');

    // Change all letters to lowercase
    ingredient = ingredient.toLowerCase();

    // Remove the white space before and after the word
    ingredient = ingredient.trim();

    return ingredient;
}

/**
 * Iterate through steps and determine which ingredient is used in each step
 * @param {Array} steps - Steps of dish
 * @param {Array} ingredients - Ingredients of dish
 * @Return {Promise}
 */

const getIngredientsInSteps = async (steps, ingredients) => {
    let ingredientsInStepsArray = [];
    /* We are going to copy ingredients array so that when we insert info the dishInfo field we will use the 
	 * the orignal array instead of the one that is filtered */
    ingredientsCopy = ingredients.map(a => Object.assign({}, a));

    let filteredIngredients = filterAllIngredients(ingredientsCopy);

    for (var stepNumber = 0; stepNumber < steps.length; stepNumber++) {
        let ingredientsInEachStep = [];
        let stepDescription = steps[stepNumber].value.toLowerCase();

        for (
            var ingredientNumber = 0;
            ingredientNumber < filteredIngredients.length;
            ingredientNumber++
        ) {
            let ingredientDescription =
                filteredIngredients[ingredientNumber].value;

            if (stepHasIngredient(stepDescription, ingredientDescription)) {
                ingredientsInEachStep.push(ingredients[ingredientNumber]);
            }
        }
        ingredientsInStepsArray.push(ingredientsInEachStep);
    }

    return ingredientsInStepsArray;
};

const findHeading = async ($, heading) => {
    return new Promise(async (resolve, reject) => {
        var html = $('h1, h2, h3, h4, h5').filter(function() {
            if (heading == 'ingredients') {
                return checkForIngredientsHeading(
                    $(this)
                        .text()
                        .trim()
                        .toLowerCase(),
                );
            } else {
                return checkForStepsHeading(
                    $(this)
                        .text()
                        .trim()
                        .toLowerCase(),
                );
            }
        });

        if (html == '') {
            console.log('REJECT HEADING NOT FOUND');
            reject();
        }

        return html;
    });
};

/**
 * Parse through a web page and store the steps of the recipe
 * @param {String} $ - Represents the html contents of a page
 * @Return {Promise}
 */

const getStepsFromWebPage = async $ => {
    return new Promise(async (resolve, reject) => {
        try {
            var stepsArray = [];

            // Find the heading that contains instruction
            var stepsHTML = await findHeading($, 'steps');

            stepsHTML
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
        } catch (error) {
            reject({
                statusCode: 404,
                msg: 'CANNOT_RETRIEVE_STEPS',
            });
        }
    });
};

/**
 * Search through DOM for an unordered or orderlist list but investigating current node and traversing up the DOM tree if not found
 * @Return {Promise}
 */

const findList = async $ => {
    return new Promise(async (resolve, reject) => {
        let ingredients = '';
        var searchHTML = $.parent();

        let ingredientsHTML = searchHTML.find('ul, ol');
        while (ingredientsHTML == '') {
            searchHTML = searchHTML.parent();
            ingredientsHTML = searchHTML.find('ul, ol');
            //console.log('NEW: ' + searchHTML);

            /* If we make it to the top level without finding it, send back a reject */
            if (searchHTML.initialize) {
                console.log('OUT OF LOOP');

                reject();
            }
        }
        console.log('OUT OF LOOP');
        resolve(ingredientsHTML);
    });
};

/**
 * Parse through a web page and store the ingredients of the recipe
 * @param {String} $ - Represents the html contents of a page
 * @Return {Promise}
 */

const getIngredientsFromWebPage = async $ => {
    return new Promise(async (resolve, reject) => {
        try {
            var ingredientsArray = [];

            var headingHTML = await findHeading($, 'ingredients');
            ingredientsHTML = await findList(headingHTML);

            ingredientsHTML
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
                    console.log(
                        '********ADDED INGREDIENT: ' + ingredient.value,
                    );
                });
            resolve(ingredientsArray);
        } catch (error) {
            reject({
                statusCode: 404,
                msg: 'CANNOT_RETRIEVE_INGREDIENTS',
            });
        }
    });
};

exports.createDish = async (req, res) => {
    try {
        const userId = req.params.userId;
        await userModel.checkIfUserExists(userId);

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
    await userModel.checkIfUserExists(userId);

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
            updatedDishFields.ingredientsInSteps = dishInfo.ingredientsInSteps;

            await dishModel.saveDish(userId, dishId, updatedDishFields);
            res.status(200).send('OK');
        } else {
            await dishModel.saveDish(userId, dishId, updatedDishFields);
            res.status(200).send('OK');
        }
    } catch (error) {
        console.log('SEND ERROR RESPONSE: ' + error.msg);
        sendErrorResponse(res, error);
    }
};

exports.getDishesOfUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        await userModel.checkIfUserExists(userId);
        const dishes = await dishModel.getAllDishesOfUser(userId);
        res.status(200).json(dishes);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

exports.getDish = async (req, res) => {
    try {
        const userId = req.params.userId;
        await userModel.checkIfUserExists(userId);

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
        await userModel.checkIfUserExists(userId);

        const dishId = req.params.dishId;
        await dishModel.checkIfDishExists(userId, dishId);

        await dishModel.deleteDishFromDatabase(userId, dishId);
        res.status(204).end();
    } catch (error) {
        sendErrorResponse(res, error);
    }
};
