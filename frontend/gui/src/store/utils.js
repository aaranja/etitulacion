import { AUTH_LOGOUT } from "./actionTypes";

export const updateObject = (oldObject, updateProperties) => {
  return {
    ...oldObject,
    ...updateProperties,
  };
};

export const isLogged = (token) => {
  return token !== undefined;
};

export const getToken = () => localStorage.getItem("token");

export const isAuthenticated = (dispatch, token) => {
  if (token === undefined) {
    removeDataStorage();
    dispatch({ type: AUTH_LOGOUT });
    return false;
  }
  return true;
};

export const removeDataStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expirationDate");
  localStorage.removeItem("all_name");
  localStorage.removeItem("userID");
  localStorage.removeItem("user_type");
};
