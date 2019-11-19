module.exports = {
    Query: {
        dish: (_, {userID, dishID}, {dataSources}) =>
            dataSources.dishAPI.getDishById({userId: userID, dishId: dishID}),
        dishes: (_, {userID}, {dataSources}) =>
            dataSources.dishAPI.getAllDishes({userId: userID}),
    },
};
