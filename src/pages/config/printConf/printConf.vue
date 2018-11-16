
<template>
<div class="printConf">
 <el-form  :model="formModel"    ref="formModel" label-width="100px" >
 <el-form-item label="纸张类型" prop="paper">
      <el-select v-model="formModel.paper" style="width:100%"  @change="_initial">
         <el-option label="A4" value="A4"></el-option>
         <el-option label="B5" value="B5"></el-option>
         <el-option label="三联单" value="三联单"></el-option>
      </el-select>
  </el-form-item>
  <el-row>
        <el-col :span="12">
            <el-form-item label="左边距" prop="marginLeft">
                    <el-input v-model.number="formModel.marginLeft" ></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="上边距" prop="marginRight" >
                <el-input v-model.number="formModel.marginRight" ></el-input>
            </el-form-item>
        </el-col>
    </el-row>
    <el-row>
    <el-col :span="12">
        <el-form-item label="宽度" prop="width">
                <el-input v-model.number="formModel.width" ></el-input>
        </el-form-item>
    </el-col>
    <el-col :span="12">
        <el-form-item label="高度" prop="height" >
            <el-input v-model.number="formModel.height" ></el-input>
        </el-form-item>
    </el-col>
  </el-row>
  
  <el-row>
        <el-col :span="12">
            <el-form-item label="行高" prop="tableRows">
                    <el-input v-model.number="formModel.tableRows" ></el-input>
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="行数" prop="rowHeight" >
                <el-input v-model.number="formModel.rowHeight" ></el-input>
            </el-form-item>
        </el-col>
    </el-row>

    <el-row>
        <el-col :span="12">
            <el-form-item label="打印方向" prop="sB_Col8">
                <el-switch  v-model="formModel.sB_Col8"
                                        on-text="横向"
                                        off-text="纵向">
                            </el-switch>
            </el-form-item>
        </el-col>
        <el-col :span="12">
             <el-form-item label="显示页码" prop="isPageNum">
                <el-switch  v-model="formModel.isPageNum"
                                        on-text="显示"
                                        off-text="隐藏"
                                        on-color="#13ce66"
                                        off-color="#ff4949">
                            </el-switch>
            </el-form-item>
        </el-col>
    </el-row>

  
   <el-form-item style="text-align:right;" >
      <el-button @click="_resetForm">重置</el-button>
      <el-button type="primary" @click="_onSubmit" :loading="loading">保存</el-button>
  </el-form-item>
  
</el-form>
</div>
</template>


<script type="text/babel">
import fetch from '@/api/fetch'

export default {
    data(){
        return{
            formModel:{
                userID:this.getUserInfo().user.id,
                orgId:this.getUserInfo().user.manageOrgId,
                menuCode:this.menuCode,
                paper:'A4',
                height:780,
                width:1000,
                marginRight:50,
                marginLeft:80,
                tableRows: 34,
                rowHeight:11,
                isPageNum: true,
                sB_Col8:true
            }, 
            loading:false
        }        
    },
    props:{
         menuCode:{
              type:String,
              default:function(){
                    return ''
              }
          }
    },
    methods:{
         _onSubmit() {
                this.$refs.formModel.validate((valid) => {
                if (valid) {
                    this.loading=true;
                    var params={};
                    params.order=this.formModel;
                    fetch({
                        url:'api/services/app/printConf/createOrUpdateMainObject',
                        method:'post',
                        data:params
                    }).then(data=>{
                    if(data.success){
                            this.$notify({
                                title: '成功',
                                message: '保存打印配置成功！',
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
                        this.loading=false;
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
                
            });
            },
         _resetForm() {
                this.$refs.formModel.resetFields();
         },
         _complete(){
                this.$emit('close');
            },
        _getConfInfo(){
             var params={};
                    params.queryConditionItem=[
                        {dataField:"OrgId",op:"EQ",dataValue:this.getUserInfo().user.manageOrgId},
                        {dataField:"UserID",op:"EQ",dataValue:this.getUserInfo().user.id,},
                        {dataField:"MenuCode",op:"EQ",dataValue:this.menuCode,},
                    ];
                    fetch({
                        url:'/api/services/app/printConf/getMainObjectForEdit',
                        method:'post',
                        data:params
                    }).then(data=>{
                    if(data.success){
                           if(data.result&&data.result.order){
                               this.formModel=data.result.order;
                               
                           }else{

                           }
                        }
                        else {
                            this.$message.error('失败！'+data.error.message);
                        }
                    }).catch(function(error){
                    })
        },
       _initial(){  
         var params={};
                    params.queryConditionItem=[
                        {dataField:"OrgId",op:"EQ",dataValue:this.getUserInfo().user.manageOrgId},
                        {dataField:"UserID",op:"EQ",dataValue:this.getUserInfo().user.id,},
                        {dataField:"MenuCode",op:"EQ",dataValue:this.menuCode,},
                    ];
                    fetch({
                        url:'/api/services/app/printConf/getMainObjectForEdit',
                        method:'post',
                        data:params
                    }).then(data=>{ 
                    if(data.success){           
                        
                        if(this.formModel.paper=="B5"){
                            if(data.result.order!=null && data.result.order.paper=="B5"){
                                        this.formModel.sB_Col8=data.result.order.sB_Col8;
                                        this.formModel.height=data.result.order.height;
                                        this.formModel.width=data.result.order.width;
                                        this.formModel.marginRight=data.result.order.marginRight;
                                        this.formModel.marginLeft=data.result.order.marginLeft;  
                                        this.formModel.tableRows=data.result.order.tableRows;
                                        this.formModel.rowHeight=data.result.order.rowHeight;
                            }else{   
                                        this.formModel.height=660;
                                        this.formModel.width=860;
                                        this.formModel.marginRight=40;
                                        this.formModel.marginLeft=50;  
                                        this.formModel.tableRows=34;
                                        this.formModel.rowHeight=9;
                                        this.formModel.sB_Col8=true;
                            }    
                            }else if(this.formModel.paper=="三联单"){
                                if(data.result.order!=null && data.result.order.paper=="三联单") {
                                        this.formModel.sB_Col8=data.result.order.sB_Col8;
                                        this.formModel.height=data.result.order.height;
                                        this.formModel.width=data.result.order.width;
                                        this.formModel.marginRight=data.result.order.marginRight;
                                        this.formModel.marginLeft=data.result.order.marginLeft;  
                                        this.formModel.tableRows=data.result.order.tableRows;
                                        this.formModel.rowHeight=data.result.order.rowHeight;
                                }else{
                                        this.formModel.height=400;
                                        this.formModel.width=775;
                                        this.formModel.marginRight=30;
                                        this.formModel.marginLeft=10;  
                                        this.formModel.tableRows=35;
                                        this.formModel.rowHeight=5;
                                        this.formModel.sB_Col8=false;
                                }  
                            }else{
                                if(data.result.order!=null && this.formModel.paper=="A4"==data.result.order.paper){
                                        this.formModel.sB_Col8=data.result.order.sB_Col8;
                                        this.formModel.height=data.result.order.height;
                                        this.formModel.width=data.result.order.width;
                                        this.formModel.marginRight=data.result.order.marginRight;
                                        this.formModel.marginLeft=data.result.order.marginLeft;  
                                        this.formModel.tableRows=data.result.order.tableRows;
                                        this.formModel.rowHeight=data.result.order.rowHeight; 
                                }else{  
                                        this.formModel.height=780;
                                        this.formModel.width=1000;
                                        this.formModel.marginRight=50;
                                        this.formModel.marginLeft=80;  
                                        this.formModel.tableRows=34;
                                        this.formModel.rowHeight=11;
                                        this.formModel.sB_Col8=true;
                            }
                                
                     }
                } 
            })  
        }
        
    },
    mounted(){
        this._getConfInfo();
    },
     watch:{
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


