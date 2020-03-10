import gql from 'graphql-tag';

export const UPDATE_DISH = gql`
    mutation updateDish(
        $userId: String!
        $dishId: String!
        $url: String
        $steps: [StepInput]
        $ingredients: [IngredientInput]
        $history: [String]
        $cookingTime: String
        $notes: String
    ) {
        updateDish(
            userId: $userId
            dishId: $dishId
            url: $url
            steps: $steps
            ingredients: $ingredients
            history: $history
            cookingTime: $cookingTime
            notes: $notes
        ) {
            success
            message
            dish {
                __typename
                id
                name
                url
                ingredients {
                    value
                }
                steps {
                    value
                }
                history
                cookingTime
                notes
                ingredientsInSteps {
                    step
                    ingredients {
                        value
                    }
                }
            }
        }
    }
`;

export const UPDATE_DISH_HISTORY = gql`
    mutation updateDish(
        $userId: String!
        $dishId: String!
        $history: [String]
    ) {
        updateDish(userId: $userId, dishId: $dishId, history: $history) {
            success
            message
        }
    }
`;
