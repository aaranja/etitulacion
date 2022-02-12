import careerTypes from "../../../site/collections/careerTypes";
import React from "react";

export const columns = [
  {
    title: "Matrícula",
    dataIndex: "enrollment",
    key: "enrollment",
    width: 100,
  },
  {
    title: "Nombre(s)",
    dataIndex: "first_name",
    key: "first_name",
  },
  {
    title: "Apellidos",
    dataIndex: "last_name",
    key: "last_name",
  },
  {
    title: "Carrera",
    dataIndex: "career",
    key: "career",
    render: (record) => {
      return <p style={{ margin: "auto" }}>{careerTypes[record]}</p>;
    },
  },
];
