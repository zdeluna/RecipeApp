import gql from "graphql-tag";

export const DELETE_DISH = gql`
    mutation deleteDish($id: ID!) {
        deleteDish(id: $id) {
            success
            message
        }
    }
`;
