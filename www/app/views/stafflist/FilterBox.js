import React, { Component } from 'react';
import {connect} from "dva";
import { Row, Col, Radio, Checkbox, DatePicker, Select, Tag, Input} from "antd";
import moment from "moment";


const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const {RangePicker} = DatePicker;
const Option = Select.Option;

class FilterBox extends Component {
    constructor(props){
        super();
       
        this.state = {
            "items" : [
                {
                    "chinese" : "性别",
                    "key" : "sex",
                    "options" : ["男","女"],
                    "type" : "SINGLEOPTION"
                },
                {
                    "chinese": "血型",
                    "key": "blood",
                    "options": ["A", "B", "AB", "O", "R"],
                    "type": "MUTIPLEOPTION"
                },
                {
                    "chinese": "学历",
                    "key": "education",
                    "options": ["小学", "初中", "高中", "大学"],
                    "type": "MUTIPLEOPTION"
                },
                {
                    "chinese": "职位",
                    "key": "title",
                    "options": ["总监", "经理", "主管", "员工"],
                    "type": "MUTIPLEOPTION"
                },
                {
                    "chinese": "入职时间",
                    "key": "hiredate",
                    "type": "TIMESPAN"
                },
                {
                    "chinese": "生日",
                    "key": "birthday",
                    "type": "TIMESPAN"
                },
                {
                    "chinese": "是否结婚",
                    "key": "marriage",
                    "type": "BOOLEANCHOOSE"
                },
                {
                    "chinese": "是否党员",
                    "key": "partyMember",
                    "type": "BOOLEANCHOOSE"
                },
                {
                    "chinese": "关键词",
                    "key": "keyword",
                    "type": "WENBENKUANG"
                }
            ]
        }
    }
    
    //得到store中某k的v
    getVbyK(k){
        const item = this.props.filters.filter(item=>item.k == k)[0];
        if (item){
            return item.v;
        }
        return "";
    }

    //显示题目的JSX
    showJSX(ITEMJSON){
        if (ITEMJSON.type == "SINGLEOPTION"){
            return <div>
                <RadioGroup 
                    value={this.getVbyK(ITEMJSON.key)}
                    onChange={(e)=>{
                        this.props.dispatch({ "type": "staffListModel/changeFilters" , "k" : ITEMJSON.key , "v" : e.target.value})
                    }}
                >
                    {
                        ITEMJSON.options.map(item=>{
                            return <Radio key={item} value={item}>{item}</Radio>
                        })
                    }
                </RadioGroup>
            </div>
        } else if (ITEMJSON.type == "MUTIPLEOPTION") {
            return <div>
                <CheckboxGroup 
                    options={ITEMJSON.options.map(item => ({ "label": item, "value": item}))}
                    value={this.getVbyK(ITEMJSON.key).split("v")}
                    onChange={(v) => {
                        this.props.dispatch({ "type": "staffListModel/changeFilters", "k": ITEMJSON.key, "v" : v.join("v")})
                    }}
                />
            </div>
        } else if (ITEMJSON.type == "TIMESPAN"){
            //得到值
            var arr = this.getVbyK(ITEMJSON.key).split("to").map(item=>Number(item));
            //如果有两项表示当前有值
            if (arr.length == 2){
                var v = [moment(arr[0]) , moment(arr[1])];
            }else{
                var v = [];
            }

            return <div>
                <RangePicker value={v} onChange={(a)=>{
                    let vv = a.map(item=>item.unix() * 1000);
                    this.props.dispatch({ "type": "staffListModel/changeFilters", "k": ITEMJSON.key, "v": vv.join("to") })
                }}/>
            </div>
        } else if (ITEMJSON.type == "BOOLEANCHOOSE") {
            return <Select
                allowClear={true} 
                value={this.getVbyK(ITEMJSON.key)} 
                style={{ width: 120 }}
                onChange={v=>{
                    this.props.dispatch({ "type": "staffListModel/changeFilters", "k": ITEMJSON.key, v })
                }}
            >
                <Option value="1">是</Option>
                <Option value="0">否</Option>
            </Select>
        } else if(ITEMJSON.type == "WENBENKUANG"){
            return <Input  style={{ "width": 300 }} onChange={(e) => {
                this.props.dispatch({ "type": "staffListModel/changeFilters", "k": "keyword", "v": e.target.value })
            }}></Input>
        }
    }

    //显示当前的Tag
    showTags(){
        return this.props.filters.map(item=>{
            var ming , zhi;
            //遍历this.state.items看看那项的key是这里的item.k，如果是就显示item.chinese
            this.state.items.forEach(_item=>{
                if(_item.key == item.k){
                    ming = _item.chinese;
                    if(_item.type == "SINGLEOPTION"){
                        zhi = item.v;
                    } else if (_item.type == "MUTIPLEOPTION"){
                        zhi = item.v.split("v").join(" 或 ");
                    } else if (_item.type == "TIMESPAN") {
                        zhi = item.v.split("to").map(__item=>{
                            return moment(Number(__item)).format("YYYY年MM月DD日");
                        }).join(" 到 ");
                    } else if (_item.type == "BOOLEANCHOOSE") {
                        zhi = item.v == "1" ? "是" : "否"
                    } else if (_item.key == "keyword"){
                        zhi = item.v;
                    }
                }
            });
            
            return <Tag 
                key={item.k} 
                closable
                onClose={(e)=>{
                    this.props.dispatch({ "type": "staffListModel/changeFilters", "k": item.k , "v" : "" })
                }}
            >{ming}: {zhi}</Tag>
        });
    }

    render() {
        return (
            <div>
                {
                    this.state.items.map(item=>{
                        return <Row key={item.key}>
                            <Col span={2}>
                                {item.chinese}
                            </Col>
                            <Col span={22}>
                                {this.showJSX(item)}
                            </Col>
                        </Row>
                    })
                }
 


                <div className="h10"></div>
                <Row key="KEYWORD">
                    <Col span={2}>
                        当前：
                    </Col>
                    <Col span={22}>
                        {this.showTags()}
                    </Col>
                </Row>
            </div>
        )
    }
}

export default connect(
    ({ staffListModel}) => ({
        filters: staffListModel.filters
    })
)(FilterBox);