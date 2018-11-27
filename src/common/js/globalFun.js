import Vue from 'vue'
import moment from 'moment';
import fetch from  '@/api/fetch';
import util from './util';
import xlsx from  './js-xlsx';
import router from '@/router';

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

//校验是否为空
Vue.prototype.checkIsNull = function (rule, value, callback){ 
   setTimeout(() => {
          if (value=="") {
             callback(new Error('输入项不能为空！'));
          }else{
                callback();
          }
        }, 500);
}
Vue.prototype.checkIsNullfn = function (value){
      let result;
      value==""?  result=false: result=true;
      return result
}
//校验整数
Vue.prototype.checkInt = function (rule, value, callback){ 
   setTimeout(() => {
         value=Number(value);
          if (!Number.isInteger(value)) {
             callback(new Error('请输入数字值！'));
          }else{
                callback();
          }
        }, 500);
}

Vue.prototype.checkIntfn = function (value){
      let result;
      value=Number(value);
      !Number.isInteger(value)?  result=false: result=true;
      return result
}

//浮点数验证
Vue.prototype.checkdecimal = function (rule, value, callback){
    setTimeout(() => {
          if (!alldecimalreg.test(value)) {
             callback(new Error('请输入正确的浮点数！'));
          }else{
             callback();
          }
      }, 500);
}

Vue.prototype.checkdecimalfn = function (value){
      let result;
      value=parseFloat(value);
      !alldecimalreg.test(value)?  result=false: result=true;
      return result
}



//邮箱验证
Vue.prototype.checkemail = function (rule, value, callback){
    setTimeout(() => {
          if (!emailreg.test(value)) {
             callback(new Error('请输入正确的邮箱格式！'));
          }else{
                callback();
          }
      }, 500);
}


//验证点电话号码
Vue.prototype.checkphoneNum = function (rule, value, callback){
    setTimeout(() => {
          if (!phoneNum.test(value)) {
             callback(new Error('请输入正确的电话号码！'));
          }else{
                callback();
          }
      }, 500);
}

//url校验
Vue.prototype.checkurl = function (rule, value, callback){
    setTimeout(() => {
          if (!urlreg.test(value)) {
             callback(new Error('请输入正确的URL！'));
          }else{
                callback();
          }
      }, 500);
}




//判断获取单号
Vue.prototype.generateOrderCode=function(tableName,orgId,orderDate,callback,orderType=0,value='',sortCode=''){
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
}



//日期格式化
Vue.prototype.formatDate= function (value,option){
      return moment(value).format(option); 
}

//日期格式化
Vue.prototype.moment= function (value,option){
      return moment; 
}

//判断重复
Vue.prototype.IsJudgeRepeat = function (rule, value, callback){
      let Arr=rule.split("|"),
      params={};
      params.tableName=Arr[0];
      params.ColumnNames=Arr[1];
      params.columnValues=Arr[2];
      params.oldValue=Arr[3];
      if(params.oldValue.toLowerCase()==params.columnValues.toLowerCase()){
            callback();
      }else{
            setTimeout(() => {
                  fetch({ 
                              url: '/api/services/app/sqlExecute/IsCommonJudgeRepeat',
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
}
//获取用户信息
Vue.prototype.getUserInfo=function(allowChange){
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
                  if(this.$route.path.indexOf('/ReportCenter/ordershow')>=0){
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
     

}

//生成guid 
Vue.prototype.newGuid=function(){
      let UUID = require('uuid-js');
      // Generate a V4 UUID
      let uuid4 = UUID.create();
      return uuid4.toString();    
}

//获取guidOfNull
Vue.prototype.guidOfNull= function (){
      return "00000000-0000-0000-0000-000000000000"; 
}

Vue.prototype.accessWords= function (){
      return 'CFBAC5B8043E79BBEEE90FAB9FF49F01CD7E8E6173385AC57A39C27870714B66'
   }

//获取通用函数
Vue.prototype.commonSqlExcute=function (params){
      return new Promise(function (resolve, reject) {
           fetch({ 
                 url: '/api/services/app/sqlExecute/ExecuteSqlAndProcCommand',
                 method: 'post',
                 data:params
           }).then((data)=>{
                 if(data.success){
                       resolve(data.result);
                 }else{
                        reject(new Error('请求信息失败！'+err))
                 }
           }).catch((err)=>{
                  reject(new Error('请求信息异常！'+err))
           });
       }); 
}
//获取越权函数
Vue.prototype.forceSqlExcute=function (params){

      return new Promise(function (resolve, reject) {
           fetch({ 
                 url: '/api/services/app/apiManager/YlHttpV8',
                 method: 'post',
                 data:{
                       baseUrl:params.baseUrl,
                       url:params.url,
                       verbType:params.method,
                       parasJson:JSON.stringify(params.data),
                       paras:[
                        {name: "client_id", value: getClientObj().sysConf.clientId},
                        {name: "client_secret", value: getClientObj().sysConf.clientSecret}
                       ]
                 }
           }).then((data)=>{
                 if(data.success){
                       resolve(data.result);
                 }else{
                        reject(new Error('请求信息失败！'+err))
                 }
                  
           }).catch((err)=>{
                  reject(new Error('请求信息异常！'+err))
           });
       }); 
} 

//获取模块对象
Vue.prototype.getTableName=function (url=''){
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
}
//获取审批状态信息
Vue.prototype.getApproveInfo=function (tableName=''){
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
}


//封装的异步请求
Vue.prototype.asyncFunc=function (apiConf,errText=''){
    
      return new Promise(function (resolve, reject) {
            fetch(apiConf).then((data)=>{
                  if(data.success){
                        resolve(data.result)
                  }else{
                      reject(new Error(errText+'获取失败！'))
                  }
                  
            }).catch((err)=>{
                   reject(new Error(errText+'获取异常！'+err))
            });
      }); 

  
}


//execl导出通用方法
Vue.prototype.exportHtmlToExcel=function(str,fileConf){
      xlsx.exportHtmlToExcel(str,fileConf);
}

//execl导出模板方法
Vue.prototype.exportCommonTemplate=function(ColumnConf,DataList,titleName){
      xlsx.exportCommonTemplate(ColumnConf,DataList,titleName);
}

//execl导入通用方法
Vue.prototype.importToJsonData=function(file,callback){
      xlsx.importToJsonData(file,callback);
}


//路由跳转
Vue.prototype.goUrl=function (url='',type=0){
      if(type===0){
            router.push({path:url})     
      }else if(type===1){
            router.replace(url)
      }else if(type==3){
            router.go(-1)
      }
     
}

//获取当前OrgID
  
Vue.prototype.getLocalOrgId=function (){
     
      if(this.$route.path.indexOf('/ReportCenter')>=0){
            //报表中心
            let Orgid=util.getCookieValue('reportOrg');
            if(Orgid){
                  return  JSON.parse(Orgid).id;
            }else{

            }
           
      }
      else{
            let userinfo=util.getCookieValue('userInfo');  
            return  JSON.parse(userinfo).user.manageOrgId;
      }     
     
}

//获取当前模块对象属性

Vue.prototype.getMenuInfo=function (){
     let o=localStorage.getItem('currentRouter');
     if(o){
           return JSON.parse(o)
     }
}
