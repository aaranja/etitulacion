/* Class HOME: to manage all diferents views to differents users
 */
import React from "react";
import { connect } from "react-redux";
import Process from "../../containers/Process";
import SServices from "../../containers/SServices";
import Coordination from "../../containers/Coordination";
import * as actions from "../../store/actions/account";
import * as userTypes from "../../const/userTypes";

class Home extends React.Component {
	componentDidMount() {
		/* get user data to share within other components*/
		if (this.props.user_type === userTypes.USER_GRADUATE) {
			/* get process data of graduate users*/
			this.props.getUserData();
		}
	}

	componentDidUpdate() {
		if (!this.props.account.loading) {
			//when isn't loading the loggin
			if (this.props.account.error != null) {
				console.log(this.props.account.error);
			} else {
			}
		}
	}

	render() {
		const userView = (user_type) => {
			if (this.props.loading !== true && user_type !== null) {
				switch (user_type) {
					case userTypes.USER_GRADUATE:
						return <Process />;
					case userTypes.USER_SERVICES:
						return <SServices match={this.props.match} />;
					case userTypes.USER_COORDINATION:
						return <Coordination />;
					default:
						return (
							<p>
								Ha ocurrido un error, no se puede cargar su tipo
								de usuario
							</p>
						);
				}
			} else {
				/*if data is still loading*/
				return <p> CARGANDO </p>;
			}
		};

		/* render a different view according to user type*/
		return userView(this.props.user_type);
	}
}

const mapStateToProps = (state) => {
	return {
		account: state.account,
		loading: state.account.loading,
		error: state.account.error,
		user_type: state.auth.user_type,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		getUserData: () => dispatch(actions.accountGetData()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
