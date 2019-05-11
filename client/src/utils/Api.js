const axios = require('axios');
var path = require('path');
var lib = path.join(
    path.dirname(require.resolve('axios')),
    'lib/adapters/http',
);
var http = require(lib);

class API {
    contructor() {
        this.host = '/api/';
    }

    getDish(userId, dishId) {
        return axios.get(`/api/users/${userId}/dish/${dishId}`);
    }

    getDishesOfUser(userId) {
        return axios.get(`/api/users/${userId}/dish`, {adapter: http});
    }

    createDish(userId, dish) {
        return axios.post(`/api/users/${userId}/dish`, dish);
    }

    updateDish(userId, dishId, updatedDishFields) {
        return axios.put(
            `/api/users/${userId}/dish/${dishId}`,
            updatedDishFields,
        );
    }

    createUser(userInfo) {
        return axios.post(`/api/users`, userInfo);
    }

    deleteDish(userId, dishId) {
        return axios.delete(`/api/users/${userId}/dish/${dishId}`);
    }
}

export default API;
