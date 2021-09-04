import React, { Component } from "react";
import { Table, PageHeader, Button, Card } from "antd";
import * as actions from "../../store/actions/staff_services";
import { ReloadOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
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
				title: "No. de control",
				dataIndex: "enrollment",
				width: "15%",
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
			},
			{
				title: "Documentación",
				dataIndex: "documents",
				width: "10%",
			},
		];

		const columns = datacolumns.map((col) => {
			return col;
		});

		return (
			<Card
				style={{
					margin: 0,
					minHeight: 280,
					overflow: "initial",
					height: "100%",
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
					style={{ fontSize: "100%" }}
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
