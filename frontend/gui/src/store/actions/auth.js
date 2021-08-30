import * as actionTypes from "./actionTypes";
import axios from "axios";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, user_type, fullname) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    user_type: user_type,
    fullname: fullname,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("all_name");
  localStorage.removeItem("userID");
  localStorage.removeItem("user_type");
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const checkAuthTimeout = (expirationDate) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationDate * 1000);
  };
};

export const authLogin = (email, password) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post("http://127.0.0.1:8000/authenticate/", {
        email: email,
        password: password,
      })
      .then((res) => {
        const token = res.data.token;
        const user_id = res.data.user_id;
        const user_type = res.data.user_type;
        const fullname = res.data.fullname;

        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        /*console.log("login aceptado: ".concat(expirationDate));*/
        localStorage.setItem("token", token);
        localStorage.setItem("userID", user_id);
        localStorage.setItem("user_type", user_type);
        localStorage.setItem("fullname", fullname);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(authSuccess(token, user_type, fullname));
        dispatch(checkAuthTimeout(3600));
      })
      .catch((err) => {
        console.log("error");
        dispatch(authFail(err));
      });
  };
};

export const authSignUp = (
  email,
  first_name,
  last_name,
  password1,
  password2,
  enrollment,
  career,
  gender
) => {
  return (dispatch) => {
    dispatch(authStart());

    axios.defaults.headers = {
      "Content-Type": "application/json",
    };
    axios
      .post("http://127.0.0.1:8000/rest-auth/registration/", {
        email: email,
        first_name: first_name,
        last_name: last_name,
        user_type: "USER_GRADUATE",
        password1: password1,
        password2: password2,
        enrollment: enrollment,
        career: career,
        gender: gender,
      })
      .then((res) => {
        var user_type = "USER_GRADUATE";
        const token = res.data.key;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem("token", token);
        localStorage.setItem("expirationDate", expirationDate);
        dispatch(authSuccess(token, user_type, "null"));
        dispatch(checkAuthTimeout(3600));
      })
      .catch((err) => {
        dispatch(authFail(err));
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem("token");
    const user_type = localStorage.getItem("user_type");
    const fullname = localStorage.getItem("fullname");
    //console.log(token.concat("TESTT"));
    if (token === undefined) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem("expirationDate"));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const expirationTime = expirationDate.getTime() - new Date().getTime();
        const newDate = expirationTime / 1000;
        dispatch(authSuccess(token, user_type, fullname));
        dispatch(checkAuthTimeout(newDate));
      }
    }
  };
};
