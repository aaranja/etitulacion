import axios from "axios";
import * as actionTypes from "../actionTypes";
import { url } from "../urls";
import { logout } from "./auth";

export const transactionStart = () => {
  return {
    type: actionTypes.ADMIN_TRANSACTION_START,
  };
};

export const transactionSuccess = (payload) => {
  return {
    type: actionTypes.ADMIN_TRANSACTION_SUCCESS,
    payload: payload,
  };
};

export const transactionFail = (error) => {
  return {
    type: actionTypes.ADMIN_TRANSACTION_FAIL,
    error: error,
  };
};

const adminActionStart = (name, action) => {
  return {
    type: actionTypes.ADMIN_TRANSACTION_START,
    name: name,
    action: action,
  };
};

const adminActionSuccess = (name, action, data) => {
  return {
    type: actionTypes.ADMIN_TRANSACTION_SUCCESS,
    name: name,
    action: action,
    data: data,
  };
};

const adminActionFailure = (name, action, error) => {
  return {
    type: actionTypes.ADMIN_TRANSACTION_FAIL,
    name: name,
    action: action,
    error: error,
  };
};

export const getAccountDetails = (type) => {
  return async (dispatch) => {
    const name = "accounts";
    const action = "get";
    let token = localStorage.getItem("token");
    let user_type = localStorage.getItem("user_type");
    if (token === undefined || user_type !== "USER_ADMIN") {
      dispatch(logout());
    } else {
      dispatch(adminActionStart(name, action));
      setTimeout(() => {
        axios
          .get(`${url}/admin/site/account-details/`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            params: { type: type },
          })
          .then((res) => {
            dispatch(adminActionSuccess(name, action, res.data));
          })
          .catch((error) => {
            dispatch(transactionFail(error));
          });
      }, 500);
    }
  };
};

export const staffRegister = (values, type) => {
  const name = "accounts";
  const action = "create";
  return async (dispatch) => {
    let token = localStorage.getItem("token");
    let user_type = localStorage.getItem("user_type");
    if (token === undefined || user_type !== "USER_ADMIN") {
      dispatch(logout());
    } else {
      dispatch(adminActionStart(name, action));
      setTimeout(() => {
        axios.defaults.headers = {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        };
        axios
          .post(`${url}/authenticate/registration/staff/`, {
            account: values,
            register_type: type,
          })
          .then((res) => {
            dispatch(adminActionSuccess(name, action, res.data));
          })
          .catch((error) => {
            // get response to get de data.message with the errors
            dispatch(adminActionFailure(name, action, error));
          });
      }, 500);
    }
  };
};

export const deleteAccount = (id) => {
  const name = "accounts";
  const action = "delete";
  return async (dispatch) => {
    let token = localStorage.getItem("token");
    let user_type = localStorage.getItem("user_type");
    if (token === undefined || user_type !== "USER_ADMIN") {
      dispatch(logout());
    } else {
      dispatch(adminActionStart(name, action));
      setTimeout(() => {
        axios
          .delete(`${url}/admin/site/account-details/`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            params: { id: id },
          })
          .then((res) => {
            dispatch(adminActionSuccess(name, action, id));
          })
          .catch((error) => {
            // get response to get de data.message with the errors
            dispatch(transactionFail(error));
          });
      }, 500);
    }
  };
};

export const updateAccount = (data) => {
  const name = "accounts";
  const action = "update";
  return async (dispatch) => {
    let token = localStorage.getItem("token");
    let user_type = localStorage.getItem("user_type");
    if (token === undefined || user_type !== "USER_ADMIN") {
      dispatch(logout());
    } else {
      dispatch(adminActionStart(name, action));
      setTimeout(() => {
        axios
          .put(`${url}/admin/site/account-details/${data.id}/`, data, {
            headers: {
              Authorization: `Token ${token}`,
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            dispatch(adminActionSuccess(name, action, res.data));
          })
          .catch((error) => {
            // get response to get de data.message with the errors
            dispatch(transactionFail(error));
          });
      }, 500);
    }
  };
};
