import gql from "graphql-tag";

export const ADD_DISH = gql`
    mutation addDish($name: String!, $category: String!) {
        addDish(name: $name, category: $category) {
            success
            message
            dishId
        }
    }
`;
