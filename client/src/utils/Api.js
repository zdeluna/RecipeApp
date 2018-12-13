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
}

export default API;
