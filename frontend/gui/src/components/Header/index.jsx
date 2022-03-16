import React from "react";
import {Layout, Menu} from "antd";
import UserSubMenu from "./UserSubMenu";
import logo from "../../site/img/logotipo3.svg";

const {Header} = Layout;

class NormalHeader extends React.Component {
    render() {
        return (
            <>
                {this.props.authenticated ? (
                    <Header
                        style={{
                            position: "fixed",
                            boxShadow: "1px 3px 10px #9E9E9E",
                            width: "100%",
                            height: "65px",
                            zIndex: "999",
                            backgroundColor: "#05386B",
                        }}
                    >
                        <div
                            style={{
                                width: this.props.size,
                                margin: "auto",
                                backgroundColor: "grey",
                            }}
                        >
                            <div className="logo" style={{float: "left"}}>
                                <a href="/home/">
                                    <img src={logo} alt={""} width="100%"/>
                                </a>
                            </div>

                            <Menu
                                mode="horizontal"
                                className="rightMenu"
                                key="10"
                                defaultSelectedKeys={["1"]}
                                style={{
                                    float: "right",
                                    display: "flex",
                                    maxWidth: 500,
                                    backgroundColor: "#05386B",
                                }}
                            >
                                <UserSubMenu
                                    key={15}
                                    user_name={this.props.user_name}
                                    user_type={this.props.user_type}
                                    logout={this.props.logout}
                                />
                            </Menu>

                        </div>
                    </Header>
                ) : (
                    <Header
                        style={{
                            position: "fixed",
                            boxShadow: "1px 3px 10px #9E9E9E",
                            width: "100%",
                            height: "65px",
                            zIndex: "9999",
                            backgroundColor: "#05386B",
                        }}
                    >
                        <div
                            style={{
                                width: this.props.size,
                                margin: "auto",
                            }}
                        >
                            <div className="logo" style={{float: "left"}}>
                                <a href="/home/">
                                    <img src={logo} alt={""} width="100%"/>
                                </a>
                            </div>
                        </div>
                    </Header>
                )}
            </>
        );
    }
}

export default NormalHeader;
