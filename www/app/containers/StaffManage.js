import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import { routerMiddleware, push } from 'react-router-redux';
import { Router, Route, routerRedux } from 'dva/router';
import { connect } from "dva";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

import App from "./App.js";

class StaffManage extends Component {
    render() {
        return (
            <App current="staffmanage">
                <Layout>
                    {
                        this.props.hideSider
                        ?
                            null
                        :
                            <Sider width={200} style={{ background: '#fff' }}>
                                <Menu
                                    mode="inline"
                                    defaultSelectedKeys={[this.props.current]}
                                    style={{ height: '100%', borderRight: 0 }}
                                    onSelect={({ item, key, selectedKeys }) => {
                                      
                                        this.props.dispatch(routerRedux.push('/' + key));
                                    }}
                                >
                                    <Menu.Item key="stafflist">员工清单</Menu.Item>
                                    <Menu.Item key="addstaff">增加员工</Menu.Item>
                                </Menu>
                            </Sider>
                    }
                        
                    <Layout style={{ padding: '0 24px 24px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>List</Breadcrumb.Item>
                            <Breadcrumb.Item>App</Breadcrumb.Item>
                        </Breadcrumb>
                        <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                            {this.props.children}
                        </Content>
                    </Layout>
                </Layout>
            </App>
        )
    }
}

export default connect()(StaffManage);