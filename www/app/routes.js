import { Router, Route } from 'dva/router';
import React from "react";
import App from "./containers/App.js";
import AddStaff from "./views/addstaff/AddStaff.js";
import StaffList from "./views/stafflist/StaffList.js";
import TaskPanel from "./views/taskpanel/TaskPanel.js";
import StaffDetail from "./views/staffdetail/StaffDetail.js";
import Login from "./views/login/Login.js";
import Index from "./views/index/Index.js";

export default ({ history }) => {
    return (
        <Router history={history}>
            <div>
                <Route path="/" exact component={Index}></Route>
                <Route path="/addstaff" exact component={AddStaff}></Route>
                <Route path="/taskpanel" component={TaskPanel}></Route>
                <Route path="/stafflist" component={StaffList}></Route>
                <Route path="/staffdetail/:id" component={StaffDetail}></Route>
                <Route path="/login" component={Login}></Route>
            </div>
        </Router>
    );
}