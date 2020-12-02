import gql from "graphql-tag";

export const LOG_IN_USER = gql`
    mutation signInUser($username: String!, $password: String!) {
        signInUser(username: $username, password: $password) {
            token
        }
    }
`;
