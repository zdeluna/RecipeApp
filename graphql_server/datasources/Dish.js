const {RESTDataSource} = require('apollo-datasource-rest');

class DishAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'http://localhost:5000/api/';
    }

    dishReducer(dish, dishId) {
        return {
            id: dishId,
            name: dish.name,
            category: dish.category,
            cookingTime: dish.cookingTime,
            userId: dish.userId,
            steps: dish.steps,
            ingredients: dish.ingredients,
            url: dish.url,
            history: dish.history,
        };
    }

    dishesReducer(dishes) {
        let dishArray = [];
        let newDish;

        Object.keys(dishes).forEach((key, index) => {
            console.log(dishes[key]);
            newDish = this.dishReducer(dishes[key], key);
            dishArray.push(newDish);
        });

        console.log(dishArray.length);
        return dishArray;
    }

    async getDishById({userId, dishId}) {
        const res = await this.get(`/users/${userId}/dish/${dishId}`);
        console.log('RES: ' + res);
        return this.dishReducer(res, dishId);
    }

    async getAllDishes({userId}) {
        const res = await this.get(`/users/${userId}/dish`);
        //return res;
        return this.dishesReducer(res);
    }

    async createDish({userId, name, category}) {
        const res = await this.post(`/users/${userId}/dish`, {
            userId: userId,
            name: name,
            category: category,
        });
        return res;
    }

    async updateDish(userId, dishId, dishObject) {
        const res = await this.put(
            `/users/${userId}/dish/${dishId}`,
            dishObject,
        );
        return this.dishReducer(res, dishId);
    }
}

module.exports = DishAPI;
