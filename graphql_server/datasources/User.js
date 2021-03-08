"use strict";
const { RESTDataSource } = require("apollo-datasource-rest");
//const {RESTDataSource} = require('apollo-server-cloud-functions');

class UserAPI extends RESTDataSource {
    constructor() {
        super();

        if (process.env.GRAPH_ENV == "test") {
            this.baseURL = "https://localhost:5001/api/";
        } else {
            this.baseURL = "https://recipescheduler.azurewebsites.net/api/";
        }
    }
    async getUserById({ id }) {
        const res = await this.get(`/User/${id}`, undefined, {
            headers: { Authorization: this.context.token }
        });
        return res;
    }

    async createUser({ username, password }) {
        const res = await this.post(`/User`, {
            UserName: username,
            Password: password,
            UserRole: "User"
        });

        return res;
    }

    async updateUser({ id, categories }) {
        let updatedCategories = [
            {
                op: "replace",
                path: "/categories",
                value: categories
            }
        ];

        const res = await this.patch(`/User/${id}`, updatedCategories, {
            headers: { Authorization: this.context.token }
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
