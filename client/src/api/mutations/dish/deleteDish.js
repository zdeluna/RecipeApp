import gql from 'graphql-tag';

export const DELETE_DISH = gql`
    mutation deleteDish($userId: String!, $dishId: String!) {
        deleteDish(userId: $userId, dishId: $dishId) {
            success
            message
        }
    }
`;
