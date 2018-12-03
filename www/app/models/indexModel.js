import axios from "axios";
import * as R from "ramda";

export default {
    namespace : "indexModel",
    state : {
        tb1 : [] 
       
    },
    reducers : {
        changeTb1(state , {arr}){
            return R.set(R.lensProp("tb1") , arr , state);
        } 
    },
    effects : {
        *loadTb1(action , {put , call , select}){
            const o = yield axios.get("/api/tb1").then(d=>d.data);
            var arr = [];
            for(var k in o){
                arr.push(
                    {"value" : o[k] , "name" : k}
                )
            }
            yield put({ "type": "changeTb1" , arr})
        } 
    }
}