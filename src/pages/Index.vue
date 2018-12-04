
<template>
<div class="panel" >
    <div class="header header-background">
        <div class="left">
			    <div class="logowrapper">
					<img class="logo" src="img/logo.png"  />
				</div>
				<div class="title header-left-text-color">{{systemTitleName}}</div>
		</div>
		<div class="right">
			<ul>
                <el-popover
                    placement="top-start"
                    trigger="click">
                        <userConf></userConf>
                        <li class="userImg" slot="reference">
                             <img :src="userImgUrl" width="40px" alt="">
                        </li>
			    </el-popover>
			</ul>
			
		</div> 
    </div>
    <div class="body" v-loading="loading" :element-loading-text="$t('system.message.loading.waiting')">
        <div class="userInfo">
            <div class="username row">
                <span>{{$t('system.index.userName')}}：</span>{{userInfo.user.realName}}
            </div>
            <div class="OrgList row">
                <span>{{$t('system.index.organization')}}：</span>
                <el-select  v-model="formModel.orgId"  
                        :placeholder="$t('system.index.organizationTip')" 
                        style="width:230px">
                    <el-option
                        v-for="item in userInfo.userDataRanges"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class="RoleList row">
                <span>{{$t('system.index.role')}}：</span>
                <el-select  
                            v-model="formModel.roleId"  
                            :placeholder="$t('system.index.roleTip')" 
                            style="width:230px"
                            size=""
                            @change="_roleChange"
                            >
                    <el-option
                        v-for="item in userInfo.userRoles"
                        :key="item.id"
                        :label="item.text"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
           
        </div>
       <hr/>
        <div class="systemList" >
            <div class="sysBlock" v-for="(item,index) in systemList" :key="item.id"  v-show="item.isDisplay"
                    :style="{'background-color':getcolor(index)}"
                    @click="_goSystem(item)"
            >
                    <i :class="item.appIcon"></i>
                    <span>{{item.appName}}</span>
            </div>
        </div>
    </div>
</div>
</template>

<script type="text/babel">
import util from '@/common/js/util.js';
import fetch from '@/api/fetch.js';
import userConf from './layout/userConf';
import {
    requestGetGlobConfigInfo,
    requestUpdateCurrentUserInfo,
    requestGetCurrentLoginInformations
}from '@/api/login';
export default {
    data(){
        return{
                systemTitleName:getClientObj().sysConf.titleName,
                formModel:{
                    roleId:'',
                    orgId:'',
                },
                systemList:[],
                loading:false,
            }   
    },
    components:{
        userConf
    },
    computed:{
			userInfo:{
				get(){
					 return this.getUserInfo();
				}
            },
            userImgUrl:{
                get(){
                    if(this.getUserInfo().user.gender=='男'){
                        return './img/boy.png';
                    }else{
                        return './img/gril.png';
                    }
                }
            }
    },
    methods:{
        getcolor(index){
            return util.getColor(index);
        },
         _roleChange(node){
             this.loading=true;
             let _this=this;
             let params={
                        procType: 0, 
                        firstKeys: "RoleId", 
                        firstValues:'#'+node+'#',
                        secondKeys: "", 
                        secondOperates: "", 
                        secondValues: "",
                        procName: "Sys_GetMenuAppByRole" 
                        
                    }
             this.commonSqlExcute(params).then(
                 data=>{
                     this.systemList=data.items[0];
                     this.systemList.map(data=>{
                         if(data.appCode==='YLMREPV8.0'){
                             util.setCookie('hasReportCenter',1,1);
                         }
                     })
                     this.loading=false;
                 }
             ).catch(err=>{
                 _this.loading=false;
             })
          },
          _goSystem(item){
              let _this=this;
              this.loading=true
              document.title=item.appName;
              util.setCookie('appCode',JSON.stringify(item),1);
               let params={};
                    params=this.formModel;
                    requestUpdateCurrentUserInfo(params).then(data=>{
                         if(data.success){
                            requestGetCurrentLoginInformations().then( 
                                        data=>{
                                            if(data.success){
                                                util.setCookie('userInfo',JSON.stringify(data.result),1);
                                                if(item.appName==='报表中心'){
                                                    this.$router.push({ path:'/ReportCenter/home'});
                                                }else{
                                                    this.$router.push({ path:'/home'});
                                                }
                                            }
                                })
                         }
                         else {
                             this.$message.error('失败！'+data.error.message);
                         }
                         this.loading=false;
                    }).catch(function(error){
                         _this.loading=false;
                    })
             
          },
          _getGlobConf(){
					let inputArr=[
                        {dataField:"SB_Col8",op:"EQ",dataValue:true},
                    ],
                    input={};
					input.queryConditionItem=inputArr;
					input.sorting="sortCode ";
					requestGetGlobConfigInfo(input).then(data=>{
						if(data.success){
                              // 加载系统配置
                                data.result.map(i=>{
                                    if(i.name.substring(0,2)==='IO'){
                                         util.setLocalStorage('GBIoConf',i.describe);
                                    }else{
                                        util.setLocalStorage(i.name,i.describe);
                                    }
                                })
						}else{
							this.$message.error('获取全局配置失败!');
						}
					})
                },
            init(){
                this._getGlobConf(); //获取全局配置
                this.formModel.roleId=this.userInfo.user.roleId;
                this.formModel.orgId=this.userInfo.user.manageOrgId;
                this._roleChange(this.userInfo.user.roleId);
                document.title=getClientObj().sysConf.titleName;
            }
    },
    mounted(){
        this.init();
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
        .header
            height 55px
            width 100%
            display flex
            flex-direction row
            box-shadow 0 1px 0 #ddd
            .left
                width 70%
                display flex
                flex-direction row
                padding-top 5px
                padding-left 20px
                display flex
                flex-direction row
                .logo
                    height 45px
                .title
                    font-size:20px
                    font-family:SimSun
                    font-weight 500
                    height:45px
                    line-height :45px
                    padding-left:10px
            .right
                flex 1
                padding-right 10px
                ul	
                    list-style:none
                    display inline-block
                    height  55px
                    width 100%
                    text-align right
                    li 
                        width:60px
                        height:52px
                        display: inline-block
                        text-align:center
                        padding-top:5px
                        .icon 
                            font-size:22px
                            line-height:25px
                        span 
                            display: block
                            height: 15px
                            padding-top:5px
                            font-size:12px
                    li:hover
                        cursor:pointer
        .body
            flex 1
            display flex
            flex-direction column
            padding 20px
            .userInfo
                background-color #fff
                height 120px
                font-size:13px
                padding 10px
                .row
                    height 40px
                    line-height 35px
            .systemList
                background-color #fff
                border 1px dashed #ddd
                padding 10px
                display flex
                flex-wrap wrap
                .sysBlock
                    width 200px
                    height 80px
                    margin-right 15px
                    margin-top 25px
                    border 2px solid  #eee
                    color #fff
                    font-size:18px
                    text-align center
                    line-height 80px
                    box-shadow 0px 4px 2px rgba(0, 0, 0, .1)
                .sysBlock:hover 
                    background #58B7FF
                    cursor Pointer
                    
</style>