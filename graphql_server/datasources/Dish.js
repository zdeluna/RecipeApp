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

    async getStepsAndIngredients({ id, url }) {
        let steps = [];
        let ingredients = [];
        let patchArray = [];
        return new Promise(function(resolve, reject) {
            request(url, async function(error, response, html) {
                try {
                    if (error) return error;
                    let $ = cheerio.load(html);
                    steps = await getStepsFromWebPage($);
                    ingredients = await getIngredientsFromWebPage($);
                    console.log("steps");
                    console.log(steps);
                    console.log("ingredients");
                    console.log(ingredients);
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
                    if (steps.length) {
                        console.log("add steps");
                        patchArray.push({
                            op: "add",
                            path: "/steps",
                            value: steps
                        });
                    }

                    if (ingredients.length) {
                        console.log("add ingredients");
                        patchArray.push({
                            op: "add",
                            path: "/ingredients",
                            value: ingredients
                        });
                    }
                    resolve(patchArray);
                } catch (error) {
                    console.log(error);
                }
            });
        });
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
