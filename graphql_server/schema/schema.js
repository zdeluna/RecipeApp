const graphql = require('graphql');
const _ = require('lodash');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
} = graphql;

const User = require('../models/User');
const Dish = require('../models/Dish');

const DishType = new GraphQLObjectType({
    name: 'Dish',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        cookingTime: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.uid);
            },
        },
    }),
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLID},
        email: {type: GraphQLString},
        dishes: {
            type: new GraphQLList(DishType),
            resolve(parent, args) {
                return Dish.find({uid: parent.id});
            },
        },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        dish: {
            type: DishType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Dish.findById(args.id);
            },
        },
        dishes: {
            type: new GraphQLList(DishType),
            resolve(parent, args) {
                return Dish.find({});
            },
        },
        user: {
            type: UserType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Users.findById(args.id);
            },
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                return User.find({});
            },
        },
    },
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addUser: {
            type: UserType,
            args: {
                email: {type: GraphQLString},
            },

            resolve(parent, args) {
                let user = new User({
                    email: args.email,
                });
                return user.save();
            },
        },
        addDish: {
            type: DishType,
            args: {
                name: {type: GraphQLString},
                cookingTime: {type: GraphQLString},
                uid: {type: GraphQLID},
                category: {type: GraphQLString},
            },

            resolve(parent, args) {
                let dish = new Dish({
                    name: args.name,
                    cookingTime: args.cookingTime,
                    uid: args.uid,
                    category: args.category,
                });
                return dish.save();
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation,
});
