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
					dispatch(transactionTypes.D_Success(response.data));
				})
				.catch((error) => {
					dispatch(transactionTypes.D_Fail(error));
				});
		}
	};
};
