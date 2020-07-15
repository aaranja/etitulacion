import React from "react";
import {connect } from 'react-redux';
import axios from "axios";
import "antd/dist/antd.css";
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
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
        //console.log(rest.data[0]['first_name']);
        localStorage.setItem('all_name', rest.data[0]['first_name']+" "+ rest.data[0]['last_name'])
      });
  }
}
  
  // redirect to Login if props.token is changed
  UNSAFE_componentWillReceiveProps(newProps){
    if(newProps.token===null) this.props.history.push('/login/');
  }

render(){ return(
    <Content style={{ padding: '0 0px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
        <Sider className="site-layout-background" width={200}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{ height: '100%' }}
          >
            <SubMenu key="sub1" icon={<UserOutlined />} title="subnav 1">
              <Menu.Item key="1">option1</Menu.Item>
              <Menu.Item key="2">option2</Menu.Item>
              <Menu.Item key="3">option3</Menu.Item>
              <Menu.Item key="4">option4</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<LaptopOutlined />} title="subnav 2">
              <Menu.Item key="5">option5</Menu.Item>
              <Menu.Item key="6">option6</Menu.Item>
              <Menu.Item key="7">option7</Menu.Item>
              <Menu.Item key="8">option8</Menu.Item>
            </SubMenu>
            <SubMenu key="sub3" icon={<NotificationOutlined />} title="subnav 3">
              <Menu.Item key="9">option9</Menu.Item>
              <Menu.Item key="10">option10</Menu.Item>
              <Menu.Item key="11">option11</Menu.Item>
              <Menu.Item key="12">option12</Menu.Item>
            </SubMenu>
          </Menu>
        </Sider>
        <Content style={{ padding: '0 24px', minHeight: 280 }}>Content</Content>
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