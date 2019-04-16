var admin = require('firebase-admin');

var serviceAccount = require('../recipeapp-4bd8d-firebase-adminsdk-2x3ae-4b33c2148d.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://recipeapp-4bd8d.firebaseio.com',
});

module.exports.database = admin.database().ref('/');
