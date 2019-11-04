const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const startMongo = require('./config/mongo');
const app = express();

const cors = require('cors');
app.use(cors());

startMongo();

app.use(
    '/graphql',
    graphqlHTTP({
        schema,
        graphiql: true,
    }),
);

app.listen(4000, () => {
    console.log('Now listening for requests on port 4000');
});
