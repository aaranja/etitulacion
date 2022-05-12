import React from "react";
import { Button, Dropdown, Menu } from "antd";
import {
  DeleteFilled,
  DownOutlined,
  EditOutlined,
  LockOutlined,
} from "@ant-design/icons";

export const columns = (remove, edit) => {
  return [
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
      title: "",
      key: "operation",
      fixed: "right",
      width: 75,
      render: (record) => {
        return (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key={"men1"} icon={<EditOutlined />}>
                  <a onClick={() => edit(record)}>Editar información</a>
                </Menu.Item>
                <Menu.Item key={"men2"} danger icon={<DeleteFilled />}>
                  <a onClick={() => remove(record)}>Eliminar cuenta</a>
                </Menu.Item>
              </Menu>
            }
          >
            <a onClick={(e) => e.preventDefault()}>
              Operación <DownOutlined />
            </a>
          </Dropdown>
        );
      },
    },
  ];
};
