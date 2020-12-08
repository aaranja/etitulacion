import * as actionTypes from './../actions';

const example = {
    data: 'file',
    type: 'birth certificate / residence / certificate'
};

const initialState = [];

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_FILES:
            return state;
        case actionTypes.UPLOAD_FILE:
            let isNewFile = true;
            state = state.map(item => {
                if (item.type === action.file.type) {
                    isNewFile = false;
                    return action.file;
                }
                return item;
            });
            if (isNewFile)
                state.push(action.file);
            return state;
        default: return state;
    }
};

export default reducer;