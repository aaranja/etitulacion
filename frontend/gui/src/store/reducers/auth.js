import {
    AUTH_START,
    AUTH_SUCCESS,
    AUTH_LOGOUT,
    AUTH_FAIL,
} from "../actionTypes";
import {updateObject} from "../utils";

const initialState = {
    payload: null,
    error: null,
    loading: false,
    status: null,
};

const authStart = (state) => {
    return updateObject(state, {
        error: null,
        loading: true,
        status: "loading",
    });
}

const authSuccess = (state, action) => {
    return updateObject(state, {
        payload: action.payload,
        error: null,
        loading: false,
        status: "success",
    });
};

const authFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false,
        status: "fail",
    });
};

const authLogout = (state) => {
    return updateObject(state, {
        payload: null,
        status: "session_expired",
    });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTH_START:
            return authStart(state);
        case AUTH_SUCCESS:
            return authSuccess(state, action);
        case AUTH_FAIL:
            return authFail(state, action);
        case AUTH_LOGOUT:
            return authLogout(state);
        default:
            return state;
    }
};

export default reducer;