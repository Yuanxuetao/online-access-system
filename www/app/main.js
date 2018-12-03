import Dva from "dva";
import React from "react";
import reduxLogger from "redux-logger";

import routes from "./routes";
 
import staffListModel from "./models/staffListModel.js";
import updateStaffModel from "./models/updateStaffModel.js";
import addStaffModel from "./models/addStaffModel.js";
import taskPanelModel from "./models/taskPanelModel.js";
import indexModel from "./models/indexModel.js";
import meModel from "./models/meModel.js";

import Chat from "./components/Chat.js";

const app = Dva({
    // onAction: reduxLogger
});

app.router(routes);

app.model(staffListModel);
app.model(addStaffModel);
app.model(taskPanelModel);
app.model(meModel);
app.model(updateStaffModel);
app.model(indexModel);

app.start("#app");