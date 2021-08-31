import axios from "axios";
import * as actionTypes from "./actionTypes";
import { logout } from "./auth";

export const transactionStart = () => {
	return {
		type: actionTypes.TRANSACTION_START,
	};
};

export const transactionSuccess = (payload) => {
	return {
		type: actionTypes.TRANSACTION_SUCCESS,
		payload: payload,
	};
};

export const transactionFail = (error) => {
	return {
		type: actionTypes.TRANSACTION_FAIL,
		error: error,
	};
};

export const staffRegister = (values) => {
	return (dispatch) => {
		var token = localStorage.getItem("token");
		var user_type = localStorage.getItem("user_type");

		if (token === undefined || user_type !== "USER_ADMIN") {
			dispatch(logout());
		} else {
			axios.defaults.headers = {
				"Content-Type": "application/json",
				Authorization: `Token ${token}`,
			};
			axios
				.post(`http://127.0.0.1:8000/api/admin/register/staff/`, {
					email: values.email,
					first_name: values.first_name,
					last_name: values.last_name,
					user_type: values.user_type,
					password1: values.password1,
					password2: values.password2,
				})
				.then((res) => {
					console.log(res);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};
};
