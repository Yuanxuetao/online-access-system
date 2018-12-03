import axios from "axios";
import querystring from "querystring";

//请求员工数据
export const fetchServerAndChangeResultsAndTotal = function*({put , select}){
    const { page, pagesize, sortby, sortdirection , filters } = yield select(({ staffListModel }) => staffListModel);
    //查询参数
    const queryParams = {
        page,
        pagesize,
        sortby,
        sortdirection,
    };
    //遍历filters数组，给queryParams增加k-v对儿
    filters.forEach(item=>{
        queryParams[item.k] = item.v;
    });
    
    //真正发出请求
    const { results, total } = yield axios("/api/staffs?" + querystring.stringify(queryParams)).then(data=>data.data);
    //通知state改变results、total
    yield put({ "type": "changeResults", results});
    yield put({ "type": "changeTotal", total});
}

 

//添加员工
export const addStaff = function* ({ select , put }) {
    const { step1Form , step2Form } = yield select(({ addStaffModel }) => addStaffModel);

    const {result} = yield axios.post("/api/addstaff" ,  {
        ...step1Form,
        ...step2Form
    }).then(data=>data.data);

    if(result == 1){
        yield put({ "type": "changeStep" , "step" : 3});
    }
}


//请求数据
export const fetchTasksAndChangeResults = function* ({ put, select }) {
    //真正发出请求
    const { results } = yield axios("/api/tasks").then(data => data.data);
    //通知state改变results、total
    yield put({ "type": "changeResults", results });
}

export const fetchPublisherInfo = function* ({ put, select, sid , _id}) {
    //真正发出请求
    const { result } = yield axios("/api/staff/" + sid).then(data => data.data);
    yield put({ "type": "setPublisherInfo", _id ,  "publisherName": result.name, "publisherAvatar": result.avatar});
}