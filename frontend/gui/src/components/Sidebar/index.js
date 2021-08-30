import React from "react";
import { Layout, Menu, Steps, Divider, Card } from "antd";
import {
	UserOutlined,
	ProfileOutlined,
	LogoutOutlined,
} from "@ant-design/icons";
import Logo from "../../img/logo-transparent2.png";
const { Sider } = Layout;
const { Step } = Steps;
const { SubMenu } = Menu;

class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		/*console.log("cambiando a:", props.current);*/
		this.state = { current: props.current };
		console.log(this.props.name);
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
