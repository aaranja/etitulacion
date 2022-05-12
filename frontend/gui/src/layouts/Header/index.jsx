import React, {Component} from "react";
import {Layout} from "antd";
import {Link} from "react-router-dom";

const {Header} = Layout;

class CustomHeader extends Component {

    render() {
        return (
            this.props.logged ? (
                <Header>

                </Header>
            ) : (
                <Header className={"navbar"}>
                    <div className="container">
                        <div className="navbar-brand" style={{float: "left"}}>
                            <Link to="">
                                ETITULACIÓN
                                {/*<img src={logo} alt={""} width="100%" />*/}
                            </Link>
                        </div>
                    </div>
                </Header>
            )


        )
    }
}

export default CustomHeader;