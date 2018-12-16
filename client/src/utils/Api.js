const axios = require('axios');

class API {
    contructor() {
        this.host = '/api/';
    }

    getDish(userId, dishId) {
        return axios.get(
            '/api/' + 'users/' + userId + '/' + 'dish' + '/' + dishId,
        );
    }

    createDish(userId, dish) {
        return axios.post('/api/' + 'users/' + userId + '/' + 'dish', dish);
    }

    updateDish(userId, dishId, updatedDishFields) {
        console.log('update dish: ' + updatedDishFields);
        return axios.put(
            '/api/' + 'users/' + userId + '/' + 'dish' + '/' + dishId,
            updatedDishFields,
        );
    }
}

export default API;
