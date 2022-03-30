import * as actionTypes from "../actionTypes";
import { updateObject } from "../utils";

const initialState = {
  error: null,
  loading: false,
  payload: {},
};

const actionStart = (state, action) => {
  // update state with start status in specific payload action
  let { payload } = { ...state };
  let name = action.name;
  let data = action.action === "get" ? [] : payload[name].data;
  payload[name] = start(action.action, data);
  return updateObject(state, {
    error: null,
    loading: false,
    payload: { ...payload },
  });
};

const start = (name, data) => {
  // payload start structure
  return {
    status: "loading",
    data: data,
    action: name,
    error: null,
  };
};

const actionSuccess = (state, action) => {
  // update state with success response in specific payload action
  let { payload } = { ...state };
  let name = action.name;
  payload[name] = success(action.action, action.data, payload[name].data);
  return updateObject(state, {
    error: null,
    loading: false,
    payload: { ...payload },
  });
};

const success = (action, newData, prevData) => {
  // build payload success structure in different action types
  let status = "success";
  let data;
  switch (action) {
    case "get":
      data = newData;
      break;
    case "create":
      prevData.unshift(newData);
      data = prevData;
      break;
    case "delete":
      let index = prevData.findIndex((item) => newData === item.id);
      if (index !== -1) {
        prevData.splice(index, 1);
      }
      data = prevData;
      break;
    case "update":
      let ind = prevData.findIndex((item) => newData.id === item.id);
      if (ind !== -1) {
        prevData[ind] = newData;
      }
      data = prevData;
      break;
    default:
      data = null;
  }

  return { status: status, data: data, action: action, error: null };
};

const actionFailure = (state, action) => {
  // update state with failure response in specific payload action
  let { payload } = { ...state };
  let name = action.name;
  payload[name] = failure(action.action, payload[name].data, action.error);
  return updateObject(state, {
    error: null,
    loading: false,
    payload: { ...payload },
  });
};

const failure = (action, prevData, error) => {
  // payload failure structure (object)
  return { status: "failure", data: prevData, action: action, error: error };
};

const reducer = (state = initialState, action) => {
  // action types reducer to update state by response
  switch (action.type) {
    case actionTypes.ADMIN_TRANSACTION_START:
      return actionStart(state, action);
    case actionTypes.ADMIN_TRANSACTION_SUCCESS:
      return actionSuccess(state, action);
    case actionTypes.ADMIN_TRANSACTION_FAIL:
      return actionFailure(state, action);
    default:
      return state;
  }
};

export default reducer;
