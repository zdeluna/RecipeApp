import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GET_DISHES } from "../../api/queries/dish/getAllDishes";
import { useDispatch } from "react-redux";
import { useQuery } from "@apollo/react-hooks";

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
        dishesLoading(state, action) {
            state.status = "loading";
        },
        dishesLoaded(state, action) {
            state.status = "loaded";
            console.log("loading dishes");
            console.log(action.payload);
            state.entities = action.payload;
        }
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

export const { dishesLoading } = dishesSlice.actions;

export default dishesSlice.reducer;
