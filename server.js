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

const cheerio = require('cheerio');

app.use('/api/', dish);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
    //test();
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

app.delete('/api/users/:userId/dish/:dishId', (req, res) => {
    const userId = req.params.userId;
    const dishId = req.params.dishId;
    console.log('SERVER: delete dish');
    deleteDish(userId, dishId).then(() => {
        res.status(204).end();
    });
});

app.post('/api/users', (req, res) => {
    const email = req.body.email;
    const userId = req.body.uid;
    console.log('in server: ' + email + userId);
    createNewUser(userId, email).then(res.status(200).send('OK'));
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

function deleteDish(userId, dishId) {
    return database.child('/dishes/' + userId).once('value', snapshot => {
        const updates = {};
        snapshot.forEach(child => {
            if (child.key == dishId) {
                updates['/dishes/' + userId + '/' + child.key] = null;
                return database.update(updates);
            }
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

function createNewUser(userId, email) {
    var updates = {};
    updates['/users/' + userId] = {email: email};

    return database.update(updates);
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
