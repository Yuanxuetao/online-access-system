import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

import App from "./App.js";

export default class TaskManage extends Component {
    render() {
        return (
            <App current="taskmanage">
                <Layout>
                    <Sider width={200} style={{ background: '#fff' }}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={[this.props.current]}
                            style={{ height: '100%', borderRight: 0 }}
                        >
                            <Menu.Item key="taskpanel">任务看板</Menu.Item>
                            <Menu.Item key="addtask">增加任务</Menu.Item>
                        </Menu>
                    </Sider>
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
