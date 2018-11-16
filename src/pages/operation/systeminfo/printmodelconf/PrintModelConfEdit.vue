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
        <el-form  :model="formModel"  :rules="rules"  ref="formModel" label-width="100px">
              <el-row >
                   <el-col :span="12">
                        <el-form-item label="模板名称" prop="v_Col6">
                            <el-input v-model="formModel.v_Col6" ></el-input>
                        </el-form-item>
                    </el-col>
                     <el-col :span="6">
                            <el-form-item label="版本号" prop="v_Col9">
                                    <el-input v-model="formModel.v_Col9"   ></el-input>
                            </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item  prop="b_Col26"  label="是否启用">
                                    <el-switch  v-model="formModel.b_Col26"
                                                on-text="启用"
                                                off-text="禁用"
                                                on-color="#13ce66"
                                                off-color="#ff4949">
                                    </el-switch>
                            </el-form-item>
                    </el-col>
             </el-row >
            <el-form-item label="说明" prop="v_Col7">
                <el-input type="textarea" v-model="formModel.v_Col7" ></el-input>
            </el-form-item>
                <el-form-item label="内容" prop="v_Col24">
                     <yl-jsoneditor ref="modelConf" v-model="formModel.v_Col24" style="height:400px"></yl-jsoneditor>
             </el-form-item>
            
            
        </el-form>
    </div>
</template>

<script type="text/babel">
import util from '@/common/js/util';
import fetch from '@/api/fetch';
export default {
    data(){
        return{
            formModel:{
                    v_Col6: "",
                    v_Col7: "",
                    v_Col9: util.getLocalStorage('SysGlobConf').versionNum,
                    v_Col10: "",
                    v_Col24: "",
                    sortCode: 0,
                    id: "",
                    b_Col26:true,
                    oversionNum:'',
                    ov_Col6:''
            },
            rules:{
                v_Col9: [
                    {validator: this.commonJudgeRepeat, trigger: 'blur' }
                ],
                 v_Col6: [ 
                            //验证规则直接调用
                            { required: true, message: '不能为空！', trigger: 'blur' },
                            { validator: this.commonJudgeRepeat, trigger: 'blur' }
                        ],
            },
            loading:false,
            isClose:true,
        }
    },
    props:{
        selectRow:{}
    },
    methods:{
        commonJudgeRepeat(rule, value, callback){
                let columnName='v_Col6,v_Col9',columnValue='';
                for(let item in this.formModel){
                    if(columnName.indexOf(item)>=0){
                        columnValue=columnValue+this.formModel[item]+','
                    }
                }
                columnValue=columnValue.substring(0,columnValue.length-1)
                let str=`Material_SingleTable76|${columnName}|${columnValue}|${this.formModel.ov_Col6},${this.formModel.oversionNum}`;
                this.IsJudgeRepeat(str,value, callback);
            },
            _onSubmit(){
                    let _this=this;
                    this.$refs.formModel.validate((valid) => {
                    if (valid) {
                        this.loading=true;
                        if(this.formModel.v_Col9==''){
                            this.formModel.v_Col9=this.VersionNum;
                        }
                        this.formModel.v_Col24=this.$refs.modelConf.getValue(); 
                        this.formModel.v_Col10=this.formatDate(new Date(),'YYYY/MM/DD-HH:mm:ss');
                        let params={};
                        params.order=this.formModel;
                        fetch({url:'api/services/app/singleTable76/createOrUpdateMainObject',
                               method:'post',
                               data:params}).then(data=>{
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
                                _this.$message.error('保存数据失败！'+data.error.message);
                            }
                                this.loading=false;
                        }).catch(function(error){
                        this.loading=false;
                        })
                    } else {
                        this.$message.warning('请按照条件填充表单！');
                        return false;
                    }
                
                });
            },
            _resetForm() {
                 this.$refs.formModel.order.resetFields();
            },
            _complete(){
               if(this.isClose){
                 this.$emit('close');
             }  
            },
    },
    mounted(){
        Object.assign(this.formModel,this.selectRow); 
        if(this.formModel.id!==''){
             this.formModel.ov_Col6=this.formModel.v_Col6;
             this.formModel.oversionNum=this.formModel.v_Col9;
        }
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
