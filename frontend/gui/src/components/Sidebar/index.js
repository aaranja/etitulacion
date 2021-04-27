import React from "react";
import { Layout, Menu, Steps, Divider } from "antd";

const { Sider } = Layout;
const { Step } = Steps;

class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			current: props.current,
		};
	}

	onChange = (current) => {
		this.props.callbackFromParent(current);
		this.setState({ current });
	};

	render() {
		const { current } = this.state;
		return (
			<Sider width={200} className="site-layout-background">
				<Menu
					mode="inline"
					defaultSelectedKeys={["1"]}
					defaultOpenKeys={["sub1"]}
					style={{ height: "100%", borderRight: 0 }}
				>
					<div>
						<Divider
							orientation="center"
							style={{ paddingLeft: "5%", paddingRight: "5%" }}
						>
							Proceso
						</Divider>
						<Steps
							current={current}
							onChange={this.onChange}
							direction="vertical"
							style={{ paddingLeft: "7%" }}
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
				</Menu>
			</Sider>
		);
	}
}

export default Sidebar;
