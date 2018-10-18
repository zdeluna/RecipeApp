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

app.post('/api/dish/:id/recipe/steps', (req, res) => {
    saveSteps(req.body.userID, req.params.id, req.body.steps);
});

/* This route stores a url in the database and generates the steps from the url then saves again to the database*/
app.post('/api/dish/:id/recipe/url', (req, res) => {
    // Parse the steps from the url
    const url = req.body.url;
    getRecipeStepsAndIngredientsFromWebPage(url, function(err, stepsArray) {
        if (!err) {
            saveSteps(req.body.userID, req.params.id, stepsArray).then(() => {
                saveUrl(req.body.userID, req.params.id, req.body.url).then(() =>
                    res.status(200).send('OK'),
                );
            });
        }
    });
});

/* This route gets */
app.get('/api/dish/:id/recipe', (req, res) => {
    console.log('in get route');
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

function saveUrl(userId, dishId, url) {
    return database
        .child('/dishes/' + userId + '/' + dishId)
        .update({url: url});
}

function getRecipeStepsAndIngredientsFromWebPage(url, complete) {
    var json = [];
    var stepsArray = [];

    request(url, function(error, response, html) {
        if (error) return complete(error, err);
        var $ = cheerio.load(html);

        $('.recipe-procedure-text').filter(function() {
            var stepNumber = 1;

            var data = $(this);
            var stepDescription = data.children().text();

            var step = {id: stepsArray.length, value: stepDescription};

            stepsArray.push(step);
        });

        complete(false, stepsArray);
    });
}
