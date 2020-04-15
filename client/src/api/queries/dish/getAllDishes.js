import gql from "graphql-tag";

export const GET_DISHES = gql`
    query getDishes {
        dishes {
            id
            name
            cookingTime
            category
            lastMade
        }
    }
`;
