import * as actionTypes from "./actionTypes";

export const _Start = () => {
	return {
		type: actionTypes.TRANSACTION_START,
	};
};

export const _Success = (payload) => {
	return {
		type: actionTypes.TRANSACTION_SUCCESS,
		payload: payload,
	};
};

export const _Fail = (error) => {
	return {
		type: actionTypes.TRANSACTION_FAIL,
		error: error,
	};
};

export const D_Start = () => {
	return {
		type: actionTypes.GET_DATA_START,
	};
};

export const D_Success = (payload) => {
	return {
		type: actionTypes.GET_DATA_SUCCESS,
		payload: payload,
	};
};

export const D_Fail = (error) => {
	return {
		type: actionTypes.GET_DATA_FAIL,
		error: error,
	};
};
