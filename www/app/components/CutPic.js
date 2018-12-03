import React, { Component } from 'react';
import { Row, Col, Button} from "antd";
import axios from "axios";
import querystring from "querystring";
import {connect} from "dva";
import PropTypes from 'prop-types';

export default class CutPic extends Component {
    constructor(props){
        super();

        this.state = {
            //配置一下图片允许的最大宽度
            maxW : 800,
            //配置一下图片允许的最大高度
            maxH : props.maxH || 500,
            //cut切片的x
            x : 0,
            //cut切片的y
            y : 0,
            //cut切片的w
            w : 100,
            //cut切片的h
            h : 100,
            //图片的宽高
            picW : 0,
            picH : 0
        }
    }

    //执行裁切，并且调用父辈的回调
    async doCut(){
        //执行裁切！
        await axios.get("/api/docut?" + querystring.stringify({
            x: this.state.x,
            y: this.state.y,
            w: this.state.w,
            h: this.state.h,
            picW: this.state.picW,
            picname: this.props.picurl
        }));
        //调用父亲的函数
        this.props.quedingjiancaiHandler({
            picname: this.props.picurl
        })
    }

    //组件上树之后
    componentDidMount(){
        var self = this;

        //允许裁图框被拖拽
        $(this.refs.cut).draggable({
            //容器
            containment : "parent",
            //当拖拽的时候做的事情
            drag(event , ui){
                const {left , top} = ui.position;
                //改变state
                self.setState({
                    x : left,
                    y : top
                });
            }
        });

        //允许裁图框被改变大小
        $(this.refs.cut).resizable({
            //容器
            containment: "parent",
            //设置宽、高比为1
            aspectRatio : 1,
            //当改变尺寸的时候做的事情
            resize(event , ui){
                const { width, height } = ui.size;
                //改变state
                self.setState({
                    w : width,
                    h : height
                });
            }
        });

        //计算宽度、高度

        //计算图片的宽度、高度
        if (this.props.width / this.props.height < this.state.maxW / this.state.maxH) {
            //高超了
            if (this.props.height > this.state.maxH) {
                //等比例缩小
                this.setState({
                    picH: this.state.maxH,
                    picW: this.props.width * (this.state.maxH / this.props.height)
                });
            }else{
                this.setState({
                    picH: this.props.height,
                    picW: this.props.width
                });
            }
        } else {
            //高超了
            if (this.props.width > this.state.maxW) {
                //等比例缩小
                this.setState({
                    picW: this.state.maxW,
                    picH: this.props.height * (this.state.maxW / this.props.width)
                });
            } else {
                this.setState({
                    picH: this.props.height,
                    picW: this.props.width
                });
            }
        }
    }

    //显示预览图盒子
    showPreviewRect(width){
        return <div 
            style={{
                "width": width,
                "height": width,
                "border": "1px solid black",
                "marginBottom": "10px",
                "overflow" : "hidden",
                "position" : "relative"
            }}
        >
            <img
                style={{ "width": this.state.picW, "height": this.state.picH }}
                src={"http://127.0.0.1:3000/uploads/" + this.props.picurl}
                style={{
                    "position" : "absolute",
                    "left" : -this.state.x / this.state.w * width || 0,
                    "top": -this.state.y / this.state.h * width || 0,
                    "width": this.state.picW / this.state.w * width,
                    "height": this.state.picH / this.state.h * width
                }}
            />
        </div>
    }

    render() {
        return (
            <div style={{
                "overflow": "hidden"
            }}>
                
                {/* 大盒子，是绝对定位的母盒子 */}
                <div className="box" ref="box" style={{
                    "float" : "left" , 
                    "border": "2px solid #333",
                    "position" : "relative"
                }}>

                    {/* 待切图片 */}
                    <img
                        ref="bigimg"
                        style={{ "width": this.state.picW, "height": this.state.picH }}
                        src={"http://127.0.0.1:3000/uploads/" + this.props.picurl}
                    />

                    {/* 裁切框 */}
                    <div className="cut" ref="cut" style={{
                        "width": 100,
                        "height" : 100,
                        "position" : "absolute",
                        "top" : 0,
                        "left": 0,
                        "zIndex" : 999,
                        "overflow" : "hidden"
                    }}>
                        <img
                            style={{ 
                                "width": this.state.picW, 
                                "height": this.state.picH,
                                "position" : "absolute",
                                "top" : -this.state.y ,
                                "left" : -this.state.x
                            }}
                            src={"http://127.0.0.1:3000/uploads/" + this.props.picurl}
                        />

                        <div className="t"></div>
                        <div className="r"></div>
                        <div className="b"></div>
                        <div className="l"></div>
                    </div>

                    {/* 黑色遮罩 */}
                    <div className="mask" style={{
                        "position": "absolute",
                        "width": "100%",
                        "height": "100%",
                        "top": 0,
                        "left": 0,
                        "background" : "rgba(0,0,0,.618)"
                    }}></div>
                </div>
                <div className="previewBox" style={{
                    "float" : "left",
                    "marginLeft" : 20
                }}>
                    {this.showPreviewRect(140)}
                    {this.showPreviewRect(100)}
                    {this.showPreviewRect(70)}

                    <div className="h10"></div>

                    <Button type="primary" onClick={()=>{
                        this.doCut();
                       
                    }}>确定剪裁</Button>
                </div>
               
            </div>
        )
    }
}

CutPic.propTypes = {
    picurl : PropTypes.string.isRequired,
    quedingjiancaiHandler: PropTypes.func.isRequired
};
