import React, { Component } from "react";
import { Table, PageHeader, Button, Card, Progress, Tag, Layout } from "antd";
import * as actions from "../../store/actions/staff_services";
import { ReloadOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
const { Content } = Layout;
class GraduateTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: null,
			loading: false,
			loadingData: false,
			loadingList: false,
		};
		this.props.getGraduateList();
	}

	componentDidMount() {
		if (!this.state.loading) {
			console.log("cargando");
		}
	}

	render() {
		const datacolumns = [
			{
				title: "No. control",
				dataIndex: "enrollment",
				width: "10%",
			},
			{
				title: "Nombre",
				dataIndex: "first_name",
				width: "20%",
			},
			{
				title: "Apellidos",
				dataIndex: "last_name",
				width: "30%",
			},
			{
				title: "Carrera",
				dataIndex: "career",
				width: "20%",
			},
			{
				title: "Estatus",
				dataIndex: "status",
				width: "10%",
				render: (text, record) => {
					var current = 0;
					switch (text) {
						case "STATUS_00":
							current = 0;
							break;
						case "STATUS_01":
							current = 1;
							break;
						case "STATUS_02":
							current = 2;
							break;
						case "STATUS_03":
							current = 2;
							break;
						case "STATUS_04":
							current = 2;
							break;
						case "STATUS_05":
							current = 3;
							break;
						case "STATUS_06":
							current = 4;
							break;
						default:
							current = 4;
					}
					return <Progress percent={current * 25} steps={4} />;
				},
			},
			{
				title: "Documentación",
				dataIndex: "documents",
				width: "10%",
				render: (text, record) => {
					var color = "default";
					var custom_text = "Sin cargar";
					var status = record.status;
					if (status === "STATUS_06") {
						color = "success";
						custom_text = "Aprobada";
					} else {
						if (status === "STATUS_05") {
							color = "processing";
							custom_text = "Por revisar";
						} else {
							if (status === "STATUS_04") {
								color = "error";
								custom_text = "Rechazada";
							}
						}
					}

					return (
						<Tag
							color={color}
							style={{ width: "100%", textAlign: "center" }}
						>
							{custom_text}
						</Tag>
					);
				},
			},
		];

		const columns = datacolumns.map((col) => {
			return col;
		});

		return (
			<Card
				style={{
					width: "62vw",
					overflow: "initial",
				}}
			>
				<Content
					className="site-layout-background"
					style={{
						margin: 0,
						minHeight: 280,
						overflow: "initial",
					}}
				>
					<PageHeader
						ghost={false}
						title="Lista de egresados"
						/*subTitle="This is a subtitle"*/
						extra={[
							<Button key="1">
								Actualizar <ReloadOutlined />
							</Button>,
						]}
					></PageHeader>
					<Table
						pagination={false}
						rowClassName={() => "editable-row"}
						bordered
						dataSource={this.props.dataSource}
						columns={columns}
						style={{
							fontSize: "100%",
						}}
						extra={[<p>hola</p>]}
						onRow={(record, rowIndex) => {
							return {
								onClick: (event) => {
									this.props.callBack(
										"documents",
										record.enrollment
									);
								}, // click row
							};
						}}
					/>
				</Content>
			</Card>
		);
	}
}

const mapStateToProps = (state) => {
	var dataSource = [];
	if (
		!state.staff_services.loading &&
		state.staff_services.payload !== null
	) {
		// set an unique key to each data row
		var graduatelist = state.staff_services.payload.tableData;
		for (const key in graduatelist) {
			graduatelist[key].key = key;
		}
		dataSource = graduatelist;
	}

	return {
		loading: state.staff_services.loading,
		dataSource: dataSource,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getGraduateList: () => dispatch(actions.getGraduateList()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(GraduateTable);
