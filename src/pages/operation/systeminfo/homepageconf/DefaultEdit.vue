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
                                    :loading="loading"><i class="icon-floppy-disk"></i> 
                                    保存
                                </el-button>   
                            </el-form-item>
                 </el-form>
          </yl-toolbar>
      <el-form  :model="formModel"  :rules="rules"  ref="formModel" label-width="100px" style="padding-top:10px">
                 <el-row >
                        <el-col :span="8">
                                <el-form-item label="角色名称" prop="roleId">
                                    默认角色
                                </el-form-item>
                        </el-col>
                        <el-col :span="8">
                                <el-form-item  prop="isEnable"  label="门户类型">
                                    <el-radio-group v-model="formModel.homeType" @change="_radioChange">
                                        <el-radio :label="0">PC端应用</el-radio>
                                        <el-radio :label="1">Mobile端应用</el-radio>
                                    </el-radio-group>    
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                                <el-form-item label="版本号" prop="versionNum">
                                        <el-input v-model="formModel.versionNum"  readonly></el-input>
                                </el-form-item>
                        </el-col>
                         <el-col :span="8">
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
                            <el-col :span="8">
                            <el-form-item  prop="isEnable"  label="是否启用">
                                    <el-switch  v-model="formModel.isEnable"
                                                on-text="启用"
                                                off-text="禁用"
                                                on-color="#13ce66"
                                                off-color="#ff4949">
                                    </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>    
                 <el-form-item label="基本信息配置" prop="homePageConf">
                    <yl-jsoneditor ref="homePageConf" v-model="formModel.homePageConf" style="height:400px"></yl-jsoneditor>
                </el-form-item>
     </el-form>
</div>
</template>
<script type="text/babel">
import util from '@/common/js/util'  
import fetch from '@/api/fetch';
import roleTree from '@/ocomponents/role/roleTree';
export default {
    data(){
    return{
           formModel:{
                        id:'',
                        versionNum:util.getLocalStorage('SysGlobConf').versionNum,
                        roleId:"",
                        roleName:'',
                        homeType:0,
                        isEnable:true,
                        extensionTwo:'',
                        homePageConf:{}
                      },   
        loading:false,
        rules: {
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
        _radioChange(){
            this._init();
        },
         _getCurrentNode(node){
             this.formModel.roleName=node.text;
            },
         _onSubmit() {
                this.$refs.formModel.validate((valid) => {
                if (valid) {
                    var _this=this;
                    this.loading=true;
                    let params={};
                    params.order=this.formModel;
                    this.formModel.roleId=this.guidOfNull();
                    this.formModel.roleName='默认角色';
                    this.formModel.homePageConf=this.$refs.homePageConf.getValue();
                    this.formModel.createTime=this.formatDate(new Date(),'YYYY/MM/DD-HH:mm:ss');
                    fetch({
                        url:'/api/services/app/homePageConf/createOrUpdateMainObject',
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
          },
         _init(){
            let inputArr=[
                {dataField:"RoleName", op:'EQ', dataValue:'默认角色'},
                {dataField:"HomeType", op:'EQ', dataValue:this.formModel.homeType},
                {dataField:"VersionNum", op:'EQ', dataValue:this.formModel.versionNum}
                ],params={};
            params.queryConditionItem=inputArr;
            fetch({
                    url: '/api/services/app/homePageConf/getMainObjectForEdit',
                    method: 'post',
                    data: params
            }).then((data)=>{
                if(data.result.order){
                    this.formModel=data.result.order;
                }else{
                    this.formModel.homePageConf={},
                    this.formModel.id=""
                }
            })
       }
    },
    components:{
         'yl-roleTree':roleTree
        },
     mounted(){
           this._init();
    },
    watch:{
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
