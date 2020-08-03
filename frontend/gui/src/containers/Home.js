import React from "react";
import {connect } from 'react-redux';
import axios from "axios";
import Account from "../components/Account";
import "antd/dist/antd.css";
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined, MailOutlined, CalendarOutlined } from '@ant-design/icons';
import "../css/home.css"

const { SubMenu } = Menu;
const {  Content,  Sider } = Layout;

class Home extends React.Component {

  // load data from server if toke is in storage
  constructor(props) {
  super(props);
  var token = localStorage.getItem('token')
  //console.log(token)
  if(localStorage.getItem('token')===null) {
    this.props.history.push('/login/');
  }else {
    axios.defaults.headers = {
      "Content-Type":"application/json",
      "Authorization": `Token ${token}`
      }
    axios.get("http://127.0.0.1:8000/api/").then((rest) => {
        this.setState({
          accounts: rest.data,
        });
        //console.log(rest.data[0]);
        // save name in localstorage to display on header
        localStorage.setItem('all_name', rest.data[0]['first_name']+" "+ rest.data[0]['last_name'])
      });
  }
}
  
  // redirect to Login if props.token is changed
  UNSAFE_componentWillReceiveProps(newProps){
    if(newProps.token===null) this.props.history.push('/login/');
  }

  state = {
    step: true,
  };


  view_info = collapsed => {
    this.setState({ step: true });
    console.log(this.state.step);
  };

  view_docs = comp =>{
    this.setState({ step: false });
    console.log(this.state.step);
  }


render(){ return(
    <Content style={{ padding: '0 0px' }}>
      
      <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
        <Sider className="site-layout-background" width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={this.state.step ? (['1']) : (['2'])}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%' }}
          >
            <Menu.Item key="1" icon={<MailOutlined />} onClick={this.view_info}>Verificar información</Menu.Item>
            <Menu.Item key="2" icon={<CalendarOutlined />} onClick={this.view_docs}>Subir documentación</Menu.Item>
          </Menu>
        </Sider>
        <Content style={{ padding: '0 24px', minHeight: 280 }}>{this.state.step ? ( <Account/>): (<h1>Subir documentación</h1>)}</Content>
      </Layout>
    </Content>
);
};
}

const mapStateToProps = state =>{
  return {
    token: state.token
  } 
}

export default connect(mapStateToProps)(Home);