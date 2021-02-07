module.exports = {
    Query: {
        dish: (_, { id }, { dataSources }) =>
            dataSources.dishAPI.getDishById({ id }),
        dishes: (_, undefined, { dataSources }) => {
            return dataSources.dishAPI.getAllDishes();
        },
        user: (_, { id }, { dataSources }) =>
            dataSources.userAPI.getUserById({ id })
    },
    Mutation: {
        addDish: async (_, { name, category }, { dataSources }) => {
            const results = await dataSources.dishAPI.createDish({
                name: name,
                category: category
            });
            return {
                id: results.id,
                success: true,
                message: "The dish was created successfully"
            };
        },
        updateDish: async (_, dishObject, { dataSources }) => {
            const result = await dataSources.dishAPI.updateDish(
                dishObject.id,
                dishObject
            );
            return {
                success: true,
                message: "The dish was successfully updated",
                dish: result
            };
        },
        deleteDish: async (_, { id }, { dataSources }) => {
            await dataSources.dishAPI.deleteDish({
                id
            });
            return {
                success: true,
                message: "The dish was successfully deleted"
            };
        },
        addUser: async (_, { username, password }, { dataSources }) => {
            const result = await dataSources.userAPI.createUser({
                username,
                password
            });
            return {
                success: true,
                message: "The user was created successfully",
                token: result.token,
                id: result.id
            };
        },
        updateUser: async (_, { id, categories }, { dataSources }) => {
            const result = await dataSources.userAPI.updateUser({
                id,
                categories
            });
            return {
                success: true,
                message: "The user was successfully updated",
                user: result
            };
        },

        addDishUrl: async (_, { id, url }, { dataSources }) => {
            const result = dataSources.dishAPI.addDishUrl({ id, url });
            return {
                success: true,
                message: "the dish was updated successfully",
                dish: result
            };
        },
        signInUser: async (_, { username, password }, { dataSources }) => {
            let response = await dataSources.userAPI.signInUser({
                username,
                password
            });
            return {
                success: true,
                token: response.token,
                id: response.id
            };
        }
    }
};
