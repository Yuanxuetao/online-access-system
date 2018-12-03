import React, { Component } from 'react';
import { Layout, Menu, Row, Col, Popover,  Modal } from 'antd';
import { routerRedux } from 'dva/router';
import { connect } from "dva";
import UpdateStaffDrawer from "../components/UpdateStaffDrawer.js";
import ChooseAndUploadAvatarAndCutPic from "../components/ChooseAndUploadAvatarAndCutPic.js";
import axios from "axios";
import Chat from "../components/Chat.js";

import "../less/less.less";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
 
class App extends Component {
    constructor(props){
        super();

        //登陆验证
        props.dispatch({ "type": "meModel/checkLogin"});

        this.state = {
            visibleDrawer : false,
            // 是否显示模态框
            visible: false
        }
    }

    //收到新的props的时候
    componentWillReceiveProps(props){
        if(!props.login){
            this.props.dispatch(routerRedux.push("/login"));
        }
    }


    showModal() {
        this.setState({
            visible: true,
        });
    }

    handleOk(e) {

        this.setState({
            visible: false,
        });
    }

    handleCancel(e) {

        this.setState({
            visible: false,
        });
    }

   
    render() {
        if (!this.props.login){
            return null;
        }


        const content = (
            <div>
                <p>
                    <a href="javascript:void()" onClick={() => {
                        this.setState({
                            "visibleDrawer": true
                        });
                    }}>修改资料</a>
                </p>
                <p>
                    <a href="javascript:void()" onClick={() => {
                        this.setState({
                            "visible": true
                        });
                    }}>修改头像</a>
                </p>
            </div>
        );

        return (
            <div>
                {/* 抽屉 */}
                <UpdateStaffDrawer 
                    closeHandler={()=>{
                        this.setState({
                            "visibleDrawer" : false
                        })
                    }}
                    visible={this.state.visibleDrawer}
                    sid={Number(this.props.id)}
                ></UpdateStaffDrawer>

                {/* 修改头像 */}
                {/* 模态框，用来裁剪头像 */}
                <Modal
                    title="Basic Modal"
                    visible={this.state.visible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    width={700}
                    height={400}
                    footer={<div></div>}
                >
                    <ChooseAndUploadAvatarAndCutPic
                        maxH={400}
                        quedingjiancaiHandler={({ picname }) => {
                            axios.post("/api/updateavtar", {
                                picname,
                                id: this.props.id
                            });
                            this.handleCancel();
                            window.location.reload();
                        }}
                    ></ChooseAndUploadAvatarAndCutPic>
                </Modal>

                <Layout>
                    <Header className="header">
                        <Row>
                            <Col span={20}>
                                <div className="logo" />
                                <Menu
                                    theme="dark"
                                    mode="horizontal"
                                    defaultSelectedKeys={[this.props.current]}
                                    style={{ lineHeight: '64px' }}
                                    onClick={({ key }) => {
                                        console.log(1)
                                        if (key == "staffmanage") {
                                            this.props.dispatch(routerRedux.push('/stafflist'));
                                        } else if (key == "taskmanage") {
                                            this.props.dispatch(routerRedux.push('/taskpanel'));
                                        } else if (key == "home") {
                                            this.props.dispatch(routerRedux.push('/'));
                                        }
                                    }}
                                >
                                    <Menu.Item key="home">首页</Menu.Item>
                                    <Menu.Item key="staffmanage">人事管理</Menu.Item>
                                    <Menu.Item key="taskmanage">任务管理</Menu.Item>
                                </Menu>
                            </Col>
                            <Col span={4}>
                                <div className="rightbox" style={{
                                    "cursor" : "pointer"
                                }}>
                                    <Popover placement="bottom"  content={content} trigger="click">
                                        <img width={30} src={this.props.avatar ? "http://127.0.0.1:3000/uploads/" + this.props.avatar : "images/defaultavatar.jpg"} />
                                    </Popover>
                                    &nbsp;
                                    &nbsp;
                                    欢迎你，{this.props.name}
                                </div>
                            </Col>
                        </Row>
                    </Header>
                    {this.props.children}
                </Layout>
                <div className="piao">
                    <Chat></Chat>
                </div>
            </div>
        )
    }
}

export default connect(({meModel})=>({
    login: meModel.login,
    name: meModel.name,
    department: meModel.department,
    id: meModel.id,
    avatar : meModel.avatar
}))(App);