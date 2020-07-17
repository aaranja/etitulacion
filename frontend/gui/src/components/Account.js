import React from "react";
import { List, Divider, Table, Form, Input, InputNumber, Button, Select, Radio } from "antd";
import {connect } from 'react-redux';
import axios from "axios";
import "antd/dist/antd.css";
const { useRef, forwardRef, useState } = React;

let lastIndex = 0;
const updateIndex = () => {
	lastIndex++;
	return lastIndex;
};


class Account extends React.Component{

	state = {
    account: [],
    formFields:{
    	enrollment:''
    }
  };

	constructor(props){
		super(props);
		this.myRef = React.createRef();
	}

	getUserData(){
		let data = [];
		var token = localStorage.getItem('token')
		if (token === null){
			this.props.history.push('/login/');
		}else{
			axios.defaults.headers = {
				"Content-Type":"application/json",
				"Authorization": `Token ${token}`
			}
			axios.get("http://127.0.0.1:8000/api/account/").then((response) => {
				this.setState({
			        account: response.data,
			      });

				this.setState(prevState => {
                let formFields = Object.assign({}, prevState.formFields)
                formFields['enrollment'] = response.data[0]['enrollment']
                return {formFields}
            });
			  });
		}
	}

	componentDidMount(){
		this.getUserData()
	}

	UNSAFE_componentWillReceiveProps(newProps){
		//console.log(this.state.account)
		if(newProps.token===null) this.props.history.push('/login/');
	}
	onFinish = (values) => {
		console.log(values);
	};

	render(){
		const layout = {
		  labelCol: {
			span: 8,
		  },
		  wrapperCol: {
			span: 16,
		  },
		};

		//console.log(this.state.formFields)
		//const inputRef = useRef();

		let profiles = this.state.account.map(profile => {
			console.log(profile)
            return 	<div key={updateIndex()} ref={this.myRef}> 
            			<Form.Item
            				
							name={['user', 'first_name']}
							label="Nombre(s)"
							key={updateIndex()}
							rules={null}
						>
							<Input defaultValue={profile.account.first_name} style={{ width: 200 }}/>
					  	</Form.Item>
					  	<Form.Item
							name={['user', 'last_name']}
							label="Apellidos"
							rules={null}
							key={updateIndex()}
					  	>
							<Input defaultValue={profile.account.last_name}/>
					  	</Form.Item>
					  	<Form.Item
					  		key={updateIndex()}
							name={['user', 'email']}
							label="Email"
							rules={[
							  {
								type: 'email',
							  },
							]}
						>
							<Input defaultValue={profile.account.email}/>
					  	</Form.Item>
					  	<Form.Item
					  		key={updateIndex()}
							name={['profile', 'enrollment']}
							label="Matrícula"
							rules={[
							  {
								type: 'number',
								
							  },
							]}
						>
							<Input key={profile.enrollment} style={{ width: 160 }} defaultValue={profile.enrollment}/>
						</Form.Item>
						  <Form.Item
						  	  key={updateIndex()} 
						      label="Carrera" 
						      name='career' 
						      rules={[
						          {
						            message: "Por favor seleccione su carrera!",
						          },
						        ]}>
						    <Select  defaultValue={profile.career}>
						    	<Select.Option value="sistemas">Ing. Sistemas</Select.Option>
						    	<Select.Option value="mecatronica">Ing. Mecatrónica</Select.Option>
						    </Select>
					   	</Form.Item>
					   	<Form.Item 
					        label="Género" 
					        key={updateIndex()}
					        name="gender"
					        rules={[
					          {
					            message: "Por favor seleccione una opción!",
					          },
					        ]} >
					          <Radio.Group style={{ width: 400 }} defaultValue={profile.gender} ref={this.myRef}>
					            <Radio.Button value="M">Masculino</Radio.Button>
					            <Radio.Button value="F">Femenino</Radio.Button>
					            <Radio.Button value="O">Otro</Radio.Button>
					          </Radio.Group>
					    </Form.Item>
            		</div>
        })
		//console.log(test_state.currentObject.enrollment.value)
		//<code>{JSON.stringify(this.state.account)}</code>

		return(
			<div>
				<Divider orientation="center">Información personal</Divider>
				<p> {this.state.account.enrollment}</p>
				<Form {...layout} name="nest-messages" onFinish={this.onFinish} validateMessages={null} >
					  {profiles} 
					  <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }} orientation="right">
						<Button type="primary" htmlType="submit">
						  Guardar
						</Button>
					  </Form.Item>
				</Form>
			</div>
			);
	};
}

const mapStateToProps = state =>{
  return {
	token: state.token
  } 
}
export default connect(mapStateToProps)(Account);
