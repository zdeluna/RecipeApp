"use strict";
const { RESTDataSource } = require("apollo-datasource-rest");
//const {RESTDataSource} = require('apollo-server-cloud-functions');
const request = require("request");
const axios = require("axios");
const cheerio = require("cheerio");
const {
    getStepsFromWebPage,
    getIngredientsFromWebPage,
    getIngredientsInSteps
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
        if (dishObject.ingredients || dishObject.steps) {
            let patchArray = [];
            if (dishObject.steps && dishObject.steps.length) {
                patchArray.push({
                    op: "replace",
                    path: "/steps",
                    value: dishObject.steps
                });
            }

            if (dishObject.ingredients && dishObject.ingredients.length) {
                patchArray.push({
                    op: "replace",
                    path: "/ingredients",
                    value: dishObject.ingredients
                });
            }

            return await this.patch(`/${dishObject.id}`, patchArray, {
                headers: { Authorization: this.context.token }
            });
        }

        const res = await this.put(`/${id}`, dishObject, {
            headers: { Authorization: this.context.token }
        });
        return this.dishReducer(res);
    }

    async getIngredientsWithSteps({ steps, ingredients }) {
        return getIngredientsInSteps(steps, ingredients);
    }

    async getStepsAndIngredients({ id, url }) {
        let steps = [];
        let ingredients = [];
        let patchArray = [];
        console.log("url");
        console.log(url);
        const requestOptions = {
            uri: url,
            encoding: "utf8"
        };

        return new Promise(async function(resolve, reject) {
            //request(requestOptions, async function(error, response, html) {
            try {
                let { data } = await axios.get(url);
                let $ = cheerio.load(data);
                steps = await getStepsFromWebPage($);
                ingredients = await getIngredientsFromWebPage($);
                console.log("FROM URL: ");
                console.log(steps);
                console.log(ingredients);

                if (steps.length) {
                    patchArray.push({
                        op: "replace",
                        path: "/steps",
                        value: steps
                    });
                }

                if (ingredients.length) {
                    patchArray.push({
                        op: "replace",
                        path: "/ingredients",
                        value: ingredients
                    });
                }
                resolve(patchArray);
            } catch (error) {
                console.log(error);
            }
        });
        // });
    }

    async addDishUrl({ id, url }) {
        let steps = [];
        let ingredients = [];
        let token = this.context.token;

        let patchArray = await this.getStepsAndIngredients({ id, url });
        await this.patch(`/${id}`, patchArray, {
            headers: { Authorization: this.context.token }
        });

        let dish = await this.getDishById({ id });

        return this.dishReducer(dish);
    }
}

module.exports = DishAPI;
