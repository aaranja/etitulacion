import React from "react";
import { Layout, Spin } from "antd";
import { connect } from "react-redux";
import { logout } from "../../store/actions/auth";
import Header from "../../components/Header";
import { withRouter } from "../../routes/withRouter";
import { userTypes } from "../../site/collections/userTypes";
import "../../site/css/layout.css";
import { LoadingOutlined } from "@ant-design/icons";

const { Content } = Layout;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

class NormalLayout extends React.Component {
  constructor(props) {
    super(props);
    let windowWidth = "70%";
    if (window.innerWidth <= 1081) {
      windowWidth = "100%";
    }
    this.state = { windowWidth: windowWidth, loaded: false };
  }

  handleResize = (e) => {
    const windowSize = window.innerWidth;

    if (windowSize <= 1081) {
      // let windowWidth = "100%";
      if (this.state.windowWidth !== "100%") {
        this.setState({
          windowWidth: "100%",
        });
      }
    } else {
      if (this.state.windowWidth !== "70%") {
        this.setState({
          windowWidth: "70%",
        });
      }
    }

    // this.setState({ windowWidth: window.innerWidth });
  };

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    // if (nextState.loaded === this.state.loaded) {
    //   console.log("diferente", this.state.loaded);
    // } else {
    //   console.log("no diferente");
    // }

    if (!this.state.loaded) {
      if (!this.props.loading && !nextProps.loading) {
        nextState.loaded = true;
      } else {
        if (this.props.loading && !nextProps.loading) {
          nextState.loaded = true;
        }
      }
    }

    return true;
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  render() {
    let usertype = null;
    if (this.props.auth !== null) {
      usertype = this.props.auth.usertype;
    }
    return (
      <Layout
        style={{
          height: "100vh",
          backgroundColor: "white",
          // backgroundColor: "#F9F7F7",
        }}
      >
        <>
          {this.props.isAuthenticated ? (
            <Header
              authenticated={this.props.isAuthenticated}
              logout={this.props.logout}
              user_name={this.props.auth.name}
              page_type={userTypes[usertype]}
              user_type={usertype}
              size={this.state.windowWidth}
            />
          ) : (
            <Header
              authenticated={this.props.isAuthenticated}
              logout={this.props.logout}
              size={this.state.windowWidth}
            />
          )}
          {this.state.loaded ? (
            <Content
              style={{
                width: this.state.windowWidth,
                minWidth: 480,
                margin: "auto",
                marginTop: "65px",
                zIndex: "50",
              }}
            >
              {React.cloneElement(this.props.children, {
                usertype: usertype,
                navigate: this.props.navigate,
                params: this.props.params,
                location: this.props.location,
                match: this.props.match,
              })}
            </Content>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10vh",
              }}
            >
              <Spin indicator={antIcon} />
            </div>
          )}
        </>
      </Layout>
    );
  }
}

const mergeProps = (ownProps, mapProps, dispatchProps) => {
  return { ...ownProps, ...mapProps, ...dispatchProps };
};

const mapStateToProps = (state) => {
  let isAuth = false;
  if (state.auth.payload !== null) {
    isAuth = state.auth.payload.token !== null;
  }

  return {
    auth: state.auth.payload,
    loading: state.auth.loading,
    isAuthenticated: isAuth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps, mergeProps)(NormalLayout)
);
