import moment from "moment";
import React from "react";
import { Button} from "antd";


export default (sortby, sortdirection, cols, kanxiangqing, showDrawer) => {
    const getSortOrderString = (key) => {
        if (sortby == key){
            if (sortdirection == 1){
                return "ascend";
            }else if(sortdirection == -1){
                return "descend";
            }
        }else{
            return "";
        }
    }

    //全部列可能
    const ALLCOLS = [
        {
            title : "头像",
            dataIndex: 'avatar',
            key: 'avatar',
            render(text , record){
                if(!text){
                    return <img onClick={()=>{
                        kanxiangqing(record.id)
                    }} src="images/defaultavatar.jpg" width={80} style={{
                        "cursor": "pointer"
                    }}/>
                }else{
                    return <img onClick={() => {
                        kanxiangqing(record.id)
                    }} src={"http://127.0.0.1:3000/uploads/" + text + "?" + Math.random()} width={80} style={{
                        "cursor": "pointer"
                    }}/>
                }
            }
        },
        {
            title: '性别',
            dataIndex: 'sex',
            key: 'sex',
        },
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
            sorter : true,
            sortOrder: getSortOrderString("id")
        },
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
            sorter: true,
            sortOrder: getSortOrderString("name")
        },
        {
            title: '生日',
            dataIndex: 'birthday',
            key: 'birthday',
            render(text){
                return <span>{moment(text).format("YYYY-MM-DD")}</span>
            },
            sorter: true,
            sortOrder: getSortOrderString("birthday")
        },
        {
            title: '部门',
            dataIndex: 'department',
            key: 'department'
        },
        {
            title: '入职时间',
            dataIndex: 'hiredate',
            key: 'hiredate',
            render(text) {
                return <span>{moment(text).format("YYYY-MM-DD")}</span>
            },
            sorter: true,
            sortOrder: getSortOrderString("hiredate")
        },
        {
            title: '职称',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '学历',
            dataIndex: 'education',
            key: 'education',
        },
        {
            title: '血型',
            dataIndex: 'blood',
            key: 'blood',
        },
        {
            title: '是否结婚',
            dataIndex: 'marriage',
            key: 'marriage',
            render(text){
                return <span>{text ? "是" : "否"}</span>
            }
        },
        {
            title: '是否党员',
            dataIndex: 'partyMember',
            key: 'partyMember',
            render(text) {
                return <span>{text ? "是" : "否"}</span>
            }
        },
        {
            title: '家乡',
            dataIndex: 'nativePlace',
            key: 'nativePlace'
        },
        {
            title: '身份证号',
            dataIndex: 'idcard',
            key: 'idcard'
        },
        {
            title: '手机',
            dataIndex: 'mobile',
            key: 'mobile'
        }
    ]

    //返回的是全局Modal中的映射出的一个新数组，自己琢磨一下！
    //工作中最难的算法就是形式转换：
    return [...cols.map(item=>{
            return ALLCOLS.filter(_item=>_item.key == item)[0];
        }),
        {
            title: '修改',
            dataIndex: 'modify',
            key: 'modify',
            render(text , record) {
                return <Button shape="circle" icon="search" onClick={()=>{
                    showDrawer(true , record.id);
                }}/>
            }
        }
    ];
}