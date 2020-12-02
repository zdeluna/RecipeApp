import gql from "graphql-tag";

export const ADD_USER = gql`
    mutation addUser($username: String!, $password: String!) {
        addUser(username: $username, password: $password) {
            success
            message
        }
    }
`;
