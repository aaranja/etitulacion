import React from "react";
import careerTypes from "../../../../site/collections/careerTypes";
import { Button } from "antd";
import { LoadingOutlined, PlusSquareOutlined } from "@ant-design/icons";

const staffType = (key, data, role) => {
  if (data !== undefined) {
    const index = data.findIndex((item) => key === item.key);
    if (index !== -1) {
      return data[index][role];
    } else {
      return "No encontrado";
    }
  } else {
    return <LoadingOutlined />;
  }
};

export const columns = (staffData) => {
  const data = staffData["arpStaff"];
  return [
    {
      title: "Trámite",
      dataIndex: "enrollment",
      key: "procedure",
      width: 60,
      render: (key) => {
        return (
          <Button
            icon={<PlusSquareOutlined />}
            href={"/home/dossier/" + key + "/"}
            type="text"
            target="_blank"
            block
          />
        );
      },
    },
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
      width: 200,
    },
    {
      title: "Apellidos",
      dataIndex: "last_name",
      key: "last_name",
      width: 200,
    },
    {
      title: "Carrera",
      dataIndex: "career",
      key: "career",
      width: 200,
      render: (record) => {
        return <p style={{ margin: "auto" }}>{careerTypes[record]}</p>;
      },
    },
    {
      title: "No. Celular",
      dataIndex: "cellphone",
      width: 200,
      inputType: "number",
    },
    {
      title: "Instituto",
      dataIndex: "institute",
      width: 200,
      inputType: "text",
    },
    {
      title: "Carrera",
      dataIndex: "career",
      width: 200,
      editable: true,
      inputType: "select",
      options: "career",
      render: (record) => {
        return careerTypes[record];
      },
    },
    {
      title: "Opción de titulación",
      dataIndex: "titulation_type",
      width: 200,
      inputType: "text",
    },
    {
      title: "Título de trabajo",
      dataIndex: "project_name",
      width: 200,
      inputType: "text",
    },
    {
      title: "Asesor interno",
      dataIndex: "int_assessor_name",
      width: 200,
      inputType: "text",
    },
    {
      title: "Cédula presidente",
      dataIndex: "president_id",
      width: 200,
      inputType: "select",
      options: "id_card",
      render: (record) => {
        return staffType(record, data, "id_card");
      },
    },
    {
      title: "Presidente",
      dataIndex: "president_id",
      width: 200,
      inputType: "select",
      options: "full_name",
      render: (record) => {
        return staffType(record, data, "full_name");
      },
    },
    {
      title: "Profesion presidente",
      dataIndex: "president_id",
      width: 200,
      inputType: "select",
      options: "profession",
      render: (record) => {
        return staffType(record, data, "profession");
      },
    },
    {
      title: "Cédula secretario",
      dataIndex: "secretary_id",
      width: 200,
      inputType: "select",
      options: "id_card",
      render: (record) => {
        return staffType(record, data, "id_card");
      },
    },
    {
      title: "Secretario",
      dataIndex: "secretary_id",
      width: 200,
      inputType: "select",
      options: "full_name",
      render: (record) => {
        return staffType(record, data, "full_name");
      },
    },
    {
      title: "Profesion secretario",
      dataIndex: "secretary_id",
      width: 200,
      inputType: "select",
      options: "profession",
      render: (record) => {
        return staffType(record, data, "profession");
      },
    },
    {
      title: "Cédula vocal",
      dataIndex: "vocal_id",
      width: 200,
      inputType: "select",
      options: "id_card",
      render: (record) => {
        return staffType(record, data, "id_card");
      },
    },
    {
      title: "Vocal",
      dataIndex: "vocal_id",
      width: 200,
      inputType: "select",
      options: "full_name",
      render: (record) => {
        return staffType(record, data, "full_name");
      },
    },
    {
      title: "Profesion vocal",
      dataIndex: "vocal_id",
      width: 200,
      inputType: "select",
      options: "profession",
      render: (record) => {
        return staffType(record, data, "profession");
      },
    },
  ];
};
