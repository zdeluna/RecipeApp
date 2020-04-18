import gql from "graphql-tag";

export const DELETE_DISH = gql`
    mutation deleteDish($dishId: String!) {
        deleteDish(dishId: $dishId) {
            success
            message
        }
    }
`;
