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

const actionUpdate = (state, action) => {
  let data = { ...state.payload };
  let toUpdate = action.payload.updated;
  for (let index in toUpdate) {
    let listUpdate = toUpdate[index];
    for (let j in listUpdate) {
      for (let i in state.payload[index]) {
        if (state.payload[index][i].key === listUpdate[j].key) {
          data[index][i] = listUpdate[j];
          break;
        }
      }
    }
  }
  return updateObject(state, {
    error: null,
    loading: false,
    payload: data,
  });
};

const actionCreate = (state, action) => {
  let data = { ...state.payload };
  let toUpdate = action.payload.create;
  for (let index in toUpdate) {
    let listUpdate = toUpdate[index];
    for (let j in listUpdate) {
      console.log(listUpdate[j]);
      data[index].push(listUpdate[j]);
    }
  }
  return updateObject(state, {
    error: null,
    loading: false,
    payload: data,
  });
};

const actionDelete = (state, action) => {
  let data = { ...state.payload };
  let toUpdate = action.payload.delete;
  for (let index in toUpdate) {
    let listUpdate = toUpdate[index];
    for (let j in listUpdate) {
      for (let i in data[index]) {
        if (data[index][i].key.toString() === listUpdate[j].toString()) {
          data[index].splice(i, 1);
          console.log(data);
          break;
        }
      }
    }
  }
  return updateObject(state, {
    error: null,
    loading: false,
    payload: data,
  });
};

const actionReset = (state, action) => {
  if (state.payload !== null) {
    state.payload[action.resetType] = null;
  }
  return updateObject(state, {
    error: null,
    loading: false,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_DATA_START:
      return actionStart(state, action);
    case actionTypes.GET_DATA_SUCCESS:
      return actionSuccess(state, action);
    case actionTypes.UPDATE_DATA_SUCCESS:
      return actionUpdate(state, action);
    case actionTypes.CREATE_DATA_SUCCESS:
      return actionCreate(state, action);
    case actionTypes.DELETE_DATA_SUCCESS:
      return actionDelete(state, action);
    case actionTypes.GET_DATA_FAIL:
      return actionFail(state, action);
    case actionTypes.RESET_DATA:
      return actionReset(state, action);
    default:
      return state;
  }
};

export default reducer;
