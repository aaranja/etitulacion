import React, { Component } from "react";
import { Table } from "antd";
import * as actions from "../../store/actions/staff_services";
import { connect } from "react-redux";
class GraduateTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: null,
			loading: false,
		};
	}

	componentDidMount() {
		if (!this.state.loading) {
			this.props.getGraduateList();
			this.setState({
				loading: true,
			});
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
		const rowSelection = {
			onChange: (
				selectedRowKeys: React.Key[],
				selectedRows: DataType[]
			) => {
				console.log(
					`selectedRowKeys: ${selectedRowKeys}`,
					"selectedRows: ",
					selectedRows
				);
			},
			getCheckboxProps: (record: DataType) => ({
				disabled: record.name === "Disabled User", // Column configuration not to be checked
				name: record.name,
			}),
		};

		return (
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
							console.log(record);
						}, // click row
					};
				}}
			/>
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
		var graduatelist = state.staff_services.payload;
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
