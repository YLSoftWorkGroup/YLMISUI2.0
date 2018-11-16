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

          <el-form  :model="formModel"  :rules="rules"  ref="formModel" label-width="100px" style="padding:10px;box-sizing:border-box;" >
                                <el-row >
                                    <el-col :span="6">
                                            <el-form-item label="菜单编码" prop="menuId">
                                                    <yl-menuItemTree  
                                                            placeholder="请选择菜单" 
                                                            style="width:100%" 
                                                            v-model="formModel.menuId"
                                                            @getCurrentNode="_getCurrentNode"
                                                    ></yl-menuItemTree>  
                                            </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                            <el-form-item label="菜单编码" prop="menuCode">
                                                <el-input v-model="formModel.menuCode"   style="width:100%"></el-input>
                                            </el-form-item>
                                    </el-col>
                                    <el-col :span="6">
                                            <el-form-item label="页面编码" prop="pageName">
                                                <el-input v-model="formModel.pageName"   style="width:100%"></el-input>
                                            </el-form-item>
                                    </el-col>
                                     <el-col :span="6">
                                            <el-form-item label="报表类型" prop="extensionTwo">
                                                      <el-select v-model="formModel.extensionTwo" placeholder="请选择模块类型">
                                                        <el-option :key="1"
                                                            label="assemblePage"
                                                            value="assemblePage">
                                                        </el-option>
                                                        <el-option :key="2"
                                                            label="dynamicPage"
                                                            value="dynamicPage">
                                                        </el-option>
                                                    </el-select>
                                            </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="6">
                                            <el-form-item label="页面标题" prop="extensionOne">
                                                <el-input v-model="formModel.extensionOne"   ></el-input>
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
                                <el-form-item label="界面配置" prop="pageConf">
                                    <yl-jsoneditor ref="pageConf" v-model="formModel.pageConf" style="height:500px"></yl-jsoneditor>
                                </el-form-item>
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
                 extensionOne:'',
                 extensionTwo:"",
                 menuId:'',
                 menuCode:'',
                 pageName:'',
                 versionNum:util.getLocalStorage('SysGlobConf').versionNum,
                 pageConf:'',
                 sortCode:1,
                 omenuCode:'',
                 opageName:'',
                 oversionNum:'',
                 isEnable:true
        },
         rules: {
                   versionNum: [
                            {validator: this.commonJudgeRepeat, trigger: 'blur' }
                        ],
                    menuCode: [
                      { required: true, message: '菜单编码不能为空！', trigger: 'blur' },
                      {validator: this.commonJudgeRepeat, trigger: 'blur' }
                    ],
                    pageName: [
                      { required: true, message: '页面名称不能为空！', trigger: 'blur' },
                      {validator: this.commonJudgeRepeat, trigger: 'blur' }
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
        isVisible:false,
        isCopy:false
    },
    methods:{
         commonJudgeRepeat(rule, value, callback){
                let columnName='menuCode,pageName,versionNum',columnValue='';
                let columnNameArr=columnName.split(',');
                columnNameArr.map(data=>{
                    columnValue=columnValue+this.formModel[data]+',';
                })
                columnValue=columnValue.substring(0,columnValue.length-1)
                let str=`Base_UserMobilePageConf|${columnName}|${columnValue}|${this.formModel.omenuCode},${this.formModel.opageName},${this.formModel.oversionNum}`;
                
                this.IsJudgeRepeat(str,value, callback);
         },
         _getCurrentNode(node){
                        this.formModel.menuCode=node.funcCode;
                        this.formModel.extensionOne=node.text;
            },
         _onSubmit() {
                this.$refs.formModel.validate((valid) => {
                if (valid) {
                    var _this=this;
                    this.loading=true;
                    let params={};
                    this.formModel.createTime=this.formatDate(new Date(),'YYYY/MM/DD-HH:mm:ss');
                    this.formModel.pageConf=this.$refs.pageConf.getValue();
                    if(_this.isCopy){
                        this.formModel.id='';
                    }
                    params.order=this.formModel;
                    fetch({
                        url:'/api/services/app/usermobilePageConf/createOrUpdateMainObject',
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
         if(!this.isCopy){
                this.formModel.omenuCode=this.formModel.menuCode;
                this.formModel.opageName=this.formModel.pageName;
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
