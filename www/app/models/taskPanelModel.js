import * as R from "ramda";
import { fetchTasksAndChangeResults, fetchPublisherInfo } from "./utils.js";
import axios from "axios";

export default {
    namespace: "taskPanelModel",
    state: {
        // 服务器返回的结果
        results: [
            
        ],
        ganying : [

        ]
    },
    reducers: {
        changeResults(state, { results }) {
            return R.set(R.lensProp("results"), results, state);
        },
        //设置发布者的信息
        setPublisherInfo(state, { _id , publisherName, publisherAvatar}){
            return R.set(R.lensProp("results"), R.map(item=>{
                if (item._id != _id){
                    return item;
                }else{
                    return {
                        ...item , 
                        publisherName,
                        publisherAvatar
                    }
                }
            },state.results) , state);
        } ,
        changeGanying(state, {results}){
            return R.set(R.lensProp("ganying"), results, state);
        },
        addImplementerSync(state, {_id, sid, avatar, name}){
            return R.set(R.lensProp("results"), R.map(item => {
                if (item._id != _id) {
                    return item;
                } else {
                    return {
                        ...item,
                        implementer : [
                            ...item.implementer,
                            {
                                sid, 
                                avatar, 
                                name,
                                "priority" : 1
                            }
                        ]
                    }
                }
            }, state.results), state);
        }
    },
    effects: {
        *init(action, { put, call, select }){
            yield call(fetchTasksAndChangeResults, { put, select });
        },
        *getPublisherInfo({ _id }, { put, call, select }){
            //得到这条_id的publisher的sid
            const {results} = yield select(({ taskPanelModel }) => taskPanelModel);
            //寻找
            var sid = 0;
            for(let i = 0 ; i < results.length ; i++){
                if(results[i]._id == _id){
                    sid = results[i].publisher;
                }
            }
             
            yield call(fetchPublisherInfo, { put, select, sid , _id});
        },
        *setTaskPriority({ _id, sid, priority }, { put, call, select }){
            yield axios.get("/api/changeTaskPriority?_id=" + _id + "&sid=" + sid + "&priority=" + priority).then(data=>data.data);
            
        },
        *zhinengganying({ keyword }, { put, call, select }) {
            if(keyword){
                const { results } = yield axios.get("/api/staffs?pagesize=9999&page=1&keyword=" + keyword).then(data => data.data);
                yield put({ "type": "changeGanying", results })
            }else{
                yield put({ "type": "changeGanying", "results" : [] })
            }
        },
        *addImplementer({ _id, sid, avatar, name}, { put, call, select }){
            yield axios.post("/api/addImplementer" , {
                _id, sid, avatar, name
            }).then(data => data.data);

            yield put({ "type": "addImplementerSync", _id, sid, avatar, name});
        }
    }
}
