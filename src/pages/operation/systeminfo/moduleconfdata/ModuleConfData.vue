<template>
<yl-panelpage  titleName="配置数据管理" >
        <div slot="content">
             <yl-layout >
                    <div slot="fristbox" >
                        <yl-toolbar>
                            <el-form  :inline="true"  >
                                 <el-form-item class="form-content-vertical">
                                                <el-tag v-if="switchValue"
                                                    type="primary"
                                                  >
                                                   已设置
                                                 </el-tag>
                                                 <el-tag v-if="!switchValue"
                                                    type="danger"
                                                  >
                                                    未设置
                                                 </el-tag> 
                                        </el-form-item>
                                        <el-form-item class="form-content-vertical">
                                            <el-input  
                                                    placeholder="服务地址  http://" 
                                                    size="small" 
                                                    style="width:300px" 
                                                    v-model="serviceUrl"
                                            ></el-input>   
                                        </el-form-item>
                                        <el-form-item class="form-content-vertical">
                                             <el-button type="success"  
                                                :loading="Loading" 
                                                size="small"   
                                                :disabled="serviceUrl===''" 
                                                @click="_getToken" ><i class="icon-alignment-aligned-to"></i>获取Token
                                             </el-button> 
                                        </el-form-item>
                                    </el-form>
                         </yl-toolbar>
                  </div>
                <div slot="secondbox" class="flexbox">

                    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
                        <el-tab-pane label="模块配置" name="moduleConf" >
                                <moduleConf :serviceUrl="serviceUrl" ref="moduleConf"> </moduleConf>
                        </el-tab-pane>
                        <el-tab-pane label="报表配置" name="reportConf">
                                <reportConf :serviceUrl="serviceUrl" ref="reportConf"> </reportConf>
                        </el-tab-pane>
                        <el-tab-pane label="门户配置" name="homePageConf">
                             <homePageConf :serviceUrl="serviceUrl" ref="homePageConf"> </homePageConf>
                        </el-tab-pane>
                        <el-tab-pane label="数据选择器配置" name="selectModuleConf">
                             <selectModuleConf :serviceUrl="serviceUrl" ref="selectModuleConf"> </selectModuleConf>
                        </el-tab-pane>
                    </el-tabs>
                </div>
             </yl-layout >
        </div>
    </yl-panelpage>
</template>

<script type="text/babel">
import moduleConf from './moduleConf.vue'
import reportConf from './reportConf.vue'
import homePageConf from './homePageConf.vue'
import selectModuleConf from './selectModuleConf.vue'
import util from '@/common/js/util'
import fetch from '@/api/fetch'
export default {
    data(){
        return {
            activeName:'moduleConf',
            serviceUrl:'',
            Loading:false,
            switchValue:false
        }
    },
    methods:{
        handleClick(val){
            this.$refs[val.name]._reload();
        },
        _getToken(){
             fetch( { 
                        url: '/Token',
                        method: 'post',
                        data: "grant_type=client_credentials"
                    },
                    {
                        baseURL:this.serviceUrl,
                        authorization:util.getDefaultToken(),
                        formatData:false
                    }
                ).then(data=>{
                       localStorage.setItem('confAuthorization',"Bearer " +data.access_token);
                       localStorage.setItem('serviceUrl',this.serviceUrl);
                        this.switchValue=true;
                })
        }
    },
    components:{
        moduleConf,
        reportConf,
        homePageConf,
        selectModuleConf
    },
    mounted(){
        if(localStorage.getItem('confAuthorization')!=null){
            this.serviceUrl=localStorage.getItem('serviceUrl');
            this.switchValue=true;
        }else{
             this.switchValue=false;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css" rel="stylesheet/css" >
.el-tabs--border-card{
    border:none;
}
.el-tab-pane{
    height:100%;
}
.el-tabs__header{
    margin: 0px;
}
.el-tabs__content{
    height:100%;
}

</style>

