import React, { Component } from 'react';
import { Modal, Row, Col, Button , Icon} from "antd";
import Tanchuceng from "./Tanchuceng.js";
import { connect} from "dva";

class GridModal extends Component {
    constructor(){
        super();

        this.state = {
            left: 0,
            top : 0,
            visibility : "hidden"
        }
    }

    //组件将要收到新的props，就是新的
    componentWillReceiveProps(){
        this.setState({
            left: 0,
            top: 0,
            visibility: "hidden"
        });
    }

    

    render() {
        return (
            <div onClick={()=>{
                this.setState({
                    visibility: "hidden"
                })
            }}>
                <Modal
                    title={this.props.item.title}
                    visible={this.props.visible}
                    onOk={this.props.handleOk}
                    onCancel={this.props.handleCancel}
                    width={800}
                    destroyOnClose={false}
                >
                    <div ref="wrapwrap" style={{
                        "position" : "relative"
                    }}>
                        
                        <Row>
                            <Col>
                                内容：
                                {this.props.item.detail}
                            </Col>
                        </Row>
                        <Row>
                            <Col span={6}>
                                发布者：
                            <img width={30} src={this.props.item.publisherAvatar ? "http://127.0.0.1:3000/uploads/" + this.props.item.publisherAvatar : "images/defaultavatar.jpg"} alt="" />
                                {this.props.item.publisherName}
                            </Col>
                            <Col span={18}>
                                执行者：
                                {
                                    this.props.item.implementer.map(item => {
                                        return <span key={item.sid}>
                                            <img width={30} src={item.avatar ? "http://127.0.0.1:3000/uploads/" + item.avatar : "images/defaultavatar.jpg"} alt="" />
                                            {item.name}
                                        </span>
                                    })
                                }
                                <span>
                                    <Button
                                        type="primary"
                                        shape="circle"
                                        icon="plus"
                                        onClick={(e) => {
                                            //事件阻止冒泡
                                            e.stopPropagation();
                                            
                                            this.setState({
                                                "left" : e.clientX + 20, 
                                                "top": e.clientY + 10,
                                                "visibility" : "visible"
                                            })
                                        }}
                                    />
                                </span>
                            </Col>
                        </Row>

                        <div 
                            className="menu" 
                            style={{
                                "width" : 200,
                                "backgroundColor" : "white",
                                "boxShadow" : "0px 0px 8px rgba(0,0,0,.5)",
                                "position" : "fixed",
                                "left" : this.state.left ,
                                "top" : this.state.top,
                                "zIndex" : 999,
                                "visibility" : this.state.visibility,
                                "padding" : 10
                            }} 
                            onClick={(e) => {
                                //事件阻止冒泡
                                e.stopPropagation();
    
                            }}
                        >
                            <Tanchuceng _id={this.props._id}></Tanchuceng>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default connect(({taskPanelModel})=>({
    results: taskPanelModel.results
}))(GridModal);