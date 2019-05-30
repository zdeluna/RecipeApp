var path = require('path');
var axios = require('axios');
var MockAdapter = require('axios-mock-adapter');
var mock = new MockAdapter(axios);
require('dotenv').config();

class API {
    contructor() {
        this.host = '/api/';
    }

    getDish(userId, dishId) {
        mock.onGet('/api/users/${userId}/dish/${dishId}').reply(200, {
            category: 1,
            ingredients: [
                {
                    id: 0,
                    value: 'Ground beef',
                },
                {
                    id: 1,
                    value: 'Taco shells',
                },
            ],
            name: 'Taco',
            steps: [
                {
                    id: 0,
                    value: 'Cook ground beef',
                },
                {
                    id: 1,
                    value: 'Cook taco shells',
                },
            ],
            uid: process.env.TEST_USER_ID,
        });
        return axios.get('/api/users/${userId}/dish/${dishId}');
    }

    getDishesOfUser(userId) {
        mock.onGet('/api/users/${userId}/dish').reply(200, {
            '-LesMF0g40cA-VOSqJjD': {
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
                uid: process.env.TEST_USER_ID,
            },
        });
        return axios.get('/api/users/${userId}/dish');
    }

    createDish(userId, dish) {
        //return axios.post(`/api/users/${userId}/dish`, dish);
    }

    updateDish(userId, dishId, updatedDishFields) {
        /*
        return axios.put(
            `/api/users/${userId}/dish/${dishId}`,
            updatedDishFields,
		);
		*/
    }

    createUser(userInfo) {
        /*
		return axios.post(`/api/users`, userInfo);
		*/
    }

    deleteDish(userId, dishId) {
        mock.onDelete('/api/users/${userId}/dish/${dishId}').reply(204);
        return axios.delete('/api/users/${userId}/dish/${dishId}');
    }
}

export default API;
