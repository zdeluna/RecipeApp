const axios = require('axios');

class API {
    contructor() {
        this.host = '/api/';
    }

    getDish(userId, dishId) {
        return axios.get(`/api/users/${userId}/dish/${dishId}`);
    }

    getDishesOfUser(userId) {
        return axios.get(`/api/users/${userId}`);
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
}

export default API;
