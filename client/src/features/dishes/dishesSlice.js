import {
    createSlice,
    createAsyncThunk,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { GET_DISHES } from "../../api/queries/dish/getAllDishes";
import { ADD_DISH } from "../../api/mutations/dish/createDish";

import { useDispatch } from "react-redux";
import { useQuery } from "@apollo/react-hooks";
import { useMutation } from "@apollo/react-hooks";

const dishesAdapter = createEntityAdapter();

export const fetchDishes = createAsyncThunk(
    "dishes/fetchDishes",
    async (args, thunkAPI) => {
        console.log("in fetch dishes");

        useQuery(GET_DISHES, {
            onCompleted({ dishes }) {
                return thunkAPI.dispatch({
                    type: "dishes/dishesLoaded",
                    payload: dishes
                });
                console.log("loaded dishes");
                console.log(dishes);
            }
        });
    }
);

const initialState = {
    status: "idle",
    entities: []
};

const dishesSlice = createSlice({
    name: "dishes",
    initialState,
    reducers: {
        dishesLoaded(state, action) {
            state.status = "loaded";

            /* Convert array of dishes to object*/
            let entities = {};
            for (let i = 0; i < action.payload.length; i++) {
                entities[action.payload[i].id] = action.payload[i];
            }

            dishesAdapter.setAll(state, entities);
        },
        dishAdded(state, action) {
            console.log("dish added");
            console.log(action);
            state.entities.push(action.payload);
        },
        addOneDish: dishesAdapter.addOne,
        dishDeleted: dishesAdapter.removeOne
    }
    /* extraReducers: builder => {
        builder
            .addCase(fetchDishes.pending, (state, action) => {
                console.log("loading");
                state.status = "loading";
            })
            .addCase(fetchDishes.fulfilled, (state, action) => {
                console.log("fulfilled");
                state.status = "fulfilled";
                state.entities = ["dfdf"];
            });
    }*/
});

export const { selectAll: selectDishes } = dishesAdapter.getSelectors(
    state => state.dishes
);

export const { addOneDish, dishDeleted } = dishesSlice.actions;

export default dishesSlice.reducer;
