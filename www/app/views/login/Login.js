import React, { Component } from 'react';
import { Row, Col ,Form, Icon, Input, Button, Checkbox } from 'antd';
import axios from "axios";
import { Router, Route, routerRedux } from 'dva/router';
const FormItem = Form.Item;

import "./less.less";

class Login extends Component {
    render() {
        const { getFieldsValue, getFieldDecorator } = this.props.form;

        return (
            <div className="login_wrap">
                <div className="login_box">
                    <h1>请登录</h1>
                    <hr/>
                    <Form className="login-form">
                        <FormItem>
                            {getFieldDecorator('id')(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password')(
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                            )}
                        </FormItem>
                        <FormItem>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                className="login-form-button"
                                onClick={()=>{
                                    axios.post("/api/login", getFieldsValue()).then(data=>{
                                        if(data.data == "1"){
                                            window.location = "/#/";
                                        }else{
                                            alert("请检查用户名和密码！");
                                        }
                                    });
                                }}
                            >
                                Log in
                            </Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create()(Login);