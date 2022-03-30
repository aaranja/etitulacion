import axios from "axios";
import {
  GET_DATA_FAIL,
  GET_DATA_SUCCESS,
  GET_DATA_START,
  RESET_DATA,
  UPDATE_DATA_SUCCESS,
  CREATE_DATA_SUCCESS,
  DELETE_DATA_SUCCESS,
  ACTION_START,
  ACTION_SUCCESS,
  ACTION_FAIL,
} from "../actionTypes";
import { isLogged } from "../utils";
import { logout } from "./auth";
import {
  transactionFail,
  transactionStart,
  transactionSuccess,
} from "./account";
import { url } from "../urls";

const actionStart = () => {
  return {
    type: GET_DATA_START,
  };
};

const actionSuccess = (payload) => {
  return {
    type: GET_DATA_SUCCESS,
    payload: payload,
  };
};

const actionUpdate = (payload) => {
  return {
    type: UPDATE_DATA_SUCCESS,
    payload: payload,
  };
};

const actionCreate = (payload) => {
  return {
    type: CREATE_DATA_SUCCESS,
    payload: payload,
  };
};

const actionDelete = (payload) => {
  return {
    type: DELETE_DATA_SUCCESS,
    payload: payload,
  };
};

const actionFail = (error) => {
  return {
    type: GET_DATA_FAIL,
    error: error,
  };
};

const actionReset = (resetType) => {
  return {
    type: RESET_DATA,
    resetType: resetType,
  };
};

const staffActionStart = (name, action) => {
  return {
    type: ACTION_START,
    dataName: name,
    action: action,
  };
};

const staffActionSuccess = (name, action, data) => {
  return {
    type: ACTION_SUCCESS,
    dataName: name,
    action: action,
    data: data,
  };
};
const staffActionFail = (name, action, error) => {
  return {
    type: ACTION_FAIL,
    dataName: name,
    action: action,
    error: error,
  };
};

export const getGraduateList = () => {
  return async (dispatch) => {
    let token = localStorage.getItem("token");
    if (isLogged(token)) {
      dispatch(actionStart());
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      await axios
        .get(`${url}/staff/graduate-list/`)
        .then((response) => {
          dispatch(actionSuccess({ tableData: response.data }));
        })
        .catch((error) => {
          dispatch(actionFail(error));
        });
    } else {
      dispatch(logout());
    }
  };
};

export const getFilteredList = (filters) => {
  /*
   * Get graduate filtered list
   * */
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(actionStart());
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      await axios
        .post(`${url}/staff/graduate-list/`, filters)
        .then((response) => {
          dispatch(actionSuccess({ tableData: response.data }));
        })
        .catch((error) => {
          dispatch(actionFail(error));
        });
    }
  };
};

export const resetData = (type) => {
  // remove certain data
  return (dispatch) => {
    dispatch(actionReset(type));
  };
};

export const getDocument = (enrollment, keyName) => {
  return async (dispatch) => {
    let token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(actionStart());
      await axios({
        method: "get",
        Authorization: `Token ${token}`,
        url: `${url}/staff/graduate-data/${enrollment}/documents/${keyName}/`,
        responseType: "arraybuffer",
        responseEncoding: "binary",
      })
        .then((response) => {
          dispatch(
            actionSuccess({
              document: { data: response.data, keyName: keyName },
            })
          );
        })
        .catch((error) => {
          dispatch(actionFail(error));
        });
    }
  };
};

export const setApproval = (enrollment, message, type) => {
  return async (dispatch) => {
    let token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(actionStart());
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      await axios
        .post(`${url}/staff/graduate-data/${enrollment}/`, {
          message: message,
          type: type,
        })
        .then((response) => {
          dispatch(actionSuccess({ graduate: response.data }));
        })
        .catch((error) => {
          dispatch(actionFail(error));
        });
    }
  };
};

export const getGraduate = (enrollment) => {
  return async (dispatch) => {
    let token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(actionStart());
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      await axios
        .get(`${url}/staff/graduate-data/${enrollment}/`)
        .then((response) => {
          dispatch(
            actionSuccess({
              graduate: response.data,
              loading: false,
            })
          );
        })
        .catch((error) => {
          dispatch(actionFail(error));
        });
    }
  };
};

export const getDocumentsDetails = (type) => {
  return async (dispatch) => {
    let token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(actionStart());
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      await axios
        .post(`${url}/api/procedure/documents-metadata/`, {
          type: type,
        })
        .then((response) => {
          dispatch(actionSuccess({ documents: response.data }));
        })
        .catch((error) => {
          dispatch(actionFail(error));
        });
    }
  };
};

export const uploadSignatureFiles = (data) => {
  return async (dispatch) => {
    let token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(actionStart());
      let formData = new FormData();
      let metadata = data.file.fileList[0];
      metadata.originFileObj = null;
      let jsonData = JSON.stringify(metadata);

      if (data.action_type === "upload") {
        formData.append("file", data.file.file);
      } else {
        formData.append("file", null);
      }

      formData.append("action_type", data.action_type);
      formData.append("type", data.type);
      formData.append("data", jsonData);

      await axios
        .put(`${url}/staff/services/settings/signature/`, formData, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-type": "multipart/form-data",
          },
        })
        .then((response) => {
          dispatch(actionSuccess(response.data));
        })
        .catch((error) => {
          dispatch(actionFail(error));
        });
    }
  };
};

export const getInstituteData = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      const name = "institute";
      const action = "get";
      dispatch(staffActionStart(name, action));
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      await axios
        .get(`${url}/api/settings/institute/`)
        .then((response) => {
          /*dispatch all data*/
          /*this return an OBJECT*/
          dispatch(staffActionSuccess(name, action, response.data));
        })
        .catch((error) => {
          dispatch(staffActionFail(name, action, error));
        });
    }
  };
};

export const updateInstituteData = (values) => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      const name = "institute";
      const action = "put";
      dispatch(staffActionStart(name, action));
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      await axios
        .patch(`${url}/api/settings/institute/`, values)
        .then((response) => {
          /*dispatch all data*/
          /*this return an OBJECT*/
          dispatch(staffActionSuccess(name, action, response.data));
        })
        .catch((error) => {
          dispatch(staffActionFail(name, action, error));
        });
    }
  };
};

export const getAccountDetails = () => {
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
        .get(`${url}/staff/services/settings/account-details/`)
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

export const createGroupDate = (values) => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(actionStart());
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      await axios
        .post(`${url}/staff/coordination/group-date/`, {
          groupDate: values,
        })
        .then((response) => {
          /*dispatch all data*/
          /*this return an OBJECT*/
          dispatch(actionSuccess(response.data));
        })
        .catch((error) => {
          dispatch(actionFail(error));
        });
    }
  };
};

export const updateGroupDate = (values) => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(actionStart());
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      await axios
        .patch(`${url}/staff/coordination/group-date/`, {
          groupDate: values,
        })
        .then((response) => {
          /*dispatch all data*/
          /*this return an OBJECT*/
          dispatch(actionSuccess(response.data));
        })
        .catch((error) => {
          dispatch(actionFail(error));
        });
    }
  };
};

export const deleteGroupDate = (values) => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(actionStart());
      await axios
        .delete(`${url}/staff/coordination/group-date/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          params: { id: values.id },
        })
        .then((response) => {
          /*dispatch all data*/
          /*this return an OBJECT*/
          dispatch(actionSuccess(response.data));
        })
        .catch((error) => {
          dispatch(actionFail(error));
        });
    }
  };
};

export const getDateGroup = (type) => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(actionStart());
      await axios
        .get(`${url}/staff/coordination/group-date/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          params: { type: type },
        })
        .then((res) => {
          dispatch(actionSuccess(res.data));
        })
        .catch((error) => {
          dispatch(actionFail(error));
        });
    }
  };
};

export const getARPGroup = (id) => {
  /* Function to get the arp group data to edit,
   *  or get the graduate data to make the arp group
   * */
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(staffActionStart("arpGroup", "get"));
      await axios
        .get(`${url}/staff/coordination/arp-group/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          params: { id: id },
        })
        .then((res) => {
          dispatch(staffActionSuccess("arpGroup", "get", res.data));
        })
        .catch((error) => {
          dispatch(staffActionFail("arpGroup", "get", error));
        });
    }
  };
};

export const createARPGroup = (id) => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(staffActionStart("arpGroup", "get"));
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      await axios
        .post(`${url}/staff/coordination/arp-group/`, {
          id: id,
        })
        .then((res) => {
          dispatch(staffActionSuccess("arpGroup", "get", res.data));
        })
        .catch((error) => {
          dispatch(actionFail("arpGroup", "get", error));
        });
    }
  };
};

export const saveARPGroup = (values) => {
  /* Function to save an update or create the arp group data
   * */
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(staffActionStart("arpGroup", "update"));
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      await axios
        .patch(`${url}/staff/coordination/arp-group/`, values)
        .then((res) => {
          dispatch(staffActionSuccess("arpGroup", "update", res.data));
        })
        .catch((error) => {
          dispatch(actionFail("arpGroup", "update", error));
        });
    }
  };
};

export const deleteARPGroup = (id) => {
  const name = "arpGroup";
  const action = "delete";
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(staffActionStart(name, action));
      await axios
        .delete(`${url}/staff/coordination/arp-group/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          params: { id: id },
        })
        .then((res) => {
          dispatch(staffActionSuccess(name, action, res.data));
        })
        .catch((error) => {
          dispatch(staffActionFail(name, action, error));
        });
    }
  };
};

export const getARPStaff = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(actionStart());
      await axios
        .get(`${url}/staff/coordination/arp-staff/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        })
        .then((res) => {
          dispatch(actionSuccess(res.data));
        })
        .catch((error) => {
          dispatch(actionFail(error));
        });
    }
  };
};

export const createARPStaff = (data) => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(actionStart());
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      await axios
        .post(`${url}/staff/coordination/arp-staff/`, {
          arpStaffData: data,
        })
        .then((res) => {
          dispatch(actionCreate(res.data));
        })
        .catch((error) => {
          dispatch(actionFail(error));
        });
    }
  };
};

export const updateARPStaff = (data) => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(actionStart());
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      await axios
        .patch(`${url}/staff/coordination/arp-staff/`, {
          arpStaffData: data,
        })
        .then((res) => {
          dispatch(actionUpdate(res.data));
        })
        .catch((error) => {
          dispatch(actionFail(error));
        });
    }
  };
};

export const deleteARPStaff = (data) => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(actionStart());
      await axios
        .delete(`${url}/staff/coordination/arp-staff/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          params: { key: data.key },
        })
        .then((res) => {
          dispatch(actionDelete(res.data));
        })
        .catch((error) => {
          dispatch(actionFail(error));
        });
    }
  };
};

export const getARPGroups = () => {
  /* Function to get the arp group data to edit,
   *  or get the graduate data to make the arp group
   * */
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(actionStart());
      await axios
        .get(`${url}/staff/coordination/arp-group/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          params: { id: "list" },
        })
        .then((res) => {
          // console.log(res.data);
          dispatch(actionSuccess(res.data));
        })
        .catch((error) => {
          dispatch(actionFail(error));
        });
    }
  };
};

export const getARPGroupsServices = () => {
  /* Function to get the arp group data to edit,
   *  or get the graduate data to make the arp group
   * */
  return async (dispatch) => {
    const name = "arpGroups";
    const action = "get";
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(staffActionStart(name, action));
      await axios
        .get(`${url}/staff/coordination/arp-group/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          params: { id: "list-services" },
        })
        .then((res) => {
          let data = res.data["arpGroups"];
          for (let index in data) {
            data[index].key = data[index].id;
          }
          dispatch(staffActionSuccess(name, action, data));
        })
        .catch((error) => {
          dispatch(staffActionFail(name, action, error));
        });
    }
  };
};

export const getAEPGroupsServices = (id) => {
  /* Function to get the arp group data to edit,
   *  or get the graduate data to make the arp group
   * */
  return async (dispatch) => {
    const name = "aepGroup";
    const action = "get";
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(staffActionStart(name, action));
      await axios
        .get(`${url}/staff/coordination/arp-group/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          params: { id: id },
        })
        .then((res) => {
          let data = res.data;
          // for (let index in data) {
          //   data[index].key = data[index].id;
          // }
          dispatch(staffActionSuccess(name, action, data));
        })
        .catch((error) => {
          dispatch(staffActionFail(name, action, error));
        });
    }
  };
};
export const getARPStaff2 = () => {
  return async (dispatch) => {
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      const name = "arpStaff";
      const action = "get";
      dispatch(staffActionStart(name, action));
      await axios
        .get(`${url}/staff/coordination/arp-staff/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        })
        .then((res) => {
          dispatch(staffActionSuccess(name, action, res.data));
        })
        .catch((error) => {
          dispatch(staffActionFail(name, action, error));
        });
    }
  };
};
export const getAEPGraduate = (enrollment) => {
  return async (dispatch) => {
    const name = "aepGraduate";
    const action = "get";
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(staffActionStart(name, action));
      await axios
        .get(`${url}/staff/services/aep-graduate/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          params: { enrollment: enrollment },
        })
        .then((res) => {
          let data = res.data;
          dispatch(staffActionSuccess(name, action, data));
        })
        .catch((error) => {
          dispatch(staffActionFail(name, action, error));
        });
    }
  };
};

export const generateAEP = (data) => {
  return async (dispatch) => {
    const name = "preAEP";
    const action = "get";
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(staffActionStart(name, action));
      await axios({
        method: "post",
        Authorization: `Token ${token}`,
        headers: {
          "Content-Type": "application/json",
        },
        url: `${url}/staff/services/aep-graduate/`,
        responseType: "arraybuffer",
        responseEncoding: "binary",
        data: { aepData: data },
      })
        .then((res) => {
          let resData = {
            preAEP: res.data,
          };
          dispatch(staffActionSuccess(name, action, resData));
        })
        .catch((error) => {
          dispatch(staffActionFail(name, action, error));
        });
    }
  };
};

export const uploadAEPFile = (file, metadata, enrollment) => {
  return async (dispatch) => {
    const name = "aepDocument";
    const action = "get";
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(staffActionStart(name, action));
      let formData = new FormData();
      let jsonData = JSON.stringify(metadata);
      formData.append("data", jsonData);
      formData.append("file", file);
      formData.append("graduate", enrollment);
      await axios
        .patch(`${url}/staff/services/aep-graduate/`, formData, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-type": "multipart/form-data",
          },
        })
        .then((response) => {
          dispatch(staffActionSuccess(name, action, response));
        })
        .catch((error) => {
          dispatch(staffActionFail(name, action, error));
        });
    }
  };
};

export const deleteAEPFile = (enrollment) => {
  return async (dispatch) => {
    const name = "aepDocument";
    const action = "delete";
    const token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(staffActionStart(name, action));
      await axios
        .delete(`${url}/staff/services/aep-graduate/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          params: { enrollment: enrollment },
        })
        .then((response) => {
          dispatch(staffActionSuccess(name, action, response));
        })
        .catch((error) => {
          dispatch(staffActionFail(name, action, error));
        });
    }
  };
};

export const setLiberation = (enrollment, type) => {
  return async (dispatch) => {
    let token = localStorage.getItem("token");
    if (token === undefined) {
      dispatch(logout());
    } else {
      dispatch(actionStart());
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      };
      await axios
        .patch(`${url}/staff/services/aep-liberation/`, {
          enrollment: enrollment,
          type: type,
        })
        .then((response) => {
          dispatch(actionSuccess({ graduate: response.data }));
        })
        .catch((error) => {
          dispatch(actionFail(error));
        });
    }
  };
};
