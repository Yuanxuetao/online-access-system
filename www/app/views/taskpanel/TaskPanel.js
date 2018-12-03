import React, { Component } from 'react'
import { connect } from 'dva';
import { Row, Col} from "antd";
import GridModal from "./GridModal.js";
import TaskManage from "../../containers/TaskManage.js";

import GridItem from "./GridItem.js";

import "./task.less";

class TaskPanel extends Component {
    constructor(props){
        super();

        props.dispatch({ "type": "taskPanelModel/init"});

        this.state = {
            col1number : 0,
            col2number : 0,
            col3number : 0,
            visible: false,
            // 打开的模态框的id
            modalId : "",
            item : {
                implementer : []
            }
        }
    }

    showModal(_id , item){
        this.setState({
            visible: true,
            modalId: _id,
            item
        });
    }

    handleOk(e){
     
        this.setState({
            visible: false,
        });
    }

    handleCancel(e){

        this.setState({
            visible: false,
        });
    }


    // 上树
    componentDidMount(){
        var self = this;
        $(this.refs.taskpanelwrap).find(".c_box").sortable({
            connectWith: ".c_box" ,
            start(event , ui){
                const priority = Number($(ui.item[0]).parents(".c_box").data("priority"));
                
                self.setState({
                    ["col" + priority + "number"]: self.state["col" + priority + "number"] - 1
                })
            },
            stop(event , ui){
                const _id = $(ui.item[0]).data("_id");
                const priority = Number($(ui.item[0]).parents(".c_box").data("priority"));
             
                self.props.dispatch({ "type": "taskPanelModel/setTaskPriority", _id  , "sid" : 100244, priority})

                self.setState({
                    ["col" + priority + "number"]: self.state["col" + priority + "number"] + 1
                })
            }
        });
    }

    
    //分类，得到sid的这个权重的数据
    getTasks(sid, priority){
        var arr = [];
        for(let i = 0 ; i < this.props.results.length ; i++){
            for (let j = 0; j < this.props.results[i].implementer.length ; j++){
                if (this.props.results[i].implementer[j].sid == sid && this.props.results[i].implementer[j].priority == priority){
                    arr.push(this.props.results[i]);
                }
            }
        }
        return arr;
    }

    //收到新的属性
    componentWillReceiveProps(){
        this.setState({
            col1number: this.getTasks(100244 , 1).length,
            col2number: this.getTasks(100244 , 2).length,
            col3number: this.getTasks(100244 , 3).length,
        })
    }

    render() {
        return (
            <TaskManage current="taskpanel">
                <div ref="taskpanelwrap">
                    {/* 模态框 */}

                    <GridModal
                        handleOk={this.handleOk.bind(this)}
                        handleCancel={this.handleCancel.bind(this)}
                        visible={this.state.visible}
                        _id={this.state.modalId}
                        item={this.state.item}
                    ></GridModal>
                    
                    
                    <Row gutter={30}>
                        <Col span={8}>
                            <h3>收件箱（{this.state.col1number}）</h3>
                            <div className="c_box" data-priority="1">
                                {
                                    this.getTasks(100244, 1).map(item => {
                                        return <div className="grid" data-_id={item._id} key={item._id}>
                                            <GridItem item={item} showModal={this.showModal.bind(this)}></GridItem>
                                        </div>
                                    })
                                }
                            </div>
                        </Col>
                        <Col span={8}>
                            <h3>今天要做（{this.state.col2number}）</h3>
                            <div className="c_box" data-priority="2">
                                {
                                    this.getTasks(100244, 2).map(item => {
                                        return <div className="grid" data-_id={item._id} key={item._id}>
                                            <GridItem item={item} showModal={this.showModal.bind(this)}></GridItem>
                                        </div>
                                    })
                                }
                            </div>
                        </Col>
                        <Col span={8}>
                            <h3>下一步做（{this.state.col3number}）</h3>
                            <div className="c_box" data-priority="3">
                                {
                                    this.getTasks(100244, 3).map(item => {
                                        return <div className="grid" data-_id={item._id}  key={item._id}>
                                            <GridItem item={item} showModal={this.showModal.bind(this)}></GridItem>
                                        </div>
                                    })
                                }
                            </div>
                        </Col>
                    </Row>
                </div>
            </TaskManage>
        )
    }
}

export default connect(
    ({ taskPanelModel }) => ({
        results: taskPanelModel.results
    })
)(TaskPanel);