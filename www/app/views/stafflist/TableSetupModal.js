import React, { Component } from 'react';
import { Modal, Button } from 'antd';
import { DraggableArea , DraggableAreasGroup} from 'react-draggable-tags';
import {connect} from "dva";

const group = new DraggableAreasGroup();
const DraggableArea1 = group.addArea();
const DraggableArea2 = group.addArea();

//备选项
const ALLTAGS = [
    { "id": "avatar", "title": "头像" },
    { "id": "blood", "title": "血型" },
    { "id": "marriage", "title": "是否结婚" },
    { "id": "partyMember", "title": "是否党员" },
    { "id": "nativePlace", "title": "家乡" },
    { "id": "id", "title": "id" },
    { "id": "name", "title": "姓名" },
    { "id": "sex", "title": "性别" },
    { "id": "birthday", "title": "生日" },
    { "id": "department", "title": "部门" },
    { "id": "hiredate", "title": "入职时间" },
    { "id": "title", "title": "职称" },
    { "id": "idcard", "title": "身份证号码" },
    { "id": "mobile", "title": "手机" },
    { "id": "education", "title": "学历" }
];
 
class TableSetupModal extends Component {
    constructor(){
        super();
        
    }

    //组件将要更新，从全局读取列的顺序
    componentWillReceiveProps(props){
        this.initialTags1 = [];
        this.initialTags2 = [];

        ALLTAGS.forEach(item=>{
            if(props.cols.includes(item.id)){
                this.initialTags2.push(item);
            }else{
                this.initialTags1.push(item);
            }
        })
    }

    render() {
        var chooseArr = [];

        return (
            <div>
                <Modal
                    title="自定义表格列"
                    visible={this.props.isShow}
                    onOk={()=>{
                        this.props.dispatch({ "type": "staffListModel/changeCols", "cols": chooseArr})
                        this.props.hideModal();
                    }}
                    onCancel={()=>{this.props.hideModal()}}
                    width={800}
                >
                    <h3>备选项：</h3>
                    <div className="">
                        <DraggableArea1
                            initialTags={this.initialTags1}
                            render={({ tag}) => (
                                <div className="tag" >
                                    {tag.title}
                                </div>
                            )}
                        />
                    </div>
                    <h3>当前行：</h3>
                    <div ref="choosecolbox">
                        <DraggableArea2
                            initialTags={this.initialTags2}
                            render={({ tag}) => (
                                <div className="tag" data-id={tag.id}>
                                    {tag.title}
                                </div>
                            )}
                            onChange={(arr)=>{
                                chooseArr = arr.map(item=>item.id);
                                console.log(chooseArr);
                            }}
                        />
                    </div>
                </Modal>
            </div>
        )
    }
}

export default connect(
    ({ staffListModel}) => ({
        cols: staffListModel.cols
    })
)(TableSetupModal);