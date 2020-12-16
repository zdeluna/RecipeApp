"use strict";
const { RESTDataSource } = require("apollo-datasource-rest");
//const {RESTDataSource} = require('apollo-server-cloud-functions');

class UserAPI extends RESTDataSource {
    constructor() {
        super();

        if (process.env.GRAPH_ENV == "test") {
            this.baseURL = "https://recipescheduler.azurewebsites.net/api/";
        } else {
            this.baseURL = "https://recipescheduler.azurewebsites.net/api/";
        }
    }

    async createUser({ username, password }) {
        const res = await this.post(`/User`, {
            UserName: username,
            Password: password,
            UserRole: "User"
        });
        console.log("Create user response");
        console.log(res);

        return res;
    }

    async signInUser({ username, password }) {
        const res = await this.post(`/Login`, {
            UserName: username,
            Password: password
        });
        console.log("Sign in response");
        console.log(res);
        return res;
    }
}

module.exports = UserAPI;
