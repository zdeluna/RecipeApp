module.exports = {
    Query: {
        dish: (_, { userId, dishId }, { dataSources }) =>
            dataSources.dishAPI.getDishById({ userId: userId, dishId: dishId }),
        dishes: (_, { userId }, { dataSources }) => {
            return dataSources.dishAPI.getAllDishes({ userId: userId });
        }
    },
    Mutation: {
        addDish: async (_, { userId, name, category }, { dataSources }) => {
            const results = await dataSources.dishAPI.createDish({
                userId: userId,
                name: name,
                category: category
            });
            return {
                dishId: results.id,
                success: true,
                message: "The dish was created successfully"
            };
        },
        updateDish: async (_, dishObject, { dataSources }) => {
            const result = await dataSources.dishAPI.updateDish(
                dishObject.userId,
                dishObject.dishId,
                dishObject
            );
            return {
                success: true,
                message: "The dish was successfully updated",
                dish: result
            };
        },
        deleteDish: async (_, { userId, dishId }, { dataSources }) => {
            dataSources.dishAPI.deleteDish({ userId: userId, dishId: dishId });
            return {
                success: true,
                message: "The dish was successfully deleted"
            };
        },
        addUser: async (_, { googleId, email }, { dataSources }) => {
            dataSources.userAPI.createUser({
                googleId: googleId,
                email: email
            });
            return {
                success: true,
                message: "The user was created successfully"
            };
        }
    }
};
