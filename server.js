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
    database
        .child('/dishes/' + req.body.userID + '/' + req.params.id)
        .update({steps: req.body.steps});
});

app.post('/api/dish/:id/recipe/url', (req, res) => {
    const url = req.body.url;
    database
        .child('/dishes/' + req.body.userID + '/' + req.params.id)
        .update({url: url});

    // Parse the steps from the url
    getRecipeStepsFromWebPage(url, function(err, stepsArray) {
        if (!err) {
        }
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    //var stepsArray = [];
});

function getRecipeStepsFromWebPage(url, complete) {
    console.log('in function');

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
