import gql from 'graphql-tag';

export const ADD_USER = gql`
    mutation addUser($googleId: String!, $email: String!) {
        addUser(googleId: $googleId, email: $email) {
            success
            message
        }
    }
`;
