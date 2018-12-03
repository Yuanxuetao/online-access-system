import React, { Component } from 'react';
import {connect} from "dva";
import { Table, Pagination, Button, Row , Col } from "antd";
import FilterBox from "./FilterBox.js";
import TableSetupModal from "./TableSetupModal.js";
import StaffManage from "../../containers/StaffManage.js";
import UpdateStaffDrawer from "../../components/UpdateStaffDrawer.js";
import { Router, Route, routerRedux } from 'dva/router';

import getCols from "./getCols.js";


class StaffList extends Component {
    constructor(props){
        super();
        //发出请求
        props.dispatch({ "type": "staffListModel/init"});

        this.state = {
            //是否显示抽屉
            "visibleDrawer" : false,
            //抽屉的入参
            "drawerid" : 0,
            //是否显示表格配置模态框
            "isShowTableSetup" : false,
            //表格的配置
            "tableConfig" : {
                "dataSource" : props.results,
                "pagination" : false,
                "rowKey" : "id",
                onChange(pagination, filters, { order, field}){
                    props.dispatch({ "type": "staffListModel/changeSortbyAndSortDirection", "sortby": field, "sortdirection": order == "ascend" ? 1 : -1})
                }
            },
            //分页条的配置
            "paginationConfig" : {
                "total" : props.total,
                "current" : props.page,
                "pageSize": props.pagesize,
                "pageSizeOptions" : ["10","20","50","100"],
                "showSizeChanger" : true,
                onChange(page , pagesize){
                    props.dispatch({ "type": "staffListModel/changePageAndPagesize", page, pagesize})
                },
                onShowSizeChange(page , pagesize){
                    //改变页面尺寸的时候要页码要换为1
                    props.dispatch({ "type": "staffListModel/changePageAndPagesize", "page" : 1, pagesize })
                }
            }
        }
    }

    showDrawer(b , id){
        this.setState({
            "visibleDrawer" : b,
            "drawerid" : id
        });
    }


    kanxiangqing(id){
        this.props.dispatch(routerRedux.push("/staffdetail/" + id));
    }

    //当组件收到新的props的时候做的事情
    //什么时候会收到新的props？？组件通天了，connect()()了，所以当全局变化了，它就有新props了。
    componentWillReceiveProps(props){
        //改变state
        this.setState({
            "tableConfig" : {
                ...this.state.tableConfig ,
                "dataSource" : props.results,
                "columns": getCols(props.sortby, props.sortdirection, props.cols, this.kanxiangqing.bind(this), this.showDrawer.bind(this))
            },
            "paginationConfig": {
                ...this.state.paginationConfig,
                "total": props.total,
                "current": props.page,
                "pageSize": props.pagesize
            }
        })
    }

    showModal(){
        this.setState({
            isShowTableSetup: true
        })
    }

    hideModal(){
        this.setState({
            isShowTableSetup: false
        })
    }

    render() {
        return (
            <StaffManage current="stafflist">
                <FilterBox></FilterBox>
                <div className="h10"></div>
                <Row>
                    <Col span={23}></Col>
                    <Col span={1}>
                        <Button 
                            type="primary" 
                            shape="circle" 
                            icon="setting" 
                            onClick={()=>{
                                this.showModal();
                            }}
                        />
                    </Col>
                </Row>
                <Table {...this.state.tableConfig}></Table>
                <div className="h10"></div>
                <Pagination {...this.state.paginationConfig}/>

                {/* 模态框 */}

                <TableSetupModal 
                    isShow={this.state.isShowTableSetup}
                    showModal={this.showModal.bind(this)}
                    hideModal={this.hideModal.bind(this)}
                ></TableSetupModal>

                {/* 抽屉 */}
                <UpdateStaffDrawer 
                    visible={this.state.visibleDrawer} 
                    closeHandler={()=>{
                        this.showDrawer(false , 0);
                    }}
                    sid={this.state.drawerid}
                />
            </StaffManage>
        )
    }
}

export default connect(
    ({ staffListModel}) => ({
        results: staffListModel.results,
        total: staffListModel.total,
        pagesize: staffListModel.pagesize,
        page: staffListModel.page,
        sortby: staffListModel.sortby,
        sortdirection: staffListModel.sortdirection,
        cols: staffListModel.cols
    })
)(StaffList);