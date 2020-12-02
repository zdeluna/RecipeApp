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
                dishObject.dishId,
                dishObject
            );
            return {
                success: true,
                message: "The dish was successfully updated",
                dish: result
            };
        },
        deleteDish: async (_, { dishId }, { dataSources }) => {
            await dataSources.dishAPI.deleteDish({
                dishId: dishId
            });
            return {
                success: true,
                message: "The dish was successfully deleted"
            };
        },
        addUser: async (_, { username, password }, { dataSources }) => {
            dataSources.userAPI.createUser({
                username,
                password
            });
            return {
                success: true,
                message: "The user was created successfully"
            };
        },
        signInUser: async (_, { username, password }, { dataSources }) => {
            let response = await dataSources.userAPI.signInUser({
                username,
                password
            });
            return {
                success: true,
                token: response.token
            };
        }
    }
};
