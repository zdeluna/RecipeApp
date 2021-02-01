import gql from "graphql-tag";

export const GET_USER = gql`
    query getUser($id: ID!) {
        user(id: $id) {
            __typename
            userName
            categories {
                name
                order
                id
                userID
            }
        }
    }
`;
