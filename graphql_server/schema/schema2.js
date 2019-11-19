const {gql} = require('apollo-server');

const typeDefs = gql`
    type Query {
        dish(userID: String!, dishID: String!): Dish
        dishes(userID: String!): [Dish]
    }

    type Dish {
        id: ID
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
