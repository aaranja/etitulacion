import React from "react";
import { Button, Tag } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";
import moment from "moment";

const columns = (callback) => {
  return [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 70,
    },
    {
      title: "Fecha",
      dataIndex: "date",

      render: (date) => (
        <p style={{ margin: "auto" }}>
          {moment(date).format(" dddd DD [de] MMMM [de] YYYY")}
        </p>
      ),
    },
    {
      title: "No. egresados",
      dataIndex: "no_graduate",
      width: 50,
    },
    {
      title: "Asistencia",
      dataIndex: "confirmed",
      width: 200,
      render: (text) => {
        return text ? <Tag>Confirmado</Tag> : <Tag>Sin confirmar</Tag>;
      },
    },
    {
      title: "Ver más",
      dataIndex: "action",
      width: 100,
      render: (key, record) => {
        return (
          <Button
            icon={<PlusSquareOutlined />}
            onClick={() => {
              callback(record);
            }}
            type="text"
            block
          />
        );
      },
    },
  ];
};

export default columns;
