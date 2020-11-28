import React, {Component} from 'react';
import {Link} from "react-router-dom";

import GoogleLogin from 'react-google-login';

import {connect} from "react-redux";

import * as actionTypes from './../../redux/actions';


import {
    googleLogin,
    nativeLogin,
    saveGoogleToken,
    authLogin
} from "../../services/auth";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invalid_email:false,
            invalid_email_message:"",
            invalid_password:false,
            invalid_password_message:""
        }
    }
    
    handleSubmit = e => {
        e.preventDefault();
        const user = {
            email: this.state.email,
            password: this.state.password
        };
        
        // nativeLogin(user)
        //     .then(data => {
        //         this.props.registerUser(data.user);
        //         this.props.history.push('/');
        //         window.toastr.success(data.message)
        //     })
        //     .catch(error => {
        //         window.toastr.error(error.message)
        //     });

        authLogin(user)
            .then(data => {
                this.props.history.push('/');
                window.toastr.success(data.message)
            })
            .catch(error => {
                window.toastr.error(error.message)
            });
    };
    
    handleOnChange = e => {
        let {name,value} = e.target;
        this.setState({
            [name]:value
        });
    };
    
    handleOnBlurEmail = e => {
        const email = this.state.email;
        this.setState({
            invalid_email:!/^\S+@ite.edu.mx$/.test(email),
            invalid_email_message:"Use un correo institucional"
        });
    };
    
    onSignIn = (googleUser) => {
        window.toastr.warning('Coming Soon');
        return true;
        const profile = googleUser.getBasicProfile();
        const user = {
            "name":profile.getGivenName(),
            "full_name":profile.getName(),
            "email":profile.getEmail(),
            "idtoken":googleUser.tokenId
        };
        if(!/^[\w-\.]+@ite.edu.mx$/.test(profile.getEmail())){
            window.toastr.warning("Correo electronico no valido.");
            return;
        }
        googleLogin(user)
            .then(data=>{
                this.props.registerUser(data.user);
                this.props.history.push('/');
                window.toastr.success(data.message);
            })
            .catch(error=>{
                window.toastr.error(error.message);
            })
    };

    responseGoogle = (response) => {
        console.log(response);
    };
    
    render() {
        return (
            <div>
                <div className="hold-transition login-page">
                    <div className="login-box">
                        <div className="login-logo">
                            <b>e</b>Titulacion
                        </div>
                        <div className="card">
                            <div className="card-body login-card-body">
                                <p className="login-box-msg">Inicia sesion en eTitulacion</p>
                                <form onSubmit={this.handleSubmit.bind(this)}>
                                    <div className="input-group mb-3">
                                        {/*onBlur={this.handleOnBlurEmail.bind(this)}*/}
                                        <input id="email" name="email" type="email" className={this.state.invalid_email ? "form-control is-invalid" : "form-control"} placeholder="Correo electronico" onChange={this.handleOnChange.bind(this)} />
                                        <div className="input-group-append">
                                            <div className="input-group-text">
                                                <span className="fas fa-envelope" />
                                            </div>
                                        </div>
                                        <span id="InputEmail-error" className="error invalid-feedback">{this.state.invalid_email_message}</span>
                                    </div>
                                    <div className="input-group mb-3">
                                        <input name="password" type="password" className={this.state.invalid_password ? "form-control is-invalid" : "form-control"} placeholder="Contraseña"  onChange={this.handleOnChange.bind(this)}/>
                                        <div className="input-group-append">
                                            <div className="input-group-text">
                                                <span className="fas fa-lock" />
                                            </div>
                                        </div>
                                        <span id="InputPassword-error" className="error invalid-feedback">{this.state.invalid_password_message}</span>
                                    </div>
                                    <div className="row">
                                        <div className="col-8">
                                            <div className="icheck-primary">
                                                <input name="remember" type="checkbox" id="remember" onChange={(e)=>{this.setState({remember:e.target.checked})}}/>
                                                <label htmlFor="remember">
                                                    Recordarme
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <button type="submit" className="btn btn-primary btn-block">Acceder</button>
                                        </div>
                                    </div>
                                </form>
                                <div className="social-auth-links text-center mb-3">
                                    <p>- O -</p>
                                    <GoogleLogin
                                        clientId="216096255980-7gpdh29061s55o96deeri9t6r8ihsj7s.apps.googleusercontent.com"
                                        render={props =>
                                            (
                                                <button onClick={props.onClick} disabled={props.disabled} className="btn btn-block btn-danger">
                                                    <i className="fab fa-google-plus mr-2" /> Acceder con Google
                                                </button>
                                            )    
                                        }
                                        onSuccess={this.onSignIn}
                                        buttonText="Login"
                                        onFailure={this.responseGoogle}
                                        cookiePolicy={'single_host_origin'}
                                    >
                                    </GoogleLogin>
                                </div>
                                <p className="mb-1">
                                    <Link to="/forgot-password">¿Olvido su contraseña?</Link>
                                </p>
                                <p className="mb-0">
                                    <Link to="register" className="text-center">Registrese para crear una cuenta</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        registerUser: (user) => dispatch({type: actionTypes.WRITE_USER,user}),
        authSuccess: (token) => dispatch({type: actionTypes.AUTH_SUCCESS, token}),
        authFail: (error) => dispatch({type: actionTypes.AUTH_FAIL, error})
    };
};
export default connect(null, mapDispatchToProps)(Login);