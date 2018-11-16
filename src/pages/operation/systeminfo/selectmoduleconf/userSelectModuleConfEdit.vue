<template>
 <div>
         <yl-toolbar>
                <el-form  :inline="true"  >
                             <el-form-item class="form-content-vertical">
                              <el-checkbox v-model="isClose">保存后关闭</el-checkbox>
                            </el-form-item>
                            <el-form-item class="form-content-vertical">
                               <el-button 
                                    type="primary" 
                                    size="small" 
                                    @click="_onSubmit" 
                                    :loading="loading"><i class="icon-floppy-disk"></i> 保存</el-button>   
                            </el-form-item>
                            
                 </el-form>
          </yl-toolbar>
      <el-form  :model="formModel"  :rules="rules"  ref="formModel" label-width="100px" >
                <el-tabs  type="border-card" active-name="baseInfoConf"  >
                        <el-tab-pane label="基本信息配置" name="baseInfoConf" style="padding:10px;box-sizing:border-box;"> 
                              <el-row >
                                    <el-col :span="6">
                                            <el-form-item label="选择器标识" prop="extensionOne">
                                                     <yl-dataDictionaryForSel 
                                                            code="selectModule"
                                                            size="small"
                                                            clearable
                                                            v-model="formModel.extensionOne"
                                                    ></yl-dataDictionaryForSel>
                                            </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                            <el-form-item label="版本号" prop="versionNum">
                                                 <el-input v-model="formModel.versionNum"   ></el-input>
                                            </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item  prop="isEnable"  label="是否启用">
                                                <el-switch  v-model="formModel.isEnable"
                                                            on-text="启用"
                                                            off-text="禁用"
                                                            on-color="#13ce66"
                                                            off-color="#ff4949">
                                                </el-switch>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-form-item label="排序"  prop="sortCode" >
                                            <el-input-number v-model="formModel.sortCode"></el-input-number>
                                        </el-form-item>
                                    </el-col>
                                </el-row>    
                                <el-form-item label="基本信息配置" prop="baseInfoConf">
                                    <yl-jsoneditor ref="baseInfoConf" v-model="formModel.baseInfoConf" style="height:400px"></yl-jsoneditor>
                                </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="API配置" name="apiConf"> 
                                <el-form-item label="API配置" prop="apiConf">
                                <yl-jsoneditor ref="apiConf" v-model="formModel.apiConf" style="height:500px"></yl-jsoneditor>
                                </el-form-item>
                            </el-tab-pane>
                        <el-tab-pane label="过滤器配置" name="fliterConf"> 
                            <el-form-item label="过滤器配置" prop="fliterConf">
                            <yl-jsoneditor ref="fliterConf" v-model="formModel.fliterConf" style="height:500px"></yl-jsoneditor>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="表信息配置" name="tableInfoConf"> 
                            <el-form-item label="表信息配置" prop="tableInfoConf">
                                <yl-jsoneditor ref="tableInfoConf" v-model="formModel.tableInfoConf" style="height:500px"></yl-jsoneditor>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="功能信息配置" name="functionConf"> 
                            <el-form-item label="功能信息配置" prop="functionConf">
                                <yl-jsoneditor ref="functionConf" v-model="formModel.functionConf" style="height:500px"></yl-jsoneditor>
                            </el-form-item>
                        </el-tab-pane>
                </el-tabs>
            </el-form>
</div>
</template>
<script type="text/babel">
import util from '@/common/js/util'  
import fetch from '@/api/fetch';
import dataDictionaryForSel from '@/ocomponents/datadictionary/dataDictionaryForSel';
export default {
    data(){
    return{
           formModel:{
                        id:'',
                        versionNum:util.getLocalStorage('SysGlobConf').versionNum,
                        menuId:"",
                        pageName:'',
                        isEnable:true,
                        baseInfoConf:'',
                        formConf:'',
                        apiConf:'',
                        fliterConf:'',
                        tableInfoConf:'',
                        functionConf:'',
                        extensionOne:'',
                        extensionTwo:'',
                        extensionThere:'',
                        extensionFure:'',
                        extensionFrive:'',
                        oextensionTwo:'',
                        oextensionOne:'',
                        oversionNum:""
                      },   
        loading:false,
         rules: {
              versionNum: [
                    {validator: this.commonJudgeRepeat, trigger: 'blur' }
                ],
                extensionOne: [
                    { required: true, message: '材料信息为空', trigger: 'blur' },
                    {validator: this.commonJudgeRepeat, trigger: 'blur' }
                ],
        },
        loading:false,
        isClose:true,
       }       
    },
    props:{
        selectRow:{},
        isVisible:false,
        isCopy:false,
    },
    computed:{
            
    },
    methods:{
        //判断重复
          commonJudgeRepeat(rule, value, callback){
                let columnName='extensionOne,versionNum',columnValue='';
                let columnNameArr=columnName.split(',');
                columnNameArr.map(data=>{
                    columnValue=columnValue+this.formModel[data]+',';
                })
                columnValue=columnValue.substring(0,columnValue.length-1)
                let str=`Base_UserSelectModuleConf|${columnName}|${columnValue}|${this.formModel.oextensionOne},${this.formModel.oversionNum}`;
                this.IsJudgeRepeat(str,value, callback);
         },
         _getCurrentNode(node){
            },
         _onSubmit() {
                this.$refs.formModel.validate((valid) => {
                if (valid) {
                    var _this=this;
                    this.loading=true;
                    let params={};
                    params.order=this.formModel;
                    this.formModel.baseInfoConf=this.$refs.baseInfoConf.getValue();
                    this.formModel.apiConf=this.$refs.apiConf.getValue();
                    this.formModel.fliterConf=this.$refs.fliterConf.getValue(); 
                    this.formModel.tableInfoConf=this.$refs.tableInfoConf.getValue();
                    this.formModel.functionConf=this.$refs.functionConf.getValue();
                    this.formModel.createTime=this.formatDate(new Date(),'YYYY/MM/DD-HH:mm:ss');
                    if(_this.isCopy){
                        this.formModel.id='';
                    }
                    fetch({
                        url:'/api/services/app/userselectModuleConf/createOrUpdateMainObject',
                        method:'post',
                        data:params
                    }).then(data=>{
                            if(data.success){
                                    this.$notify({
                                        title: '成功',
                                        message: '保存数据成功！',
                                        type: 'success'
                                        });
                                   //关闭面板
                                    _this._complete();
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
         _complete(){
             if(this.isClose){
                 this.$emit('close');
             }  
          }
    },
    components:{
         'yl-dataDictionaryForSel':dataDictionaryForSel
        },
     mounted(){
         if(this.selectRow.id!==undefined){
             Object.assign(this.formModel,this.selectRow); 
             
         }else{
             //给配置初始值
                this.formModel.baseInfoConf='{"baseInfoConf":{}}';
                this.formModel.apiConf='{"apiConf":{}}';
                this.formModel.fliterConf='{"fliterConf":{}}';
                this.formModel.tableInfoConf='{"tableInfoConf":{}}';
                this.formModel.functionConf='{"functionConf":{}}';
         }
          if(!this.isCopy){
                this.formModel.oextensionOne=this.formModel.extensionOne;
                this.formModel.oversionNum=this.formModel.versionNum;
         }
        
    },
    watch:{
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
