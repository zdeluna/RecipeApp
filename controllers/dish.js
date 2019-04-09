const dishModel = require('../models/dish.js');

function createNewUser(userId, email) {
    var updates = {};
    updates['/users/' + userId] = {email: email};

    return database.update(updates);
}

function getRecipeStepsAndIngredientsFromWebPage(url, complete) {
    var json = [];
    var stepsArray = [];
    var ingredientsArray = [];

    request(url, function(error, response, html) {
        if (error) return complete(error, err);
        var $ = cheerio.load(html);

        getStepsFromWebPage($, steps => {
            stepsArray = steps;
            getIngredientsFromWebPage($, ingredients => {
                ingredientsArray = ingredients;
                complete(false, stepsArray, ingredientsArray);
            });
        });
    });
}

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
function getStepsFromWebPage($, complete) {
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
            console.log(listItem.length);

            var stepDescription = $(this).text();

            console.log('**Step: ' + stepDescription);
            var step = {id: stepsArray.length, value: stepDescription};
            stepsArray.push(step);
        });

    complete(stepsArray);
}

/* This function will parse a website and return the recipe ingredients in an array */
function getIngredientsFromWebPage($, complete) {
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

    complete(ingredientsArray);
}

exports.createDish = async (req, res) => {
    try {
        const userId = req.params.userId;
        const dishName = req.body.name;
        const category = req.body.category;

        console.log('before getdish key');
        const dishId = dishModel.getNewDishKey();
        console.log('dishId: ' + dishId);

        let newDish = {
            uid: userId,
            name: dishName,
            category: category,
            history: [],
        };

        let responseObject = {id: dishId};

        console.log('create dish: ' + dishId);
        const dish = await dishModel.addDish(userId, dishId, newDish);

        res.location(
            'http://localhost:5000/api/users/' + userId + '/dish/' + dishId,
        );
        res.status(201).send(responseObject);
    } catch (error) {
        console.log('error2');
    }
};

exports.updateDish = async (req, res) => {
    const updatedDishFields = req.body;
    const userId = req.params.userId;
    const dishId = req.params.dishId;

    // If the user is updating the url, then the steps and ingredients will be changed
    if (updatedDishFields.url) {
        getRecipeStepsAndIngredientsFromWebPage(updatedDishFields.url, function(
            err,
            stepsArray,
            ingredientsArray,
        ) {
            if (!err) {
                updatedDishFields.steps = stepsArray;
                updatedDishFields.ingredients = ingredientsArray;

                dishModel
                    .saveDish(userId, dishId, updatedDishFields)
                    .then(response => {
                        res.status(200).send('OK');
                    });
            }
        });
    } else {
        try {
            await dishModel.saveDish(userId, dishId, updatedDishFields);
            res.status(200).send('OK');
        } catch (error) {
            console.log('error');
        }
    }
};

exports.getDishesOfUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const dishes = await dishModel.getAllDishesOfUser(userId);
        res.status(200).json(dishes);
    } catch (error) {
        console.log('error');
    }
};

exports.getDish = async (req, res) => {
    const userId = req.params.userId;
    const dishId = req.params.dishId;

    try {
        const dish = await dishModel.getDishFromDB(userId, dishId);
        res.status(200).json(dish);
    } catch (error) {
        console.log('error');
    }
};
