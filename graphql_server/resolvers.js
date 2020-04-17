module.exports = {
    Query: {
        dish: (_, { dishId }, { dataSources }) =>
            dataSources.dishAPI.getDishById({ dishId: dishId }),
        dishes: (_, undefined, { dataSources }) => {
            return dataSources.dishAPI.getAllDishes();
        }
    },
    Mutation: {
        addDish: async (_, { name, category }, { dataSources }) => {
            const results = await dataSources.dishAPI.createDish({
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
            await dataSources.dishAPI.deleteDish({
                userId: userId,
                dishId: dishId
            });
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
