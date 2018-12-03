import React, { Component } from 'react';
import { Row, Col } from "antd";
import { connect } from 'dva';

class GridItem extends Component {
    constructor(props){
        super();

        //请求数据

        props.dispatch({ "type": "taskPanelModel/getPublisherInfo", "_id": props.item._id})
    }

    render() {
        return (
            <div onClick={()=>{
                this.props.showModal(this.props.item._id , this.props.item);
            }}>
                <h3><b>{this.props.item.title}</b></h3>
                <p>
                    {this.props.item.detail}
                </p>
                <Row>
                    <Col span={6}>
                        <img width={30} src={this.props.item.publisherAvatar ? "http://127.0.0.1:3000/uploads/" + this.props.item.publisherAvatar : "images/defaultavatar.jpg"} alt="" />
                        {this.props.item.publisherName}
                    </Col>
                    <Col span={18} style={{ "textAlign": "right" }}>
                        截止时间：
                        2018年10月24日
                    </Col>
                </Row>
            </div>
        )
    }
}

export default connect()(GridItem);