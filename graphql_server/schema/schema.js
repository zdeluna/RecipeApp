const {gql} = require('apollo-server');

const typeDefs = gql`
    type AddDishResponse {
        success: Boolean!
        message: String
        dishId: String
    }

    type UpdateDishResponse {
        success: Boolean!
        message: String
    }

    type Step {
        id: Int
        value: String
    }

    type Ingredient {
        id: Int
        value: String
    }

    input StepInput {
        id: Int
        value: String
    }

    input IngredientInput {
        id: Int
        value: String
    }

    type Dish {
        id: ID
        name: String
        cookingTime: String
        category: String
        userId: String
        steps: [Step]
        ingredients: [Ingredient]
        url: String
    }

    type User {
        id: ID!
        email: String
        dishes: [Dish]
    }

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
        updateDish(
            userId: String!
            dishId: String!
            name: String
            cookingTime: String
            category: String
            userId: String
            steps: [StepInput]
            ingredients: [IngredientInput]
            url: String
        ): UpdateDishResponse
    }
`;

module.exports = typeDefs;
