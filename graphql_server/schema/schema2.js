const {gql} = require('apollo-server');

const typeDefs = gql`
    type Query {
        dish(id: ID!): Dish
        dishes: [Dish]
    }

    type Dish {
        id: ID!
        name: String
        cookingTime: String
        category: String
    }

    type User {
        id: ID!
        email: String
        dishes: [Dish]
    }
`;

module.exports = typeDefs;
