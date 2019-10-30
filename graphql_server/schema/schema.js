const graphql = require('graphql');
const _ = require('lodash');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLID,
} = graphql;

var dishes = [
    {name: 'Risotto', cookingTime: '40 minutes', id: '1'},
    {name: 'Tacos', cookingTime: '20 minutes', id: '2'},
];

const DishType = new GraphQLObjectType({
    name: 'Dish',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        cookingTime: {type: GraphQLString},
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
    },
});

module.exports = new GraphQLSchema({
    query: RootQuery,
});
