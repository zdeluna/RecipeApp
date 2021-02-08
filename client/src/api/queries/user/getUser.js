import gql from "graphql-tag";

export const GET_USER = gql`
    query getUser($id: ID!) {
        user(id: $id) {
            __typename
            id
            userName
            categories {
                __typename @include(if: false)
                name
                order
                id
                userID
            }
        }
    }
`;
