import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
	error: null,
	loading: false,
	payload: null,
};

const actionStart = (state, action) => {
	return updateObject(state, {
		error: null,
		loading: true,
	});
};

const actionFail = (state, action) => {
	return updateObject(state, {
		error: action.error,
		loading: false,
	});
};

const actionSuccess = (state, action) => {
	return updateObject(state, {
		error: null,
		loading: false,
		payload: action.payload,
	});
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.GET_DATA_START:
			return actionStart(state, action);
		case actionTypes.GET_DATA_SUCCESS:
			return actionSuccess(state, action);
		case actionTypes.GET_DATA_FAIL:
			return actionFail(state, action);
		default:
			return state;
	}
};

export default reducer;