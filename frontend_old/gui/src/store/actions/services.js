import { url } from "../urls";
import axios from "axios";
import {
  SERVICES_START,
  SERVICES_SUCCESS,
  SERVICES_FAILURE,
} from "../actionTypes";
import { isAuthenticated, getToken, removeDataStorage } from "../utils";

export const onSignup = (values) => {
  return async (dispatch) => {
    const name = "register";
    const action = "post";
    dispatch(authStart(name, action));
    axios.defaults.headers = {
      "Content-Type": "application/json",
    };
    await axios
      .post(`${url}/rest-auth/registration/`, values)
      .then((res) => {
        removeDataStorage();
        dispatch(authSuccess(name, action, res.data));
      })
      .catch((error) => {
        dispatch(authFail(name, action, error));
      });
  };
};

export const sendEmailVerification = (values) => {
  return async (dispatch) => {
    const name = "econfirmation";
    const action = "post";
    dispatch(authStart(name, action));
    axios.defaults.headers = {
      "Content-Type": "application/json",
    };
    await axios
      .post(`${url}/account/authenticate/confirm-email/`, values)
      .then((res) => {
        dispatch(authSuccess(name, action, res.data));
      })
      .catch((error) => {
        dispatch(authFail(name, action, error));
      });
  };
};

export const authStart = (name, action) => {
  return {
    type: SERVICES_START,
    name: name,
    action: action,
  };
};

export const authSuccess = (name, action, data) => {
  return {
    type: SERVICES_SUCCESS,
    name: name,
    action: action,
    data: data,
  };
};

export const authFail = (name, action, error) => {
  return {
    type: SERVICES_FAILURE,
    name: name,
    action: action,
    error: error,
  };
};
