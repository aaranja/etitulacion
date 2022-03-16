import axios from "axios";
import {logout} from "./auth";
import * as actionTypes from "../actionTypes";
import {url} from "../urls";

export const actionStart = () => {
    return {
        type: actionTypes.SERVERDATA_START,
    };
};

export const actionSuccess = (payload) => {
    return {
        type: actionTypes.SERVERDATA_SUCCESS,
        payload: payload,
    };
};

export const actionFail = (error) => {
    return {
        type: actionTypes.SERVERDATA_FAIL,
        error: error,
    };
};

const actionReset = (resetType) => {
    return {
        type: actionTypes.SERVERDATA_RESET,
        resetType: resetType,
    };
};

export const resetData = (type) => {
    // remove serverdata
    return (dispatch) => {
        dispatch(actionReset(type));
    };
};

export const processGetTitulationTypes = () => {
    /*
     * Function to get all titulation types
     */
    return (dispatch) => {
        let token = localStorage.getItem("token");
        if (token === undefined) {
            dispatch(logout());
        } else {
            dispatch(actionStart());
            axios.defaults.headers = {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            };
            axios
                .get(`${url}/api/process/4/titulation/types/`)
                .then((response) => {
                    dispatch(actionSuccess({titulations: response.data}));
                })
                .catch((error) => {
                    dispatch(actionFail(error));
                });
        }
    };
};

export const getDocumentsMetadata = (type) => {
    /*
     * Function to get all documents metadata to dossier process step
     * */
    return (dispatch) => {
        let token = localStorage.getItem("token");
        if (token === undefined) {
            dispatch(logout());
        } else {
            dispatch(actionStart());
            axios.defaults.headers = {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`,
            };
            axios
                .post(`${url}/api/procedure/documents-metadata/`, {
                    type: type,
                })
                .then((response) => {
                    dispatch(actionSuccess({documents: response.data}));
                })
                .catch((error) => {
                    dispatch(actionFail(error));
                });
        }
    };
};

export const getSignatureSettings = () => {
    /*
     * Get multiples files to init signature settings of user services
     * */
    return async (dispatch) => {
        let token = localStorage.getItem("token");
        if (token === undefined) {
            dispatch(logout());
        } else {
            await getFile(dispatch, "signature", token);
            await getFile(dispatch, "seal", token);
        }
    };
};

const getFile = async (dispatch, id, token) => {
    dispatch(actionStart());
    await axios({
        method: "get",
        Accept: "application/json",
        Authorization: `Token ${token}`,
        url: `${url}/staff/services/settings/signature/${id}/`,
        responseType: "blob",
    })
        .then((response) => {
            let settingsfiles = {};
            settingsfiles[id] = response.data;
            dispatch(actionSuccess({...settingsfiles}));
        })
        .catch((error) => {
            dispatch(actionFail(error));
        });
};

export const getSignaturePreview = () => {
    /* get the cni preview to see the signature and seal on document generation */
    return async (dispatch) => {
        let token = localStorage.getItem("token");
        if (token === undefined) {
            dispatch(logout());
        } else {
            dispatch(actionStart());
            await axios({
                method: "get",
                Authorization: `Token ${token}`,
                url: `${url}/staff/services/settings/signature/preview-cni/`,
                responseType: "arraybuffer",
                responseEncoding: "binary",
            })
                .then((response) => {
                    dispatch(
                        actionSuccess({
                            previewCNI: {data: response.data},
                        })
                    );
                })
                .catch((error) => {
                    dispatch(actionFail(error));
                });
        }
    };
};
