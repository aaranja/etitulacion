import { combineReducers } from "redux";
import { default as authReducer } from "../reducers/auth";
import { default as accountReducer } from "../reducers/account";
import { default as staffReducer } from "../reducers/staff";
import { default as serverReducer } from "../reducers/serverdata";
import { default as adminReducer } from "../reducers/admin";
import { default as newStaffReducer } from "../reducers/stafff";
import { default as servicesReducer } from "../reducers/services";

const appReducer = combineReducers({
  auth: authReducer,
  account: accountReducer,
  staff: staffReducer,
  serverdata: serverReducer,
  services: servicesReducer,
  admin: adminReducer,
  dataStaff: newStaffReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "AUTH_LOGOUT") {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
