import React, { Component } from 'react';
import { connect } from 'dva';
import { Input} from "antd";

class Tanchuceng extends Component {
    render() {
        return (
            <div>
                <Input onInput={(e)=>{
                      
                    this.props.dispatch({ "type": "taskPanelModel/zhinengganying", "keyword": e.target.value})
                    
 
                }}
                    placeholder="请输入姓名/手机号查询"
                ></Input>

                <div className="h10"></div>

                <div style={{
                    "height" : 200,
                    "overflowY" : "scroll",
                    
                }}>
                    {
                        this.props.ganying.map(item=>{
                            return <div key={item.id} style={{
                                "cursor" : "pointer"
                            }} onClick={()=>{
                                this.props.dispatch({ "type": "taskPanelModel/addImplementer", "_id": this.props._id, "sid": item.id, "avatar": item.avatar , "name" : item.name})
                            }}>
                                <img width={30} src={item.avatar ? "http://127.0.0.1:3000/uploads/" + item.avatar : "images/defaultavatar.jpg"} alt="" />
                                {item.name}
                            </div>
                        })
                    }
                </div>
            </div>
        )
    }
}

export default connect(({ taskPanelModel})=>({
    ganying: taskPanelModel.ganying
}))(Tanchuceng);