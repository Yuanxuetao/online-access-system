import {fetchServerAndChangeResultsAndTotal} from "./utils.js";
import * as R from "ramda";

export default {
    namespace : "staffListModel" ,
    state : {
        // 页码
        page : 1,
        // 页面尺寸
        pagesize : 10,
        // 排序名字
        sortby : "id",
        // 排序方向
        sortdirection : 1,
        // 过滤器
        filters : [
            
        ],
        // 服务器返回的结果
        results : [],
        // 服务器告知的当前结果总数
        total : 0,
        // 当前表格列
        cols: []
    },
    reducers : {
        changeResults(state , {results}){
            return R.set(R.lensProp("results"), results , state);
        },
        changeTotal(state, { total }) {
            return R.set(R.lensProp("total"), total, state);
        },
        changePage(state, { page }) {
            return R.set(R.lensProp("page"), page, state);
        },
        changePagesize(state, { pagesize }) {
            return R.set(R.lensProp("pagesize"), pagesize, state);
        },
        changeSortby(state, { sortby }) {
            return R.set(R.lensProp("sortby"), sortby, state);
        },
        changeSortdirection(state, { sortdirection }) {
            return R.set(R.lensProp("sortdirection"), sortdirection, state);
        },
        addFilter(state , {k , v}){
            return R.set(R.lensProp("filters"), R.append({k,v},state.filters) , state);
        },
        delFilter(state, { k }) {
            return R.set(R.lensProp("filters"), R.filter(item => item.k != k,state.filters), state);
        },
        updateFilter(state, { k , v }) {
            return R.set(R.lensProp("filters"), R.map(item=>item.k == k ? R.set(R.lensProp("v"),v,item) : item , state.filters) , state);
        },
        changeColsSync(state, { cols}){
            return R.set(R.lensProp("cols"), cols , state);
        }
    },
    effects : {
        //初始化
        *init(action , {put , call , select}){
            //[第一个事：拉取服务器的数据]
            yield call(fetchServerAndChangeResultsAndTotal, { put, select});
            //[第二个事：读取本地存储的cols的历史]
            var cols = localStorage.getItem("kaolaoa_cols");
            if (!cols){
                //赋予默认cols
                yield put({ "type": "changeColsSync", "cols": [
                    "avatar","id", "name", "sex", "department", "title" , "birthday" , "idcard" , "mobile" , "hiredate"
                ]})
            }else{
                yield put({ "type": "changeColsSync", "cols" : JSON.parse(cols)})
            }
        },
        *changePageAndPagesize({ page, pagesize }, { put, call, select }){
            yield put({ "type": "changePage" , page});
            yield put({ "type": "changePagesize", pagesize});
            yield call(fetchServerAndChangeResultsAndTotal, { put, select });
        },
        *changeSortbyAndSortDirection({ sortby, sortdirection }, { put, call, select }) {
            yield put({ "type": "changeSortby", sortby });
            yield put({ "type": "changeSortdirection", sortdirection });
            yield put({ "type": "changePage", "page" : 1 });
            yield call(fetchServerAndChangeResultsAndTotal, { put, select });
        },
        *changeFilters({ k, v }, { put, call, select }){
            //这个函数是一个中枢，要首先判断是增加filter、删除filter、改变filter
            //先判断是不是删除
            if(v == ""){
                yield put({ "type": "delFilter", k });
            }else{
                //flag旗帜：是否存在
                var isExit = false;
                //得到当前的filters
                const { filters } = yield select(({ staffListModel }) => staffListModel);
                filters.forEach(item => {
                    if (item.k == k) {
                        isExit = true;
                    }
                });

                //根据是否存在决定
                if (isExit) {
                    //修改
                    yield put({ "type": "updateFilter", k, v });
                } else {
                    //增加
                    yield put({ "type": "addFilter", k, v });
                }
            }
                
            //执行新的请求
            yield call(fetchServerAndChangeResultsAndTotal, { put, select });
        },
        *changeCols({ cols }, { put, call, select , fork }){
            localStorage.setItem("kaolaoa_cols", JSON.stringify(cols));
            yield put({ "type": "changeColsSync", cols});
        }
    }
}