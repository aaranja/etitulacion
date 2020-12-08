import * as actionTypes from './../actions';

const initialState = {
    path:'/home',
    title:'Home',
    breadcrumb:''
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.WRITE_ACTUAL_PAGE:
            return {
                ...action.page,
            };
        case "d":
            return {
                ...state,
            };
        default: return state;
    }
};

export default reducer;