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

    async didReceiveResponse(response, _request) {
        let cookies = response.headers.get("set-cookie");
        console.log("in graphql server: ");
        console.log(cookies);
        const defaultReturnValue = await super.didReceiveResponse(
            response,
            _request
        );
        if (cookies) {
            return {
                ...defaultReturnValue,
                headers: response.headers
            };
        }

        return defaultReturnValue;
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
        console.log("in sign in user data source");
        console.log(res);
        this.context.setHeaders.push({
            key: "headername",
            value: "headercontent"
        });
        this.context.setCookies.push({
            name: "testCookie",
            value: "cookieValue",
            options: {
                domain: "http://localhost:3000",
                expires: new Date("2021-01-01T00:00:00"),
                httpOnly: true,
                maxAge: 3600,
                path: "/",
                sameSite: true,
                secure: true
            }
        });

        return res;
    }
}

module.exports = UserAPI;
