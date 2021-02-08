//const {gql} = require('apollo-server');
const { gql } = require("apollo-server-cloud-functions");

const typeDefs = gql`
    type AddDishResponse {
        success: Boolean!
        message: String
        id: ID
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
        id: ID
    }

    type UpdateUserResponse {
        success: Boolean!
        message: String
        user: User
    }

    type LoginUserResponse {
        token: String!
        id: ID!
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
        steps: [String]
        ingredients: [String]
        url: String
        history: [String]
        cookingTime: String
        notes: String
        ingredientsInSteps: [IngredientsInStep]
        lastMade: String
    }

    type User {
        id: ID
        userName: String
        categories: [Category]
    }

    type Category {
        id: ID
        userID: ID
        name: String
        order: Int
    }

    input CategoryInput {
        id: ID
        userID: ID
        name: String
        order: Int
    }

    type Query {
        dish(id: ID!): Dish
        dishes: [Dish]
        user(id: ID!): User
    }

    type Token {
        token: String!
    }

    type Mutation {
        addDish(name: String!, category: String!): AddDishResponse!
        updateDish(
            id: ID!
            name: String
            category: String
            userId: String
            steps: [String]
            ingredients: [String]
            url: String
            history: [String]
            cookingTime: String
            notes: String
            lastMade: String
        ): UpdateDishResponse
        addDishUrl(id: ID!, url: String): UpdateDishResponse
        deleteDish(id: ID!): DeleteDishResponse
        addUser(username: String!, password: String!): CreateUserResponse
        updateUser(id: ID!, categories: [CategoryInput]): UpdateUserResponse
        signInUser(username: String!, password: String!): LoginUserResponse
    }
`;

module.exports = typeDefs;
