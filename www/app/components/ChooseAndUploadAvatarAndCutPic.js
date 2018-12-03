import React, { Component } from 'react';
import { notification, Row, Col, Progress, Button} from "antd";
import CutPic from "./CutPic.js";
import PropTypes from 'prop-types';

export default class ChooseAndUploadAvatarAndCutPic extends Component {
    constructor(){
        super();

        this.state = {
            //图片是否完整上传
            "isPictureUploaded" : false ,
            //图片的服务器地址
            "picurl": ""
        }
    }


    showNotification(percent, nativeBase64URL){
        notification.open({
            key : 'somekey',
            message: '正在上传请稍后',
            //内容：
            description: <div>
                <Row>
                    <Col span={6}>
                        <img width="100%" src={nativeBase64URL} />
                    </Col>
                    <Col span={1}>&nbsp;</Col>
                    <Col span={24 - 7}>
                        <Progress percent={percent} status="active" />
                    </Col>
                </Row>
            </div>,
            placement: "bottomRight",   //显示在右下角
            duration: 0,        //不自动关闭
        });
    }

    uploadFile(e){
        //本地的base64地址
        var nativeBase64URL = "";

        //显示预览图片
        var fr = new FileReader();
        //读取图片
        fr.readAsDataURL(e.target.files[0]);
        //备份
        var self = this;
        //显示
        fr.onload = function(env){
            //改变函数的全局变量
            nativeBase64URL = env.target.result
            //显示通知框
            self.showNotification(0, nativeBase64URL);
        }
        //创建虚拟表单
        var formData = new FormData();
        //在虚拟表单中追加一项
        formData.append("tupian" , e.target.files[0]);
        //创建XMLHttpRequest对象，这是Ajax的底层对象 
        var xhr = new XMLHttpRequest();
        //回调函数
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){
                //关闭notification框
                notification.close("somekey");
                //进入到裁图这步
                self.setState({
                    "isPictureUploaded" : true ,
                    "picurl": JSON.parse(xhr.responseText).filename,
                    "width": JSON.parse(xhr.responseText).width,
                    "height": JSON.parse(xhr.responseText).height
                });
            }
        }
        //进度条
        xhr.upload.onprogress = function(env){
            //显示通知框
            self.showNotification(env.loaded / env.total * 100, nativeBase64URL);
        }
        //配置如何发送、地址、是否异步
        xhr.open("POST" , "api/upload" , true);
        //发送整个虚拟表单
        xhr.send(formData);
    }

    render() {
        return (
            <div>
                {
                    !this.state.isPictureUploaded
                    ?
                    <div>
                        <input type="file" ref="fileCtrl" hidden onChange={(e) => {
                            this.uploadFile(e);
                        }} />
                        <Button onClick={() => {
                            //创建一个鼠标事件
                            var evt = document.createEvent("MouseEvents");
                            //初始化
                            evt.initMouseEvent("click", false, false);
                            //模拟触发
                            this.refs.fileCtrl.dispatchEvent(evt);
                        }}>选择计算机中的图片</Button>
                    </div>
                    :
                    <CutPic 
                        picurl={this.state.picurl}
                        width={this.state.width} 
                        height={this.state.height}
                        quedingjiancaiHandler={this.props.quedingjiancaiHandler}
                        maxH={this.props.maxH}
                     />
                }
            </div>
        )
    }
}

ChooseAndUploadAvatarAndCutPic.propTypes = {
    quedingjiancaiHandler: PropTypes.func.isRequired,
    minH: PropTypes.number
};
