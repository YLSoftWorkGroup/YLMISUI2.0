import moment from 'moment';
import fetch from  '@/api/fetch';
import util from '@/common/js/util'
//表单验证规则

//表单验证规则
const emailreg=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
//url校验
const  urlreg=/^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
/* 小写字母*/
const  lowercasereg=/^[a-z]+$/;
/* 大写字母*/
const  uppercasereg=/^[A-Z]+$/;
/* 大小写写字母*/ 
const  alphabetsreg=/^[A-Za-z]+$/;
//判断输入的字符是否为:a-z,A-Z,0-9    
const  Stringreg=/^[a-zA-Z0-9_]+$/;
//判断输入的邮编(只能为六位)是否正确    
const postreg=/^\d{6}$/;  
//验证点电话号码
const phoneNum=/^(\(\d{3,4}\)|\d{3,4}-)?\d{7,8}$/;  
//非负浮点数（正浮点数 + 0）
const dacimalreg=/^\d+(\.\d+)?$/;  
//浮点数
const alldecimalreg=/^(-?\d+)(\.\d+)?$/

export default {

//校验是否为空
checkIsNull : function (rule, value, callback){ 
   setTimeout(() => {
          if (value=="") {
             callback(new Error('输入项不能为空！'));
          }else{
                callback();
          }
        }, 500);
},
checkIsNullfn : function (value){
      let result;
      value==""?  result=false: result=true;
      return result
},
//校验整数
checkInt : function (rule, value, callback){ 
   setTimeout(() => {
         value=Number(value);
          if (!Number.isInteger(value)) {
             callback(new Error('请输入数字值！'));
          }else{
                callback();
          }
        }, 500);
},

checkIntfn : function (value){
      let result;
      value=Number(value);
      !Number.isInteger(value)?  result=false: result=true;
      return result
},

//浮点数验证
checkdecimal : function (rule, value, callback){
    setTimeout(() => {
          if (!alldecimalreg.test(value)) {
             callback(new Error('请输入正确的浮点数！'));
          }else{
             callback();
          }
      }, 500);
},

checkdecimalfn : function (value){
      let result;
      value=parseFloat(value);
      !alldecimalreg.test(value)?  result=false: result=true;
      return result
},



//邮箱验证
checkemail : function (rule, value, callback){
    setTimeout(() => {
          if (!emailreg.test(value)) {
             callback(new Error('请输入正确的邮箱格式！'));
          }else{
                callback();
          }
      }, 500);
},


//验证点电话号码
checkphoneNum : function (rule, value, callback){
    setTimeout(() => {
          if (!phoneNum.test(value)) {
             callback(new Error('请输入正确的电话号码！'));
          }else{
                callback();
          }
      }, 500);
},

//url校验
checkurl : function (rule, value, callback){
    setTimeout(() => {
          if (!urlreg.test(value)) {
             callback(new Error('请输入正确的URL！'));
          }else{
                callback();
          }
      }, 500);
},


//日期格式化
formatDate: function (value,option){
      return moment(value).format(option); 
},


//判断获取单号
 generateOrderCode:  function(tableName,orgId,orderDate,callback,orderType=0,value='',sortCode=''){
      let obj={
                  tableName: tableName,
                  orgId:orgId,
                  orderDate: orderDate,
                  orderType: orderType,
                  value: value,
                  sortCode:sortCode
            };
      fetch({ 
            url: '/api/services/app/sqlExecute/GenerateOrderCode',
            method: 'post',
            data: obj
            }).then((data)=>{
                  if(data.success){
                        callback(data.result);
                  }else{
                        callback(new Error('获取编码信息失败，请检查参数是否正确！'));
                  }
            })
},

//判断重复
IsJudgeRepeat : function (rule, value, callback){
      let Arr=rule.split("|"),
      params={};
      params.tableName=Arr[0];
      params.columnName=Arr[1];
      params.orgId=Arr[2];
      params.parentId=Arr[3];
      params.oldValue=Arr[4];
      params.columnValue=value;
      if(params.oldValue==params.columnValue){
            callback();
      }else{
            setTimeout(() => {
                  fetch({ 
                              url: '/api/services/app/sqlExecute/IsJudgeRepeat',
                              method: 'post',
                              data: params
                        }).then((data)=>{
                              if(data.success){
                                    if(data.result==0){
                                          callback();
                                    }else{
                                    callback(new Error('输入字段重复,请重新数据！'));
                                    }
                              }
                        })
                  }, 500);
        }
},

//获取用户信息
getUserInfo:function(allowChange){
      let value=util.getCookieValue('userInfo');
      if(value==''){
            return {
                  user: {
                        realName: "",   //用户姓名
                        gender: "", //性别
                        userName: "", //用户账号
                        emailAddress: "", //用户邮箱地址
                        manageOrgId: "", //组织机构主键
                        manageOrgName: "", //组织机构名称
                        orgCode:'',
                        orgCategory:'',
                        companyId:"", //管理单位主键
                        companyName:"",  //管理单位名称
                        roleId: "", //角色主键
                        roleName: "", // 角色名称
                        realOrgId:"" ,//如果是项目部工区 该值为项目部主键
                        lastLoginTime: "", //上次登录时间
                        id:"" //用户主键
                    },
                    userDataRanges:[],
                    userRoles:[]
            }
      }else{
            let obj=JSON.parse(value)
            if(!allowChange){
                  if(location.href.indexOf('/ReportCenter/ordershow')>=0){
                        //单据中心
                        let Orgid=util.getCookieValue('reportOrg');
                        if(Orgid){
                              let Org=JSON.parse(Orgid);
                              obj.user.manageOrgId=Org.id;
                              obj.user.manageOrgName=Org.text;
                              obj.user.orgCode=Org.code;
                              obj.user.orgCategory=Org.funcCode;
                        }
                  }
            }
            return  obj;
      }
     

},

//生成guid 
newGuid:function(){
      var guid = "";
      for (var i = 1; i <= 32; i++){
            var n = Math.floor(Math.random()*16.0).toString(16);
            guid +=   n;
            if((i==8)||(i==12)||(i==16)||(i==20))
            guid += "-";
      }
      return guid;    
},

//获取guidOfNull
guidOfNull:function (){
      return "00000000-0000-0000-0000-000000000000"; 
},

//获取模块对象
getTableName:function (url=''){
      let inputArr=[ 
                     {dataField:"Url",op:"EQ",dataValue:url},
                   ];
      return new Promise(function (resolve, reject) {
            fetch({ 
                  url: '/api/services/app/menuItem/GetMenuItemForEdit',
                  method: 'post',
                  data: inputArr
            }).then((data)=>{
                  resolve(data.result.menuItem)
            }).catch((err)=>{
                   reject(new Error('获取模块表名称失败！'+err))
            });
      }); 
},

//获取审批状态信息
getApproveInfo:function (tableName=''){
       return new Promise(function (resolve, reject) {
            fetch({ 
                  url: '/api/services/app/roleApproveState/GetRoleApproveStateByRoleAndModule?tableName='+tableName,
                  method: 'post',
            }).then((data)=>{
                   resolve(data.result.roleApproveState);
            }).catch((err)=>{
                   reject(new Error('获取审批状态信息失败！'+err))
            });
        }); 
},



}
