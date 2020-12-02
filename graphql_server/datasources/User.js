"use strict";
const { RESTDataSource } = require("apollo-datasource-rest");
//const {RESTDataSource} = require('apollo-server-cloud-functions');

class UserAPI extends RESTDataSource {
    constructor() {
        super();

        if (process.env.GRAPH_ENV == "test") {
            this.baseURL = "https://localhost:5001/api/";
        } else {
            this.baseURL = "https://recipescheduler-227221.appspot.com/api/";
        }
    }

    async createUser({ googleId, email }) {
        const res = await this.post(`/users`, {
            googleId: googleId,
            email: email
        });
        return res;
    }

    async signInUser({ username, password }) {
        const res = await this.post(`/Login`, {
            UserName: username,
            Password: password
        });
        return res;
    }
}

module.exports = UserAPI;
