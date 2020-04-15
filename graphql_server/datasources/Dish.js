"use strict";
const { RESTDataSource } = require("apollo-datasource-rest");
//const {RESTDataSource} = require('apollo-server-cloud-functions');

class DishAPI extends RESTDataSource {
    constructor() {
        super();

        if (process.env.GRAPH_ENV == "test") {
            this.baseURL = "http://localhost:5000/api/";
        } else {
            this.baseURL = "https://recipescheduler-227221.appspot.com/api/";
        }
    }

    dishReducer(dish) {
        return {
            id: dish.dishId,
            name: dish.name,
            category: dish.category,
            userId: dish.userId,
            steps: dish.steps,
            ingredients: dish.ingredients,
            url: dish.url,
            history: dish.history,
            cookingTime: dish.cookingTime,
            notes: dish.notes,
            ingredientsInSteps: dish.ingredientsInSteps,
            lastMade: dish.lastMade
        };
    }

    dishesReducer(dishes) {
        let dishArray = [];

        for (let i = 0; i < dishes.length; i++) {
            dishArray.push(this.dishReducer(dishes[i]));
        }
        return dishArray;
    }

    async getDishById({ dishId }) {
        const res = await this.get(`/users/dish/${dishId}`, undefined, {
            headers: { Authorization: this.context.token }
        });
        return this.dishReducer(res, dishId);
    }

    async getAllDishes() {
        const res = await this.get(`/users/dish`, undefined, {
            headers: { Authorization: this.context.token }
        });

        if (!res) return null;
        else return this.dishesReducer(res);
    }

    async createDish({ userId, name, category }) {
        const res = await this.post(
            `/users/dish`,
            {
                userId: userId,
                name: name,
                category: category
            },
            { headers: { Authorization: this.context.token } }
        );
        return res;
    }

    async deleteDish({ userId, dishId }) {
        const res = await this.delete(`/users/dish/${dishId}`, undefined, {
            headers: { Authorization: this.context.token }
        });
        return res;
    }

    async updateDish(userId, dishId, dishObject) {
        const res = await this.put(`/users/dish/${dishId}`, dishObject, {
            headers: { Authorization: this.context.token }
        });
        return this.dishReducer(res, dishId);
    }
}

module.exports = DishAPI;
