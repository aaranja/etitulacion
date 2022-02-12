import * as actionTypes from "../actionTypes";
import { updateObject } from "../utils";

const initialState = {
  error: null,
  loading: false,
  payload: null,
};

const actionStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
  });
};

const actionFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const actionSuccess = (state, action) => {
  let data = null;
  if (state.payload !== null) {
    data = state.payload;

    for (const key in action.payload) {
      if (data[key] !== undefined) {
        data[key] = action.payload[key];
      } else {
        data[key] = action.payload[key];
      }
    }
  } else {
    data = action.payload;
  }

  return updateObject(state, {
    error: null,
    loading: false,
    payload: data,
  });
};

const actionReset = (state, action) => {
  if (state.payload !== null) {
    if (action.resetType === "all") {
      state.payload = null;
    } else {
      state.payload[action.resetType] = null;
    }
  }
  return updateObject(state, {
    error: null,
    loading: false,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SERVERDATA_START:
      return actionStart(state, action);
    case actionTypes.SERVERDATA_SUCCESS:
      return actionSuccess(state, action);
    case actionTypes.SERVERDATA_FAIL:
      return actionFail(state, action);
    case actionTypes.SERVERDATA_RESET:
      return actionReset(state, action);
    default:
      return state;
  }
};

export default reducer;
