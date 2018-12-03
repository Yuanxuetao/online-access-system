import * as R from "ramda";
import { addStaff} from "./utils.js";

export default {
    namespace : "addStaffModel",
    state : {
        step : 1,           //当前步骤
        step1Form : {       //存放第一步的表单结果，比如id、name、sex等

        },
        step2Form: {       //存放第二步的表单结果，比如x、y、w、h、picW、picH、picname等

        }
    },
    reducers : {
        changeStep(state, { step }) {
            return R.set(R.lensProp("step"), step, state);
        },
        changeStep1Form(state, { step1Form}){
            return R.set(R.lensProp("step1Form"), step1Form, state);
        },
        changeStep2Form(state, { step2Form }) {
            return R.set(R.lensProp("step2Form"), step2Form, state);
        }
    },
    effects : {
        *tijiaoForm1({ step1Form } , {put}) {
            yield put({ "type": "changeStep1Form", step1Form});
            yield put({ "type": "changeStep", "step" : 2});
        }, 
        *tijiaoForm2({ step2Form }, { put , call , select}) {
            // 【真正的实现图片裁切】
            yield put({ "type": "changeStep2Form", step2Form });
            // 【提交到数据库表单1和2的数据】
            yield call(addStaff, { select , put});
        }
    }
}