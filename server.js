const express = require('express');

const app = express();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

var admin = require('firebase-admin');

var serviceAccount = require('./recipeapp-4bd8d-firebase-adminsdk-2x3ae-e33243e2f1.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://recipeapp-4bd8d.firebaseio.com',
});

var database = admin.database().ref('/');

app.post('/api/dish/:id/recipe', (req, res) => {
    database
        .child('/dishes/' + req.body.userID + '/' + req.params.id)
        .update({url: req.body.url});
});

app.listen(port, () => console.log(`Listening on port ${port}`));
