<template>
    <yl-panelpage :titleName="'基础配置 当前对接版本:【'+type+'】,修改后需重新登录'" >
        <div slot="content" style="background-color:white;height:600px"> 
            <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
                <el-tab-pane label="过磅全局配置" name="three">
                    <WeightAllConfig ref="allConfig" v-if="activeName2=='three'" :confData="data"></WeightAllConfig>
                </el-tab-pane>
                <el-tab-pane label="7.0接口配置" name="second">
                    <Weight70BaseConfig ref="v7Config"  v-if="activeName2=='second'" :confData="data"></Weight70BaseConfig>
                </el-tab-pane>
                <el-tab-pane label="8.0接口配置" name="four">
                    <WeightV8BaseConfig ref="v8Config"  v-if="activeName2=='four'" :confData="data"></WeightV8BaseConfig>
                </el-tab-pane>
                <el-tab-pane label="久其接口配置" name="first">
                    <WeigtBaseConfig ref="jiuQConfig"  v-if="activeName2=='first'" :confData="data"></WeigtBaseConfig>
                </el-tab-pane>
            </el-tabs>
        </div>
  </yl-panelpage>
</template>

<script type="text/babel">
import WeigtBaseConfig from './WeigtBaseConfig'
import WeightAllConfig from './WeightAllConfig'
import Weight70BaseConfig from './Weight70BaseConfig'
import WeightV8BaseConfig from './WeightV8BaseConfig'
import util from '@/common/js/util';
export default {
    data(){
        return{
            activeName2:'three',
            loading:false,
            data:{
                id:'',
                name:'GBConf',
                describe:'',
                remark:'',
                sortCode:''
            },
            type:''
        }
    },
    methods:{
        handleClick(tab, event) {
            if(tab.name=="first"){
                this._getConfObjForEdit();
            }else if(tab.name=="three"){
               this._getConfObjForEdit();
            }else if(tab.name =='second'){
                this._getConfObjForEdit();
            }else if(tab.name =='four'){
                this._getConfObjForEdit();
            }
        },
        async _getConfObjForEdit(){
             let parms={
                 queryConditionItem:[{
                         dataField:'Name',
                         dataValue:this.data.name,
                         op:'EQ',
                         relation:'and'
                     }],
                 sorting:''
             };
            let alldata= await  this.asyncFunc({
                                                url:'api/services/app/globConfig/getMainObjectForEdit',
                                                method:'post',
                                                data:parms
                                            },'获取初始化Form信息');
                    if(alldata.globConfig.id!=undefined){
                        this.data=alldata.globConfig;
                    }   
            }
    },
    mounted(){
        let gbjs = util.getLocalStorage('GBConf');
        this.type=gbjs.ioConf.models.type;
    },
    beforeMount(){
        this._getConfObjForEdit();
    },
    components:{
        WeigtBaseConfig,
        WeightAllConfig,
        Weight70BaseConfig,
        WeightV8BaseConfig
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


