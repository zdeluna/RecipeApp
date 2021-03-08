import gql from "graphql-tag";

export const UPDATE_DISH = gql`
    mutation updateDish(
        $id: ID!
        $url: String
        $steps: [String]
        $ingredients: [String]
        $history: [String]
        $cookingTime: String
        $notes: String
        $lastMade: String
        $name: String
        $category: String
    ) {
        updateDish(
            id: $id
            url: $url
            steps: $steps
            ingredients: $ingredients
            history: $history
            cookingTime: $cookingTime
            notes: $notes
            lastMade: $lastMade
            name: $name
            category: $category
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
                category
            }
        }
    }
`;

export const UPDATE_PARTIAL_DISH = gql`
    mutation updatePartialDish(
        $id: ID!
        $url: String
        $steps: [String]
        $ingredients: [String]
        $history: [String]
        $cookingTime: String
        $notes: String
        $lastMade: String
        $name: String
        $category: String
    ) {
        updatePartialDish(
            id: $id
            url: $url
            steps: $steps
            ingredients: $ingredients
            history: $history
            cookingTime: $cookingTime
            notes: $notes
            lastMade: $lastMade
            name: $name
            category: $category
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
                category
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
