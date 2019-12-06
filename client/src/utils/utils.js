import React, {useState, Component} from 'react';
import {graphql} from 'react-apollo';
import {useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Loading from '..//components/Loading';

const GET_DISH = gql`
    query getDish($userId: String!, $dishId: String!) {
        dish(userId: $userId, dishId: $dishId) {
            name
            cookingTime
            url
            category
            steps {
                id
                value
            }
            ingredients {
                id
                value
            }
        }
    }
`;

export default function withFetchDataHook(Component) {
    return function WrappedComponent(props) {
        const {loading, error, data} = useQuery(GET_DISH, {
            variables: {
                userId: props.userId,
                dishId: props.match.params.dishId,
            },
        });

        if (loading) return <Loading />;

        return <Component {...props} dish={data.dish} />;
    };
}
