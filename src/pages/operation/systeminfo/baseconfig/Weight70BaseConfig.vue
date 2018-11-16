<template>
  <div slot="content" >
    <el-form  :model="formModel"  v-loading.body="formLoading" :rules="rules"  ref="formModel" label-width="100px" >
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
            <el-col :span="11">
                <el-form-item label="对应组织编码" prop="projectId">
                    <el-input v-model="formModel.projectId" ></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            
            <el-col :span="11">
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
            formModel:{
                type:'v7',//对接系统类型
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
                ptBeforeUplodEvent:{isOn:true,event:"function(data,_this){let gbjs=_this.utilObject.getLocalStorage('GBConf');let rows=data.order;var data={ItemNM:rows.id,BdNum:1,ProjectID:gbjs.ioConf.models.projectId,ProjectName:_this.getUserInfo().user.manageOrgName,BatchNo:rows.orderCode,WagonNumber:(rows.v_Col11).substr(1),InfoCode:rows.infoCode,InfoName:rows.infoName,InfoModel:rows.infoModel,InfoSecUnit:rows.v_Col15,InfoUnit:rows.infoUnit,InfoClassNodebh:rows.classNodebh,InfoClassName:'',SecondClassName:'',FirstClassName:'',Storeroom:'',SupplierNM:rows.o_Col36,SupplierName:rows.v_Col12,GrossWeight:rows.d_Col36,TareWeight:rows.d_Col37,DiscountRate:rows.d_Col39,Discount:rows.d_Col40,NetWeight:rows.d_Col42,PriSecConvRate:rows.d_Col38,NetQuantity:rows.d_Col42,WeighMan:rows.maker,InTime:rows.v_Col16,IsOut:rows.b_Col27==true?1:0,OutTime:rows.v_Col17,IsUpload:rows.b_Col30==true?1:0,UploadTime:_this.formatDate(new Date(),'YYYY-MM-DD HH:mm:ss'),IsReceive:0,ReceiveTime:'',IsCh:0,IsBd:0,IsAudit:1,Maker:rows.maker,MakerDate:rows.makerDate,IsAccountCheck:0,CheckTime:'',CheckName:'',Remark:rows.orderRemark,WagAbbProvince:(rows.v_Col11).substr(0,1),MaterialStore:rows.v_Col14,TransformSupplier:'',WeightDiff:0,NetNewQuantity:rows.d_Col42};let dataStr=JSON.stringify(data);let parms={baseUrl:gbjs.ioConf.models.baseUrl,url:'/Service/BarCodeService.asmx/InsertSingleWeightInfo1',paras:[{name:'infos',value:dataStr}]};let resultParms={apiData:{url:window.getClientObj().sysConf.url+'/api/services/app/apiManager/YlHttpPost',method:'post',data:parms},token:{}};return resultParms}"},
                ptAfterUplodEvent:{isOn:true,event:"function(data,_this){let js=data.result.replace(/<[^<]+>/g, '');if(js.indexOf('true') > 0){return true;}else{return js};}"},
                cCBeforeUplodEvent:{isOn:true,event:"function(data,_this){let gbjs=_this.utilObject.getLocalStorage('GBConf');let rows=data.order;var data={ItemNM:rows.id,BdNum:1,ProjectID:gbjs.ioConf.models.projectId,ProjectName:_this.getUserInfo().user.manageOrgName,BatchNo:rows.orderCode,WagonNumber:(rows.v_Col11).substr(1),WagAbbProvince:(rows.v_Col11).substr(0,1),InfoCode:rows.infoCode,InfoName:rows.infoName,InfoModel:rows.infoModel,InfoSecUnit:rows.v_Col15,InfoUnit:rows.infoUnit,PriSecConvRate:rows.d_Col38,InfoClassNodebh:rows.classNodebh,InfoClassName:'',SecondClassName:'',FirstClassName:'',Storeroom:'',LabourNM:rows.o_Col36,LabourName:rows.v_Col12,GrossWeight:rows.d_Col36,TareWeight:rows.d_Col37,DiscountRate:rows.d_Col39,Discount:rows.d_Col40,NetWeight:rows.d_Col42,NetQuantity:rows.d_Col42,WeighMan:rows.maker,InTime:rows.v_Col16,IsOut:rows.b_Col27==true?1:0,OutTime:rows.v_Col17,IsUpload:rows.b_Col30==true?1:0,UploadTime:_this.formatDate(new Date(),'YYYY-MM-DD HH:mm:ss'),IsCh:0,IsBd:0,IsAudit:1,Maker:rows.maker,MakerDate:rows.makerDate,Remark:rows.orderRemark,};let dataStr=JSON.stringify(data);let parms={baseUrl:gbjs.ioConf.models.baseUrl,url:'/Service/BarCodeService.asmx/InsertSingleOutWeightInfo1',paras:[{name:'infos',value:dataStr}]};let resultParms={apiData:{url:window.getClientObj().sysConf.url+'/api/services/app/apiManager/YlHttpPost',method:'post',data:parms},token:{}};return resultParms}"},
                cCAfterUplodEvent:{isOn:true,event:"function(data,_this){let js=data.result.replace(/<[^<]+>/g, '');if(js.indexOf('true') > 0){return true;}else{return js};}"}
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
        }
    },
     mounted(){
        this.formModel.baseUrl=window.getClientObj().ioConf.url;
        console.log(this.formModel.baseUrl);
    },
    beforeMount(){
        this.descrbStr=this.confData.describe;
        let obj=JSON.parse(this.descrbStr);
        this.descrb=obj;
        this.deepFormData=obj.ioConf.models;
        Object.assign(this.data,this.confData); 
        Object.assign(this.formModel,obj.ioConf.models);
        this.formModel.type='v7';
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


