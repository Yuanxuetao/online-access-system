import React, { Component } from 'react';
import { Steps, Icon } from 'antd';
import { connect } from 'dva';
import StaffManage from "../../containers/StaffManage.js";

const Step = Steps.Step;

import Step1 from "./Step1.js";
import Step2 from "./Step2.js";
import Step3 from "./Step3.js";

class AddStaff extends Component {
    render() {
        const getStatus = (thisStep) => {
            if (this.props.step == thisStep){
                return "process";
            }else if(this.props.step > thisStep){
                return "finish";
            } else if (this.props.step < thisStep) {
                return "wait";
            }
        }

        //显示步骤组件
        const showStepComponent = () => {
            if(this.props.step == 1){
                return <Step1 />
            } else if (this.props.step == 2) {
                return <Step2 />
            } else if (this.props.step == 3) {
                return <Step3 />
            }
        }

        return (
            <StaffManage current="addstaff">
                <Steps>
                    <Step status={getStatus(1)} title="基本信息录入" icon={<Icon type="user" />} />
                    <Step status={getStatus(2)} title="上传头像" icon={<Icon type="smile" theme="outlined" />} />
                    <Step status={getStatus(3)} title="成功" icon={<Icon type="check-circle" theme="outlined" />} />
                </Steps>

                <div className="h10"></div>

                {showStepComponent()}
            </StaffManage>
        )
    }
}

export default connect(({ addStaffModel})=>({
    step : addStaffModel.step
}))(AddStaff);
