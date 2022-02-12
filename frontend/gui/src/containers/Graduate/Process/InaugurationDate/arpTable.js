import React from "react";
import { Table } from "antd";

export const arpRowRender = (data) => {
  const roles = {
    president: "Presidente",
    vocal: "Vocal",
    secretary: "Secretario",
  };

  const columns = [
    { title: "Cedula", dataIndex: "id_card", key: "id_card" },
    { title: "Nombre", dataIndex: "full_name", key: "full_name" },
    { title: "Profesión", dataIndex: "profession", key: "profession" },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      render: (record) => roles[record],
    },
  ];

  return <Table columns={columns} dataSource={data} pagination={false} />;
};
