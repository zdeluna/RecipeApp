//const {gql} = require('apollo-server');
const { gql } = require("apollo-server-cloud-functions");

const typeDefs = gql`
    type AddDishResponse {
        success: Boolean!
        message: String
        dishId: String
    }

    type DeleteDishResponse {
        success: Boolean!
        message: String
    }

    type UpdateDishResponse {
        success: Boolean!
        message: String
        dish: Dish
    }

    type CreateUserResponse {
        success: Boolean!
        message: String
        token: String
    }

    type Step {
        id: Int
        value: String
    }

    type Ingredient {
        id: Int
        value: String
    }

    type IngredientsInStep {
        step: Int
        ingredients: [Ingredient]
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
        category: String
        userId: String
        steps: [Step]
        ingredients: [Ingredient]
        url: String
        history: [String]
        cookingTime: String
        notes: String
        ingredientsInSteps: [IngredientsInStep]
        lastMade: String
    }

    type User {
        googleId: String
        email: String
    }

    type Query {
        dish(dishId: String!): Dish
        dishes: [Dish]
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
            category: String
            userId: String
            steps: [StepInput]
            ingredients: [IngredientInput]
            url: String
            history: [String]
            cookingTime: String
            notes: String
            lastMade: String
        ): UpdateDishResponse
        deleteDish(userId: String!, dishId: String!): DeleteDishResponse
        addUser(googleId: String!, email: String!): CreateUserResponse
    }
`;

module.exports = typeDefs;
