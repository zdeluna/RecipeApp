"use strict";
const { RESTDataSource } = require("apollo-datasource-rest");
//const {RESTDataSource} = require('apollo-server-cloud-functions');
const request = require("request");
const cheerio = require("cheerio");
const {
    getStepsFromWebPage,
    getIngredientsFromWebPage
} = require("../utils/parseRecipe/parseRecipe.js");

class DishAPI extends RESTDataSource {
    constructor() {
        super();

        if (process.env.GRAPH_ENV == "test") {
            this.baseURL = "https://localhost:5001/api/Dish";
        } else {
            this.baseURL = "https://recipescheduler.azurewebsites.net/api/Dish";
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

    async getDishById({ id }) {
        const res = await this.get(`/${id}`, undefined, {
            headers: { Authorization: this.context.token }
        });
        return this.dishReducer(res);
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

    async deleteDish({ id }) {
        const res = await this.delete(`/${id}`, undefined, {
            headers: { Authorization: this.context.token }
        });
        return res;
    }

    async updateDish(id, dishObject) {
        const res = await this.put(`/${id}`, dishObject, {
            headers: { Authorization: this.context.token }
        });
        return this.dishReducer(res);
    }

    async addDishUrl({ id, url }) {
        console.log("add url");
        console.log(id);
        console.log(url);
        let steps = [];
        let ingredients = [];
        let token = this.context.token;

        request(url, async function(error, response, html) {
            try {
                if (error) return error;
                let $ = cheerio.load(html);
                steps = await getStepsFromWebPage($);
                ingredients = await getIngredientsFromWebPage($);
                /* Copy ingredients array so that we can send it as a parameter when
				 *  determine which ingredients are in each step in the function getIngredientsInSteps*/
                /*
                let ingredients = dishInfo.ingredients.map(a =>
                    Object.assign({}, a)
                );
                
                dishInfo.ingredientsInSteps = await getIngredientsInSteps(
                    dishInfo.steps,
                    ingredients
                );*/
                console.log(steps);
                console.log(ingredients);
                let patchArray = [];
                if (steps) {
                    patchArray.push({
                        op: "add",
                        path: "/steps",
                        value: steps
                    });
                }

                if (ingredients) {
                    patchArray.push({
                        op: "add",
                        path: "/ingredients",
                        value: ingredients
                    });
                }
                const res = await this.patch(`/${id}`, patchArray, {
                    headers: { Authorization: token }
                });

                return res;
            } catch (error) {
                console.log(error);
            }
        });

        return null;
    }
}

module.exports = DishAPI;
