import React from "react";
import { Table, Input, InputNumber, Form, Button, Select } from "antd";
import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import scrollIntoView from "scroll-into-view";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  let inputNode;
  if (inputType === "number") {
    inputNode = <InputNumber />;
  } else {
    if (inputType === "select") {
      inputNode = (
        <Select>
          <Select.Option value="president">Presidente</Select.Option>
          <Select.Option value="secretary">Secretario</Select.Option>
          <Select.Option value="vocal">Vocal</Select.Option>
        </Select>
      );
    } else {
      inputNode = <Input />;
    }
  }

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.dataSource,
      editingKey: "",
      cancelType: "",
      loading: true,
    };
    this.formRef = React.createRef();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {
    this.props.setActionsProps({
      save: this.onSave,
      add: this.onAdd,
    });
    this.setState({
      loading: false,
    });
  }

  setEditingKey = (key) => this.setState({ editingKey: key });
  setData = (data) => this.setState({ data: data });

  onEdit = (record) => {
    this.formRef.current.setFieldsValue({
      id_card: "",
      full_name: "",
      profession: "",
      ...record,
    });
    scrollIntoView(document.querySelector(".scroll-row"), {
      align: {
        top: 0,
      },
    });
    this.setEditingKey(record.key);
  };

  onAdd = () => {
    const newData = [...this.state.data];
    const newEntry = {
      key: 0,
    };
    newData.push(newEntry);
    this.setState({
      data: newData,
      cancelType: "create",
    });
    this.onEdit(newEntry);
  };

  onCancel = () => {
    if (this.state.cancelType === "create") {
      this.onRemove(this.state.editingKey);
    }
    this.setEditingKey("");
    this.props.hasChange(false);
  };

  onRemove = (key) => {
    const newData = [...this.state.data];
    const index = newData.findIndex((item) => key === item.key);
    newData.splice(index, 1);
    this.setData(newData);
  };

  onSave = async (data) => {
    console.log("guardando");
    console.log("datasource ", this.props.dataSource);
    this.setState({
      data: this.props.dataSource,
      editingKey: "",
      cancelType: "",
    });
    // const index = newData.findIndex((item) => editKey === item.key);
    // console.log(index);
    // this.setState({
    //   editingKey: "",
    //   cancelType: "",
    // });

    // try {
    //   const row = await this.formRef.current.validateFields();
    //   const newData = [...this.state.data];
    //   const index = newData.findIndex((item) => editKey === item.key);
    //   if (index > -1) {
    //   } else {
    //     newData.push(row);
    //     this.setState({
    //       data: newData,
    //       editingKey: "",
    //     });
    //   }
    // } catch (errInfo) {
    //   console.log("Validate Failed: ", errInfo);
    // }
  };

  render() {
    const isEditing = (record) => record.key === this.state.editingKey;
    const columns = [
      {
        title: "key",
        dataIndex: "key",
        editable: false,
        defaultSortOrder: "ascend",

        // sorter: (a, b) => a.key - b.key,
      },
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
      {
        title: "Operación",
        dataIndex: "operation",
        render: (_, record) => {
          const editable = isEditing(record);
          return editable ? (
            <Button
              type="link"
              onClick={this.onCancel}
              icon={<CloseOutlined />}
            >
              Cancelar
            </Button>
          ) : (
            <Button
              icon={<EditOutlined />}
              type="link"
              disabled={this.state.editingKey !== ""}
              onClick={() => {
                this.onEdit(record);
                this.setState({
                  cancelType: "edit",
                });
                this.props.hasChange(true);
              }}
            >
              Editar
            </Button>
          );
        },
      },
    ];

    const mergedColumns = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      let inputType = (type) => {
        switch (type) {
          case "id_card":
            return "number";
          case "role":
            return "select";
          default:
            return "text";
        }
      };

      return {
        ...col,
        onCell: (record) => ({
          record,
          inputType: inputType(col.dataIndex),
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    });
    return this.state.loading ? (
      <p>Loading</p>
    ) : (
      <Form
        ref={this.formRef}
        component={false}
        onFinish={(values) => {
          console.log(values);
          this.formRef.current.validateFields().then((res) => {
            values.key = this.state.editingKey;
            this.props.toSave(values, this.state.cancelType);
          });
        }}
      >
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={this.state.data}
          columns={mergedColumns}
          // rowClassName={(record, index) => {
          //   return index === 5 ? "scroll-row" : "";
          // }}
          pagination={{
            onChange: this.onCancel,
          }}
        />
      </Form>
    );
  }
}

export default EditableTable;
