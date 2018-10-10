const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.post('/api/recipe/', (req, res) => {
    //res.send({express: 'Hello From Express'});
    console.log('Server received url: ' + req.body);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
