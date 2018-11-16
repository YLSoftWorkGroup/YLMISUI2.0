<template>
     <div class="yl-config-page ">
        <div class="yl-config-loading" v-if="!isRender" >
            <div class="loading">
                <img  src="img/loading1.gif" alt="">
                <p>模块初始化中，请稍后...</p>
            </div>
        </div>
         <div class="yl-config-body" v-if="isRender">
              <yl-commonPage  
                    v-if="moduleType==='commonPage'"
                    :baseInfoConf="baseInfoConf"
                    :apiConf="apiConf"
                    :filterConf="filterConf"
                    :tableInfoConf="tableInfoConf"
                    :functionConf="functionConf"
                    :formConf="formConf"
                    :outPutConf="outPutConf">
             </yl-commonPage>

              <yl-reportassemble 
                     v-else-if="moduleType==='assemblePage'"
                    :baseInfoConf="baseInfoConf"
                    :filterConf="filterConf"
                    :tableInfoConf="tableInfoConf"
                    :functionConf="functionConf">
            </yl-reportassemble>

            <yl-dynamicPage  
                v-else-if="moduleType==='dynamicPage'"
                :options="tableInfoConf">
            </yl-dynamicPage>

         </div>
       
    </div>
</template>

<script type="text/babel">
import {
         requestGetModuleConfForEdit
       } from '@/api/moduleconf';
import util from '@/common/js/util';
import fetch from '@/api/fetch'
export default {
    data(){
        return {
            isRender:false,
            mConfigs:{},
            tableInfoConf:{}
        }  
    },
    computed:{
                apiConf:function(){
                    return JSON.parse(this.mConfigs.apiConf,util.dealFunction).apiConf;
                },
                baseInfoConf:function(){
                    return JSON.parse(this.mConfigs.baseInfoConf,util.dealFunction).baseInfo;
                },
                filterConf:function(){
                    return JSON.parse(this.mConfigs.fliterConf,util.dealFunction).filterConf;
                },
                // tableInfoConf:function(){
                //     return JSON.parse(this.mConfigs.tableInfoConf,util.dealFunction).tableInfoConf;
                // },
                functionConf:function(){
                    return JSON.parse(this.mConfigs.functionConf,util.dealFunction).functionConf;
                },
                formConf:function(){
                    return JSON.parse(this.mConfigs.formConf,util.dealFunction).formConf;
                },
                outPutConf:function(){
                    return JSON.parse(this.mConfigs.extensionOne,util.dealFunction).outPutConf;
                },
                moduleType:function(){
                    return this.mConfigs.extensionFrive;
                },
                globalConf:{
                    get(){
                        return util.getLocalStorage('SysGlobConf');
                    }
                },
    },
    methods:{
        init(){
            this.isRender=false;
             let moduleCode=this.$route.params.tableName;
             let pageCode=this.$route.params.pageName;
             let inputArrs=[ 
                    {dataField:"ExtensionTwo",op:"EQ",dataValue:moduleCode},
                    {dataField:"VersionNum",op:"EQ",dataValue:this.globalConf.versionNum},
                    {dataField:"PageName",op:"EQ",dataValue:pageCode},
                    {dataField:"IsEnable",op:"EQ",dataValue:1},
                ];
            fetch({
                url:"/api/services/app/moduleConf/GetModuleConfByKey",
                method:"post",
                data:inputArrs
            }).then((data)=>{
                    if(data.success){
                        if(data.result.order==null){
                            this.$message.warning('该模块没有配置数据！');
                        }else{
                            this.mConfigs=data.result.order;
                            this.tableInfoConf=JSON.parse(this.mConfigs.tableInfoConf,util.dealFunction).tableInfoConf;
                            this.isRender=true;
                            //缓存
                            sessionStorage.setItem('currentPageType',this.mConfigs.extensionFrive);
                        }
                    }  
                    else {
                        this.$message.error('失败！'+data.error.message);
                    }
                }).catch(err=>{

                });
        },
    },
    created(){
    },
    mounted(){
        this.init();
    }, 
     watch:{
          "$route": "init"
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css" rel="stylesheet/css" scoped>
.yl-config-page{height:100%;width:100%}
.yl-config-body{height:100%;width:100%}
.yl-config-loading{height:100%;width:100%;background-color:#fff}
.loading{
            height:100px;
            width:300px;
            text-align:center;
            color:#4388C9;
            font-size:14px;
            margin: 0 auto;
            padding-top:200px;
        }
</style>
