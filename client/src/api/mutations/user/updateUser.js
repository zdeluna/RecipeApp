import gql from "graphql-tag";

export const UPDATE_USER = gql`
    mutation updateUser($id: ID!, $categories: [CategoryInput]) {
        updateUser(id: $id, categories: $categories) {
            success
        }
    }
`;
