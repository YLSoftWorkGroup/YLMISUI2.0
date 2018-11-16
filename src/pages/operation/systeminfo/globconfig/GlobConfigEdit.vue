<template>
<div>
<el-form  :model="formModel"  :rules="rules"  ref="formModel" label-width="100px" >
     <el-tabs  type="border-card" active-name="baseInfoConf" >
                    <el-tab-pane label="基本配置信息" name="baseInfoConf" style="padding:10px"> 
                             <el-form-item label="名称" prop="name">
                                <el-input v-model="formModel.name" ></el-input>
                            </el-form-item>
                            <el-row>
                            <el-col :span="12">
                                        <el-form-item  prop="sB_Col8"  label="是否启用">
                                                <el-switch  v-model="formModel.sB_Col8"
                                                            on-text="启用"
                                                            off-text="禁用"
                                                            on-color="#13ce66"
                                                            off-color="#ff4949">
                                                </el-switch>
                                        </el-form-item>
                                        </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="排序"  prop="sortCode" >
                                            <el-input-number v-model="formModel.sortCode"></el-input-number>
                                        </el-form-item>
                                    </el-col>
                            </el-row>
                            <el-form-item label="说明" prop="remark">
                                <el-input v-model="formModel.remark"   ></el-input>
                            </el-form-item>      
                            <el-form-item label="界面配置" prop="uiConf">
                                <yl-jsoneditor ref="sV_Col6" v-model="formModel.sV_Col6" style="height:300px"></yl-jsoneditor>
                            </el-form-item>
                    </el-tab-pane>
                        <el-tab-pane label="配置内容" name="uiConf" style="padding:10px"> 
                            <el-form-item label="内容" prop="describe">
                                <yl-jsoneditor ref="describe" v-model="formModel.describe" style="height:500px"></yl-jsoneditor>
                            </el-form-item>
                            
                        </el-tab-pane>
                </el-tabs>
        <el-checkbox v-model="isClose">保存后关闭</el-checkbox>
        <div style="text-align:right;">   
            <el-button @click="_resetForm">重置</el-button>
            <el-button type="primary" @click="_onSubmit" :loading="loading">保存</el-button>
        </div>
    </el-form-item>
</el-form>
</div>
</template>
<script type="text/babel">
import util from '@/common/js/util'  
import {
    requestcreateOrUpdateMainObject
}from '@/api/globconfig';
export default {
    data(){
    return{
        formModel:{
                 name:'',
                 describe:'',
                 remark:'',
                 sV_Col6:'',
                 sortCode:1,
                 sB_Col8:true
        },
         rules: {
                    name: [
                      { required: true, message: '名称不能为空！', trigger: 'blur' }
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
    methods:{
         _onSubmit() {
                this.$refs.formModel.validate((valid) => {
                if (valid) {
                    var _this=this;
                    this.loading=true;
                    let params={};
                    params.globConfig=this.formModel;
                    params.permissionType=1;
                    this.formModel.describe=this.$refs.describe.getValue();
                    this.formModel.sV_Col6=this.$refs.sV_Col6.getValue();
                    requestcreateOrUpdateMainObject(params).then(data=>{
                            if(data.success){
                                    this.$notify({
                                        title: '成功',
                                        message: '保存数据成功！',
                                        type: 'success'
                                        });
                                   //关闭面板
                                    _this._complete();
                                    //更新
                                    let i=params.globConfig;
                                      if(i.name.substring(0,2)==='IO'){
                                         util.setLocalStorage('GBIoConf',i.describe);
                                    }else{
                                        util.setLocalStorage(i.name,i.describe);
                                    }
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
