import React from "react";
import { Layout } from "antd";
import { withRouter } from "react-router-dom";
import * as action from "../../store/actions/auth";
import { connect } from "react-redux";
import Header from "../../components/Header";
import "../../css/layout.css";

const { Content } = Layout;

class NormalLayout extends React.Component {
	render() {
		return (
			<Layout style={{ height: "100vh" }}>
				<Header
					authenticated={this.props.isAuthenticated}
					logout={this.props.logout}
				/>
				<Content
					style={{
						padding: "30px 50px",
					}}
				>
					{this.props.children}
				</Content>
			</Layout>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		logout: () => dispatch(action.logout()),
	};
};

export default withRouter(connect(null, mapDispatchToProps)(NormalLayout));
