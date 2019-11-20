const {RESTDataSource} = require('apollo-datasource-rest');

class DishAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'http://localhost:5000/api/';
    }

    dishReducer(dish) {
        return {
            name: dish.name,
            category: dish.category,
            cookingTime: dish.cookingTime,
        };
    }

    dishesReducer(dishes) {
        let dishArray = [];
        let newDish;

        for (let dish in dishes) {
            newDish = {
                id: dish,
                name: dishes[dish].name,
                history: dishes[dish].history,
                cookingTime: dishes[dish].cookingTime,
            };
            dishArray.push(newDish);
        }
        return dishArray;
    }

    async getDishById({userId, dishId}) {
        const res = await this.get(`/users/${userId}/dish/${dishId}`);
        return this.dishReducer(res);
    }

    async getAllDishes({userId}) {
        const res = await this.get(`/users/${userId}/dish`);
        return this.dishesReducer(res);
    }

    async createDish({userId, name, category}) {
        const res = await this.post(`/users/${userId}/dish`, {
            userId: userId,
            name: name,
            category: category,
        });
        console.log('Object: ' + res);
        return res.id;
    }
}

module.exports = DishAPI;
