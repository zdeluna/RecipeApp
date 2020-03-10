const {RESTDataSource} = require('apollo-datasource-rest');
//const {RESTDataSource} = require('apollo-server-cloud-functions');

class UserAPI extends RESTDataSource {
    constructor() {
        super();

        if (process.env.GRAPH_ENV == 'test') {
            this.baseURL = 'http://localhost:5000/api/';
        } else {
            this.baseURL = 'https://recipescheduler-227221.appspot.com/api/';
        }
    }

    async createUser({userId, email}) {
        const res = await this.post(`/users`, {
            userId: userId,
            email: email,
        });
        return res;
    }
}

module.exports = UserAPI;
