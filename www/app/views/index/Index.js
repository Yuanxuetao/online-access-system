import React, { Component } from 'react';
import App from "../../containers/App.js";
import {Row , Col , Layout , Card} from "antd"; 
import tb1option from "./tb1option.js";
import tb2option from "./tb2option.js";
import tb3option from "./tb3option.js";
 
import { connect } from 'dva';

class Index extends Component {

    constructor(props){
        super();

        //刺激一下
        props.dispatch({ "type": "indexModel/loadTb1"});
 
    }

    //组件已经上树
    componentDidMount(){
        // // 基于准备好的dom，初始化echarts实例
        this.myChart1 = echarts.init(this.refs.tb1);
        this.myChart2 = echarts.init(this.refs.tb2);
        this.myChart3 = echarts.init(this.refs.tb3);

        // // 使用刚指定的配置项和数据显示图表。
        this.myChart1.setOption(tb1option);
        this.myChart2.setOption(tb2option);
        this.myChart3.setOption(tb3option);
        
    }

    //回调函数
    componentWillReceiveProps(props){
        this.myChart1.setOption({
            series : {
                data: props.tb1
            }
        })
 
    }

    render() {
        return (
            <App current="home">
                <Card>
                    <Row gutter={30}>
                        <Col span={6}>
                            <Card>
                                昨日公司入职员工数：
                                <h1>
                                    1000
                                </h1>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                昨日公司入职员工数：
                                <h1>
                                    1000
                                </h1>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                昨日公司入职员工数：
                                <h1>
                                    1000
                                </h1>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                昨日公司入职员工数：
                                <h1>
                                    1000
                                </h1>
                            </Card>
                        </Col>
                    </Row>
                    <div className="cl h30"></div>
                    <Row gutter={80}>
                        <Col span={8}>
                            <div ref="tb1" style={{
                                "width" : "100%",
                                "height" : "340px"
                            }}></div>
                        </Col>
                        <Col span={8}>
                            <div ref="tb2" style={{
                                "width": "100%",
                                "height": "340px"
                            }}></div>
                        </Col>
                        <Col span={8}>
                            <div ref="tb3" style={{
                                "width": "100%",
                                "height": "340px"
                            }}></div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                           
                        </Col>
                    </Row>
                </Card>
                
            </App>
        )
    }
}

export default connect(({indexModel})=>({
    tb1 : indexModel.tb1,
    tb4 : indexModel.tb4
}))(Index);