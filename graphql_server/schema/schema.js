const {gql} = require('apollo-server');

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
        category: String
        userId: String
        steps: [Step]
        ingredients: [Ingredient]
        url: String
        history: [String]
        cookingTime: String
        notes: String
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
            category: String
            userId: String
            steps: [StepInput]
            ingredients: [IngredientInput]
            url: String
            history: [String]
            cookingTime: String
            notes: String
        ): UpdateDishResponse
        deleteDish(userId: String!, dishId: String!): DeleteDishResponse
    }
`;

module.exports = typeDefs;
