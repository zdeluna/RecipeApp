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

const usersAdapter = createEntityAdapter();

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
    userName: "",
    categories: [],
    isAuthenticated: false,
    jwt_token: "",
    jwt_token_expiry: ""
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        userLoaded(state, action) {
            console.log("user loaded");
            state.status = "loaded";

            state.userName = action.payload.userName;
            state.categories = action.payload.categories;
        },
        userAuthenticated(state, action) {
            if (action.payload.jwt_token) {
                state.jwt_token = action.payload.jwt_token;
                state.jwt_token_expiry = action.payload.jwt_token_expiry;
                state.isAuthenticated = true;
            }
        }
    }
});

export const { selectAll: selectDishes } = usersAdapter.getSelectors(
    state => state.dishes
);

//export const { addOneDish, dishDeleted } = usersSlice.actions;

export default usersSlice.reducer;
