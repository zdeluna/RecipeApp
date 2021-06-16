import { configureStore } from "@reduxjs/toolkit";

import dishesReducer from "./features/dishes/dishesSlice";

const store = configureStore({
    reducer: {
        dishes: dishesReducer
    }
});

export default store;
