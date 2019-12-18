import gql from 'graphql-tag';

export const GET_DISHES = gql`
    query getDishes($userId: String!) {
        dishes(userId: $userId) {
            id
            name
            cookingTime
            category
        }
    }
`;
