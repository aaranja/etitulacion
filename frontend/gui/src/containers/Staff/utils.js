import React from "react";
import { Badge, Progress, Tooltip } from "antd";
import {
  graduate_status_services,
  graduate_status_coordination,
} from "../../site/collections/staffStatus";

export const status_tag_services = (status) => {
  let color = graduate_status_services["DEFAULT"].color;
  let custom_text = graduate_status_services["DEFAULT"].procedure_text;

  let status_info = graduate_status_services[status];
  if (status_info !== undefined) {
    color = status_info.color;
    custom_text = status_info.procedure_text;
  }

  return (
    <Badge
      status={color}
      text={custom_text}
      // offset={[6, 18]}
      style={{ width: 120 }}
    />
  );
};

export const status_tag_coordination = (status) => {
  let status_info = graduate_status_coordination[status];

  return (
    <Badge
      status={status_info.color}
      text={status_info.procedure_text}
      // offset={[6, 18]}
      style={{ width: 120 }}
    />
  );
};

export const status_progress_services = (status) => {
  let status_info = graduate_status_services[status];
  return (
    <Tooltip placement="top" title={status_info.status_text}>
      <Progress
        percent={status_info.percent * 20}
        steps={graduate_status_services.TOTAL_STATUS}
      />
    </Tooltip>
  );
};

export const status_progress_coordination = (status) => {
  let status_info = graduate_status_coordination[status];
  return (
    <Tooltip placement="top" title={status_info.status_text}>
      <Progress
        percent={status_info.percent * 20}
        steps={graduate_status_coordination.TOTAL_STATUS}
      />
    </Tooltip>
  );
};
