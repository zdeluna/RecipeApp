const {gql} = require('apollo-server');

const typeDefs = gql`
    type Query {
        dish(userId: String!, dishId: String!): Dish
        dishes(userId: String!): [Dish]
    }

    type Mutation {
        addDish(
            userId: String!
            name: String!
            category: String!
        ): AddDishResponse!
    }

    type AddDishResponse {
        success: Boolean!
        message: String
        dishId: String
    }

    type Dish {
        id: ID
        name: String
        cookingTime: String
        category: String
        userId: String
    }

    type User {
        id: ID!
        email: String
        dishes: [Dish]
    }
`;

module.exports = typeDefs;
