<template>
<yl-panelpage :titleName="'项目信息维护'" >
<div slot="content">
  <yl-columnlay>
              <div slot="left" >        
                   <yl-organizeTreeWithPanel :highlightCurrent="true"  :treeLoading="treeLoading" :reloadIsShow="true" v-model="origanizeWithPanel" @getCurrentNode="_getCrureentNode"  :placeholder="'请选择'"   style="width:200px"> </yl-organizeTreeWithPanel>
                </div>
                <div slot="right" >       
                    <el-form  :model="formModel"  :rules="rules"  ref="formModel" label-width="110px" style="padding:15px 1.5em 3ex 1%;">
  <el-row>
      <el-col :span="24">
         <el-form-item label="所属项目部" prop="shortName">
             <el-input :disabled="true" v-model="formModel.shortName"></el-input>
         </el-form-item>
      </el-col>
    </el-row>
    <el-row>
         <el-col :span="24">
        <el-form-item label="项目简称" prop="abbbName">
             <el-input v-model="formModel.abbbName" ></el-input>
         </el-form-item>
         </el-col>
    </el-row>
      <el-col :span="24">
        <el-form-item label="项目地址" prop="pAddress">
                <yl-map ref="adressMap"
                :styl="{width:'100%',height:'200px'}"
                :plugin="mapPlugin"
                @getInfo="_getInfo"        
                ></yl-map>
            </el-form-item>   
            <el-form-item label="" prop="pAddress">
                <el-input v-model="formModel.pAddress" ></el-input>
            </el-form-item>   
      </el-col > 
     
    <el-row>
        <el-col :span="12">
        </el-col>
        <el-col :span="12">
            <el-form-item label="项目编码" prop="pCode">
                <el-input v-model="formModel.pCode" ></el-input>
            </el-form-item>
        </el-col>
         <el-col :span="12">
          <el-form-item label="区域名称" prop="pZoneName">
                   <yl-provinceCitySelTree v-model="formModel.pZoneId" :placeholder="'请选择区域名称'" @getCurrentNode="_getCurrentsGHNodes"  :isexpand="false" ></yl-provinceCitySelTree>
          </el-form-item>
         </el-col>
    </el-row>
          <el-row>
     <el-col :span="12">
         <el-form-item label="负责人" prop="pResponsiblePerson">
             <el-input v-model="formModel.pResponsiblePerson" ></el-input>
         </el-form-item>
         </el-col>
      <el-col :span="12">
         <el-form-item label="电话" prop="pPhone">
             <el-input v-model="formModel.pPhone" ></el-input>
         </el-form-item>
         </el-col>
         </el-row>
         <el-row>
         <el-col :span="12">
         <el-form-item label="合同标价(万元)" prop="pContractPrice">
             <el-input v-model="formModel.pContractPrice" ></el-input>
         </el-form-item>  
         </el-col>
         <el-col :span="12">
         <el-form-item label="中标金额(万元)" prop="sD_Col10">
             <el-input v-model="formModel.sD_Col10" ></el-input>
         </el-form-item>  
         </el-col>
                <el-col :span="12">
                    <el-form-item label="经度" prop="longitude">
                        <el-input v-model="formModel.longitude"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="纬度" prop="latitude">
                        <el-input v-model="formModel.latitude"></el-input>
                    </el-form-item>
                </el-col>
       </el-row>
          <el-row>
     <el-col :span="6">
         <el-form-item label="实际开工时间" prop="pStartDate">
      <el-date-picker type="date" placeholder="选择日期" v-model="formModel.pStartDate" style="width: 100%;"></el-date-picker>
         </el-form-item>
         </el-col>
      <el-col :span="6">
         <el-form-item label="实际竣工时间" prop="pEndDate">
               <el-date-picker type="date" placeholder="选择日期" v-model="formModel.pEndDate" style="width: 100%;"></el-date-picker>
         </el-form-item>
         </el-col>
          <el-col :span="6">
         <el-form-item label="合同开工时间" prop="pContractStartDate">
               <el-date-picker type="date" placeholder="选择日期" v-model="formModel.pContractStartDate" style="width: 100%;"></el-date-picker>
         </el-form-item>
         </el-col>
          <el-col :span="6">
         <el-form-item label="合同竣工时间" prop="pContractEndDate">
               <el-date-picker type="date" placeholder="选择日期" v-model="formModel.pContractEndDate" style="width: 100%;"></el-date-picker>
         </el-form-item>
         </el-col>
       </el-row>
          <el-row>
      <el-col :span="6">
         <el-form-item label="投标日期" prop="pBidDate">
               <el-date-picker type="date" placeholder="选择日期" v-model="formModel.pBidDate" style="width: 100%;"></el-date-picker>
         </el-form-item>
         </el-col>
          <el-col :span="6">
         <el-form-item label="签订日期" prop="pSiginDate">
               <el-date-picker type="date" placeholder="选择日期" v-model="formModel.pSiginDate" style="width: 100%;"></el-date-picker>
         </el-form-item>
         </el-col>
          <el-col :span="6">
         <el-form-item label="项目类型" prop="sId">
                <el-select v-model="formModel.sId" placeholder="请选择" 
                    @change="_getCurrentsGHNode">
                    <el-option v-for="item in selectData"  
                    :label="item.text" 
                    :key="item.id"
                    :value="item.id" >
                    </el-option>
                </el-select>
         </el-form-item>
         </el-col>
          <el-col :span="6">
              <el-form-item label="项目状态" prop="pStatus">
               <dataDictionaryForSel :code="'projectStatus'" v-model="formModel.pStatus"  :placeholder="'请选择状态'" >
                </dataDictionaryForSel>
         </el-form-item>
         </el-col>     
       </el-row>
          <el-row>
      <el-col :span="12">
         <el-form-item label="设计单位" prop="pDesigner">
             <el-input v-model="formModel.pDesigner" ></el-input>
         </el-form-item>
         </el-col>
         <el-col :span="12">
         <el-form-item label="主管单位" prop="pManager">
             <el-input v-model="formModel.pManager" ></el-input>
         </el-form-item>
         </el-col>
       </el-row>
          <el-row>
     <el-col :span="12">
         <el-form-item label="监督单位" prop="pSupervision">
             <el-input v-model="formModel.pSupervision" ></el-input>
         </el-form-item>
         </el-col>
      <el-col :span="12">
         <el-form-item label="业主单位" prop="pOwner">
             <el-input v-model="formModel.pOwner" ></el-input>
         </el-form-item>
         </el-col>
       </el-row> 
         
         <el-form-item label="项目概况" prop="pDescriptions">
             <el-input v-model="formModel.pDescriptions" type="textarea" :rows="4"  ></el-input>
         </el-form-item>
         <el-form-item label="备注" prop="remark">
             <el-input v-model="formModel.remark"  type="textarea" :rows="2"  ></el-input>
         </el-form-item>   
   <el-form-item style="text-align:center;"  v-if="buttonProject" >
      <el-button @click="_resetForm">重置</el-button>
      <el-button type="primary" :loading="loading" @click="_onSubmit">保存</el-button>
  </el-form-item>
  <!--:loading="loading"-->
   </el-form>
          </div>
     </yl-columnlay>
 </div>
</yl-panelpage>
</template>
<script type="text/babel">
import util from '@/common/js/util';
import organizeTreeWithPanel from '@/ocomponents/organize/organizeTreeWithPanel'
import dataDictionaryForSel from '@/ocomponents/datadictionary/dataDictionaryForSel'
import provinceCitySelTree from '@/ocomponents/provincecity/provinceCitySelTree'
import  {inputModel} from '@/api/inputmodel';
import {
            requestCreateOrUpdateProject,
            requestGetProjectForEdit,
            requestGetStandardGHByParent,
        }   from '@/api/project';
export default {
    data(){
        return {
           mapPlugin:[
                  {  //比例尺插件
                    pName: 'Scale',
                  },
                  { //鹰眼插件
                    pName: 'OverView',
                  },
                    {  //类型
                        pName: 'MapType',
                        defaultType: 0,
                    },
                    {  //自动补全
                        pName: 'Autocomplete',
                    },
                    {  //搜索
                        pName: 'PlaceSearch',
                    }
              ],
           formModel:{
                 id:'',
                 shortName:'',
                 abbbName:'',
                 pAddress:'',
                 pResponsiblePerson:'',
                 pPhone:'',
                 pStartDate:'',
                 pEndDate:'',
                 pContractStartDate:'',
                 pContractEndDate:'',
                 pStatus:'',
                 pZoneId:'',
                 pZoneName:'',
                 pTypeName:'',
                 pDesigner:'',
                 pSupervision:'',
                 pManager:'',
                 pOwner:'',
                 pDescriptions:'',
                 pBidDate:'',
                 pSiginDate:'',
                 pContractPrice:'',
                 pCode:'',
                 longitude:'',
                 latitude:'',
                 remark:'',
                 sId:'',
                 sName:'',
                 sD_Col10:''
        },
           rules: {
                   pZoneName: [
                       { required: true, message: '区域名称不能为空！', trigger: 'change' }
                    ],  
                     sId: [
                       { required: true, message: '项目类型不能为空！', trigger: 'change' }
                    ],  
         },
                ghidFirst:'',
                treeLoading:false,
                origanizeWithPanel:[], 
                selectData:[],
                defaultProps: {
                        children: 'children',
                        label: 'text',
                        id: 'id',
                        funcCode: 'funcCode'
                    },
                     selectNode:{id:""},
                     buttonProject:false,
                orgNode:{},
                loading:false
            }
    },
    methods:{
        _getInfo(info){
            console.log(info);
            if(info){
                this.formModel.pAddress=info.regeocode.formattedAddress;
                this.formModel.longitude=info.regeocode.pois[0].location.lng;
                this.formModel.latitude=info.regeocode.pois[0].location.lat;
            }
            
        },
        _getCurrentsGHNode(selectNode){
            if(selectNode!=''){
            let obj=[];
            obj=this.selectData.filter((item,index)=>{
                        return item.id===selectNode;
            });
                this.formModel.sId=obj[0].id;
                this.formModel.sName=obj[0].text;
            }
        },
        _getStantardGHList(){
              requestGetStandardGHByParent(this.guidOfNull()).then(data=>{
                    if(data.success){
                            this.selectData=data.result;
                    }
                    else {
                        this.$message.error('获取数据失败！');
                    }
            })
        },
     _getCrureentNode(node){
             if(node.funcCode=='项目经理部'){
                 this.buttonProject=true;
                 this.formModel.id=node.id;
                 this.formModel.shortName=node.text;
                 this.formModel.abbbName=node.text;
                 this.orgNode=node;
                 this._getProjectForEdit(node.id);
             }else{
                   this.$alert('请选择项目部', '温馨提示！', {
                    confirmButtonText: '确定',
                    callback: action => {
            }
        });
             }
        },
      _getProjectForEdit(){
                let params={
                    queryConditionItem:[
                        {dataField:"Id",op:"EQ",dataValue:this.formModel.id}
                        ],
                    sorting:''
                };
                requestGetProjectForEdit(params).then(data =>{
                            if(data.success){
                                if(data.result.project!=null){
                                    this.formModel=data.result.project;
                                    
                                    if(this.formModel.longitude){
                                        this.$refs.adressMap.setCenter(this.formModel.longitude,this.formModel.latitude)
                                    }
                                    
                                }else{
                                    this. _resetForm();
                                    this.formModel.id=this.orgNode.id;
                                    this.formModel.shortName=this.orgNode.text;
                                    this.formModel.abbbName=this.orgNode.text;
                                }
                            }
                            else {
                                this.$message.warning('请填写项目信息！');
                            }
                })
        },
     
      _getCurrentsGHNodes(selectNode){
          if(selectNode.isLeaf!=false){  
                this.formModel.pZoneName=selectNode.text;
                this.formModel.pZoneId=selectNode.id;
          }else{
            this.formModel.pZoneName='';
            this.formModel.pZoneId='';
            this.$message.warning('请选择子节点！');
          };
        },
      _onSubmit(){ 
          this.$refs.formModel.validate((valid) => {
                if (valid){
                    var _this=this;
                    this.loading=true;
                    let params={};
                    this.formModel.pStartDate=this.formatDate(this.formModel.pStartDate,"YYYY-MM-DD");
                    this.formModel.pEndDate=this.formatDate(this.formModel.pEndDate,"YYYY-MM-DD");
                    this.formModel.pContractStartDate=this.formatDate(this.formModel.pContractStartDate,"YYYY-MM-DD");
                    this.formModel.pContractEndDate=this.formatDate(this.formModel.pContractEndDate,"YYYY-MM-DD");
                    this.formModel.pBidDate=this.formatDate(this.formModel.pBidDate,"YYYY-MM-DD");
                    this.formModel.pSiginDate=this.formatDate(this.formModel.pSiginDate,"YYYY-MM-DD");
                     params.project=this.formModel;
                    requestCreateOrUpdateProject(params).then(data=>{
                    if(data.success){
                            this.$notify({
                                title: '成功',
                                message: '保存数据成功！',
                                type: 'success'
                                });
                            this.loading=false;
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
         _resetForm() {
                this.$refs.formModel.resetFields();   
         },
    },
    components:{
        'yl-provinceCitySelTree':provinceCitySelTree,
        'yl-organizeTreeWithPanel':organizeTreeWithPanel,
         dataDictionaryForSel,
        },
    mounted(){
        this._getStantardGHList();
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

