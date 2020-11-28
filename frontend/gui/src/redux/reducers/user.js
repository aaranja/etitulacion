import * as actionTypes from './../actions';

let jwt = require('jsonwebtoken');

// const initialState = localStorage.getItem('token') ? jwt.decode(localStorage.getItem('token')).user : [];
const initialState = [];

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.WRITE_USER:
            return {
                ...action.user,
            };
        case "d":
            return {
                ...state,
            };
        default:
            return state;
    }
};

export default reducer;