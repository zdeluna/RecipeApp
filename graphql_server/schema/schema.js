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

var dishes = [
    {name: 'Risotto', cookingTime: '40 minutes', id: '1', uid: '1'},
    {name: 'Tacos', cookingTime: '20 minutes', id: '2', uid: '2'},
];

var users = [
    {email: 'zach.deluna@gmail.com', id: '1'},
    {email: 'usertest@gmail.com', id: '2'},
];

const DishType = new GraphQLObjectType({
    name: 'Dish',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        cookingTime: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return _.find(users, {id: parent.uid});
            },
        },
    }),
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: GraphQLID},
        email: {type: GraphQLString},
    }),
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        dish: {
            type: DishType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return _.find(dishes, {id: args.id});
            },
        },
        dishes: {
            type: new GraphQLList(DishType),
            resolve(parent, args) {
                return dishes;
            },
        },
        user: {
            type: UserType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return _.find(users, {id: args.id});
            },
        },
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
});
