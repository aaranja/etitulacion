import React, { Component } from "react";
import { Table, PageHeader, Button, Card, Layout } from "antd";
import * as actions from "../../../store/actions/staff_services";
import { ReloadOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import columns from "./columns";
import Sidebar from "./Sidebar";

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

	render() {
		return (
			<>
				<Sidebar />
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
			</>
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
