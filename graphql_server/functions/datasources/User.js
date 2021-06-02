"use strict";
const { RESTDataSource } = require("apollo-datasource-rest");
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

    setCookieHeader(headers) {
        const cookies = headers.get("set-cookie");
        const parsedCookie = cookie.parse(cookies);

        // Format C# DateTime to JavaScript date
        ///https://stackoverflow.com/questions/61984132/how-do-i-get-cookie-from-apollo-graphql-resolver
        const expirationDate = new Date(Date.parse(parsedCookie.expires));

        console.log("Cookie");
        console.log(parsedCookie);

        this.context.setCookies.push({
            name: "refresh_token",
            value: parsedCookie.refresh_token,
            options: {
                expires: expirationDate,
                httpOnly: true,
                path: "/",
                domain: ".recipescheduler.net",
                sameSite: false,
                secure: true
            }
        });
    }

    /* This method will allow us to return the headers in the login user request so
     * that we can pass along the cookie to our GraphQL client*/
    async didReceiveResponse(response, _request) {
        let cookies =
            response.headers.get("set-cookie") ||
            _request.headers.get("set-cookie");
        const defaultReturnValue = await super.didReceiveResponse(
            response,
            _request
        );
        if (cookies) {
            return {
                ...defaultReturnValue,
                headers: response.headers || _request.headers
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

        this.setCookieHeader(res.headers);

        return res;
    }

    async refreshToken({ accessToken }) {
        const res = await this.post(
            "/Login/refresh",
            {
                AccessToken: accessToken
            },
            { headers: { cookie: this.context.cookie } }
        );
        this.setCookieHeader(res.headers);

        return res;
    }
}

module.exports = UserAPI;
