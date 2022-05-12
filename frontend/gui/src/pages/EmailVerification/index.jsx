import React, {Component} from "react";
import withRouter from "../../routes/withRouter/withRouter";
import {connect} from "react-redux";
import {auth} from "../../store/services/auth";
import EmailConfirmation from "./EmailConfirmation";

class EmailVerification extends Component {

    constructor(props) {
        super(props);
        const localstate = this.props.location.state;
        this.state = {
            email: localstate !== null ? localstate.email : null,
        };
        this.form = React.createRef();
    }


    componentDidMount() {
        const {email} = this.state;
        // return to login is the user opens de link randomly
        if (email === null) {
            this.setState({
                noemail: true,
            })
        } else {
            //    check state of email verification
            this.props.checkEmail({email: email})
        }
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        /* return to login if the page doesn't receive email on localstate*/
        if (this.state.noemail) {
            this.props.navigate("/login")
        }
    }

    render() {
        const {email} = this.state;
        let result = this.props.emailChecked({email: email})

        console.log("check", result)

        if (result.isSuccess) {
            if (result.data.verified) {
                return <div>Su cuenta ya está verificada. Haga clic aquí para ir a la página de inicio de sesión</div>
            } else {
                return <EmailConfirmation email={email} time={result.data.sent}/>
            }
        } else {
            return <div>Loading</div>
        }


    }
}

const mapStateToProps = (state) => {
    return {
        emailChecked: (email) => auth.endpoints.checkEmailVerification.select(email)(state),
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        checkEmail: (email) => {
            dispatch(auth.endpoints.checkEmailVerification.initiate(email))
        }
    }
}

export default (withRouter(connect(mapStateToProps, mapDispatchToProps)(EmailVerification)));