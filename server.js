const express = require('express');
var request = require('request');
var cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

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
    //var stepsArray = [];
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
    const steps = req.body.steps;
    const userId = req.params.userId;
    const dishId = req.params.dishId;

    console.log('SERVER: save steps');
    saveSteps(userId, dishId, steps).then(res.status(200).send('OK'));
});

/* Route to add ingredients to a dish*/
app.post('/api/users/:userId/dish/:dishId/ingredients', (req, res) => {
    const ingredients = req.body.ingredients;
    const userId = req.params.userId;
    const dishId = req.params.dishId;

    saveIngredients(userId, dishId, ingredients).then(
        res.status(200).send('OK'),
    );
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

/* Route to update ingredients to a dish*/
app.put('/api/users/:userId/dish/:dishId/ingredients', (req, res) => {
    const ingredients = req.body.ingredients;
    const userId = req.params.userId;
    const dishId = req.params.dishId;
    console.log('in put: User id: ' + userId);
    console.log('in put: Dish id: ' + dishId);
    console.log('in put: Ingredients: ' + ingredients);
    saveIngredients(userId, dishId, ingredients).then(response => {
        console.log(response);
        res.status(303).send('OK');
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

/* This route gets dish information using the dish id */
app.get('/api/users/:userId/dish/:dishId/ingredients', (req, res) => {
    var userId = req.params.userId;
    var dishId = req.params.dishId;

    getDishFromDatabase(userId, dishId, dish => {
        res.status(200).json(dish.ingredients);
    });
});

function saveSteps(userId, dishId, steps) {
    return database
        .child('/dishes/' + userId + '/' + dishId)
        .update({steps: steps});
}

function saveIngredients(userId, dishId, ingredients) {
    console.log(ingredients);
    return database
        .child('/dishes/' + userId + '/' + dishId)
        .update({ingredients: ingredients});
}

function saveUrl(userId, dishId, url) {
    return database
        .child('/dishes/' + userId + '/' + dishId)
        .update({url: url});
}

function getDishFromDatabase(userId, dishId, complete) {
    return database
        .child('/dishes/' + userId + '/' + dishId)
        .once('value', function(snapshot) {
            complete(snapshot.val());
        });
}

function getRecipeStepsAndIngredientsFromWebPage(url, complete) {
    var json = [];
    var stepsArray = [];
    var ingredientsArray = [];

    request(url, function(error, response, html) {
        if (error) return complete(error, err);
        var $ = cheerio.load(html);

        /* Get the recipes steps */
        $('.recipe-procedure-text').filter(function() {
            var data = $(this);
            var stepDescription = data.children().text();

            var step = {id: stepsArray.length, value: stepDescription};

            stepsArray.push(step);
        });

        /* Get the ingredients */
        $('.ingredient').filter(function() {
            var data = $(this);
            var ingredientDescription = data.text();

            var ingredient = {
                id: ingredientsArray.length,
                value: ingredientDescription,
            };

            ingredientsArray.push(ingredient);
        });

        complete(false, stepsArray, ingredientsArray);
    });
}

/* This function will create a new dish and return an id of the dish entry in the database */
function createNewDish(userId, dishName, category, dishKey) {
    var newDish = {
        uid: userId,
        name: dishName,
        category: category,
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
