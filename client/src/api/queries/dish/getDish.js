import gql from 'graphql-tag';

export const GET_DISH = gql`
    query getDish($userId: String!, $dishId: String!) {
        dish(userId: $userId, dishId: $dishId) {
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
        }
    }
`;
