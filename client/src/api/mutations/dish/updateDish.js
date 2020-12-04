import gql from "graphql-tag";

export const UPDATE_DISH = gql`
    mutation updateDish(
        $dishId: String!
        $url: String
        $steps: [String]
        $ingredients: [String]
        $history: [String]
        $cookingTime: String
        $notes: String
        $lastMade: String
    ) {
        updateDish(
            dishId: $dishId
            url: $url
            steps: $steps
            ingredients: $ingredients
            history: $history
            cookingTime: $cookingTime
            notes: $notes
            lastMade: $lastMade
        ) {
            success
            message
            dish {
                __typename
                id
                name
                url
                ingredients
                steps
                history
                cookingTime
                notes
                lastMade
            }
        }
    }
`;

export const UPDATE_DISH_HISTORY = gql`
    mutation updateDish($dishId: String!, $history: [String]) {
        updateDish(dishId: $dishId, history: $history) {
            success
            message
        }
    }
`;
