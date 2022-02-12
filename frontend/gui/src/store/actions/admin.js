import axios from "axios";
import * as actionTypes from "../actionTypes";
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

export const getAccountDetails = (type) => {
  return (dispatch) => {
    let token = localStorage.getItem("token");
    let user_type = localStorage.getItem("user_type");
    if (token === undefined || user_type !== "USER_ADMIN") {
      dispatch(logout());
    } else {
      dispatch(transactionStart());
      axios
        .get(`http://127.0.0.1:8000/admin/site/account-details/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          params: { type: type },
        })
        .then((res) => {
          dispatch(transactionSuccess({ accounts: res.data }));
        })
        .catch((error) => {
          dispatch(transactionFail(error));
        });
    }
  };
};

export const staffRegister = (values, type) => {
  return (dispatch) => {
    let token = localStorage.getItem("token");
    let user_type = localStorage.getItem("user_type");
    if (token === undefined || user_type !== "USER_ADMIN") {
      dispatch(logout());
    } else {
      dispatch(transactionStart());
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      axios
        .post(`http://127.0.0.1:8000/account/staff-register/`, {
          account: values,
          register_type: type,
        })
        .then((res) => {
          dispatch(transactionSuccess({ account: res.status }));
        })
        .catch((error) => {
          // get response to get de data.message with the errors
          error.type = "register_failed";
          dispatch(transactionFail(error));
        });
    }
  };
};
