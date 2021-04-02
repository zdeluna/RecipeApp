module.exports = {
    Query: {
        dish: (_, { id }, { dataSources }) =>
            dataSources.dishAPI.getDishById({ id }),
        dishes: (_, undefined, { dataSources }) => {
            return dataSources.dishAPI.getAllDishes();
        },
        user: (_, { id }, { dataSources }) => {
            return dataSources.userAPI.getUserById({ id });
        },
        ingredientsInSteps: (_, { steps, ingredients }, { dataSources }) => {
            return dataSources.dishAPI.getIngredientsWithSteps({
                steps,
                ingredients
            });
        }
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
        updatePartialDish: async (_, dishObject, { dataSources }) => {
            const result = await dataSources.dishAPI.updatePartialDish(
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
                jwt_token: response.jwt_token,
                jwt_token_expiry: response.jwt_token_expiry,
                id: response.id
            };
        },
        refreshToken: async (_, { accessToken }, { dataSources }) => {
            console.log("Access token: " + accessToken);
            let response = await dataSources.userAPI.refreshToken({
                accessToken
            });

            return {
                jwt_token: response.jwt_token,
                jwt_token_expiry: response.jwt_token_expiry
            };
        }
    }
};
