import { combineReducers } from "redux";
import { default as authReducer } from "./auth";
import { default as accountReducer } from "./account";

const rootReducer = combineReducers({
	auth: authReducer,
	account: accountReducer,
});

export default rootReducer;
