const express = require("express");
const mongoose = require("mongoose");
const formidable = require("formidable");
const _ = require("underscore");
const path = require("path");
const url = require("url");
const fs = require('fs');
const gm = require("gm");
const session = require('express-session');
const crypto = require("crypto");
const app = express();


var alluser = [];

//装饰一下
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static("www"));
app.use("/uploads", express.static("uploads"));

//session
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false
}));

//链接数据库
mongoose.connect("mongodb://127.0.0.1:27017/kaolaoa");

//数据库的对象
const Staff = mongoose.model("Staff" , {
    "id"                :            Number,
    "name"              :            String,
    "sex"               :            String,
    "birthday"          :            Number,
    "department"        :            String,
    "hiredate"          :            Number,
    "title"             :            String,
    "nativePlace"       :            String,
    "idcard"            :            String,
    "mobile"            :            String,
    "education"         :            String,
    "blood"             :            String,
    "marriage"          :            Boolean,
    "partyMember"       :            Boolean,
    "avatar"            :            String
});

//数据库的对象
const Task = mongoose.model("Task", {
    "title": String,
    "detail": String,
    "publisher": Number,
    "implementer": [
        {
            "sid" : Number,
            "priority" : Number,
            "name" : String,
            "avatar" : String
        }
    ],
    "deadline": Number,
    "comments": Array,
    "enclosure": Array
});

//数据库的对象
const User = mongoose.model("User", {
    "id": Number,
    "password": String
});

//富查询接口
app.get("/api/staffs" , (req,res)=>{
    const page = Number(url.parse(req.url , true).query.page) || 1;
    const pagesize = Number(url.parse(req.url, true).query.pagesize) || 10;
    const sortby = url.parse(req.url, true).query.sortby || "id";
    const sortdirection = Number(url.parse(req.url, true).query.sortdirection) || 1;
    const sex = url.parse(req.url, true).query.sex;
    const department = url.parse(req.url, true).query.department;
    const education = url.parse(req.url, true).query.education;
    const blood = url.parse(req.url, true).query.blood;
    const title = url.parse(req.url, true).query.title;
    const marriage = url.parse(req.url, true).query.marriage;
    const partyMember = url.parse(req.url, true).query.partyMember;
    const birthday = url.parse(req.url, true).query.birthday;
    const hiredate = url.parse(req.url, true).query.hiredate;
    const keyword = url.parse(req.url, true).query.keyword;

    //查询体
    var CHAXUNTI = {};

    if (sex) {CHAXUNTI["sex"] = sex};
    if (department) { CHAXUNTI["department"] = department.split("v")};
    if (blood) { CHAXUNTI["blood"] = blood.split("v")};
    if (education) { CHAXUNTI["education"] = education.split("v")};
    if (title) { CHAXUNTI["title"] = title.split("v")};
    if (marriage) { CHAXUNTI["marriage"] = Boolean(Number(marriage))};
    if (partyMember) { CHAXUNTI["partyMember"] = Boolean(Number(partyMember))};
    if (birthday) { 
        CHAXUNTI["birthday"] = { 
            "$gte": birthday.split("to")[0],
            "$lte": birthday.split("to")[1]
        }
    };
    if (hiredate) {
        CHAXUNTI["hiredate"] = {
            "$gte": hiredate.split("to")[0],
            "$lte": hiredate.split("to")[1]
        }
    };
    if(keyword){
        CHAXUNTI["$or"] = [
            { "name": new RegExp(keyword) },
            { "mobile": new RegExp(keyword) },
            { "idcard": new RegExp(keyword) },
            { "nativePlace": new RegExp(keyword) }
        ]
    }

    //得到GET请求
    res.setHeader("Access-Control-Allow-Origin" , "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");
    Staff.count(CHAXUNTI , (err , total)=>{
        Staff.find(CHAXUNTI).sort({ [sortby]: [sortdirection] }).skip((page - 1) * pagesize).limit(pagesize).exec((err, docs) => {
            res.json({ 
                "total" : total,
                "results": docs 
            });
        });
    })
});

//检查id是否被占用
app.get("/api/checkid" , (req,res)=>{
    const id = Number(url.parse(req.url, true).query.id);
    Staff.count({id}, (err, total) => {
        res.json({ "result": total != 0});
    });
});

//图片上传的接口
app.post("/api/upload" , (req,res)=>{
    var form = new formidable.IncomingForm();
    //配置上传的文件夹，上传的图片要放到这个文件夹中
    form.uploadDir = path.resolve(__dirname, "./uploads");
    //保留扩展名，比如用户上传.jpg文件，服务器上会保持.jpg扩展名
    form.keepExtensions = true;

    form.parse(req , (err , fields , files) => {
        //用GM得到尺寸
        gm(files.tupian.path).size((err, { width , height }) => {
            res.json({
                "result" : 200, 
                "filename": path.basename(files.tupian.path),
                width, 
                height
            });
        });
    });
});

//接口
app.get("/api/docut" , (req,res)=>{
    const picname = url.parse(req.url, true).query.picname;
    const w = Number(url.parse(req.url, true).query.w);
    const h = Number(url.parse(req.url, true).query.h);
    const x = Number(url.parse(req.url, true).query.x);
    const y = Number(url.parse(req.url, true).query.y);
    const picW = Number(url.parse(req.url, true).query.picW);
    //得到这个图片的原来的尺寸
    gm(path.resolve(__dirname, "./uploads/" + picname)).size((err,{width})=>{
        //计算比例
        var rate = width / picW;

        gm(path.resolve(__dirname, "./uploads/" + picname))
            .crop(w * rate, h * rate, x * rate, y * rate)
            .write(path.resolve(__dirname, "./uploads/" + picname), function (err) {
                res.send("1");
            });
    });
});

//增加员工
app.post("/api/addstaff" , (req,res)=>{
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        
      
        Staff.create({
            "id": fields.id,
            "name": fields.name,
            "sex": fields.sex,
            "birthday": fields.birthday,
            "department": fields.department,
            "hiredate": fields.hiredate,
            "title": fields.title,
            "nativePlace": fields.nativePlace,
            "idcard": fields.idcard,
            "mobile": fields.mobile,
            "education": fields.education,
            "blood": fields.blood,
            "marriage": fields.marriage == "是" ? true : false,
            "partyMember": fields.partyMember == "是" ? true : false,
            "avatar": fields.picname
        },(err)=>{
           
            
            res.json({"result" : 1})
        })
    });
});


//修改员工
app.post("/api/updatestaff", (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        const id = fields.id;

        Staff.update({id} , {
             
                "name": fields.name,
                "sex": fields.sex,
                "birthday": fields.birthday,
                "department": fields.department,
                "hiredate": fields.hiredate,
                "title": fields.title,
                "nativePlace": fields.nativePlace,
                "idcard": fields.idcard,
                "mobile": fields.mobile,
                "education": fields.education,
                "blood": fields.blood,
                "marriage": fields.marriage == "是" ? true : false,
                "partyMember": fields.partyMember == "是" ? true : false,
             
        } , (err , docs)=>{
            console.log(err);
            console.log(docs);
            res.send("ok");
        });
    });
});

//修改头像
app.post("/api/updateavtar", (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        const id = fields.id;
        const picname = fields.picname;

        Staff.update({ id }, {

            "avatar": picname

        }, (err, docs) => {
            console.log(err);
            console.log(docs);
            res.send("ok");
        });
    });
});

//显示所有任务，其实要显示登陆这个人的业务
app.get("/api/tasks" , (req,res)=>{
    Task.find({}).exec((err , docs)=>{

        iterator(0);

        function iterator(i){
            if(i == docs.length){
                res.json({"results" : docs})
                return;
            }

            let count = 0;

            for(let j = 0 ; j < docs[i].implementer.length ; j++){
                Staff.find({ "id": docs[i].implementer[j].sid } , (err , _docs)=>{
                    docs[i].implementer[j].name = _docs[0].name;
                    docs[i].implementer[j].avatar = _docs[0].avatar;
 

                    count++;
                    if (count == docs[i].implementer.length){
                        iterator(++i);
                    }
                })
            }
           
        }
    });
});


//得到某人
app.get("/api/staff/:id", (req, res) => {
    Staff.find({"id" : req.params.id}).exec((err, docs) => {
        if(!docs){
            res.json({"result" : {}});
            return;
        }
        res.json({ "result": docs[0] });
    });
});

app.get("/api/changeTaskPriority" , (req,res)=>{
    const _id = url.parse(req.url, true).query._id;
    const sid = url.parse(req.url, true).query.sid;
    const priority = Number(url.parse(req.url, true).query.priority);

    Task.find({ "_id": _id }).exec((err, docs) => {
        var theone = docs[0];

        for (let i = 0; i < theone.implementer.length ; i++){
            if (theone.implementer[i].sid == sid){
                theone.implementer[i].priority = priority;
            }
        }
 
        theone.save((err)=>{
            res.send("ok");
        });  //持久
    });
});


app.post("/api/addImplementer", (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        const sid = fields.sid;
        const _id = fields._id;
        const avatar = fields.avatar;
        const name = fields.name;

        Task.find({_id} , (err , docs)=>{
            docs[0].implementer.push({
                sid ,
                avatar,
                name,
                "priority" : 1
            });

            docs[0].save((err)=>{
                res.send("ok");
            })
        })
    });
});

//检查是否登陆
app.get("/api/me" , (req,res)=>{
   
    Staff.find({
        id: Number(req.session.sid)
    }, (err, docs) => {
      
        if(!docs){
            res.json({"login" : -1});
        }else{
            res.json({
                "login": "1",
                "id": req.session.sid,
                "name": docs[0].name,
                "department": docs[0].department,
                "avatar": docs[0].avatar
            })
        }
    });
});

//执行登陆
app.post("/api/login" , (req,res)=>{
    var form = new formidable.IncomingForm();
    form.parse(req , (err , fields)=>{
        const id = fields.id;
        //变为16进制的SHA256加密码
        const password = crypto.createHash("SHA256").update(fields.password).digest("hex");

        User.find({
            id , password
        },(err , docs)=>{
            if(docs && docs.length == 1){
                Staff.find({"id" : id} , (err , docs2)=>{
                    // 登陆成功
                    req.session.login = true;
                    req.session.sid = id;
                    req.session.name = docs2[0].name;
                    req.session.department = docs2[0].department;
                    req.session.avatar = docs2[0].avatar;
 
                    res.send("1");
                });
            }else{
                req.session.login = false;
                res.send("-1");
            }
        });
        
    });
   
});

app.get("/api/tb1" , (req,res)=>{
    Staff.count({"education" : "小学"} , (err , count1) =>{
        Staff.count({ "education": "初中" }, (err, count2) => {
            Staff.count({ "education": "高中" }, (err, count3) => {
                Staff.count({ "education": "大学" }, (err, count4) => {
                    res.json({
                        "小学" : count1,
                        "初中" : count2,
                        "高中" : count3,
                        "大学" : count4
                    })
                })
            })
        }) 
    })
});

 
//当有时事通讯请求链接的时候，做的事情
io.on('connection', function(socket){
    console.log("有一个用户链接了");

    // 广播
    socket.broadcast.emit("yourendenglu", JSON.stringify(alluser));
    
    socket.on("denglule" , function(msg){
        console.log("收到了denglule信息：" + msg);

        //去重
        var isExit = false;
        for(let i = 0 ; i < alluser.length ; i++){
            if(alluser[i].id == JSON.parse(msg).id){
                isExit = true;
            }
        }
        if (!isExit){
            alluser.push(JSON.parse(msg));
            // 广播
            socket.broadcast.emit("yourendenglu", JSON.stringify(alluser));
        }
       

        
    });
});


http.listen(3000);