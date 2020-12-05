"use strict";
const { RESTDataSource } = require("apollo-datasource-rest");
//const {RESTDataSource} = require('apollo-server-cloud-functions');

class DishAPI extends RESTDataSource {
    constructor() {
        super();

        if (process.env.GRAPH_ENV == "test") {
            this.baseURL = "http://localhost:5000/api/Dish";
        } else {
            this.baseURL = "https://recipescheduler-227221.appspot.com/api/";
        }
    }

    dishReducer(dish) {
        return {
            id: dish.id,
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
        const res = await this.get(`/${dishId}`, undefined, {
            headers: { Authorization: this.context.token }
        });
        return this.dishReducer(res, dishId);
    }

    async getAllDishes() {
        const res = await this.get(`/`, undefined, {
            headers: { Authorization: this.context.token }
        });
        console.log("after response");

        if (!res) return null;
        else return this.dishesReducer(res);
    }

    async createDish({ name, category }) {
        const res = await this.post(
            `/`,
            {
                name: name,
                category: category
            },
            { headers: { Authorization: this.context.token } }
        );
        return res;
    }

    async deleteDish({ dishId }) {
        const res = await this.delete(`/users/dish/${dishId}`, undefined, {
            headers: { Authorization: this.context.token }
        });
        return res;
    }

    async updateDish(dishId, dishObject) {
        console.log("make update dish call to API");
        console.log(dishObject);
        const res = await this.put(`/${dishId}`, dishObject, {
            headers: { Authorization: this.context.token }
        });
        return this.dishReducer(res, dishId);
    }
}

module.exports = DishAPI;
