import gql from 'graphql-tag';

export const UPDATE_DISH = gql`
    mutation updateDish($userId: String!, $dishId: String!, $url: String) {
        updateDish(userId: $userId, dishId: $dishId, url: $url) {
            success
            message
            dish {
                __typename
                id
                name
                url
                ingredients {
                    value
                }
                steps {
                    value
                }
            }
        }
    }
`;
