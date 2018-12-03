import React, { Component } from 'react';
import {connect} from "dva";

class Chat extends Component {
    constructor(){
        super();

        this.state = {
            "dangqiandengluderen" : []
        }
    }

    //组件上树之后
    componentDidMount(){
        //发出与服务器的链接请求
        this.socket = io();

        var self = this;
        
        this.socket.emit("denglule", JSON.stringify({
            id: this.props.id,
            avatar: this.props.avatar,
            name: this.props.name
        }));

        this.socket.on("yourendenglu" , function(msg){
            console.log(msg);
            self.setState({
                "dangqiandengluderen" : JSON.parse(msg)
            })
        });
    }

    componentWillReceiveProps(props){
        this.socket.emit("denglule", JSON.stringify({
            id : props.id,
            avatar : props.avatar ,
            name : props.name
        }));
    }

    render() {
        return (
            <div>
                {JSON.stringify(this.state.dangqiandengluderen)}
               <ul>
                    {
                        this.state.dangqiandengluderen.map(item=>{
                            return <li key={Math.random()}>
                                {item.name}
                            </li>
                        })
                    }
               </ul>
                
            </div>
        )
    }
}

export default connect(({meModel})=>({
    id : meModel.id,
    avatar: meModel.avatar,
    name: meModel.name
}))(Chat);