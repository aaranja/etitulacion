import React from "react";
import { Layout, Menu} from "antd";
import { Link, withRouter } from "react-router-dom";
import * as action from "../store/actions/auth";
import { connect } from "react-redux";
import '../css/layout.css'; 

const { Header, Content } = Layout;


/*function handleButtonClick(e) {
  message.info('Click on left button.');
  console.log('click left button', e);
}
*/
/*function handleMenuClick(e) {
  message.info('Click on menu item.');
  console.log('click', e);
}*/

/*const menu = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key="1" icon={<UserOutlined />}>
      Cerrar sesión
    </Menu.Item>
  </Menu>
);*/


class SiderDemo extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    //console.log(collapsed);
    this.setState({ collapsed });
  };

render() {
  //console.log("logeado: ".concat(this.props.isAuthenticated));

  return (
    <Layout className="layout">
    <Header>
      <div className="logo" />
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']}>
    {this.props.isAuthenticated ? (
              <Menu.Item key="1" onClick={this.props.logout}>
                Cerrar sesión
              </Menu.Item>
            ) : (
              <Menu.Item key="1">
                <Link to="/login/">Iniciar sesión</Link>
              </Menu.Item>
            )}
        <Menu.Item key="2">nav 2</Menu.Item>
        <Menu.Item key="3">nav 3</Menu.Item>
      </Menu>
    </Header>
    <Content style={{ padding: '30px 50px' }}>
      <div className="site-layout-content">{this.props.children}</div>
    </Content>
  </Layout>
  );


};


}

const mapDispatchToProps = (dispatch) => {
  
  return {
    logout: () => dispatch(action.logout()),
  };
};



export default withRouter(connect(null, mapDispatchToProps)(SiderDemo));
