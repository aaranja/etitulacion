import axios from "axios";
import * as transactionTypes from "./transactionTypes";
import { logout } from "./auth";

/* step 1: validate information */
export const processStep1 = (values) => {
	return (dispatch) => {
		var token = localStorage.getItem("token");
		if (token === undefined) {
			dispatch(logout());
		} else {
			dispatch(transactionTypes._Start());
			var account = {
				first_name: values.first_name,
				last_name: values.last_name,
			};
			axios.defaults.headers = {
				"Content-Type": "application/json",
				Authorization: `Token ${token}`,
			};
			axios
				.put(
					`http://127.0.0.1:8000/api/process/1/${values.enrollment}/`,
					{
						career: values.career,
						gender: values.gender,
						titulation_type: values.titulation_type,
						account: account,
					}
				)
				.then((response) => {
					dispatch(transactionTypes._Success(response.data));
				})
				.catch((error) => {
					dispatch(transactionTypes._Fail(error));
				});
		}
	};
};

export const processStep2 = (values) => {
	return (dispatch) => {
		var token = localStorage.getItem("token");
		if (token === undefined) {
			dispatch(logout());
		} else {
			dispatch(transactionTypes._Start());
		}
	};
};

/* function to get all documents details to load metadata of process 2*/
export const processGetDocumentsDetails = () => {
	return (dispatch) => {
		var token = localStorage.getItem("token");
		if (token === undefined) {
			dispatch(logout());
		} else {
			dispatch(transactionTypes.D_Start());
			axios.defaults.headers = {
				"Content-Type": "application/json",
				Authorization: `Token ${token}`,
			};
			axios
				.get(
					`http://127.0.0.1:8000/api/process/2/documents/descriptions/`
				)
				.then((response) => {
					console.log(response.data);
					dispatch(transactionTypes.D_Success(response.data));
				})
				.catch((error) => {
					dispatch(transactionTypes.D_Fail(error));
				});
		}
	};
};
