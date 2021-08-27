import React, { Component } from "react";
import {
	Divider,
	Button,
	Form,
	Upload,
	Table,
	PageHeader,
	Descriptions,
} from "antd";
import {
	UploadOutlined,
	ArrowRightOutlined,
	SaveOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions/process";
import columns from "./columns";

class UploadDocuments extends Component {
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
		};
	}

	componentDidMount() {
		this.props.getDocumentsDetails();
	}
	render() {
		return (
			<div>
				<PageHeader
					ghost={false}
					onBack={() => this.props.callbackFromParent(0)}
					title="Documentación"
					/*subTitle="This is a subtitle"*/
					extra={[
						<Button key="2">
							Guardar <SaveOutlined />
						</Button>,
						<Button key="1" type="primary">
							Siguiente <ArrowRightOutlined />
						</Button>,
					]}
				>
					<Descriptions size="middle" column={1}>
						<Descriptions.Item label={<b>INSTRUCCIONES</b>}>
							Deberá subir en cada uno de los apartos
							correspondientes los documentos escaneados en
							<b>&nbsp;ORIGINAL&nbsp;</b> para su cotejo.
						</Descriptions.Item>
						<Descriptions.Item>
							<b>
								Un archivo digital (PDF) por cada documento, por
								ambos lados, no mayor a 2.5MB. ESCANEAR LOS
								DOCUMENTOS ORIGINALES.
							</b>
						</Descriptions.Item>
					</Descriptions>
				</PageHeader>
				<Divider orientation="center">Subir documentación</Divider>
				<Table
					pagination={false}
					rowClassName={() => "editable-row"}
					bordered
					dataSource={this.props.dataSource}
					columns={columns}
				/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	var dataSource = null;
	if (state.servdata.loading !== true) {
		dataSource = state.servdata.payload;
	}
	var testdata = [
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
	];
	return {
		dataSource: dataSource,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getDocumentsDetails: () =>
			dispatch(actions.processGetDocumentsDetails()),
		onNextProcess: (values) => dispatch(actions.processStep2(values)),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(UploadDocuments);
