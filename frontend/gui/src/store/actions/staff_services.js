import axios from "axios";
import * as transactionTypes from "./transactionTypes";
import { logout } from "./auth";

export const getGraduateList = () => {
	return async (dispatch) => {
		var token = localStorage.getItem("token");
		if (token === undefined) {
			dispatch(logout());
		} else {
			dispatch(transactionTypes.D_Start());
			axios.defaults.headers = {
				"Content-Type": "application/json",
				Authorization: `Token ${token}`,
			};
			await axios
				.get(`http://127.0.0.1:8000/api/staff/graduate-list/`)
				.then((response) => {
					dispatch(
						transactionTypes.D_Success({ tableData: response.data })
					);
				})
				.catch((error) => {
					dispatch(transactionTypes.D_Fail(error));
				});
		}
	};
};

// remove certain data
export const resetData = (type) => {
	return (dispatch) => {
		dispatch(transactionTypes.D_Reset(type));
	};
};

export const setApproval = (enrollment, message, type) => {
	return async (dispatch) => {
		var token = localStorage.getItem("token");
		if (token === undefined) {
			dispatch(logout());
		} else {
			dispatch(transactionTypes.D_Start());
			axios.defaults.headers = {
				"Content-Type": "application/json",
				Authorization: `Token ${token}`,
			};
			await axios
				.post(
					`http://127.0.0.1:8000/api/staff/graduate-data/${enrollment}/`,
					{
						message: message,
						type: type,
					}
				)
				.then((response) => {
					dispatch(
						transactionTypes.D_Success({ approval: response.data })
					);
				})
				.catch((error) => {
					dispatch(transactionTypes.D_Fail(error));
				});
		}
	};
};

export const getGraduate = (enrollment) => {
	return async (dispatch) => {
		var token = localStorage.getItem("token");
		if (token === undefined) {
			dispatch(logout());
		} else {
			dispatch(transactionTypes.D_Start());
			axios.defaults.headers = {
				"Content-Type": "application/json",
				Authorization: `Token ${token}`,
			};
			await axios
				.get(
					`http://127.0.0.1:8000/api/staff/graduate-data/${enrollment}/`
				)
				.then((response) => {
					dispatch(
						transactionTypes.D_Success({
							graduate: response.data,
							loading: false,
						})
					);
				})
				.catch((error) => {
					dispatch(transactionTypes.D_Fail(error));
				});
		}
	};
};

export const getDocumentsDetails = () => {
	return async (dispatch) => {
		var token = localStorage.getItem("token");
		if (token === undefined) {
			dispatch(logout());
		} else {
			dispatch(transactionTypes.D_Start());
			axios.defaults.headers = {
				"Content-Type": "application/json",
				Authorization: `Token ${token}`,
			};
			await axios
				.get(
					`http://127.0.0.1:8000/api/process/2/documents/descriptions/`
				)
				.then((response) => {
					dispatch(
						transactionTypes.D_Success({ documents: response.data })
					);
				})
				.catch((error) => {
					dispatch(transactionTypes.D_Fail(error));
				});
		}
	};
};
