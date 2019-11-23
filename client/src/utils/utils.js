import React, {useState, Component} from 'react';
import {graphql} from 'react-apollo';
import {useQuery} from '@apollo/react-hooks';
import gql from 'graphql-tag';

const GET_DISH = gql`
    query getDish($userId: String!, $dishId: String!) {
        dish(userId: $userId, dishId: $dishId) {
            name
            cookingTime
            category
        }
    }
`;

function DishEntry(props) {
    console.log('Call dish entry function');
    console.log(props.userId);
    console.log(props.dishId);
    const {loading, error, data} = useQuery(GET_DISH, {
        variables: {userId: props.userId, dishId: props.dishId},
        onComplete: () => {
            const [dishName, setDishName] = useState(data.dish.name);
        },
    });
}

export default function withFetchDataHook(Component) {
    return function WrappedComponent(props) {
        const dishInfo = {
            category: 1,
            ingredients: [
                {
                    id: 0,
                    value: 'egg',
                },
                {
                    id: 1,
                    value: 'lettuce',
                },
            ],
            name: 'Fajitas',
            steps: [
                {
                    id: 0,
                    value: 'This is step 1',
                },
                {
                    id: 1,
                    value: 'This is step 2',
                },
            ],
            uid: 'XOqoUyqbCMWg7HUjURF6alTSXSP2',
        };
        return <Component {...props} dish={dishInfo} />;
    };
}
