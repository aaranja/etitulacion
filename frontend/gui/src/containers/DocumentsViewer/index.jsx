import React, { Component } from "react";
import { Card, PageHeader, Button, List, Space } from "antd";
import * as actions from "../../store/actions/staff_services";
import { connect } from "react-redux";

class DocumentsViewer extends Component {
	constructor(props) {
		super(props);
		this.props.getDocumentsDetails();
		this.state = {
			metadata: [],
		};
	}

	componentDidUpdate() {
		console.log(this.props);
	}

	render() {
		return (
			<Card
				style={{
					margin: 0,
					minHeight: 280,
					overflow: "initial",
				}}
			>
				<PageHeader
					ghost={false}
					title="Documentos"
					onBack={() => {
						this.props.callBack("list");
					}}
					/*subTitle="This is a subtitle"*/
				></PageHeader>
				<List
					size="large"
					footer={
						<div
							style={{
								display: "flex",
								justifyContent: "center",
							}}
						>
							<Space>
								Descargar todos los archivos
								<Button type="primary">Aqui</Button>
							</Space>
						</div>
					}
					bordered
					dataSource={this.props.metadata}
					renderItem={(item) => <List.Item>{item}</List.Item>}
				/>
			</Card>
		);
	}
}

const formatDataSource = (metadata) => {
	var list = [];
	if (metadata !== undefined) {
		for (const key in metadata) {
			if (metadata[key].clasification !== 2) {
				list.push(metadata[key].fullName);
			}
		}
	}
	return list;
};

const mapStateToProps = (state) => {
	var documents = [];
	var currentState = state.staff_services;
	if (!currentState.loading && currentState.payload.documents !== undefined) {
		documents = formatDataSource(currentState.payload.documents);
	}

	console.log(documents);

	return {
		loading: state.staff_services.loading,
		metadata: documents,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getDocumentsDetails: () => dispatch(actions.getDocumentsDetails()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentsViewer);
