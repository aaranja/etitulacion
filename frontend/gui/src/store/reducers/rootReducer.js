import { combineReducers } from "redux";
import { default as authReducer } from "./auth";
import { default as accountReducer } from "./account";
import { default as dataReducer } from "./serv_data";
import { default as uploadReducer } from "./upload_documents";
import { default as staffReducer } from "./staff_services";

const appReducer = combineReducers({
	auth: authReducer,
	account: accountReducer,
	servdata: dataReducer,
	upload: uploadReducer,
	staff_services: staffReducer,
});

const rootReducer = (state, action) => {
	if (action.type === "AUTH_LOGOUT") {
		return appReducer(undefined, action);
	}
	return appReducer(state, action);
};

export default rootReducer;
