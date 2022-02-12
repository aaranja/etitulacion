import React from "react";
import { Typography, Popconfirm } from "antd";

const isEditing = (record) => record.key === editingKey;

export const columns = (onEdit) => {
  return [
    {
      title: "Cédula",
      dataIndex: "id_card",
      editable: true,
    },
    {
      title: "Nombre",
      dataIndex: "full_name",
      editable: true,
    },
    {
      title: "Profesión",
      dataIndex: "profession",
      editable: true,
    },
    // {
    //   title: "Editar",
    //   dataIndex: "edit",
    //   render: (_, record) => {
    //     const editable = record.editable;
    //     return editable ? (
    //       <span>
    //         <Typography.Link
    //           onClick={() => save(record.key)}
    //           style={{
    //             marginRight: 8,
    //           }}
    //         >
    //           Save
    //         </Typography.Link>
    //         <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
    //           <a>Cancel</a>
    //         </Popconfirm>
    //       </span>
    //     ) : (
    //       <Typography.Link
    //         disabled={editingKey !== ""}
    //         onClick={() => edit(record)}
    //       >
    //         Edit
    //       </Typography.Link>
    //     );
    //   },
    // },
  ];
};
