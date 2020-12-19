import gql from "graphql-tag";

export const ADD_DISH_URL = gql`
    mutation addDishUrl($id: ID!, $url: String) {
        addDishUrl(id: $id, url: $url) {
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
