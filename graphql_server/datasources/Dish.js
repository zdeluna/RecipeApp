const {RESTDataSource} = require('apollo-datasource-rest');

class DishAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'http://localhost:5000/api/';
    }

    dishReducer(dish) {
        return {
            id: dish,
            name: dish.name,
            category: dish.category,
            cookingTime: dish.cookingTime,
            userId: dish.userId,
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
                category: dishes[dish].category,
                userId: dishes[dish].userId,
            };
            dishArray.push(newDish);
        }
        return dishArray;
    }

    async getDishById({userId, dishId}) {
        const res = await this.get(`/users/${userId}/dish/${dishId}`);
        console.log('RES: ' + res);
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
        return res;
    }
}

module.exports = DishAPI;
