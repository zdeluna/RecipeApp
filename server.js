const express = require('express');
var request = require('request');

const app = express();
const port = process.env.PORT || 8111;
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

app.post('/api/dish/:id/recipe', (req, res) => {
    database
        .child('/dishes/' + req.body.userID + '/' + req.params.id)
        .update({url: req.body.url});
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    var stepsArray = [];
    getRecipeStepsFromWebPage(stepsArray);
});

function getRecipeStepsFromWebPage(stepsArray) {
    console.log('in function');

    var json = [];

    const url =
        'https://www.seriouseats.com/recipes/2013/06/grilled-skirt-steak-fajitas-food-lab-recipe.html';

    request(url, function(error, response, html, stepsArray) {
        if (error) return;
        var $ = cheerio.load(html);

        $('.recipe-procedure-text').filter(function(stepsArray) {
            var stepNumber = 1;

            var data = $(this);
            var stepDescription = data.children().text();

            var step = {id: 0, value: stepDescription};
            stepsArray.push(step);
        });
    });
    console.log('out of request');
    console.log(stepsArray);
}
