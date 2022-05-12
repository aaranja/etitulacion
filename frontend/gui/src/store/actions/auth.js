import {
    AUTH_START,
    AUTH_SUCCESS,
    AUTH_FAIL,
    AUTH_LOGOUT
} from "../actionTypes";
import axios from "axios";
import {url} from "../url";
import {sleep} from "../utils";


export const authStart = () => {
    return {
        type: AUTH_START,
    };
};

export const authSuccess = (payload) => {
    return {
        type: AUTH_SUCCESS,
        payload: payload,
    };
};

export const authFail = (error) => {
    return {
        type: AUTH_FAIL,
        error: error,
    };
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("expirationDate");
    localStorage.removeItem("user_type");
    localStorage.removeItem("all_name");
    return {
        type: AUTH_LOGOUT,
    };
};

export const checkAuthTimeout = (expirationDate) => {
    return (dispatch) => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationDate * 1000);
    };
};


export const authSession = (email, password) => {
    return (dispatch) => {
        dispatch(authStart());
        axios
            .post(
                `${url}/authenticate/`,
                {
                    username: email,
                    password: password,
                },
                {
                    headers: {
                        "Accept-Language": "es-MX;",
                    },
                }
            )

            .then((res) => {
                const token = res.data.token;
                const user_type = res.data.user_type;
                const all_name = res.data.fullname;

                const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
                console.log("login aceptado: ".concat(expirationDate));
                localStorage.setItem("token", token);
                localStorage.setItem("expirationDate", expirationDate);
                localStorage.setItem("user_type", user_type);
                localStorage.setItem("all_name", all_name);
                dispatch(
                    authSuccess({token: token, usertype: user_type, name: all_name})
                );
                dispatch(checkAuthTimeout(3600));
            })
            .catch((err) => {
                let messages = {}
                if (err.code === "ERR_NETWORK") {
                    messages = {
                        non_field_errors: ["No se pudo localizar el servidor"],
                    }
                } else {
                    messages = err.response.data
                }
                dispatch(authFail(messages));
            });
    };
};

export const authCheckState = () => {
    return (dispatch) => {
        dispatch(authStart());
        const token = localStorage.getItem("token");
        const user_type = localStorage.getItem("user_type");
        const all_name = localStorage.getItem("all_name");
        if (token === undefined) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem("expirationDate"));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                // Usage!
                sleep(500).then(() => {
                    const expirationTime =
                        expirationDate.getTime() - new Date().getTime();
                    const newDate = expirationTime / 1000;
                    dispatch(
                        authSuccess({token: token, usertype: user_type, name: all_name})
                    );
                    dispatch(checkAuthTimeout(newDate));
                });
            }
        }
    };
};

export const authSignUp = (values) => {
    return (dispatch) => {
        dispatch(authStart());

        axios.defaults.headers = {
            "Content-Type": "application/json",
        };
        axios
            .post(`${url}/rest-auth/registration/`, values)
            .then((res) => {
                localStorage.removeItem("token");
                localStorage.removeItem("expirationDate");
                localStorage.removeItem("all_name");
                localStorage.removeItem("userID");
                localStorage.removeItem("user_type");
                const token = res.data.key;
                const user_type = res.data.user_type;
                const all_name = res.data.all_name;

                const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
                localStorage.setItem("token", token);
                localStorage.setItem("expirationDate", expirationDate);
                localStorage.setItem("user_type", user_type);
                localStorage.setItem("all_name", all_name);
                console.log("datos", res.data);
                dispatch(
                    authSuccess({
                        token: token,
                        usertype: user_type,
                        name: all_name,
                        email_confirmed: res.data.email_confirmed,
                    })
                );
                dispatch(checkAuthTimeout(3600));
            })
            .catch((error) => {
                dispatch(authFail(error));
            });
    };
};