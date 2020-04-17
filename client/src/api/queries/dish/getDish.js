import gql from "graphql-tag";

export const GET_DISH = gql`
    query getDish($dishId: String!) {
        dish(dishId: $dishId) {
            __typename
            id
            name
            cookingTime
            notes
            url
            category
            history
            steps {
                value
            }
            ingredients {
                value
            }
            ingredientsInSteps {
                step
                ingredients {
                    value
                }
            }
        }
    }
`;
