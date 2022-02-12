import React from "react";
import { Button, Tag } from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";
import moment from "moment";

let today = new Date();
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
      key: "date",
      render: (date) => (
        <p style={{ margin: "auto" }}>
          {moment(date).format(" dddd DD [de] MMMM [de] YYYY")}
        </p>
      ),
    },
    {
      title: "No. egresados",
      dataIndex: "no_graduate",
      key: "graduate",
      width: 50,
    },
    {
      title: "Estado",
      key: "status",
      dataIndex: "status",
      width: 200,
      render: (key, data) => {
        const diffTime = Math.abs(moment(data.date) - today);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let text;
        if (diffDays === 0) {
          text = "Hoy";
        } else {
          text = "Faltan " + diffDays + " días";
        }
        return <Tag color="blue">{text}</Tag>;
      },
    },
    {
      title: "Ver más",
      key: "action",
      width: 100,
      render: (key) => {
        return (
          <Button
            icon={<PlusSquareOutlined />}
            onClick={() => {
              callback(key, "info");
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
