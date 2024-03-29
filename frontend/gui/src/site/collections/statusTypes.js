const status = {
  STATUS_00: {
    key: 0,
    code: "STATUS_00",
    info: "INFORMATION_PROCESS",
    status: "default",
    percent: 0,
    view: 0,
  },
  STATUS_01: {
    key: 1,
    code: "STATUS_01",
    info: "DOCUMENTATION_PROCESS",
    status: "default",
    percent: 0,
    view: 1,
  },
  STATUS_02: {
    key: 2,
    code: "STATUS_02",
    info: "APPROVAL_WAIT",
    custom_info: "En espera",
    status: "default",
    percent: 1,
    view: 2,
  },
  STATUS_03: {
    key: 2,
    code: "STATUS_03",
    info: "APPROVAL_WAIT_PROCESSING",
    custom_info: "Por revisar",
    status: "processing",
    percent: 2,
    view: 2,
  },
  STATUS_04: {
    key: 2,
    code: "STATUS_04",
    info: "SERVICES_APPROVAL_PROCESSING",
    custom_info: "Por revisar",
    status: "processing",
    percent: 2,
    view: 2,
  },
  STATUS_05: {
    key: 2,
    code: "STATUS_05",
    info: "SERVICES_APPROVAL_ERROR",
    custom_info: "Error",
    status: "error",
    percent: 2,
    view: 2,
  },
  STATUS_06: {
    key: 2,
    code: "STATUS_06",
    info: "SERVICES_APPROVAL_SUCCESS",
    custom_info: "Exitoso",
    status: "success",
    percent: 2,
    view: 2,
  },
  STATUS_07: {
    key: 2,
    code: "STATUS_07",
    info: "COORDINATION_APPROVAL_PROCESSING",
    status: "processing",
    percent: 3,
    view: 2,
  },
  STATUS_08: {
    key: 2,
    code: "STATUS_08",
    info: "COORDINATION_APPROVAL_ERROR",
    status: "error",
    percent: 4,
    view: 2,
  },
  STATUS_09: {
    key: 2,
    next: true,
    code: "STATUS_09",
    info: "COORDINATION_APPROVAL_SUCCESS",
    status: "success",
    percent: 6,
    view: 3,
  },
  STATUS_10: {
    key: 3,
    code: "STATUS_10",
    info: "INAUGURATION_DATE_UNSETTLED",
    status: "default",
    percent: 6,
    view: 3,
  },
  STATUS_11: {
    key: 3,
    code: "STATUS_11",
    info: "INAUGURATION_DATE_SETTLED",
    status: "default",
    percent: 7,
    view: 3,
  },
  STATUS_12: {
    key: 3,
    code: "STATUS_12",
    info: "ARP_DATA_CREATED",
    status: "default",
    percent: 8,
    view: 3,
  },
  STATUS_13: {
    key: 3,
    code: "STATUS_13",
    info: "ARP_DATA_CONFIRMED",
    status: "default",
    percent: 8,
    view: 3,
  },
  STATUS_14: {
    key: 4,
    code: "STATUS_14",
    info: "LIBERATION_WAIT",
    status: "default",
    percent: 9,
    view: 4,
  },
  STATUS_15: {
    key: 4,
    code: "STATUS_15",
    info: "LIBERATION_DONE",
    status: "default",
    percent: 10,
    view: 5,
  },
};
export default status;
