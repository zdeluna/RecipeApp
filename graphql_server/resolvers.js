module.exports = {
    Query: {
        dish: (_, {userId, dishId}, {dataSources}) =>
            dataSources.dishAPI.getDishById({userId: userId, dishId: dishId}),
        dishes: (_, {userId}, {dataSources}) =>
            dataSources.dishAPI.getAllDishes({userId: userId}),
    },
    Mutation: {
        addDish: async (_, {userId, name, category}, {dataSources}) => {
            console.log('add Dish');
            const results = await dataSources.dishAPI.createDish({
                userId: userId,
                name: name,
                category: category,
            });
            return {
                dishId: results.id,
                success: true,
                message: 'The dish was created successfully',
            };
        },
        updateDish: async (_, {userId, dishId, url}, {dataSources}) => {
            let dataFields = {url: url};
            const results = await dataSources.dishAPI.updateDish(
                userId,
                dishId,
                dataFields,
            );
            return {
                success: true,
                message: 'The dish was successfully updated',
            };
        },
    },
};
