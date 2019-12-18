import gql from 'graphql-tag';

export const ADD_DISH = gql`
    mutation addDish($userId: String!, $name: String!, $category: String!) {
        addDish(userId: $userId, name: $name, category: $category) {
            success
            message
            dishId
        }
    }
`;

