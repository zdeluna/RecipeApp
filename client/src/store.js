import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";
import { combineReducers } from "redux";

import dishesReducer from "./features/dishes/dishesSlice";
import usersReducer from "./features/users/usersSlice";

const reducers = combineReducers({
    dishes: dishesReducer,
    users: usersReducer
});

const rootReducer = (state, action) => {
    if (action.type === "LOGOUT") {
        storage.removeItem("persist:root");
        return reducers(undefined, action);
    }

    return reducers(state, action);
};

const persistConfig = {
    key: "root",
    storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer
});

export default store;
