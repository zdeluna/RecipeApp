module.exports = {
    Query: {
        dish: (_, {userId, dishId}, {dataSources}) =>
            dataSources.dishAPI.getDishById({userId: userId, dishId: dishId}),
        dishes: (_, {userId}, {dataSources}) =>
            dataSources.dishAPI.getAllDishes({userId: userId}),
    },
    Mutation: {
        addDish: (_, {userId, name, category}, {dataSources}) =>
            dataSources.dishAPI.createDish({
                userId: userId,
                name: name,
                category: category,
            }),
    },
};
