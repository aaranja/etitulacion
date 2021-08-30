import React from "react";
import { Layout, Steps, Divider, Card } from "antd";
const { Sider } = Layout;
const { Step } = Steps;

class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.state = { current: props.current };
	}

	onChange = (current) => {
		this.props.callbackFromParent(current);
		this.setState({ current });
	};

	componentDidUpdate(prevProps) {
		/* cambiar el step actual por el nuevo */
		if (this.props.current !== prevProps.current) {
			this.setState({ current: this.props.current });
		}
	}

	render() {
		return (
			<Card
				style={{
					marginRight: "0.5%",
					overflow: "auto",
					position: "fixed",
					left: 10,
					minHeight: "90vh",
					width: 250,
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Sider
					width={200}
					className="site-layout-background"
					style={{
						backgroundColor: "white",
						display: "flex",
						flexDirection: "column",
						justifyContent: "flex-end",
					}}
				>
					<div>
						<Divider
							orientation="center"
							style={{
								paddingLeft: "5%",
								paddingRight: "5%",
							}}
						>
							Proceso
						</Divider>
						<Steps
							current={this.state.current}
							direction="vertical"
							style={{
								paddingLeft: "8%",
								borderRight: "0",
							}}
						>
							<Step
								title="Información"
								description="Valida tus datos personales."
							/>
							<Step
								title="Documentación"
								description="Sube la documentación requerida."
							/>
							<Step
								title="Aprobación S.E."
								description="Servicios escolares está validando tu proceso."
							/>
							<Step
								title="Tipo de titulación"
								description="Selecciona el tipo de titulación."
							/>
							<Step
								title="Aprobación C.T."
								description="Servicios escolares está validando tu proceso."
							/>
						</Steps>
					</div>
				</Sider>
			</Card>
		);
	}
}

export default Sidebar;
