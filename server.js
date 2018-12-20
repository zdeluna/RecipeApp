const express = require('express');
var request = require('request');
var cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.enable('trust proxy');
app.use(cors());

var admin = require('firebase-admin');

var serviceAccount = require('./recipeapp-4bd8d-firebase-adminsdk-2x3ae-e33243e2f1.json');
const cheerio = require('cheerio');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://recipeapp-4bd8d.firebaseio.com',
});

var database = admin.database().ref('/');

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    var stepsArray = [];
    var ingredientsArray = [];

    var pageUrl = 'https://www.daringgourmet.com/paella-valenciana/';

    var pageUrl =
        'https://www.seriouseats.com/recipes/2014/02/shellfish-paella-paella-de-marisco-from-spain.html';

    getRecipeStepsAndIngredientsFromWebPage(pageUrl, function(
        err,
        stepsArray,
        ingredientsArray,
    ) {
        console.log('Steps Array: ' + stepsArray);
    });
});

app.options('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Methods',
        'GET, PUT, POST, DELETE, OPTIONS',
    );
    res.header(
        'Acess-Control-Allow-Headers',
        'Content-Type, Authorization, Content-Length, X-Requested-With',
    );
    res.send(200);
});

/* Route to create a new dish */
app.post('/api/users/:userId/dish/', (req, res) => {
    const userId = req.params.userId;
    const name = req.body.name;
    const category = req.body.category;

    const key = getNewDishKey();

    var responseObject = {id: key};

    createNewDish(userId, name, category, key).then(data => {
        console.log('data: ' + data);
        res.location(
            'http://localhost:5000/api/users/' + userId + '/dish/' + key,
        );
        res.status(201).send(JSON.stringify(responseObject));
    });
});

/* Route to add new steps to a dish*/
app.post('/api/users/:userId/dish/:dishId/steps', (req, res) => {
    const steps = req.body.items;
    const userId = req.params.userId;
    const dishId = req.params.dishId;

    saveSteps(userId, dishId, steps).then(res.status(200).send('OK'));
});

app.post('/api/users/:userId/dish/:dishId/history', (req, res) => {
    const history = req.body.history;
    const userId = req.params.userId;
    const dishId = req.params.dishId;

    saveHistory(userId, dishId, history).then(res.status(200).send('OK'));
});

/* Route to add ingredients to a dish*/
app.post('/api/users/:userId/dish/:dishId/ingredients', (req, res) => {
    const ingredients = req.body.items;
    const userId = req.params.userId;
    const dishId = req.params.dishId;

    saveIngredients(userId, dishId, ingredients).then(
        res.status(200).send('OK'),
    );
});

/* Route to add ingredients to a dish*/
app.post('/api/users/:userId/dish/:dishId/notes', (req, res) => {
    const notes = req.body.notes;
    const userId = req.params.userId;
    const dishId = req.params.dishId;
    console.log('Add notes ' + userId + ' ' + dishId + ' ' + notes);
    saveNotes(userId, dishId, notes).then(res.status(200).send('OK'));
});

/* This route stores a url in the database and generates the steps from the url then saves again to the database*/
app.post('/api/users/:userId/dish/:dishId/recipe/url', (req, res) => {
    // Parse the steps from the url
    const url = req.body.url;
    const userId = req.params.userId;
    const dishId = req.params.dishId;

    getRecipeStepsAndIngredientsFromWebPage(url, function(
        err,
        stepsArray,
        ingredientsArray,
    ) {
        if (!err) {
            saveSteps(userId, dishId, stepsArray).then(() => {
                saveUrl(userId, dishId, url).then(() => {
                    saveIngredients(userId, dishId, ingredientsArray).then(
                        () => {
                            res.status(200).send('OK');
                        },
                    );
                });
            });
        }
    });
});

/* Route to update dish*/
app.put('/api/users/:userId/dish/:dishId', (req, res) => {
    const updatedDishFields = req.body;
    const userId = req.params.userId;
    const dishId = req.params.dishId;
    console.log('SERVER: ' + updatedDishFields + ' ' + userId + ' ' + dishId);

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

                saveDish(userId, dishId, updatedDishFields).then(response => {
                    res.status(200).send('OK');
                });
            }
        });
    } else {
        saveDish(userId, dishId, updatedDishFields).then(response => {
            res.status(200).send('OK');
        });
    }
});

/* Route to update ingredients to a dish*/
app.put('/api/users/:userId/dish/:dishId/ingredients', (req, res) => {
    const ingredients = req.body.items;
    const userId = req.params.userId;
    const dishId = req.params.dishId;
    saveIngredients(userId, dishId, ingredients).then(response => {
        res.status(303).send('OK');
    });
});

/* Route to update steps to a dish*/
app.put('/api/users/:userId/dish/:dishId/steps', (req, res) => {
    const steps = req.body.items;
    const userId = req.params.userId;
    const dishId = req.params.dishId;
    saveSteps(userId, dishId, steps).then(response => {
        res.status(303).send('OK');
    });
});

/* Route to update steps to a dish*/
app.put('/api/users/:userId/dish/:dishId/history', (req, res) => {
    const history = req.body.history;
    const userId = req.params.userId;
    const dishId = req.params.dishId;
    saveHistory(userId, dishId, history).then(response => {
        res.status(303).send('OK');
    });
});

/* Route to update steps to a dish*/
app.put('/api/users/:userId/dish/:dishId/notes', (req, res) => {
    const notes = req.body.notes;
    const userId = req.params.userId;
    const dishId = req.params.dishId;
    saveNotes(userId, dishId, notes).then(response => {
        res.status(303).send('OK');
    });
});

/* This route will get all the dishes of a user */
app.get('/api/users/:userId', (req, res) => {
    const userId = req.params.userId;
    getAllDishesOfUser(userId).then(dishes => {
        res.status(200).json(dishes);
    });
});

/* This route gets dish information using the dish id */
app.get('/api/users/:userId/dish/:dishId', (req, res) => {
    var userId = req.params.userId;
    var dishId = req.params.dishId;

    getDishFromDatabase(userId, dishId, dish => {
        res.status(200).json(dish);
    });
});

/* This route gets dish ingredients using the dish id */
app.get('/api/users/:userId/dish/:dishId/ingredients', (req, res) => {
    var userId = req.params.userId;
    var dishId = req.params.dishId;

    getDishFromDatabase(userId, dishId, dish => {
        res.status(200).json(dish.ingredients);
    });
});

/* This route gets dish steps using the dish id */
app.get('/api/users/:userId/dish/:dishId/steps', (req, res) => {
    var userId = req.params.userId;
    var dishId = req.params.dishId;

    getDishFromDatabase(userId, dishId, dish => {
        res.status(200).json(dish.steps);
    });
});

/* This route gets dish's history using the dish id */
app.get('/api/users/:userId/dish/:dishId/history', (req, res) => {
    var userId = req.params.userId;
    var dishId = req.params.dishId;
    getDishFromDatabase(userId, dishId, dish => {
        if (!dish.history) res.status(404);
        else res.status(200).json(dish.history);
    });
});

/* This route gets dish's history using the dish id */
app.get('/api/users/:userId/dish/:dishId/notes', (req, res) => {
    var userId = req.params.userId;
    var dishId = req.params.dishId;
    console.log('get notes');
    getDishFromDatabase(userId, dishId, dish => {
        if (!dish.notes) res.status(404);
        else res.status(200).json(dish.notes);
    });
});

function saveDish(userId, dishId, updatedDishFields) {
    return database
        .child('/dishes/' + userId + '/' + dishId)
        .update(updatedDishFields);
}

function saveSteps(userId, dishId, steps) {
    return database
        .child('/dishes/' + userId + '/' + dishId)
        .update({steps: steps});
}

function saveIngredients(userId, dishId, ingredients) {
    return database
        .child('/dishes/' + userId + '/' + dishId)
        .update({ingredients: ingredients});
}

function saveUrl(userId, dishId, url) {
    return database
        .child('/dishes/' + userId + '/' + dishId)
        .update({url: url});
}

function saveHistory(userId, dishId, history) {
    return database
        .child('/dishes/' + userId + '/' + dishId)
        .update({history: history});
}

function saveNotes(userId, dishId, notes) {
    console.log('SERVER: ' + dishId + ' ' + userId + ' ' + notes);
    return database
        .child('/dishes/' + userId + '/' + dishId)
        .update({notes: notes});
}

function getDishFromDatabase(userId, dishId, complete) {
    return database
        .child('/dishes/' + userId + '/' + dishId)
        .once('value', function(snapshot) {
            complete(snapshot.val());
        });
}

function getAllDishesOfUser(userId) {
    return database
        .child('/dishes/' + userId)
        .once('value', function(snapshot) {
            return snapshot.val();
        });
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

function getStepsFromWebPage($, complete) {
    var stepsArray = [];

    var directionsHTML = $('h1, h2, h3')
        .filter(function() {
            return (
                $(this)
                    .text()
                    .trim() ===
                ('Instructions' ||
                    'instructions' ||
                    'directions' ||
                    'Directions')
            );
        })
        .next()
        .children('ul')
        .children()
        .each(function(index, element) {
            var stepDescription = $(this).text();
            console.log('**STEP**: ' + stepDescription);
            var step = {id: stepsArray.length, value: stepDescription};
            stepsArray.push(step);
        });

    complete(stepsArray);
}

function getIngredientsFromWebPage($, complete) {
    var ingredientsArray = [];

    var ingredientsHTML = $('h1, h2, h3')
        .filter(function() {
            return (
                $(this)
                    .text()
                    .trim() === 'Ingredients'
            );
        })
        .find('ul')
        .children()
        .each(function(index, element) {
            var ingredientDescription = $(this).text();
            console.log('**Ingredient**: ' + ingredientDescription);
            var ingredient = {
                id: ingredientsArray.length,
                value: ingredientDescription,
            };
            ingredientsArray.push(ingredient);
        });

    complete(ingredientsArray);
}

/* This function will create a new dish and return an id of the dish entry in the database */
function createNewDish(userId, dishName, category, dishKey) {
    var newDish = {
        uid: userId,
        name: dishName,
        category: category,
        history: [],
    };

    var newDishKey = database.child('dishes').push().key;

    var updates = {};
    updates['/dishes/' + userId + '/' + dishKey] = newDish;

    return database.update(updates);
}

/* This function returns a new key that can be used to create a new dish */
function getNewDishKey() {
    return database.child('dishes').push().key;
}
