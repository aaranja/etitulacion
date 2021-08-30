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
	// load user data
	var data = state.payload;
	if (data !== null) {
		// if state.payload isn't null means the new action
		// is an update.
		// update data with the new data of action.payload
		for (const key in action.payload) {
			if (data[key] !== undefined) {
				data[key] = action.payload[key];
			}
		}
	} else {
		// if state.payload == null
		// is the first load of user data
		data = action.payload;
	}
	return updateObject(state, {
		error: null,
		loading: false,
		payload: data,
	});
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.TRANSACTION_START:
			return actionStart(state, action);
		case actionTypes.TRANSACTION_SUCCESS:
			return actionSuccess(state, action);
		case actionTypes.TRANSACTION_FAIL:
			return actionFail(state, action);
		default:
			return state;
	}
};

export default reducer;
