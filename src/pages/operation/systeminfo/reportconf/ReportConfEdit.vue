<template>
 <div>
         <yl-toolbar>
                <el-form  :inline="true"  >
                            <el-form-item class="form-content-vertical">
                               <el-button 
                                    type="primary" 
                                    size="small" 
                                    @click="_onSubmit" 
                                    :loading="loading">保存</el-button>   
                            </el-form-item>
                            <el-form-item class="form-content-vertical">
                              <el-checkbox v-model="isClose">保存后关闭</el-checkbox>
                            </el-form-item>
                 </el-form>
          </yl-toolbar>
      <el-form  :model="formModel"  :rules="rules"  ref="formModel" label-width="100px" >
                <el-tabs  type="border-card" active-name="baseInfoConf" >
                        <el-tab-pane label="基本信息配置" name="baseInfoConf" > 
                              <el-row style="padding-top:20px">
                                    <el-col :span="6">
                                            <el-form-item label="菜单编码" prop="menuId">
                                                    <yl-menuItemTree  
                                                            placeholder="请选择菜单" 
                                                            size="small" 
                                                            style="width:200px" 
                                                            v-model="formModel.menuId"
                                                            @getCurrentNode="_getCurrentNode"
                                                    ></yl-menuItemTree>  
                                            </el-form-item>
                                    </el-col>
                                     <el-col :span="6">
                                            <el-form-item label="菜单编码" prop="extensionTwo">
                                                <el-input v-model="formModel.extensionTwo"   style="width:100%"></el-input>
                                            </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                            <el-form-item label="页面编码" prop="pageName">
                                                <el-input v-model="formModel.pageName"   style="width:200px"></el-input>
                                            </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                            <el-form-item label="页面标题" prop="extensionThere">
                                            <el-input v-model="formModel.extensionThere"   ></el-input>
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
                        <el-tab-pane label="其他配置  " name="formConf"> 
                            <el-form-item label="其他配置" prop="formConf">
                                <yl-jsoneditor ref="formConf" v-model="formModel.formConf" style="height:500px"></yl-jsoneditor>
                            </el-form-item>
                        </el-tab-pane>
                </el-tabs>
            </el-form>
</div>
</template>
<script type="text/babel">
import util from '@/common/js/util'  
import fetch from '@/api/fetch';
import menuItemTree from '@/ocomponents/menuitem/menuItemTree';
export default {
    data(){
    return{
           formModel:{
                        id:'',
                        versionNum:'',
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
                      },   
        loading:false,
        rules: {
                menuCode: [
                    { required: true, message: '菜单编码不能为空！', trigger: 'blur' }
                ],
                pageName: [
                    { required: true, message: '页面名称不能为空！', trigger: 'blur' }
                ],
                extensionOne: [
                    { required: true, message: '页面标题不能为空！', trigger: 'blur' }
                ],
        },
        loading:false,
        isClose:true,
       }       
    },
    props:{
        selectRow:{},
        isVisible:false
    },
    computed:{
         VersionNum:{
                        get(){
                            return util.getLocalStorage('SysGlobConf').versionNum;
                        }
                    }
            
    },
    methods:{
         _getCurrentNode(node){
                        this.formModel.extensionTwo=node.funcCode;
                        this.formModel.extensionThere=node.text;
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
                    this.formModel.formConf=this.$refs.formConf.getValue();
                    this.formModel.fliterConf=this.$refs.fliterConf.getValue(); 
                    this.formModel.tableInfoConf=this.$refs.tableInfoConf.getValue();
                    this.formModel.functionConf=this.$refs.functionConf.getValue();
                    this.formModel.createTime=this.formatDate(new Date(),'YYYY/MM/DD-HH:mm:ss');
                    this.formModel.versionNum=this.VersionNum;
                    fetch({
                        url:'/api/services/app/reportConf/createOrUpdateMainObject',
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
         'yl-menuItemTree':menuItemTree
        },
     mounted(){
        Object.assign(this.formModel,this.selectRow); 
    },
    watch:{
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
