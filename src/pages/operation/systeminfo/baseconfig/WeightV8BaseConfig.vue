<template>
  <div slot="content" >
    <el-form  :model="formModel" style="height:500px" v-loading.body="formLoading" :rules="rules"  ref="formModel" label-width="100px" >
        <br>
        <el-row>
             <el-col :span="8">
                <el-form-item label="名称:" prop="name">
                    <span style="line-height:34px;color:#324057">{{data.name}}</span>
                </el-form-item>
            </el-col>
             <el-col :span="7">
                <el-form-item label="对接系统:" prop="type">
                    <span style="line-height:34px;color:#324057">{{formModel.type}}</span>
                </el-form-item>
            </el-col>
            <el-col :span="7">
                <el-form-item label="说明:" prop="remark">
                    <span style="line-height:34px;color:#324057">{{data.remark}}</span>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="11">
                <el-form-item label="域名" prop="baseUrl">
                    <el-input v-model="formModel.baseUrl" :readonly="true" ></el-input>
                </el-form-item>
            </el-col>
            
            
        </el-row>
        <el-row>
            <el-col :span="11">
                <el-form-item label="对应组织机构" prop="projectId" v-if="formModel.type=='v8'">
                    <yl-treeselect  v-model="formModel.projectId" 
                                    :treedata="orgData" 
                                    :defaultProps="defaultProps" 
                                    @getCurrentNode="_getOrgNode"
                                    :readonly="true">
                    </yl-treeselect>
                </el-form-item>
            </el-col>
              <el-col :span="11">
                <el-form-item label="对应组织编码" prop="projectId">
                    <el-input v-model="formModel.projectId" :readonly="orgReadOnly" ></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item style="text-align:center;" >
            <el-button class="icon-spinner11" @click="_resetForm">重置</el-button>
            <el-button type="primary" class="icon-floppy-disk" @click="_onSubmit" :loading="loading">保存</el-button>
        </el-form-item>
    </el-form>
    </div>
</template>

<script type="text/babel">
import fetch from  '@/api/fetch';
import util from '@/common/js/util';
export default {
    data(){
        return{
            formModel:{
                type:'v8',//对接类型
                user:'',//用户代码
                unit:'',//组织代码
                unitId:'',//组织ID
                projectId:'',//项目ID
                syscode:'',//平台编码
                authcode:'',//授权码
                baseUrl:'',
                url:'',
                storageId:'',//仓库ID
                storageCode:'',//仓库编码
                orgId:this.getUserInfo().user.manageOrgId
            },
            data:{
                id:'',
                name:'GBConf',
                describe:'',
                remark:'',
                sortCode:''
            },
            formLoading:false,
            rules:{},
            loading:false,
            interceptEventEvent:{
                ptBeforeUplodEvent:{isOn:true,event:"function(data,_this){let gbjs=_this.utilObject.getLocalStorage('GBConf');let od=data.order;let itm=data.items;for(var i=0;i<itm.length;i++){itm[i].orgId=gbjs.ioConf.models.projectId};od.orgId=gbjs.ioConf.models.projectId;od.creatorUserId='';od.lastModifierUserId='';let parms={order:od,items:itm,config:{isGenerateCode:false},judgeColumns:{orderColumns:'Id',itemColumns:'Id'}};let axiosConfig={baseURL:gbjs.ioConf.models.baseUrl,authorization:_this.utilObject.getCookieValue('ioAuthorization')};let resultParms={apiData:{url:gbjs.ioConf.models.baseUrl+'/api/services/app/table31Order/UploadMainObject',method:'post',data:parms},token:axiosConfig};console.log('resultParms',resultParms);return resultParms}"},
                ptAfterUplodEvent:{isOn:true,event:"function(data,_this){let js=data.success;if(js){return true;}else{return data.result};}"},
                cCBeforeUplodEvent:{isOn:true,event:"function(data,_this){let gbjs=_this.utilObject.getLocalStorage('GBConf');let od=data.order;let itm=data.items;for(var i=0;i<itm.length;i++){itm[i].orgId=gbjs.ioConf.models.projectId};od.orgId=gbjs.ioConf.models.projectId;od.creatorUserId='';od.lastModifierUserId='';let parms={order:od,items:itm,config:{isGenerateCode:false},judgeColumns:{orderColumns:'Id',itemColumns:'Id'}};let axiosConfig={baseURL:gbjs.ioConf.models.baseUrl,authorization:_this.utilObject.getCookieValue('ioAuthorization')};let resultParms={apiData:{url:gbjs.ioConf.models.baseUrl+'/api/services/app/table32Order/UploadMainObject',method:'post',data:parms},token:axiosConfig};console.log('resultParms',resultParms);return resultParms}"},
                cCAfterUplodEvent:{isOn:true,event:"function(data,_this){let js=data.success;if(js){return true;}else{return data.result};}"}
            },
            orgData:[],
            orgReadOnly:false,
            defaultProps:{
              children: 'children',
              label: 'text',
              id: 'id'
            }
        }
    },
    props:{
        confData:{}
    },
    methods:{
        _resetForm() {
            this.$refs.formModel.resetFields();
        },
        _onSubmit(){
            this.$refs.formModel.validate((valid) => {
            if (valid) {
                var _this=this;
                this.loading=true;
                this.descrb.ioConf.models=this.formModel;
                this.descrb.ioConf.InterceptEventEvent=this.interceptEventEvent;
                this.data.describe=JSON.stringify(this.descrb);
                let params={};
                params.globConfig=this.data;
                params.permissionType='2';
                fetch({
                    url: 'api/services/app/globConfig/createOrUpdateMainObject',
                    method: 'post',
                    data: params
                }).then(data=>{
                if(data.success){
                        this.$notify({
                            title: '成功',
                            message: '保存数据成功！',
                            type: 'success'
                            });
                    }
                    else {
                            this.$message.error('失败！'+data.error.message);
                    }
                        this.loading=false;
                }).catch(function(error){
                    _this.loading=false;
                })
            } else {
                this.$message.warning('请按照条件填充表单！');
                return false;
            }
            
        });
        },
        _getOrgList(){
            
        let gbjs = util.getLocalStorage('GBConf');
             let axiosConfig={
                 baseURL:window.getClientObj().ioConf.url,
                 authorization:util.getCookieValue('ioAuthorization')
                 }
            fetch({
                url:this.formModel.baseUrl+'/api/services/app/organize/GetAllOrganizeTreeList',
                method:'post',
                data:{}
            },axiosConfig).then(data=>{
                if(data.success){
                        this.orgData=data.result;
                }
                else {
                    this.$message.error('获取数据失败！');
                }
            })
        },
        _getOrgNode(node){
            this.orgReadOnly=true;
        }
    },
    mounted(){
        this.formModel.baseUrl=window.getClientObj().ioConf.url;
        this._getOrgList();
    },
    beforeMount(){
         this.descrbStr=this.confData.describe;
        let obj=JSON.parse(this.descrbStr);
        this.descrb=obj;
        this.deepFormData=obj.ioConf.models;
        Object.assign(this.data,this.confData); 
        Object.assign(this.formModel,obj.ioConf.models);
        this.formModel.type='v8';
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


