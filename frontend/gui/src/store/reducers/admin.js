import * as actionTypes from "../actionTypes";
import { updateObject } from "../utils";

const initialState = {
  error: null,
  loading: false,
  payload: null,
};

const actionStart = (state) => {
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
  let data = state.payload;
  if (data !== null) {
    /* update data with the new in action.payload */
    for (const key in action.payload) {
      data[key] = action.payload[key];
    }
  } else {
    /* return the new data */
    data = action.payload;
  }

  return updateObject(state, {
    error: null,
    loading: false,
    payload: data,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADMIN_TRANSACTION_START:
      return actionStart(state, action);
    case actionTypes.ADMIN_TRANSACTION_SUCCESS:
      return actionSuccess(state, action);
    case actionTypes.ADMIN_TRANSACTION_FAIL:
      return actionFail(state, action);
    default:
      return state;
  }
};

export default reducer;
