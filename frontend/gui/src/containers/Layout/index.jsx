import React from "react";
import { Layout } from "antd";
import { withRouter } from "react-router-dom";
import * as action from "../../store/actions/auth";
import { connect } from "react-redux";
import Header from "../../components/Header";
import "../../css/layout.css";

const { Content } = Layout;

class NormalLayout extends React.Component {
	componentDidUpdate(prevProps, nextProps) {
		console.log("actualizando");

		if (prevProps.isAuthenticated !== this.props.isAuthenticated) {
			if (this.props.isAuthenticated === false) {
				this.props.history.push("/login/");
			}
		}
	}

	render() {
		return (
			<Layout
				style={{
					height: "100vh",
					width: "100vw",
				}}
			>
				<Header
					authenticated={this.props.isAuthenticated}
					logout={this.props.logout}
					user_name={this.props.name}
				/>
				<Content
					className="site-layout"
					style={{
						padding: "1%",
						overflow: "auto",
						marginTop: 65,
					}}
				>
					{React.cloneElement(this.props.children, {
						user_type: this.props.user_type,
					})}
				</Content>
			</Layout>
		);
	}
}

const mapStateToProps = (state) => {
	/*store name into props to put it in header*/
	// var name = null;
	// if (state.account !== undefined) {
	// 	if (state.account.payload !== null) {
	// 		name =
	// 			state.account.payload.account["first_name"] +
	// 			" " +
	// 			state.account.payload.account["last_name"];
	// 	}
	// }
	return {
		name: state.auth.fullname,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		logout: () => dispatch(action.logout()),
	};
};

export default withRouter(
	connect(mapStateToProps, mapDispatchToProps)(NormalLayout)
);
