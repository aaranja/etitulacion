import * as userTypes from "./userTypes";
export const documentsViewer = (graduatePK) => {
  return {
    data: "documents/",
    title: "Documentación",
    url: `/home/documents/${graduatePK}/`,
  };
};

export const staffHome = (user) => {
  const data = "home/";
  const url = "/home/";
  let title = "";
  if (user === userTypes.USER_SERVICES) title = "Home - Servicios escolares";
  else if (user === userTypes.USER_COORDINAT)
    title = "Home - Cordinación dce titulación";

  return {
    data: data,
    title: title,
    url: url,
  };
};
