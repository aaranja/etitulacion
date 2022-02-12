import { updateObject } from "../utils";

import { ACTION_FAIL, ACTION_START, ACTION_SUCCESS } from "../actionTypes";

const initialState = {
  error: null,
  loading: false,
  payload: {},
};

const actionStart = (state, action) => {
  let { payload } = { ...state };
  let dataName = action.dataName;
  switch (action.action) {
    case "get":
      payload[dataName] = get_start();
      break;
    case "update":
      payload[dataName] = update_start(payload[dataName].data);
      break;
    case "delete":
      payload[dataName] = delete_start(payload[dataName]);
      break;
    default:
      return null;
  }
  return updateObject(state, {
    error: null,
    loading: true,
    payload: { ...payload },
  });
};

const actionSuccess = (state, action) => {
  let { payload } = { ...state };
  let dataName = action.dataName;
  let data = action.data;
  switch (action.action) {
    case "get":
      payload[dataName] = get_success(data);
      break;
    case "update":
      payload[dataName] = update_success(payload[dataName].data, data);
      break;
    case "delete":
      payload[dataName] = delete_success();
      break;
    default:
      return null;
  }
  return updateObject(state, {
    error: null,
    loading: false,
    payload: { ...payload },
  });
};

const actionFail = (state, action) => {
  let { payload } = { ...state };
  let dataName = action.dataName;
  switch (action.action) {
    case "get":
      payload[dataName] = get_failed;
      break;
    case "delete":
      payload[dataName] = delete_failed(payload[dataName].data);
      break;
    default:
      return null;
  }
  return updateObject(state, {
    error: action.error,
    loading: false,
    payload: { ...payload },
  });
};

const delete_start = (nameData) => {
  let data = null;
  if (nameData !== undefined) {
    data = nameData.data;
  }
  return {
    data: data,
    status: "loading",
    action: "delete",
  };
};

const delete_success = () => {
  return {
    data: null,
    status: "success",
    action: "delete",
  };
};

const delete_failed = (data) => {
  return {
    data: data,
    status: "failed",
    action: "delete",
  };
};

const update_start = (data) => {
  return {
    data: data,
    status: "loading",
    action: "update",
  };
};

const update_success = (oldData, newData) => {
  // console.log("pasa por aqui", oldData);
  let old_data = { ...oldData };

  let saved = newData["saved"];
  let data = old_data["graduateList"];

  for (let index in saved) {
    let i = data.findIndex((item) => saved[index].key === item.key);
    if (i !== -1) {
      data[i] = saved[index];
    } else {
      data.push(saved[index]);
    }
  }

  let deleted = newData["deleted"];
  if (deleted !== undefined) {
    for (let index in deleted) {
      // console.log("borrados ", deleted);
      // console.log("index: ", index);

      let i = data.findIndex((item) => deleted[index] === item.enrollment);
      if (i !== -1) {
        data.pop(i);
      }
    }
  }
  // console.log("datos: ", data);
  let allData = {
    date: newData["date"],
    graduateList: [...data],
  };

  return {
    data: allData,
    status: "success",
    action: "update",
  };
};

// const update_fail = (data) => {
//   return {
//     data: data,
//     status: "failed",
//     action: "update",
//   };
// };

const get_start = () => {
  return {
    status: "loading",
    data: [],
    action: "get",
  };
};

const get_success = (newData) => {
  return {
    status: "success",
    data: newData,
    action: "get",
  };
};

const get_failed = {
  status: "failed",
  data: [],
  action: "get",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION_START:
      return actionStart(state, action);
    case ACTION_SUCCESS:
      return actionSuccess(state, action);
    case ACTION_FAIL:
      return actionFail(state, action);
    default:
      return state;
  }
};

export default reducer;
