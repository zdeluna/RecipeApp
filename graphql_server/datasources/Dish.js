const {RESTDataSource} = require('apollo-datasource-rest');

class DishAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://localhost:5000/api/';
    }

    dishReducer(dish) {
        return {
            id: dish.id,
            cookingTime: dish.cookingTime,
            category: dish.category,
        };
    }

    async getDishById({userId, dishId}) {
        const res = await this.get(`/users/${userId}/dish/${dishId}`);
        return this.dishReducer(res[0]);
    }
}

module.exports = DishAPI;
