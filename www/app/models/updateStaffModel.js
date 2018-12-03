import * as R from "ramda";
import axios from "axios";

export default {
    namespace: "updateStaffModel",
    state: {
        // 服务器返回的结果
        values: {}
    },
    reducers: {
        changevalues(state, { values }) {
            return R.set(R.lensProp("values"), values, state);
        } 
    },
    effects: {
        *loadvalue({ sid }, { put, call, select }) {
            if(sid != 0){
                const {result} = yield axios.get("/api/staff/" + sid).then(data=>data.data);
                yield put({ "type": "changevalues", "values": result});
            }
        } 
    }
}
