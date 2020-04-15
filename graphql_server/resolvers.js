module.exports = {
    Query: {
        dish: (_, { userId, dishId }, { dataSources }) =>
            dataSources.dishAPI.getDishById({ userId: userId, dishId: dishId }),
        dishes: (_, undefined, { dataSources }) => {
            return dataSources.dishAPI.getAllDishes();
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
            await dataSources.dishAPI.deleteDish({
                userId: userId,
                dishId: dishId
            });
            return {
                success: true,
                message: "The dish was successfully deleted"
            };
        },
        addUser: async (_, { password, email }, { dataSources }) => {
            console.log(email);
            const results = await dataSources.userAPI.createUser({
                email: email,
                password: password
            });
            console.log(results);
            return {
                success: true,
                message: "The user was created successfully",
                token: results.token
            };
        }
    }
};
