import { combineReducers } from "redux";
import { default as authReducer } from "./auth";
import { default as accountReducer } from "./account";
import { default as dataReducer } from "./serv_data";
import { default as uploadReducer } from "./upload_documents";
const rootReducer = combineReducers({
	auth: authReducer,
	account: accountReducer,
	servdata: dataReducer,
	upload: uploadReducer,
});

export default rootReducer;
