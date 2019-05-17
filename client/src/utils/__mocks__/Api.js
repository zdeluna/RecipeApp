var path = require('path');
var axios = require('axios');
var MockAdapter = require('axios-mock-adapter');
var mock = new MockAdapter(axios);

class API {
    contructor() {
        this.host = '/api/';
    }

    getDish(userId, dishId) {
        //return axios.get(`/api/users/${userId}/dish/${dishId}`);
    }

    getDishesOfUser(userId) {
        mock.onGet('/api/users/${userId}/dish').reply(
            200,

            {
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
                    uid: 'XOqoUyqbCMWg7HUjURF6alTSXSP2',
                },
            },
        );
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
        /*
		return axios.delete(`/api/users/${userId}/dish/${dishId}`);
		*/
    }
}

export default API;
