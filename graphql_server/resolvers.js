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
        updateDish: async (_, dishObject, {dataSources}) => {
            let dataFields = {};

            const result = await dataSources.dishAPI.updateDish(
                dishObject.userId,
                dishObject.dishId,
                dishObject,
            );

            result.id = result.dishId;

            return {
                success: true,
                message: 'The dish was successfully updated',
                dish: result,
            };
        },
    },
};
