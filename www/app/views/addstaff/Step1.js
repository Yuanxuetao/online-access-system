import React, { Component } from 'react';
import {connect} from "dva";
import { Form, Input, DatePicker, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete, Radio  } from 'antd';
import axios from "axios";

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const RadioGroup = Radio.Group;

class Step1 extends Component {
    constructor(){
        super();

        this.state = {
            cardType : "身份证"
        }
    }

    //检查表单当前合法性
    checkFormValidate(errorObj , valueObj , rulesObj){
        console.log(rulesObj);

        for(let k in errorObj){
            if(errorObj[k] !== undefined){
                return false;
            }
        }


        for (let k in valueObj) {
            if (valueObj[k] === undefined) {
                return false;
            }
        }

        return true;
    }

    render() {
        //表单布局
        const formItemLayout = {
            // 题目占的列数
            labelCol: {
                xs: { span: 4 },       //极小屏幕手机
                sm: { span: 4 },        //小屏幕手机及以上
            },
            //输入框占的列数
            wrapperCol: {
                xs: { span: 20 },
                sm: { span: 20 },
            },
        };

        const { getFieldDecorator, getFieldsValue, getFieldsError} = this.props.form;
       
  
        return (
            <div>
                <Form style={{"width" : 500}}>
                    <FormItem
                        {...formItemLayout}
                        label="id"
                    >
                        {
                            getFieldDecorator("id", {
                                rules: [
                                    {
                                        required: true,
                                        message: "必须填写姓名！"
                                    },
                                    {
                                        async validator(rule, value, callback){
                                            //发出请求，问服务器此值是否合法
                                            const { result } = await axios.get("/api/checkid?id=" + value).then(data=>data.data);
                                            if(result){
                                                //被占用
                                                callback("服务器已经有了此ID，请更改ID");
                                            }else{
                                                callback();
                                            }
                                        }
                                    }
                                ] 
                            })(<Input />)
                        }
                    </FormItem>
                    
                    <FormItem
                        {...formItemLayout}
                        label="姓名"
                    >
                        {
                            getFieldDecorator("name" , {
                                rules: [
                                    {
                                        required: true ,
                                        message: "必须填写姓名！"
                                    },
                                    {
                                        pattern: /^([\u4e00-\u9fa5\·]{1,10})$/ ,
                                        message: "请填写正确的姓名"
                                    } 
                                ] 
                            })(<Input />)
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="性别"
                    >
                        {
                            getFieldDecorator("sex", {
                                rules: [
                                    {
                                        required: true,
                                        message: "必须选择性别！"
                                    }
                                ] 
                            })(
                                <RadioGroup>
                                    <Radio value="男">男</Radio>
                                    <Radio value="女">女</Radio>
                                </RadioGroup>
                            )
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="出生日期"
                    >
                        {
                            getFieldDecorator("birthday", {
                                rules: [
                                    {
                                        required: true,
                                        message: '必须填写！'
                                    }
                                ]
                            })(<DatePicker></DatePicker>)
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="部门"
                    >
                        {
                            getFieldDecorator("department", {
                                rules: [
                                    {
                                        required: true,
                                        message: '必须填写部门！'
                                    }
                                ] 
                            })(
                                <Select style={{ width: 120 }}>
                                    {
                                        ["研发部", "销售部", "设计部", "运营部", "产品部", "人事部"].map(item=>{
                                            return <Option key={item} value={item}>{item}</Option>
                                        })
                                    } 
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="入职时间"
                    >
                        {
                            getFieldDecorator("hiredate", {
                                rules: [
                                    {
                                        required: true,
                                        message: '必须填写！'
                                    }
                                ]
                            })(<DatePicker></DatePicker>)
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="学历"
                    >
                        {
                            getFieldDecorator("education", {
                                rules: [
                                    {
                                        required: true,
                                        message: '必须填写！'
                                    }
                                ] 
                            })(
                                <Select style={{ width: 120 }}>
                                    {
                                        ["小学", "初中", "高中", "大学"].map(item => {
                                            return <Option key={item} value={item}>{item}</Option>
                                        })
                                    }
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="血型"
                    >
                        {
                            getFieldDecorator("blood", {
                                rules: [
                                    {
                                        required: true,
                                        message: '必须填写部门！'
                                    }
                                ] 
                            })(
                                <Select style={{ width: 120 }}>
                                    {
                                        ["A", "B", "AB", "O", "R"].map(item => {
                                            return <Option key={item} value={item}>{item}</Option>
                                        })
                                    }
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="职位"
                    >
                        {
                            getFieldDecorator("title", {
                                rules: [
                                    {
                                        required: true,
                                        message: '必须填写！'
                                    }
                                ] 
                            })(
                                <Select style={{ width: 120 }}>
                                    {
                                    ["总监", "经理", "主管", "员工"].map(item => {
                                            return <Option key={item} value={item}>{item}</Option>
                                        })
                                    }
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="证件类型"
                    >
                        {
                            getFieldDecorator("cardtype", {
                                rules: [
                                    {
                                        required: true,
                                        message: '必须填写！'
                                    }
                                ] 
                            })(
                                <Select style={{ width: 120 }} onChange={(v)=>{
                                    this.setState({
                                        "cardType" : v
                                    })
                                }}>
                                    {
                                        ["身份证","护照","军官证"].map(item => {
                                            return <Option key={item} value={item}>{item}</Option>
                                        })
                                    }
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="证件号码"
                    >
                        {
                            getFieldDecorator("idcard", {
                                rules: [
                                    {
                                        required: true,
                                        message: '必须填写！'
                                    },
                                    {
                                        validator : (r , value , callback) => {
                                            if(this.state.cardType == "身份证"){
                                                if (/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)){
                                                    callback();
                                                }else{
                                                    callback("请输入正确身份证号码！");
                                                }
                                            }else if(this.state.cardType == "军官证"){
                                                if (/[\u4e00-\u9fa5](字第){1}(\d{4,8})(号?)$/.test(value)){
                                                    callback();
                                                } else {
                                                    callback("请输入正确军官证号码！");
                                                }
                                            } else if (this.state.cardType == "护照") {
                                                if (/^1[45][0-9]{7}|([P|p|S|s]\d{7})|([S|s|G|g]\d{8})|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8})|([H|h|M|m]\d{8，10})$/.test(value)) {
                                                    callback();
                                                } else {
                                                    callback("请输入正确护照号码！");
                                                }
                                            }
                                        }
                                    }
                                ] 
                            }
                            )(
                                <Input  />
                            )
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="家乡"
                    >
                        {
                            getFieldDecorator("nativePlace", {
                                rules: [
                                    {
                                        required: true,
                                        message: "必须填写家乡！"
                                    }
                                ] 
                            })(<Input />)
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="手机号码"
                    >
                        {
                            getFieldDecorator("mobile", {
                                rules: [
                                    {
                                        required: true,
                                        message: "必须填写家乡！"
                                    },
                                    {
                                        pattern: /^(((13[0-9])|(14[579])|(15([0-3]|[5-9]))|(16[6])|(17[0135678])|(18[0-9])|(19[89]))\d{8})$/,
                                        message: "请填写正确的手机号码"
                                    }
                                ] 
                            })(<Input/>)
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="是否结婚"
                    >
                        {
                            getFieldDecorator("marriage", {
                                rules: [
                                    {
                                        required: true,
                                        message: '必须填写！'
                                    }
                                ] 
                            })(
                                <Select style={{ width: 120 }} onChange={(v) => {
                                    this.setState({
                                        "cardType": v
                                    })
                                }}>
                                    {
                                        ["是","否"].map(item => {
                                            return <Option key={item} value={item}>{item}</Option>
                                        })
                                    }
                                </Select>
                            )
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="是否党员"
                    >
                        {
                            getFieldDecorator("partyMember", {
                                rules: [
                                    {
                                        required: true,
                                        message: '必须填写！'
                                    }
                                ] 
                            })(
                                <Select style={{ width: 120 }} onChange={(v) => {
                                    this.setState({
                                        "cardType": v
                                    })
                                }}>
                                    {
                                        ["是", "否"].map(item => {
                                            return <Option key={item} value={item}>{item}</Option>
                                        })
                                    }
                                </Select>
                            )
                        }
                    </FormItem>
                     
                    <FormItem
                        wrapperCol={{ span: 12, offset: 5 }}
                    >
                        <Button 
                            type="primary"
                            htmlType="submit"
                            disabled={!this.checkFormValidate(getFieldsError() , getFieldsValue())}
                            onClick={()=>{
                                console.log(getFieldsValue());
                                //这里改变moment对象
                                var step1Form = {
                                    ...getFieldsValue() ,
                                    "hiredate": getFieldsValue().hiredate.unix() * 1000,
                                    "birthday": getFieldsValue().birthday.unix() * 1000
                                }
                                this.props.dispatch({ "type": "addStaffModel/tijiaoForm1", step1Form});
                            }}
                        >
                            确定
                        </Button>
                    </FormItem>
                    
                </Form>
            </div>
        )
    }
}

export default connect()(Form.create()(Step1));