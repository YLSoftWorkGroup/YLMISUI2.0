
<template>
<div class="panel">
   <h4>跳转中，请稍后...</h4>   
   <p>O(∩_∩)O耐心等待.... </p>
</div>
</template>

<script type="text/babel">
import util from '@/common/js/util.js';
import fetch from '@/api/fetch.js';
import xml2 from '@/common/js/xml2json.min';
import {
    requestGetGlobConfigInfo,
    requestUpdateCurrentUserInfo,
    requestGetCurrentLoginInformations,
    requestToken,
}from '@/api/login';

export default {
    data(){
        return{
            }   
    },
    computed:{
    },
    methods:{
    },
    mounted(){
       //单点登录
            //判断参数是否含有ticket
            if(this.$route.query.ticket!==undefined){
                      //验证ticket
                      fetch({
                            url:"api/services/app/apiManager/YlHttpPost",
                            method:"post",
                            data:{
                                    "baseUrl": getClientObj().singleLogin.url,
                                    "url": "/cas/serviceValidate",
                                    "VerbType":"get",
                                    "paras": [
                                        {
                                        "name":"ticket",
                                        "value":this.$route.query.ticket
                                        },
                                        {
                                        "name":"service",
                                        "value":getClientObj().sysConf.url+'/api/Cas'
                                        }
                                    ]
                                 }
                        },{baseURL:'',authorization:'none',formatData:false}).then(data=>{
                            if(data.success){
                                var x2js = new xml2();
                                var jsonObj = x2js.xml_str2json(data.result);
                                if(jsonObj.serviceResponse.authenticationSuccess!=undefined){
                                      //验证成功
                                     let loginform={    userName: '',
                                                        passWord: '',
                                                        grant_type:'password',
                                                        ylClientId:'',
                                                        loginType:getClientObj().loginType,
                                                    }
                                    if(util.getCookieValue('ylClientId')===''){
                                        util.setCookie('ylClientId',util.newGuid(),1);
                                    }
                                    loginform.ylClientId=util.getCookieValue('ylClientId');
                                    loginform.fieldName=getClientObj().singleLogin.loginform.fieldName;
                                    let usetInfo=JSON.parse(jsonObj.serviceResponse.authenticationSuccess.attributes.data.__text)
                                    loginform.userId=usetInfo.id;
                                     requestToken(loginform).then(data=>{
                                         let result=data.data;
                                            if(result.error!==undefined){
                                                if(result.error==="InvalidUserName"){
                                                    this.$message.warning('用户名输入有误！');
                                                }else if(result.error==="InvalidPassword"){
                                                    this.$message.warning('密码输入有误！');
                                                }else if(result.error==="InvalidOrgId"){
                                                    this.$message.warning('用户没有授权权限范围！');
                                                }else if(result.error==="InvalidRoleId"){
                                                    this.$message.warning('用户没有授权角色！');
                                                }else{
                                                    this.$message.warning('登录有误:'+result.error);
                                                }
                                                this.$router.replace('/Page404');  
                                                //window.location = getClientObj().singleLogin.url+'/cas/login?service='+getClientObj().sysConf.url+'/api/Cas';
                                            }else{
                                                if(result.access_token!==""){
                                                    util.setLogin(result.access_token);
                                                    requestGetCurrentLoginInformations().then(
                                                            data=>{
                                                                if(data.success){
                                                                    util.setCookie('userInfo',JSON.stringify(data.result),1);
                                                                    this.$router.replace('/Index');  
                                                                }
                                                    });
                                                } else {
                                                    this.$message.error('登录失败！');
                                                }
                                            }
                                     })
                                }else{
                                      //验证失败
                                      window.location = getClientObj().singleLogin.url+'/cas/login?service='+getClientObj().sysConf.url+'/api/Cas';
                                }
                            }
                        }).catch(err=>{
                              window.location = getClientObj().singleLogin.url+'/cas/login?service='+getClientObj().sysConf.url+'/api/Cas';
                        })
            }else{ 
                   window.location = getClientObj().singleLogin.url+'/cas/login?service='+getClientObj().sysConf.url+'/api/Cas';
            }
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .panel
        display flex
        width 100%
        height 100%
        flex-direction column
</style>