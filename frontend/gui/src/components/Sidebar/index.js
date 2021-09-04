import React from "react";
import { Layout, Steps, Divider, Card } from "antd";
const { Sider } = Layout;
const { Step } = Steps;

class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.state = { current: props.current };
		console.log(this.props.currentFinished);
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

	status = (key) => {
		if (key < this.props.currentFinished) {
			return "finish";
		} else {
			if (key === this.props.currentFinished) {
				return "process";
			} else {
				return "wait";
			}
		}
	};

	render() {
		return (
			<Card
				style={{
					margin: 0.5,
					overflowY: "scroll",
					position: "fixed",
					display: "flex",
					flexDirection: "column",
					maxHeight: "90vh",
					minWidth: 250,
					width: 300,
					minHeight: "89vh",
					left: 10,
					padding: 0,
				}}
			>
				<Sider
					width={200}
					className="site-layout-background"
					style={{
						backgroundColor: "white",
						paddingBottom: "15%",
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
								status={this.status(0)}
							/>
							<Step
								title="Documentación"
								description="Sube la documentación requerida."
								status={this.status(1)}
							/>
							<Step
								title="Aprobación S.E."
								description="Servicios escolares está validando tu proceso."
								status={this.status(2)}
							/>
							<Step
								title="Tipo de titulación"
								description="Selecciona el tipo de titulación."
								status={this.status(3)}
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
