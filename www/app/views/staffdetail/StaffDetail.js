import React, { Component } from 'react';
import StaffManage from "../../containers/StaffManage.js";
import { connect } from "dva";
import { Button, Modal} from "antd";
import UpdateStaffDrawer from "../../components/UpdateStaffDrawer.js";
import ChooseAndUploadAvatarAndCutPic from "../../components/ChooseAndUploadAvatarAndCutPic.js";

import axios from "axios";

class StaffDetail extends Component {
    constructor(){
        super();

        this.state = {
            "result" : {},
            //是否显示抽屉
            "visibleDrawer": false,
            //抽屉的入参
            "drawerid": 0,
            // 是否显示模态框
            visible: false
        }
    }
    async componentWillMount(){
        const id = window.location.hash.substr(-6);
        const {result} = await axios.get("/api/staff/" + id).then(data => data.data);
        this.setState({
            "result": result,
            "drawerid" : Number(id)
        });
    }

    showDrawer(b, id) {
        this.setState({
            "visibleDrawer": b,
            "drawerid": id
        });
    }

    showModal() {
        this.setState({
            visible: true,
        });
    }

    handleOk(e){
        
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
        return (
            <StaffManage current="staffdetail" hideSider={true}>
                <h1>{this.state.result.name}详情</h1>
                <br/>
                <img width={300} src={this.state.result.avatar ? "http://127.0.0.1:3000/uploads/" + this.state.result.avatar : "images/defaultavatar.jpg"} />
                <Button onClick={this.showModal.bind(this)}>修改头像</Button>
                <br/>
                {JSON.stringify(this.state.result)}
                <br/>
                <Button onClick={()=>{
                    this.showDrawer(true, this.state.drawerid);
                    
                }}>修改{this.state.result.name}的资料</Button>

                {/* 抽屉 */}
                <UpdateStaffDrawer
                    visible={this.state.visibleDrawer}
                    closeHandler={() => {
                        this.showDrawer(false, 0);
                    }}
                    sid={this.state.drawerid}
                />

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
                        quedingjiancaiHandler={({ picname })=>{
                            axios.post("/api/updateavtar" , {
                                picname ,
                                id: this.state.drawerid
                            });
                            this.handleCancel();
                            window.location.reload();
                        }}
                    ></ChooseAndUploadAvatarAndCutPic>
                </Modal>
            </StaffManage>
        )
    }
}

export default connect(
    ({staff})=>{
        return {

        }
    }
)(StaffDetail);