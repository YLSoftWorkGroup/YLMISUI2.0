<template>
    <div>
        <el-form  :model="formModel"  :rules="rules"  ref="formModel" label-width="100px" >
            <el-row>
                <el-col :span="12">
                    <el-form-item label="表名" prop="tableName">
                        <el-input v-model="formModel.tableName" :disabled="true" ></el-input>
                    </el-form-item> 
                </el-col>
                <el-col :span="12">
                    <el-form-item label="明细表" prop="itemTableName">
                        <el-select v-model="formModel.itemTableName" style="width:100%;" clearable  placeholder="请选择">
                            <el-option
                            v-for="item in treedata"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item> 
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="来源表" prop="origiTableName">
                        <el-select v-model="formModel.origiTableName"  style="width:100%;"  clearable  placeholder="请选择">
                            <el-option
                            v-for="item in treedata"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item> 
                </el-col>
                <el-col :span="12">
                    <el-form-item label="目标表" prop="targetTableName">
                        <el-select v-model="formModel.targetTableName" style="width:100%;" clearable  placeholder="请选择">
                            <el-option
                            v-for="item in treedata"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item> 
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                     <el-form-item label="撤销关联表" prop="unAuditTable">
                        <el-select v-model="formModel.unAuditTable" style="width:100%;" clearable  placeholder="请选择">
                            <el-option
                            v-for="item in treedata"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item> 
                </el-col>
                <el-col :span="12">
                    <el-form-item label="类型" prop="type">
                        <el-select v-model="formModel.type" style="width:100%;"   placeholder="请选择">
                            <el-option
                            v-for="item in types"
                            :key="item.value"
                            :label="item.text"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item> 
                   
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="撤销验证明细" prop="isUnAuditItem">
                        <el-switch
                            v-model="formModel.isUnAuditItem"
                            on-text="是"
                            off-text="否">
                        </el-switch>
                    </el-form-item>
                </el-col>
                 <el-col :span="12">
                    <el-form-item label="删除目标明细" prop="isDeleteItem">
                        <el-switch
                            v-model="formModel.isDeleteItem"
                            on-text="是"
                            off-text="否">
                        </el-switch>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="撤销关联关系" prop="unAuditJudgeStr">
                         <el-input type="textarea" rows="5" v-model="formModel.unAuditJudgeStr" ></el-input>
                    </el-form-item>
                </el-col>
                 
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="删除条件" prop="deleteItemJudgeStr">
                         <el-input type="textarea" rows="5" v-model="formModel.deleteItemJudgeStr" ></el-input>
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
import {requestGetTableInfos}from '@/api/tableconfig';
import {
    requestCreateOrUpdateTableInfo
}from '@/api/tableinfo';
import util from '@/common/js/util';
export default {
    data(){
        return{
            formModel:{
                id:'',
                type:'',
                tableName:'',
                itemTableName:'',
                origiTableName:'',
                targetTableName:'',
                moduleName:'',
                sortCode: 1,
                isUnAuditItem:false,
                unAuditTable:'',
                unAuditJudgeStr:'',
                isDeleteItem:false,
                deleteItemJudgeStr:'',
                versionNum:''
            },
            treedata:[],
            rules: {},
            loading:false,
            types:[
                {text:'0只是用来修改审核状态',value:0},
                {text:'1只有目标表',value:1},
                {text:'2既有目标表，也有源头表',value:2},
                {text:'3只有源头表',value:3},
            ]
        }
    },
    props:{
        selectNode:{},
        selectRow:{},
    },
    methods:{
        _onSubmit() {
            this.$refs.formModel.validate((valid) => {
                if (valid) {
                    let globconf=util.getLocalStorage('SysGlobConf');
                    this.formModel.versionNum=globconf.versionNum;
                    var _this=this;
                    this.loading=true;
                    let params={};
                    params.tableInfo=this.formModel;
                    requestCreateOrUpdateTableInfo(params).then(data=>{
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
        _getGetTableConfigTreeList(){
            let _this=this;
            requestGetTableInfos().then(data => {
                    if(data.success){
                        this.treedata=data.result;
                    }
                    else {
                            this.$message.error('获取数据失败！'+data.error.message);
                    }
                }).catch(function (error) {
                        _this.$message.error('网络异常！'+error);
                });
        },
        _complete(){
                this.$emit('close');
            },
        _resetForm() {
                this.$refs.formModel.resetFields();
         },
    },
    mounted(){
       Object.assign(this.formModel,this.selectRow); 
       if(this.selectRow.id==undefined){
            this.formModel.tableName=this.selectNode.commonDataOne;
            this.formModel.moduleName=this.selectNode.text;
       }
       this._getGetTableConfigTreeList();
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
