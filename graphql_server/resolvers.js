module.exports = {
    Query: {
        dish: (_, {userId, dishId}, {dataSources}) =>
            dataSources.dishAPI.getDishById({userId: userId, dishId: dishId}),
        dishes: (_, {userId}, {dataSources}) =>
            dataSources.dishAPI.getAllDishes({userId: userId}),
    },
    Mutation: {
        addDish: async (_, {userId, name, category}, {dataSources}) => {
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
        updateDish: async (
            _,
            {userId, dishId, name, url, steps, ingredients, cookingTime},
            {datasources},
        ) => {
            console.log('update dish');
            const results = await dataSources.dishAPI.updateDish({
                userId,
                dishId,
                dishFields,
            });
            return {
                success: true,
                message: 'The dish was successfully updated',
            };
        },
    },
};
