import * as R from "ramda";
import axios from "axios";
export default {
    namespace : "meModel",
    state : {
        login : true,
        name : "",
        id : "",
        department : "",
        avatar : ""
    },
    reducers : {
        changeLogin(state , {login}){
            return R.set(R.lensProp("login"), login, state);
        },
        changename(state, { name }) {
            return R.set(R.lensProp("name"), name, state);
        },
        changeid(state, { id }) {
            return R.set(R.lensProp("id"), id, state);
        },
        changedepartment(state, { department }) {
            return R.set(R.lensProp("department"), department, state);
        },
        changeavatar(state, { avatar }) {
            return R.set(R.lensProp("avatar"), avatar, state);
        }
    },
    effects : {
        *checkLogin(action , {put}){
            const { login, name, id, department , avatar} = yield axios.get("/api/me").then(data=>data.data);
            yield put({ "type": "changeLogin" , "login" : login == "1" ? true : false});
            yield put({ "type": "changename", name});
            yield put({ "type": "changeid", id});
            yield put({ "type": "changedepartment", department});
            yield put({ "type": "changeavatar", avatar});
        }
    }
}