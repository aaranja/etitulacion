import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Table,
  Input,
  Form,
  InputNumber,
  Select,
  Tooltip,
  Popconfirm,
  Space,
  Button,
  Dropdown,
  Menu,
} from "antd";
import { careerOptions, staffStructureOptions } from "./selectOptions";
import {
  CloseOutlined,
  FieldNumberOutlined,
  SaveOutlined,
  UndoOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import MultiSelect from "./MultiSelect";

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false} style={{}}>
      <EditableContext.Provider value={form}>
        <tr
          {...props}
          style={{
            maxHeight: 50,
            height: 50,
            minHeight: 50,
            padding: 0,
            margin: 0,
          }}
        />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  inputType,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  options,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      // console.log(form.values);
      const values = await form.validateFields().then((values) => {
        //
        handleSave({ ...record, ...values });
        toggleEdit();
      });
      // const values = form.values;
      // toggleEdit();
      // handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;
  if (options !== undefined) {
    if (options.length !== 0) {
      for (let i in options) {
        if (options[i].value === record[dataIndex]) {
          children = <p style={{ margin: "auto" }}>{options[i].label} </p>;
          break;
        }
      }
    }
  }

  if (editable) {
    const inputNode =
      inputType === "number" ? (
        <InputNumber
          controls={false}
          min={1}
          ref={inputRef}
          onPressEnter={save}
          onBlur={save}
          style={{ width: "100%" }}
        />
      ) : inputType === "select" ? (
        <Select
          ref={inputRef}
          showSearch
          filterOption={(input, option) => {
            return (
              option.label
                .toString()
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
            );
          }}
          optionFilterProp="children"
          onBlur={() => toggleEdit()}
          onSelect={save}
          options={options}
          placeholder="Seleccione una opción"
        />
      ) : (
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      );
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
          backgroundColor: "yellow",
        }}
        name={dataIndex}
        rules={[
          {
            required: false,
            message: "", //`${title} es requerido.`,
          },
        ]}
      >
        {inputNode}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
          margin: "auto",
          display: "flex",
          minWidth: 70,
          minHeight: 30,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

class EditableTable extends React.Component {
  constructor(props) {
    super(props);

    // make the staff select data form

    this.state = {
      dataSource: this.props.initialData,
      oldDataSource: { ...this.props.initialData },
      selectedRowKeys: [],
      selecting: false,
      hasChanges: false,
      valuesChanged: { update: [], delete: [] },
      onGenerateStaff: false,
      staffSelect: "",
    };
    this.folioForm = React.createRef();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!_.isEqual(prevProps.initialData, this.props.initialData)) {
      this.setState({
        dataSource: this.props.initialData,
        oldDataSource: { ...this.props.initialData },
      });
    }
  }

  handleDelete = (rows) => {
    // delete selected rows
    let dataSource = [...this.state.dataSource];
    let valuesChanged = { ...this.state.valuesChanged };
    let toDelete = valuesChanged.delete;
    let toUpdate = valuesChanged.update;
    for (let key in rows) {
      // add to remove list

      let row = dataSource.findIndex((item) => rows[key] === item.key);
      toDelete.push(dataSource[row].enrollment);
      // remove if has an update
      const index = toUpdate.findIndex((item) => rows[key] === item.key);
      if (index !== -1) {
        toUpdate.splice(index, 1);
      }
      // remove from table
      dataSource = dataSource.filter((item) => item.key !== rows[key]);
    }
    valuesChanged.update = toUpdate;
    valuesChanged.delete = toDelete;

    this.setState({
      dataSource: dataSource,
      selecting: false,
      selectedRowKeys: [],
      valuesChanged: valuesChanged,
      hasChanges: true,
    });
  };

  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];

    if (!_.isEqual(row, item)) {
      newData.splice(index, 1, { ...item, ...row });
      let valuesChanged = { ...this.state.valuesChanged };
      valuesChanged = this.onSaveChanges(row, valuesChanged);
      this.setState({
        dataSource: newData,
        hasChanges: true,
        valuesChanged: valuesChanged,
      });
    }
  };

  onSaveChanges = (newItem, valuesChanged) => {
    let toUpdate = valuesChanged.update;
    const updateIndex = toUpdate.findIndex((item) => newItem.key === item.key);
    if (updateIndex === -1) {
      //   if do not exist, add it
      toUpdate.push(newItem);
    } else {
      // delete old and add new one
      let oldItem = toUpdate[updateIndex];
      toUpdate.splice(updateIndex, 1, { ...oldItem, ...newItem });
    }
    valuesChanged.update = toUpdate;
    return valuesChanged;
  };

  onSelectChange = (selectedRowKeys) => {
    // console.log("selectedRowKeys changed: ", selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  onRemoving = (value) => {
    this.setState({
      selecting: value,
      selectedRowKeys: [],
    });
  };

  onSetRecord = (number) => {
    let no = parseInt(number.record);
    let data = [...this.state.dataSource];
    let valuesChanged = { ...this.state.valuesChanged };

    for (let index in data) {
      data[index].record_page = no + parseInt(index);
      valuesChanged = this.onSaveChanges(data[index], valuesChanged);
    }
    this.setState({
      dataSource: data,
      valuesChanged: valuesChanged,
      hasChanges: true,
    });
  };

  onCancelChanges = () => {
    this.setState({
      dataSource: [...this.state.oldDataSource],
      selectedRowKeys: [],
      selecting: false,
      hasChanges: false,
      valuesChanged: { update: [], delete: [] },
    });
  };

  onSetStaff = (visible, type) => {
    this.setState({
      onGenerateStaff: visible,
      staffSelect: type,
    });
  };

  onSetStaffConfirm = (value) => {
    let data = [...this.state.dataSource];
    let valuesChanged = { ...this.state.valuesChanged };

    for (let index in data) {
      data[index][this.state.staffSelect + "_id"] = value;
      valuesChanged = this.onSaveChanges(data[index], valuesChanged);
    }
    this.setState({
      dataSource: data,
      onGenerateStaff: false,
      staffSelect: "",
      valuesChanged: valuesChanged,
      hasChanges: true,
    });
  };

  validateSave = () => {
    const data = [...this.state.dataSource];
    let complete = true;
    const fields = [
      "record_page",
      "enrollment",
      "first_name",
      "last_name",
      "email",
      "cellphone",
      "career",
      "titulation_type",
      "institute",
      "project_name",
      "int_assessor_name",
      "president_id",
      "vocal_id",
      "secretary_id",
    ];

    const isFilled = (field) => {
      return field === undefined || field === "" || field === null;
    };

    // validate fields filled
    for (let i in data) {
      data[i]["graduate"] = data[i].enrollment;
      for (let field in fields) {
        if (isFilled(data[i][fields[field]])) {
          complete = false;
          break;
        } else {
          console.log("complete ", complete);
        }
      }
    }

    this.props.onFinish(data, this.state.valuesChanged, complete);
  };

  onSaved = (data) => {
    this.setState({
      hasChanges: false,
      valuesChanged: { update: [], delete: [] },
    });
  };

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };

    const getSelectOptions = (index, option) => {
      switch (index) {
        case "career":
          return careerOptions;
        case "president_id":
          return staffStructureOptions(this.props.arpStaffOption, option);
        case "secretary_id":
          return staffStructureOptions(this.props.arpStaffOption, option);
        case "vocal_id":
          return staffStructureOptions(this.props.arpStaffOption, option);
        default:
          return [];
      }
    };

    const dcolumns = this.props.columns.map((col) => {
      if (!col.editable) {
        return col;
      }

      let options = [];
      if (col.inputType === "select") {
        options = getSelectOptions(col.dataIndex, col.options);
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          editable: col.editable,
          inputType: col.inputType,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
          options: options,
        }),
      };
    });
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      selections: [
        Table.SELECTION_ALL,
        Table.SELECTION_INVERT,
        Table.SELECTION_NONE,
        {
          key: "odd",
          text: "Select Odd Row",
          onSelect: (changeableRowKeys) => {
            let newSelectedRowKeys;
            newSelectedRowKeys = changeableRowKeys.filter((key, index) => {
              return index % 2 === 0;
            });
            this.setState({ selectedRowKeys: newSelectedRowKeys });
          },
        },
        {
          key: "even",
          text: "Select Even Row",
          onSelect: (changeableRowKeys) => {
            let newSelectedRowKeys;
            newSelectedRowKeys = changeableRowKeys.filter((key, index) => {
              return index % 2 !== 0;
            });
            this.setState({ selectedRowKeys: newSelectedRowKeys });
          },
        },
      ],
    };

    const getStaffOptions = (
      <Menu>
        <Menu.Item
          key="president"
          onClick={() => this.onSetStaff(true, "president")}
        >
          {"Presidente"}
        </Menu.Item>
        <Menu.Item
          key="secretary"
          onClick={() => this.onSetStaff(true, "secretary")}
        >
          {"Secretario"}
        </Menu.Item>
        <Menu.Item key="vocal" onClick={() => this.onSetStaff(true, "vocal")}>
          {"Vocal"}
        </Menu.Item>
      </Menu>
    );
    return (
      <>
        <div>
          <Space
            direction="horizontal"
            style={{
              justifyContent: "space-between",
              display: "flex",
            }}
          >
            <Space
              direction="horizontal"
              style={{ float: "left", marginRight: "auto" }}
            >
              <Tooltip title="Generar folio">
                <Popconfirm
                  placement="bottom"
                  title={
                    <Space direction="vertical">
                      <Form
                        name="folio-form"
                        ref={this.folioForm}
                        onFinish={this.onSetRecord}
                      >
                        <Form.Item
                          label="Generar folio"
                          name="record"
                          rules={[
                            {
                              required: true,
                              message: "Introduzca un número",
                            },
                          ]}
                        >
                          <Input placeholder="Folio" />
                        </Form.Item>
                      </Form>
                    </Space>
                  }
                  onConfirm={() => this.folioForm.current.submit()}
                  okText="Generar"
                  cancelText="Cancelar"
                >
                  <Button type="default" icon={<FieldNumberOutlined />} />
                </Popconfirm>
              </Tooltip>
              <Tooltip title="Remover egresado">
                <div>
                  <Button
                    type="default"
                    icon={<UserDeleteOutlined />}
                    onClick={() => this.onRemoving(true)}
                    style={{ display: this.state.selecting ? "none" : "block" }}
                  />
                  <Space
                    direction="horizontal"
                    style={{
                      display: this.state.selecting ? "flex" : "none",
                      margin: "auto",
                    }}
                  >
                    <Button
                      type="danger"
                      icon={<UserDeleteOutlined />}
                      onClick={() =>
                        this.handleDelete(this.state.selectedRowKeys)
                      }
                    >
                      Remover
                    </Button>
                    <Button
                      type="default"
                      icon={<CloseOutlined />}
                      onClick={() => this.onRemoving(false)}
                    >
                      Cancelar
                    </Button>
                  </Space>
                </div>
              </Tooltip>

              <Tooltip title="Asignar personal">
                <Dropdown
                  overlay={getStaffOptions}
                  placement="bottomLeft"
                  arrow
                >
                  <Button
                    icon={<UserAddOutlined />}
                    style={{
                      display: this.state.onGenerateStaff ? "none" : "block",
                    }}
                  />
                </Dropdown>
              </Tooltip>
              {this.state.onGenerateStaff ? (
                <Space direction={"horizontal"} style={{ display: "flex" }}>
                  <MultiSelect
                    dataSource={this.props.arpStaffOption}
                    type={this.state.staffSelect}
                    onFinish={this.onSetStaffConfirm}
                  />

                  <Button
                    onClick={() => {
                      this.onSetStaff(false, "");
                    }}
                  >
                    Cancelar
                  </Button>
                </Space>
              ) : null}
            </Space>
            <Space
              direction="horizontal"
              style={{
                float: "right",
                marginLeft: "auto",
                justifyContent: "space-between",
              }}
            >
              <Button
                danger
                disabled={!this.state.hasChanges}
                icon={<UndoOutlined />}
                style={{ display: this.state.hasChanges ? "block" : "none" }}
                onClick={this.onCancelChanges}
              >
                Deshacer
              </Button>
              <Button
                type="dashed"
                disabled={!this.state.hasChanges}
                icon={<SaveOutlined />}
                onClick={this.validateSave}
              >
                Guardar
              </Button>
            </Space>
          </Space>
        </div>
        <Space direction="vertical" style={{ marginTop: 10, display: "flex" }}>
          <Table
            pagination={false}
            rowSelection={this.state.selecting ? rowSelection : null}
            size="middle"
            components={components}
            rowClassName={() => "editable-row"}
            bordered
            dataSource={dataSource}
            columns={dcolumns}
            scroll={{ x: 1000 }}
          />
        </Space>
      </>
    );
  }
}

export default EditableTable;
