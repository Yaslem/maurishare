import { configureStore } from '@reduxjs/toolkit'
import userReducer from "./slices/userSlice.js";
import postReducer from "./slices/postSlice.js";

const store = configureStore({
    reducer: {
        user: userReducer,
        post: postReducer,
    },
})
export default store;
