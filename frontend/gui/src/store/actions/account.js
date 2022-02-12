import axios from "axios";
import * as actionTypes from "../actionTypes";
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

/* function to get all own account data: name, user type, enrollment, documents...*/
export const accountGetData = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(transactionStart());
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      await axios
        .get("http://127.0.0.1:8000/graduate/profile/")
        .then((response) => {
          /*dispatch all data*/
          /*this return an OBJECT*/
          dispatch(transactionSuccess(response.data));
        })
        .catch((error) => {
          dispatch(transactionFail(error));
        });
    }
  };
};

export const accountUpdate = (values) => {
  return async (dispatch) => {
    let token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(transactionStart());
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      await axios
        .put(`http://127.0.0.1:8000/graduate/profile/`, {
          values,
        })
        .then((response) => {
          /*this return an object*/
          console.log(response.data);
          dispatch(transactionSuccess(response.data));
        })
        .catch((error) => {
          dispatch(transactionFail(error));
        });
    }
  };
};

export const accountStatusUpdate = (status) => {
  return async (dispatch) => {
    let token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(transactionStart());
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      await axios
        .put(`http://127.0.0.1:8000/graduate/profile/status/`, {
          status: status,
        })
        .then((response) => {
          /*this return an object*/
          dispatch(transactionSuccess(response.data));
        })
        .catch((error) => {
          dispatch(transactionFail(error));
        });
    }
  };
};

export const getDocumentFile = (keyName) => {
  /* get a graduate document by the keyName doc */
  return async (dispatch) => {
    let token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(transactionStart());
      await axios({
        method: "get",
        Authorization: `Token ${token}`,
        url: `http://127.0.0.1:8000/graduate/profile/documents/${keyName}/`,
        responseType: "arraybuffer",
        responseEncoding: "binary",
      })
        .then((response) => {
          console.log(response);
          dispatch(
            transactionSuccess({
              document: { data: response.data, keyName: keyName },
            })
          );
        })
        .catch((error) => {
          dispatch(transactionFail(error));
        });
    }
  };
};

export const accountUploadDocument = (metadata, file, update_type) => {
  /*
   * Function to upload or remove a graduate document
   * metadata: the metadata about the pdf file
   * mile: the pdf file
   * update_type: the type of request, upload or removed
   * */
  return async (dispatch) => {
    let token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(transactionStart());
      let formData = new FormData();
      let jsonData = JSON.stringify(metadata);
      if (update_type === "uploading") {
        formData.append("file", file);
      } else {
        formData.append("file", null);
      }
      formData.append("update_type", update_type);
      formData.append("data", jsonData);
      await axios
        .put(`http://127.0.0.1:8000/graduate/profile/documents/`, formData, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-type": "multipart/form-data",
          },
        })
        .then((response) => {
          dispatch(transactionSuccess(response.data));
        })
        .catch((error) => {
          dispatch(transactionFail(error));
        });
    }
  };
};

export const accountProcedureHistory = (type, data) => {
  /*
   * Function to get the graduated procedure history, to show it in procedure step
   * */

  return async (dispatch) => {
    let token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(transactionStart());
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };

      if (type === "get") {
        await axios
          .get(`http://127.0.0.1:8000/graduate/profile/procedure/history/`)
          .then((response) => {
            console.log(response);
            /*this return an object*/
            dispatch(transactionSuccess(response.data));
          })
          .catch((error) => {
            dispatch(transactionFail(error));
          });
      } else {
        await axios
          .put(`http://127.0.0.1:8000/graduate/profile/procedure/history/`, {
            data: data,
          })
          .then((response) => {
            console.log(response);
            /*this return an object*/
            dispatch(transactionSuccess(response.data));
          })
          .catch((error) => {
            dispatch(transactionFail(error));
          });
      }
    }
  };
};

export const accountProcedureStep = (type, message) => {
  return async (dispatch) => {
    let token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(transactionStart());
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      await axios
        .put(`http://127.0.0.1:8000/graduate/profile/procedure/history/`, {
          type: type,
          data: message,
        })
        .then((response) => {
          console.log(response);
          /*this return an object*/
          dispatch(transactionSuccess(response.data));
        })
        .catch((error) => {
          dispatch(transactionFail(error));
        });
    }
  };
};

export const accountGetNotifications = () => {
  return async (dispatch) => {
    let token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(transactionStart());
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      await axios
        .get(`http://127.0.0.1:8000/graduate/notifications/`)
        .then((response) => {
          /*this return an object*/
          dispatch(transactionSuccess(response.data));
        })
        .catch((error) => {
          dispatch(transactionFail(error));
        });
    }
  };
};

export const accountGetARPInfo = () => {
  return async (dispatch) => {
    let token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(transactionStart());
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      await axios
        .get(`http://127.0.0.1:8000/graduate/profile/arp-info/`)
        .then((response) => {
          /*this return an object*/
          dispatch(transactionSuccess(response.data));
        })
        .catch((error) => {
          dispatch(transactionFail(error));
        });
    }
  };
};
