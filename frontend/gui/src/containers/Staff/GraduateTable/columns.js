import careerTypes from "../../../site/collections/careerTypes";
import * as userTypes from "../../../site/collections/userTypes";
import * as graduate_state from "../utils";
/* default columns data */
const data = {
  enrollment: {
    title: "No. control",
    dataIndex: "enrollment",
    width: "10%",
  },
  first_name: {
    title: "Nombre",
    dataIndex: "first_name",
    width: "20%",
  },
  last_name: {
    title: "Apellidos",
    dataIndex: "last_name",
    width: "30%",
  },
  career: {
    title: "Carrera",
    dataIndex: "career",
    width: "20%",
    render: (text) => {
      return careerTypes[text];
    },
  },
};

/* custom user data*/
const serviceData = {
  status: {
    title: "Estatus",
    dataIndex: "status",
    width: "10%",
    render: (text) => {
      return graduate_state.status_tag_services(text);
    },
  },
  progress: {
    title: "Progreso",
    dataIndex: "progress",
    width: "10%",
    render: (text, { status }) => {
      return graduate_state.status_progress_services(status);
    },
  },
};

const coordinationData = {
  status: {
    title: "Estatus",
    dataIndex: "status",
    width: "10%",
    render: (text) => {
      return graduate_state.status_tag_coordination(text);
    },
  },
  progress: {
    title: "Progreso",
    dataIndex: "progress",
    width: "10%",
    render: (text, { status }) => {
      return graduate_state.status_progress_coordination(status);
    },
  },
};

export const columns = (user) => {
  let status;
  let progress;
  /* set custom status and documents config based on user */
  if (user === userTypes.USER_SERVICES) {
    status = serviceData.status;
    progress = serviceData.progress;
  } else if (user === userTypes.USER_COORDINAT) {
    status = coordinationData.status;
    progress = serviceData.progress;
  }

  /* return all columns*/
  return [
    data.enrollment,
    data.first_name,
    data.last_name,
    data.career,
    status,
    progress,
  ];
};

export default columns;
