import gql from "graphql-tag";

export const REFRESH_TOKEN = gql`
    mutation refreshToken($accessToken: String!) {
        refreshToken(accessToken: $accessToken) {
            jwt_token
            jwt_token_expiry
        }
    }
`;
