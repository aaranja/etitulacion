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

export const setNewStatus = (status) => {
	return (dispatch) => {
		var token = localStorage.getItem("token");
		if (token === undefined) {
			dispatch(logout());
		} else {
			dispatch(transactionTypes._Start());
			axios.defaults.headers = {
				"Content-Type": "application/json",
				Authorization: `Token ${token}`,
			};
			axios
				.put(`http://127.0.0.1:8000/api/graduate/profile/status/`, {
					status: status,
				})
				.then((response) => {
					dispatch(transactionTypes._Success(response.data));
				})
				.catch((error) => {
					console.log(error);
					// dispatch(transactionTypes._Fail(error));
				});
		}
	};
};

export const processStep2 = (status) => {
	return (dispatch) => {
		var token = localStorage.getItem("token");
		if (token === undefined) {
			dispatch(logout());
		} else {
			dispatch(transactionTypes._Start());
			axios.defaults.headers = {
				"Content-Type": "application/json",
				Authorization: `Token ${token}`,
			};
			axios
				.put(`http://127.0.0.1:8000/api/graduate/profile/status/`, {
					status: status,
				})
				.then((response) => {
					dispatch(transactionTypes._Success(response.data));
				})
				.catch((error) => {
					console.log(error);
					// dispatch(transactionTypes._Fail(error));
				});
		}
	};
};

export const processUploadDocument = (metadata, file, update_type) => {
	return async (dispatch) => {
		var token = localStorage.getItem("token");
		if (token === undefined) {
			dispatch(logout());
		} else {
			dispatch(transactionTypes.uploadStart());
			let formData = new FormData();
			var jsonData = JSON.stringify(metadata);
			if (update_type === "upload") {
				formData.append("file", file);
			} else {
				formData.append("file", null);
			}
			formData.append("update_type", update_type);
			formData.append("data", jsonData);
			await axios
				.put(
					`http://127.0.0.1:8000/api/process/2/upload/files/`,
					formData,
					{
						headers: {
							Authorization: `Token ${token}`,
							"Content-type": "multipart/form-data",
						},
					}
				)
				.then((response) => {
					// console.log(response);
					dispatch(transactionTypes.uploadSuccess(response));
				})
				.catch((error) => {
					console.log(error);
					dispatch(transactionTypes.uploadFail(error));
				});
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
					dispatch(transactionTypes.D_Success(response.data));
				})
				.catch((error) => {
					dispatch(transactionTypes.D_Fail(error));
				});
		}
	};
};

// get graduate status
export const getStatus = () => {
	return (dispatch) => {
		var token = localStorage.getItem("token");
		if (token === undefined) {
			dispatch(logout());
		} else {
			dispatch(transactionTypes._Start());
			axios.defaults.headers = {
				"Content-Type": "application/json",
				Authorization: `Token ${token}`,
			};
			axios
				.get(`http://127.0.0.1:8000/api/graduate/profile/status/`)
				.then((response) => {
					console.log(response);

					dispatch(transactionTypes._Success(response.data));
				})
				.catch((error) => {
					dispatch(transactionTypes._Fail(error));
				});
		}
	};
};
