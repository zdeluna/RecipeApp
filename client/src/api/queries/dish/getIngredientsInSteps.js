import gql from "graphql-tag";

export const GET_INGREDIENTS_IN_STEPS = gql`
    query ingredientsInSteps($steps: [String], $ingredients: [String]) {
        ingredientsInSteps(steps: $steps, ingredients: $ingredients) {
            step
            ingredients
        }
    }
`;
