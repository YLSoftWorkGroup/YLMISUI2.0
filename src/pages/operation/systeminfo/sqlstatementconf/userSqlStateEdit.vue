<template>
    <div>
        <el-form  :model="formModel"  :rules="rules"  ref="formModel" label-width="100px">
              <el-row >
                   <el-col :span="12">
                        <el-form-item label="配置名称" prop="confName">
                            <el-input v-model="formModel.confName" ></el-input>
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
             </el-row >
            <el-form-item label="说明" prop="remark">
                <el-input type="textarea" v-model="formModel.remark" ></el-input>
            </el-form-item>
                <el-form-item label="内容" prop="content">
                <el-input type="textarea" v-model="formModel.content" :rows="15"></el-input>
            </el-form-item>
            
             <el-form-item style="text-align:right;" >
                <el-button @click="_resetForm">重置</el-button>
                <el-button type="primary" @click="_onSubmit" :loading="loading">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script type="text/babel">
import util from '@/common/js/util';
import fetch from '@/api/fetch'
import {requestcreateOrUpdateMainObject} from '@/api/sqlstatementconf';
export default {
    data(){
        return{
            formModel:{
                    confName: "",
                    oconfName: "",
                    content: "",
                    remark: "",
                    sortCode: 0,
                    id: "",
                    isEnable:true,
                    versionNum:util.getLocalStorage('SysGlobConf').versionNum,
                    oversionNum:''
            },
            rules:{
                versionNum: [
                    {validator: this.commonJudgeRepeat, trigger: 'blur' }
                ],
                 confName: [ 
                            //验证规则直接调用
                            { required: true, message: '不能为空！', trigger: 'blur' },
                            { validator: this.commonJudgeRepeat, trigger: 'blur' }
                        ],
            },
            loading:false
        }
    },
    props:{
        selectRow:{}
    },
    methods:{
        commonJudgeRepeat(rule, value, callback){
                let columnName='confName,versionNum',columnValue='';
                for(let item in this.formModel){
                    if(columnName.indexOf(item)>=0){
                        columnValue=columnValue+this.formModel[item]+','
                    }
                }
                columnValue=columnValue.substring(0,columnValue.length-1)
                let str=`Base_UserSQLStatementConf|${columnName}|${columnValue}|${this.formModel.oconfName},${this.formModel.oversionNum}`;
                this.IsJudgeRepeat(str,value, callback);
            },
            _onSubmit(){
                    let _this=this;
                    this.$refs.formModel.validate((valid) => {
                    if (valid) {
                        this.loading=true;
                        if(this.formModel.versionNum==''){
                            this.formModel.versionNum=this.VersionNum;
                        }
                        this.formModel.createTime=this.formatDate(new Date(),'YYYY/MM/DD-HH:mm:ss');
                        let params={};
                        params.order=this.formModel;
                        fetch({
                            url:'/api/services/app/userSQLStatementConf/createOrUpdateMainObject',
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
                this.$emit('close');
            },
    },
    mounted(){
        Object.assign(this.formModel,this.selectRow); 
        if(this.formModel.id!==''){
             this.formModel.oconfName=this.formModel.confName;
             this.formModel.oversionNum=this.formModel.versionNum;
        }
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
