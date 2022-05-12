import {combineReducers} from "@reduxjs/toolkit";
import {default as authReducer} from "./reducers/auth"
import {auth} from "./services/auth";

const appReducer = combineReducers({
    auth: authReducer,
    [auth.reducerPath]: auth.reducer
});

const rootReducer = (state, action) => {
    return appReducer(state, action);
};

export default rootReducer;
