<template>
        <div slot="content" >
            <el-form  :model="formModel"  v-loading.body="formLoading" :rules="rules" ref="formModel" label-width="100px" >
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
                            <el-input v-model="formModel.baseUrl" :readonly="true"  ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="链接" prop="url">
                            <el-input v-model="formModel.url" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                         <el-form-item label="授权码" prop="authcode">
                            <el-input v-model="formModel.authcode" ></el-input>
                        </el-form-item>
                    </el-col>
                   
                    <el-col :span="11">
                        <el-form-item label="平台编码" prop="syscode">
                            <el-input v-model="formModel.syscode" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row> 
                    <el-col :span="11">
                        <el-form-item label="用户代码" prop="user">
                            <el-input v-model="formModel.user" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="组织编码" prop="unit">
                            <el-input v-model="formModel.unit" ></el-input>
                        </el-form-item>
                    </el-col>
                  
                </el-row>
                <el-row>
                      <el-col :span="4">
                        <el-form-item label="" prop="unit">
                         <el-button  type="success" class="icon-cloud-download2" :loading="infoLoading" @click="_getOrgs">获取组织</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                         <el-form-item label="组织" prop="unitId">
                             <el-select v-model="formModel.unitId" 
                                style="width:100%" 
                                filterable 
                                :placeholder="''" 
                                :clearable="true" 
                                :disabled="false"
                                @change="_changeOrg">
                                <el-option v-for="item in orgData" 
                                    style="width:100%;height:auto;" 
                                    :key="item.recid"  
                                    :label="item.stdname" 
                                    :value="item.recid" >
                                        <div style="height:18px; font-size: 12px">{{item.stdname}}</div> 
                                        <!-- <div style="height:15px;color: #8492a6; font-size: 11px" >{{ item.infoUnit}}</div> -->
                                </el-option>
                        </el-select>
                        </el-form-item>
                         

                    </el-col>
                    <el-col :span="11">
                         <el-form-item label="项目编码" prop="projectId">
                             <el-select v-model="formModel.projectId" 
                                style="width:100%" 
                                filterable 
                                :placeholder="''" 
                                :clearable="true" 
                                :disabled="false"
                                @change="_changeProject">
                                <el-option v-for="item in projectData" 
                                    style="width:100%;height:auto;" 
                                    :key="item.recid"  
                                    :label="item.stdname" 
                                    :value="item.recid" >
                                        <div style="height:18px; font-size: 12px">{{item.stdname}}</div> 
                                        <!-- <div style="height:15px;color: #8492a6; font-size: 11px" >{{ item.infoUnit}}</div> -->
                                </el-option>
                        </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="11">
                         <el-form-item label="仓库" prop="storageId">
                             <el-select v-model="formModel.storageId" 
                                style="width:100%" 
                                filterable 
                                :placeholder="''" 
                                :clearable="true" 
                                :disabled="false"
                                @change="_getStorageNode">
                                <el-option v-for="item in storageData" 
                                    style="width:100%;height:auto;" 
                                    :key="item.recid"  
                                    :label="item.stdname" 
                                    :value="item.recid" >
                                        <div style="height:18px; font-size: 12px">{{item.stdname}}</div> 
                                        <!-- <div style="height:15px;color: #8492a6; font-size: 11px" >{{ item.infoUnit}}</div> -->
                                </el-option>
                        </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                         <el-form-item label="仓库编码" prop="storageCode">
                            <span style="line-height:34px;color: #8492a6;">{{formModel.storageCode}}</span>
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
export default {
    data(){
        return{
            data:{
                id:'',
                name:'GBConf',
                describe:'',
                remark:'',
                sortCode:''
            },
            formModel:{
                type:'jq',//对接类型
                user:'',//用户代码
                unit:'',//组织代码
                unitId:'',//组织ID
                projectId:'',//项目ID
                syscode:'CRCCWZ',//平台编码
                authcode:'',//授权码
                baseUrl:'http://58.213.100.34:8080',
                url:'/rest/bill/check',
                storageId:'',//仓库ID
                storageCode:'',//仓库编码
                orgId:this.getUserInfo().user.manageOrgId,
            },
            rules:{
                baseUrl: [
                      { required: true, message: '地址不能为空！', trigger: 'blur' }
                    ],
                url: [
                      { required: true, message: '链接不能为空！', trigger: 'blur' }
                    ],
                authcode: [
                      { required: true, message: '授权码不能为空！', trigger: 'blur' }
                    ],
                syscode: [
                      { required: true, message: '平台编码不能为空！', trigger: 'blur' }
                    ],
                user: [
                      { required: true, message: '用户代码不能为空！', trigger: 'blur' }
                    ],
                unit: [
                      { required: true, message: '组织代码不能为空！', trigger: 'blur' }
                    ],
            },
            loading:false,
            formLoading:false,
            orgData:[],
            projectData:[],
            storageData:[],
            uId:'',
            deepFormData:{},
            unitFilter:'',
            infoLoading:false,
            descrbStr:'',
            descrb:{},
            interceptEventEvent:{
                ptBeforeUplodEvent:{isOn:true,event:"function(result,_this){let gbjs=_this.utilObject.getLocalStorage('GBConf');let rows=result.order;let data={dataid:_this.newGuid().replace(/-/g,''),actiontype:'upbill',action:'0',user:gbjs.ioConf.models.user,unit:gbjs.ioConf.models.unit,billlist:[{RECID:rows.id.replace(/-/g,'').toUpperCase(),STORAGEID:gbjs.ioConf.models.storageId,PROJECTID:gbjs.ioConf.models.projectId,MATERIALID:rows.infoNM.replace(/-/g,'').toUpperCase(),BATCHNO:rows.orderCode,INOUTFLAG:'true',REDBLUEFLAG:'false',MEASUREMENTID:rows.o_Col38.replace(/-/g,'').toUpperCase(),QUANTITY:rows.d_Col42,BILLDATE:rows.makerDate,SUPPLIERID:rows.o_Col36.replace(/-/g,'').toUpperCase(),CREATETIME:_this.formatDate(rows.creationTime,'YYYY-MM-DD HH:mm'),UNITID:gbjs.ioConf.models.unitId,COSTOBJECT:'',RECIPIENT:'ml'}]};if(rows.orderDataType==1){data.billlist[0].SOURCERECID=rows.orderDataId.replace(/-/g,'').toUpperCase();data.billlist[0].INOUTFLAG='true',data.billlist[0].REDBLUEFLAG='true',data.billlist[0].QUANTITY=Math.abs(rows.d_Col42)}else if(rows.orderDataType==2){data.billlist[0].SOURCERECID=rows.orderDataId.replace(/-/g,'').toUpperCase()};let dataStr=JSON.stringify(data);let parms={baseUrl:gbjs.ioConf.models.baseUrl,url:gbjs.ioConf.models.url,paras:[{name:'syscode',value:gbjs.ioConf.models.syscode},{name:'authcode',value:gbjs.ioConf.models.authcode},{name:'data',value:dataStr}]};let resultParms={apiData:{url:'api/services/app/apiManager/YlHttpPost',method:'post',data:parms},token:{}};return resultParms}"},
                ptAfterUplodEvent:{isOn:true,event:"function(data,_this){let js=JSON.parse(data.result);if(js.validcode=='0'){return true;}else{return js.msg};}"},
                cCBeforeUplodEvent:{isOn:true,event:"function(result,_this){let gbjs=_this.utilObject.getLocalStorage('GBConf');let rows=result.order;let data={dataid:_this.newGuid().replace(/-/g,'').toUpperCase(),actiontype:'upbill',action:'0',user:gbjs.ioConf.models.user,unit:gbjs.ioConf.models.unit,billlist:[{RECID:rows.id.replace(/-/g,'').toUpperCase(),STORAGEID:gbjs.ioConf.models.storageId,PROJECTID:gbjs.ioConf.models.projectId,MATERIALID:rows.infoNM.replace(/-/g,'').toUpperCase(),BATCHNO:rows.orderCode,INOUTFLAG:'false',REDBLUEFLAG:'false',MEASUREMENTID:rows.o_Col38.replace(/-/g,'').toUpperCase(),QUANTITY:rows.d_Col42,BILLDATE:rows.makerDate,SUPPLIERID:'',CREATETIME:_this.globalFunObject.formatDate(rows.creationTime,'YYYY-MM-DD HH:mm'),UNITID:gbjs.ioConf.models.unitId,COSTOBJECT:rows.o_Col36.replace(/-/g,'').toUpperCase(),RECIPIENT:'ml'}]};if(rows.orderDataType==1){data.billlist[0].SOURCERECID=rows.orderDataId.replace(/-/g,'').toUpperCase();data.billlist[0].INOUTFLAG='false',data.billlist[0].REDBLUEFLAG='true',data.billlist[0].QUANTITY=Math.abs(rows.d_Col42)}else if(rows.orderDataType==2){if(rows.orderDataId!=_this.guidOfNull()){data.billlist[0].SOURCERECID=rows.orderDataId.replace(/-/g,'').toUpperCase()}};let dataStr=JSON.stringify(data);let parms={baseUrl:gbjs.ioConf.models.baseUrl,url:gbjs.ioConf.models.url,paras:[{name:'syscode',value:gbjs.ioConf.models.syscode},{name:'authcode',value:gbjs.ioConf.models.authcode},{name:'data',value:dataStr}]};let resultParms={apiData:{url:'api/services/app/apiManager/YlHttpPost',method:'post',data:parms},token:{}};console.log(resultParms);return resultParms}"},
                cCAfterUplodEvent:{isOn:true,event:"function(data,_this){let js=JSON.parse(data.result);if(js.validcode=='0'){return true;}else{return js.msg};}"}
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
                    params.permissionType=2;
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

        async  _getOrgs(){
            if(this.formModel.type=='jq'){
                let _this=this;
                this.infoLoading=true;
                let orgparams= _this._getParamaters('MD_ORG');
                //组织机构
                let orgdtastr= await  _this.asyncFunc({
                                            url:'api/services/app/apiManager/YlHttpPost',
                                            method:'post',
                                            data:orgparams
                                        },'获取组织机构信息');
                this.infoLoading=false;
                let orgjson=JSON.parse(orgdtastr).data;
                _this.orgData=orgjson;
            }
         },
         _changeOrg(node){
            if(this.formModel.type=='jq'){
                this._getProject(node);
            }
         },
        async  _getProject(id){
            let _this=this;
            //"UNITID:guid'"+id+"'|UNITID:guid'00000000000000000000000000000000'"
            let proparams=_this._getParamaters('MD_PROJECT','',"UNITID:guid'00000000000000000000000000000000'");
             //项目
            let prodatastr= await  _this.asyncFunc({
                                            url:'api/services/app/apiManager/YlHttpPost',
                                            method:'post',
                                            data:proparams
                                        },'获取项目信息');
                let projson=JSON.parse(prodatastr).data;
                _this.projectData=projson;
         },
         _changeProject(node){
            if(this.formModel.type=='jq'){
                this._getStorage(node);
            }
         },
        async  _getStorage(id){
            let _this=this;
            let storageparams=_this._getParamaters('MD_INV_STORAGE',id);
               //仓库
            let storgdatastr= await  _this.asyncFunc({
                                            url:'api/services/app/apiManager/YlHttpPost',
                                            method:'post',
                                            data:storageparams
                                        },'获取仓库信息');
                let storjson=JSON.parse(storgdatastr).data;
                _this.storageData=storjson;
         },
         _getParamaters(checkinfo,filterStr,likeStr){
              let datavalue = {
                dataid: this.newGuid(),
                actiontype: 'basedata',
                bdtype: checkinfo,
                unit: this.formModel.unit,
                user: this.formModel.user,
                updatetime: '',
                likes: "stdname:''",
                pageindex: 1,
                pagesize: 10000
            };
            if(checkinfo==='MD_INV_STORAGE'){
                datavalue.PROJECTID=filterStr;
            }else if(checkinfo==='MD_PROJECT'){
                datavalue.likes=likeStr;
            };
            console.log('过滤参数',datavalue);
            let dstr = JSON.stringify(datavalue);
            let parms = {
                baseUrl: this.formModel.baseUrl,
                url: this.formModel.url,
                paras: [{
                    name: 'syscode',
                    value: this.formModel.syscode
                }, {
                    name: 'authcode',
                    value: this.formModel.authcode
                }, {
                    name: 'data',
                    value: dstr
                }]
            };
            return parms
         },
         _getStorageNode(node){
             let item =this.storageData.filter(item=>{
                                    return  item.recid==node; 
                                    });
            if(item.length>0){
                this.formModel.storageCode=item[0].UNIQUECODE;
            }
         }
    },
     mounted(){
        this.formModel.baseUrl=window.getClientObj().ioConf.url;
    },
    beforeMount(){   
        this.descrbStr=this.confData.describe;
        let obj=JSON.parse(this.descrbStr);
        this.descrb=obj;
        this.deepFormData=obj.ioConf.models;
        Object.assign(this.data,this.confData); 
        Object.assign(this.formModel,obj.ioConf.models);
        this.formModel.type='jq';
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


