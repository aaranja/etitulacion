import React, { useContext, useState, useEffect, useRef } from "react";
import {
	Divider,
	Table,
	Input,
	Popconfirm,
	Form,
	Upload,
	message,
	Button,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
	const [form] = Form.useForm();
	return (
		<Form form={form} component={false}>
			<EditableContext.Provider value={form}>
				<tr {...props} />
			</EditableContext.Provider>
		</Form>
	);
};

const EditableCell = ({
	title,
	editable,
	children,
	dataIndex,
	record,
	handleSave,
	...restProps
}) => {
	const [editing, setEditing] = useState(false);
	const inputRef = useRef();
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

	const save = async (e) => {
		try {
			const values = await form.validateFields();
			toggleEdit();
			handleSave({ ...record, ...values });
		} catch (errInfo) {
			console.log("Save failed:", errInfo);
		}
	};

	let childNode = children;

	if (editable) {
		childNode = editing ? (
			<Form.Item
				style={{
					margin: 0,
				}}
				name={dataIndex}
				rules={[
					{
						required: true,
						message: `${title} is required.`,
					},
				]}
			>
				<Input ref={inputRef} onPressEnter={save} onBlur={save} />
			</Form.Item>
		) : (
			<div
				className="editable-cell-value-wrap"
				style={{
					paddingRight: 24,
				}}
				onClick={toggleEdit}
			>
				{children}
			</div>
		);
	}

	return <td {...restProps}>{childNode}</td>;
};

class UploadDocs extends React.Component {
	handleChange = (name) => (info) => {
		let fileList = [...info.fileList];
		// 1. Limit the number of uploaded files
		// Only to show two recent uploaded files, and old ones will be replaced by the new
		fileList = fileList.slice(-1);

		// 2. Read from response and show file link
		fileList = fileList.map((file) => {
			if (file.response) {
				// Component will show file.url as link
				file.url = file.response.url;
			}
			return file;
		});
		switch (name) {
			case "acta":
				var acta = fileList;
				this.setState({ acta });
				break;
			case "curp":
				var curp = fileList;
				this.setState({ curp });
				break;
			default:
				break;
		}
	};
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [
				{
					key: "0",
					keynum: 0,
					name: "acta",
					documento: "Acta de nacimiento",
					estatus: "Sin subir",
					archivo: "Seleccionar archivo",
				},
				{
					key: "1",
					keynum: 1,
					name: "curp",
					documento: "CURP",
					estatus: "Sin subir",
					archivo: "Seleccionar archivo",
				},
			],
			count: 2,
			fileList: [
				{
					uid: "-1",
					name: "acta.png",
					status: "done",
					url: "http://www.baidu.com/xxx.png",
				},
				{
					uid: "-2",
					name: "curp.png",
					status: "none",
					url: "http://www.baidu.com/xxx.png",
				},
			],

			acta: [
				{
					uid: "-1",
					name: "acta.png",
					status: "done",
					url: "http://www.baidu.com/xxx.png",
				},
			],
			curp: [
				{
					uid: "-1",
					name: "curp.png",
					status: "done",
					url: "http://www.baidu.com/xxx.png",
				},
			],
		};
		this.columns = [
			{
				title: "Documento",
				dataIndex: "documento",
				width: "30%",
			},
			{
				title: "Estatus",
				dataIndex: "estatus",
			},
			{
				title: "Archivo",
				dataIndex: "archivo",
				render: (text, record) => {
					const uploadProps = {
						action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
						onChange: this.handleChange(record.name),
						multiple: false,
					};
					var fileList = null;
					if (record.key !== undefined) {
						var file = this.state[record.name];
						fileList = file;
					}

					return this.state.dataSource.length >= 1 ? (
						<Upload {...uploadProps} fileList={fileList}>
							<Button>
								<UploadOutlined /> Elegir archivo
							</Button>
						</Upload>
					) : null;
				},
			},
			/*{
				title: "operation",
				dataIndex: "operation",
				render: (text, record) =>
					this.state.dataSource.length >= 1 ? (
						<Popconfirm
							title="Sure to delete?"
							onConfirm={() => this.handleDelete(record.key)}
						>
							<a href="/home/">Delete</a>
						</Popconfirm>
					) : null,
			},*/
		];
	}

	/*handleDelete = (key) => {
		const dataSource = [...this.state.dataSource];
		this.setState({
			dataSource: dataSource.filter((item) => item.key !== key),
		});
	};*/

	/*handleSave = (row) => {
		const newData = [...this.state.dataSource];
		const index = newData.findIndex((item) => row.key === item.key);
		const item = newData[index];
		newData.splice(index, 1, { ...item, ...row });
		this.setState({
			dataSource: newData,
		});
	};*/

	render() {
		const { dataSource } = this.state;
		const components = {
			body: {
				row: EditableRow,
				cell: EditableCell,
			},
		};
		const columns = this.columns.map((col) => {
			if (!col.editable) {
				return col;
			}

			return {
				...col,
				onCell: (record) => ({
					record,
					editable: col.editable,
					dataIndex: col.dataIndex,
					title: col.title,
					handleSave: this.handleSave,
				}),
			};
		});
		return (
			<div>
				<Divider orientation="center">Subir documentación</Divider>
				<Table
					pagination={false}
					rowClassName={() => "editable-row"}
					bordered
					dataSource={dataSource}
					columns={columns}
				/>
			</div>
		);
	}
}

export default UploadDocs;
