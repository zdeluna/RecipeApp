const dishModel = require('../models/dish.js');
const userModel = require('../models/user.js');
const request = require('request');
const cheerio = require('cheerio');
const {sendErrorResponse} = require('./base.js');
const {
    getStepsFromWebPage,
    getIngredientsFromWebPage,
} = require('../utils/parseRecipe/parseRecipe.js');

/**
 * Make a http request to the url and store the steps and ingredients in an object
 * @param {String} url
 * @param {Promise}
 */

const getRecipeStepsAndIngredientsFromWebPage = async url => {
    return new Promise(async (resolve, reject) => {
        let json = [];
        let dishInfo = {};
        dishInfo.steps = [];
        dishInfo.ingredients = [];
        request(url, async function(error, response, html) {
            try {
                if (error) reject(error);
                let $ = cheerio.load(html);
                dishInfo.steps = await getStepsFromWebPage($);
                dishInfo.ingredients = await getIngredientsFromWebPage($);

                /* Copy ingredients array so that we can send it as a parameter when
				 *  determine which ingredients are in each step in the function getIngredientsInSteps*/
                let ingredients = dishInfo.ingredients.map(a =>
                    Object.assign({}, a),
                );

                dishInfo.ingredientsInSteps = await getIngredientsInSteps(
                    dishInfo.steps,
                    ingredients,
                );
                console.log('IN SERVER: ' + dishInfo.ingredientsInSteps);
                return resolve(dishInfo);
            } catch (error) {
                return reject(error);
            }
        });
    });
};

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
    let filteredIngredientsArray = [];
    for (let i = 0; i < ingredientsArray.length; i++) {
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

/*
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

    for (let stepNumber = 0; stepNumber < steps.length; stepNumber++) {
        let ingredientsStepObject = {};
        ingredientsStepObject.step = stepNumber;

        let ingredientsInEachStep = [];
        let stepDescription = steps[stepNumber].value.toLowerCase();

        for (
            let ingredientNumber = 0;
            ingredientNumber < filteredIngredients.length;
            ingredientNumber++
        ) {
            let ingredientDescription =
                filteredIngredients[ingredientNumber].value;

            if (stepHasIngredient(stepDescription, ingredientDescription)) {
                ingredientsInEachStep.push(ingredients[ingredientNumber]);
            }
        }
        ingredientsStepObject.ingredients = ingredientsInEachStep;
        ingredientsInStepsArray.push(ingredientsStepObject);
    }

    return ingredientsInStepsArray;
};

exports.createDish = async (req, res) => {
    try {
        const pool = await req.app.get('pool');

        const userId = req.params.userId;
        await userModel.checkIfUserExists(pool, userId);

        const dishName = req.body.name;
        const category = req.body.category;

        const dishId = await dishModel.addDish(
            pool,
            userId,
            dishName,
            category,
        );

        let responseObject = {id: dishId};

        let dishUrl =
            req.protocol +
            '://' +
            req.get('host') +
            '/api/users/' +
            userId +
            '/dish/' +
            dishId;
        res.location(dishUrl);
        res.status(201).send(responseObject);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

exports.updateDish = async (req, res) => {
    const pool = await req.app.get('pool');

    const updatedDishFields = req.body;
    const userId = req.params.userId;
    //await userModel.checkIfUserExists(userId);

    const dishId = req.params.dishId;
    let dishInfo = {};

    // If the user is updating the url, then the steps and ingredients will be changed
    try {
        if (updatedDishFields.url) {
            console.log('A');

            dishInfo = await getRecipeStepsAndIngredientsFromWebPage(
                updatedDishFields.url,
            );

            updatedDishFields.steps = dishInfo.steps;
            updatedDishFields.ingredients = dishInfo.ingredients;
            updatedDishFields.ingredientsInSteps = dishInfo.ingredientsInSteps;
            console.log('B');
            await dishModel.saveDish(pool, dishId, updatedDishFields);
            console.log('C');

            const dish = await dishModel.getDishFromDatabase(pool, dishId);

            res.status(200).send(dish);
        } else {
            if (updatedDishFields.history)
                updatedDishFields.lastMade = updatedDishFields.history[0];

            await dishModel.saveDish(pool, dishId, updatedDishFields);
            const dish = await dishModel.getDishFromDatabase(pool, dishId);
            res.status(200).send(dish);
        }
    } catch (error) {
        console.log('SEND ERROR RESPONSE: ' + error.msg);
        sendErrorResponse(res, error);
    }
};

exports.getDishesOfUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const pool = await req.app.get('pool');
        //await userModel.checkIfUserExists(pool, userId);
        console.log('call');
        const dishes = await dishModel.getAllDishesOfUser(pool, userId);
        res.status(200).json(dishes);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

exports.getDish = async (req, res) => {
    try {
        const pool = await req.app.get('pool');

        const userId = req.params.userId;
        await userModel.checkIfUserExists(pool, userId);

        const dishId = req.params.dishId;
        const dish = await dishModel.getDishFromDatabase(pool, dishId);

        res.status(200).json(dish);
    } catch (error) {
        sendErrorResponse(res, error);
    }
};

exports.deleteDish = async (req, res) => {
    try {
        const pool = await req.app.get('pool');

        const userId = req.params.userId;
        await userModel.checkIfUserExists(pool, userId);

        const dishId = req.params.dishId;
        await dishModel.checkIfDishExists(pool, dishId);

        await dishModel.deleteDishFromDatabase(pool, dishId);
        res.status(204).end();
    } catch (error) {
        sendErrorResponse(res, error);
    }
};
