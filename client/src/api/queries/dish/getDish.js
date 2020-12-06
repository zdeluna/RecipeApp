import gql from "graphql-tag";

export const GET_DISH = gql`
    query getDish($id: ID!) {
        dish(id: $id) {
            __typename
            id
            name
            cookingTime
            notes
            url
            category
            history
            lastMade
            steps
            ingredients
            ingredientsInSteps {
                step
                ingredients {
                    value
                }
            }
        }
    }
`;
