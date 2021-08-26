import axios from "axios";
import * as actionTypes from "./actionTypes";
import { logout } from "./auth";

export const transactionStart = () => {
  return {
    type: actionTypes.TRANSACTION_START,
  };
};

export const transactionSuccess = (payload) => {
  return {
    type: actionTypes.TRANSACTION_SUCCESS,
    payload: payload,
  };
};

export const transactionFail = (error) => {
  return {
    type: actionTypes.TRANSACTION_FAIL,
    error: error,
  };
};

export const accountUpdate = (
  first_name,
  last_name,
  enrollment,
  career,
  gender,
  titulation_type
) => {
  return (dispatch) => {
    var token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(transactionStart());

      var account = { first_name: first_name, last_name: last_name };
      console.log(account);
    }
    axios.defaults.headers = {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    };
    axios
      .put(`http://127.0.0.1:8000/api/account/${enrollment}/`, {
        career: career,
        gender: gender,
        titulation_type: titulation_type,
        account: account,
      })
      .then((res) => {
        /*this return an object*/
        var nom =
          res.data.account["first_name"] + " " + res.data.account["last_name"];
        localStorage.setItem("all_name", nom);
        dispatch(transactionSuccess(res.data));
      })
      .catch((error) => {
        console.log("error");
        dispatch(transactionFail(error));
      });
  };
};

/* function to get all own account data: name, user type, enrollment, documents...*/
export const accountGetData = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(transactionStart());
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      axios
        .get("http://127.0.0.1:8000/api/account/")
        .then((response) => {
          /*dispatch all data*/
          /*this return an array*/
          dispatch(transactionSuccess(response.data[0]));
        })
        .catch((error) => {
          dispatch(transactionFail(error));
        });
    }
  };
};

/* function to get account data: name, user type, email and id*/
export const accountGetSession = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    const userID = localStorage.getItem("userID");
    if (token === undefined || userID === undefined) {
      dispatch(logout());
    } else {
      dispatch(transactionStart());
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      axios
        .get(`http://127.0.0.1:8000/api/${userID}`)
        .then((response) => {
          /*console.log(response.data);*/
          dispatch(transactionSuccess(response.data));
        })
        .catch((error) => {
          dispatch(transactionFail(error));
        });
    }
  };
};
