
<template>
<div>
<el-form  :model="formModel"  :rules="rules"  ref="formModel" label-width="80px" >
    <el-form-item label="审批状态" prop="stateText">
        <el-select  
            v-model="formModel.stateText" 
            @change="_selChange" 
            placeholder="请选择" 
            style="width:35%">
            <el-option
                v-for="item in stateList"
                :key="item.id"
                :label="item.stateText"
                :value="item.stateText"
                >
            </el-option>
        </el-select>
    </el-form-item>
    <el-form-item label="审批意见" prop="dealOptions">
        <el-input type="textarea" :rows="5" v-model="formModel.dealOptions"></el-input>
    </el-form-item>
   <el-form-item style="text-align:right;" >
      <el-button type="primary" @click="_onSubmit" :loading="loading">执行</el-button>
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
                    tableName:'',
                    orgId:this.propsOrgId,
                    orderId:this.propsOrderId,
                    isState:0,
                    stateText:'',
                    stateDesc:'',
                    dealOptions:'',
            },
            rules: {
                        stateText: [
                            { required: true, message: '状态不能为空！', trigger: 'change' }
                        ],
                        dealOptions: [
                            { required: true, message: '意见不能为空！', trigger: 'blur' }
                        ],
            },
            loading:false,
            stateList:[],
            menuCode:'',
            approveInfoList:[]
        }       
    },
    props:{
         apiUrl:{
            type:String,
            default:'',
        },
        propsOrderId:{  
            type:String,
            default:'',
        },
        propsOrgId:{  
            type:String,
            default:'',
        },
        tableName:{
            type:String,
            default:'',
        }
    },
    methods:{
        _getState(){
            let obj={};
            obj.tableName=this.formModel.tableName;
            obj.moduleType=this.menuCode.split('&')[1];
            fetch({ 
                url: '/api/services/app/roleApproveState/GetRoleApproveStatesByRole',
                method: 'post',
                data:obj
            }).then((data)=>{
                if(data.success){
                   this.stateList=data.result.data;
                   this._getApproveInfo();
                }
            })
        },
        _getApproveInfo(){  
             let Params={},inputArr=[];
             Params.sorting="DealTime desc";
             inputArr.push({
                 dataField:'OrderId',
                 op:'EQ',
                 dataValue:this.propsOrderId,
             });
            Params.queryConditionItem=inputArr;
            fetch({ 
                url: '/api/services/app/approveFlow/GetApproveFlows',
                method: 'post',
                data:Params
            }).then((data)=>{
                if(data.success){
                    this.approveInfoList=data.result;
                }
            })
        },
        _selChange(val){
            let selObj=this.stateList.filter((item,index)=>{
                return item.stateText===val;
            });
            this.formModel.isState=selObj[0].stateValue;
            this.formModel.stateDesc=selObj[0].stateDesc;
        },
         _onSubmit() {
               let _this=this;
               this.$refs.formModel.validate((valid) => {
                if (valid) {
                    //判断重复提交
                    if(this.approveInfoList.length>0){
                        if(this.formModel.isState==this.approveInfoList[0].isState){
                            this.$message.warning('您已经对提交过相同的审批行为，请查看审批状态记录！');
                            return false
                        }
                    }
                    this.loading=true;
                    let params={};
                    params=this.formModel;
                    //处理权限参数
                    let permissionType=this.menuCode.split('&');
                    let urlCode=this.apiUrl.split('/');
                    if(permissionType[1]!=undefined&&urlCode[4].toLowerCase()===permissionType[0].toLowerCase()){
                       params.permissionType=permissionType[1];
                    }
                    fetch({ 
                            url:this.apiUrl,
                            method: 'post',
                            data: params,
                        }).then(data=>{
                                if(data.success){
                                        this.$notify({
                                            title: '成功',
                                            message: '保存数据成功！',
                                            type: 'success'
                                            });
                                        //关闭面板
                                        this._complete();
                                    }
                                    else {
                                        this.$message.error('失败！'+data.error.message);
                                    }
                                        this.loading=false;
                                }).catch(function(error){
                                     _this.loading=false;
                                })
                            } else {
                                return false;
                            }
                
            });
         },
        _complete(){
            this.$emit('close');
        },
    },
    components:{
    },
     mounted(){
         console.log(this.propsOrgId);
          console.log(this.propsOrderId);
         this.menuCode=this.$route.params.tableName;
         this.formModel.tableName=this.tableName
         this._getState();
    },
     watch:{
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
