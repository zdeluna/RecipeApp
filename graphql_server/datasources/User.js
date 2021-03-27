"use strict";
const { RESTDataSource } = require("apollo-datasource-rest");
//const {RESTDataSource} = require('apollo-server-cloud-functions');
var cookie = require("cookie");

class UserAPI extends RESTDataSource {
    constructor() {
        super();

        if (process.env.GRAPH_ENV == "test") {
            this.baseURL = "https://localhost:5001/api/";
        } else {
            this.baseURL = "https://recipescheduler.azurewebsites.net/api/";
        }
    }

    /* This method will allow us to return the headers in the login user request so
     * that we can pass along the cookie to our GraphQL client*/
    async didReceiveResponse(response, _request) {
        let cookies = response.headers.get("set-cookie");
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

        const cookies = res.headers.get("set-cookie");
        const parsedCookie = cookie.parse(cookies);

        this.context.setHeaders.push({
            key: "headername",
            value: "headercontent"
        });
        this.context.setCookies.push({
            name: "refresh_token",
            value: parsedCookie.refresh_token,
            options: {
                expires: new Date("2021-08-01T00:00:00"),
                httpOnly: true,
                maxAge: 3600,
                path: "/",
                sameSite: false,
                secure: false
            }
        });

        return res;
    }
}

module.exports = UserAPI;
