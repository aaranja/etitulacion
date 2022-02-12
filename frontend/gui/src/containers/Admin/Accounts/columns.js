import React from "react";
import { Button } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";

export const columns = [
  {
    title: "ID",
    width: 50,
    dataIndex: "id",
    key: "id",
    fixed: "left",
  },
  {
    title: "E-Mail",
    width: 150,
    dataIndex: "email",
    key: "email",
    fixed: "left",
  },
  {
    title: "Nombre(s)",
    dataIndex: "first_name",
    key: "first_name",
    width: 100,
  },
  {
    title: "Apellidos",
    dataIndex: "last_name",
    key: "last_name",
    width: 150,
  },
  {
    title: "Fecha de registro",
    dataIndex: "date_joined",
    key: "date_joined",
    width: 150,
  },
  {
    title: "Fecha de sesión",
    dataIndex: "last_login",
    key: "last_login",
    width: 150,
  },
  {
    title: "Op.",
    key: "operation",
    fixed: "right",
    width: 75,
    render: (key) => {
      return (
        <Button
          icon={<PlusSquareOutlined />}
          type="text"
          onClick={() => console.log(key)}
        />
      );
    },
  },
];
