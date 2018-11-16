
<template>
<div>
<el-form  :model="formModel"  :rules="rules"  ref="formModel" label-width="100px" >
         <el-form-item label="名称" prop="attachName">
             <el-input v-model="formModel.attachName" ></el-input>
         </el-form-item>
         <el-form-item label="模块" prop="attachModule">
             <yl-menuItemTree  
                placeholder="请选择模块" 
                v-model="menuItemId"
                @getCurrentNode="_handleNodeClick"
            ></yl-menuItemTree> 
         </el-form-item>
         <el-form-item label="上传" prop="attachUrl">  
                <yl-singleupload
                    v-model="formModel.attachUrl"
                    :allowSize="1024*1024*1024"
                    :allowFormat="'xlsx|jpg|rar'"
                    :moduleName="formModel.attachModule"
                    @change="_onResult"
                >
               </yl-singleupload>
         </el-form-item>    
         <el-form-item label="上传大小" prop="attachSize">
             <el-input v-model="formModel.attachSize" :readonly="true"></el-input>
         </el-form-item>
         <el-form-item label="上传类型" prop="attachType">
             <el-input v-model="formModel.attachType" :readonly="true"></el-input>
         </el-form-item>
         <el-form-item label="单据主键" prop="sO_Col12">
             <el-input v-model="formModel.sO_Col12" ></el-input>
         </el-form-item>
         <el-form-item label="备注" prop="remark">
             <el-input v-model="formModel.remark"  type="textarea" style="width:100%" row="5"></el-input>
         </el-form-item>    
   <el-form-item style="text-align:right;" >
      <el-button @click="_resetForm">重置</el-button>
      <el-button type="primary" @click="_onSubmit" :loading="loading">保存</el-button>
  </el-form-item>
  
</el-form>
</div>
</template>

<script type="text/babel">
import menuItemTree from '@/ocomponents/menuitem/menuItemTree';
import {
    requestCreateOrUpdateAttachMent
}from '@/api/attachment';
export default {
    data(){
    return{
        menuItemId:'',
        formModel:{
                 id:'',
                 projectId:'',
                 userId:'',
                 attachName:'',
                 attachModule:'',
                 attachUrl:'',
                 attachSize:'',
                 attachType:'',
                 remark:'',
        },
         rules: {
                    attachName: [
                      { required: true, message: '附件名称不能为空！', trigger: 'blur' }
                    ],
                    attachUrl: [
                      { required: true, message: '上传附件不能为空！', trigger: 'blur' }
                    ],
                     attachModule: [
                      { required: true, message: '模块名称不能为空！', trigger: 'blur' }
                    ],
         },
        loading:false
       }       
    },
    props:{
        selectRow:{},
        isVisible:false
    },
    methods:{
         _onSubmit() {
                this.$refs.formModel.validate((valid) => {
                if (valid) {
                    var _this=this;
                    this.loading=true;
                    let params={order:{}};
                    params.order=this.formModel;
                    requestCreateOrUpdateAttachMent(params).then(data=>{
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
                    this.$message.warning('请按照条件填充表单！');
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
        _onResult(file){
            this.formModel.attachSize=file.raw.size;
            this.formModel.attachType=file.raw.type;
        },
        _handleNodeClick(node){
            if(node.funcCode!=null){
                this.formModel.attachModule=node.funcCode;
            }else{
                    this.$message.warning('请选择末级菜单节点！');
                    this.menuItemId='';
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
