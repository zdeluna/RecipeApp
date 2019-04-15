const express = require('express');
var request = require('request');
var cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.enable('trust proxy');
app.use(cors());

const dish = require('./routes/dish');
const user = require('./routes/user');

const cheerio = require('cheerio');

app.use('/api/users', user);
app.use('/api/', dish);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
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

function test() {
    var stepsArray = [];
    var ingredientsArray = [];

    var pageUrl1 = 'https://www.daringgourmet.com/paella-valenciana/';

    var pageUrl2 =
        'https://www.seriouseats.com/recipes/2013/06/grilled-skirt-steak-fajitas-food-lab-recipe.html';
    getRecipeStepsAndIngredientsFromWebPage(pageUrl1, function(
        err,
        stepsArray,
        ingredientsArray,
    ) {
        console.log('Call function');
    });
    getRecipeStepsAndIngredientsFromWebPage(pageUrl2, function(
        err,
        stepsArray,
        ingredientsArray,
    ) {
        console.log('Call function 2');
    });
}
