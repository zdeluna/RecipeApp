import gql from 'graphql-tag';

export const UPDATE_DISH = gql`
    mutation updateDish(
        $userId: String!
        $dishId: String!
        $url: String
        $steps: [StepInput]
        $ingredients: [IngredientInput]
        $history: [String]
    ) {
        updateDish(
            userId: $userId
            dishId: $dishId
            url: $url
            steps: $steps
            ingredients: $ingredients
            history: $history
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
            }
        }
    }
`;
