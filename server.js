const express = require('express');
var request = require('request');

const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

var admin = require('firebase-admin');

var serviceAccount = require('./recipeapp-4bd8d-firebase-adminsdk-2x3ae-e33243e2f1.json');
const cheerio = require('cheerio');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://recipeapp-4bd8d.firebaseio.com',
});

var database = admin.database().ref('/');

app.post('/api/users/:userId/dish/:dishId/recipe/steps', (req, res) => {
    const steps = req.body.steps;
    const userId = req.params.userId;
    const dishId = req.params.dishId;

    saveSteps(userId, dishId, steps).then(res.status(200).send('OK'));
});

app.post('/api/users/:userId/dish/:dishId/recipe/ingredients', (req, res) => {
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

/* This route gets */
app.get('/api/users/:userId/dish/:dishId', (req, res) => {
    var userId = req.params.userId;
    var dishId = req.params.dishId;

    getDishFromDatabase(userId, dishId, data => {
        console.log('got info from db' + data);
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    //var stepsArray = [];
});

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

function getDishFromDatabase(userId, dishId, complete) {
    return database
        .child('/dishes/' + userId + '/' + dishId)
        .on('value', function(snapshot) {
            console.log(snapshot.val());
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
        $('.recipe-ingredients > ul').filter(function() {
            var data = $(this);
            var ingredientDescription = data.children().text();

            var ingredient = {
                id: ingredientsArray.length,
                value: ingredientDescription,
            };

            ingredientsArray.push(ingredient);
        });

        complete(false, stepsArray, ingredientsArray);
    });
}
