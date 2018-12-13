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
}

export default API;
