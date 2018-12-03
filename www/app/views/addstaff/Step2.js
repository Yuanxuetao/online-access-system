import React, { Component } from 'react';
import { notification, Row, Col, Progress, Button} from "antd";
import { connect } from "dva";

import ChooseAndUploadAvatarAndCutPic from "../../components/ChooseAndUploadAvatarAndCutPic.js";


class Step2 extends Component {
    constructor(){
        super();
        
    }
     
    render() {
        return (
            <div>
                <ChooseAndUploadAvatarAndCutPic quedingjiancaiHandler={({picname})=>{
                    this.props.dispatch({
                        "type": "addStaffModel/tijiaoForm2",
                        "step2Form": {picname}
                    });
                }}></ChooseAndUploadAvatarAndCutPic>
            </div>
        )
    }
}

export default connect()(Step2);