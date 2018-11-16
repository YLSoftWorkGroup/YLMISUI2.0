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
                    <el-form-item label="目标表" prop="targetTableName">
                        <el-input v-model="formModel.targetTableName" :disabled="true" ></el-input>
                    </el-form-item> 
                </el-col>
                <el-col :span="12">
                    <el-form-item label="明细列" prop="itemColName">
                        <el-select v-model="formModel.itemColName" clearable  @visible-change="_changeTable(formModel.itemTableName)" style="width:100%;" placeholder="请选择">
                            <el-option
                            v-for="item in coltreedata"
                            :key="item.columN_NAME"
                            :label="item.columN_NAME"
                            :value="item.columN_NAME">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="目标列" prop="targetColName">
                        <el-select v-model="formModel.targetColName" clearable  @visible-change="_changeTable(formModel.targetTableName)" style="width:100%;" placeholder="请选择">
                            <el-option
                            v-for="item in coltreedata"
                            :key="item.columN_NAME"
                            :label="item.columN_NAME"
                            :value="item.columN_NAME">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="列类型" prop="colType">
                        <el-autocomplete
                        class="inline-input"
                        v-model="formModel.colType"
                        :fetch-suggestions="querySearch"
                        placeholder="请选择"
                        icon="close"
                        :on-icon-click="handleIconClick"
                        ></el-autocomplete>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="默认值" prop="textValue">
                            <el-input v-model="formModel.textValue" :disabled="false" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="排序" prop="sortCode" >
                        <el-input-number v-model="formModel.sortCode" :min="1" ></el-input-number>
                    </el-form-item> 
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="8">
                    <el-form-item label="撤销是否计算" prop="unAuditIsCompute">
                        <el-switch
                        v-model="formModel.unAuditIsCompute"
                        on-text="是"
                        off-text="否">
                        </el-switch>
                    </el-form-item>
                </el-col>
                 <el-col :span="8">
                    <el-form-item label="是否计算" prop="isCompute">
                        <el-switch
                        v-model="formModel.isCompute"
                        on-text="是"
                        off-text="否">
                        </el-switch>
                    </el-form-item>
                </el-col>
                 <el-col :span="8">
                    <el-form-item label="是否是条件列" prop="isOnly">
                        <el-switch
                        v-model="formModel.isOnly"
                        on-text="是"
                        off-text="否">
                        </el-switch>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="撤销计算类型" prop="unAuditComputeType" >
                        <el-select v-model="formModel.unAuditComputeType" clearable  style="width:100%;" placeholder="请选择">
                                <el-option
                                v-for="item in computeTypesa"
                                :key="item.value"
                                :label="item.text"
                                :value="item.value">
                                </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="计算类型" prop="computeType" >
                        <el-select v-model="formModel.computeType" clearable   style="width:100%;" placeholder="请选择">
                            <el-option
                            v-for="item in computeTypesa"
                            :key="item.value"
                            :label="item.text"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item> 
                </el-col>
            </el-row>
            <el-form-item style="text-align:right;" >
                <el-checkbox v-model="isClose">保存后关闭</el-checkbox>
                <el-button @click="_resetForm">重置</el-button>
                <el-button type="primary" @click="_onSubmit" :loading="loading">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script type="text/babel">
import {
    requestGetTableColumnInfo
}from '@/api/tablecolconfig';
import {
    requestCreateOrUpdateTargetTableInfo
}from '@/api/targettableinfo';
import {requestGetTableInfos}from '@/api/tableconfig';
import util from '@/common/js/util';
export default {
    data(){
        return{
            formModel:{
                id:'',
                tableName:'',
                itemTableName:'',
                targetTableName:'',
                itemColName:'',
                targetColName:'',
                colType:'',
                isOnly:0,
                isCompute:0,
                computeType:'',
                textValue:'',
                unAuditIsCompute:0,
                unAuditComputeType:'', 
                sortCode:0,
                versionNum:''
            },
            textValue:[],
            rules:{},
            coltreedata:[],
            treedata:[],
            loading:false,
            isClose:true,
            computeTypesa:[//0判断唯一性列（不变） 1覆盖 2累加 3 newid() 4文本，使用 5 累减
                {text:'0判断唯一性列（不变）',value:0},
                {text:'1覆盖',value:1},
                {text:'2累加',value:2},
                {text:'3newid()',value:3},
                {text:'4文本，使用',value:4},
                {text:'5累减',value:5},
            ],
            
            computerTypes:[
                {text:'累加1',value:1},
                {text:'累减0',value:0},
            ],
            colTypes:[]
        }
    },
    props:{
        selectRow:{},
        tbselectRow:{}
    },
    methods:{
        querySearch(queryString, cb) {
            var colTypes = this.colTypes;
            var results = queryString ? colTypes.filter(this.createFilter(queryString)) : colTypes;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        createFilter(queryString) {
            return (colType) => {
            return (colType.value.indexOf(queryString.toLowerCase()) === 0);
            };
        },
        loadAll() {
            return [
                { "value": "varchar(500)"},
                { "value": "int"},
                { "value": "bit"},
                { "value": "decimal(28,8)"},
                { "value": "float"},
                { "value": "datetime"},
                { "value": "uniqueidentifier"},
                { "value": "nvarchar(500)"},
            ]},
        handleIconClick(){
            this.formModel.colType='';
        },
        _changeTable(val){
            this._getGetTableColConfigTreeList(val);
        },
        _getGetTableColConfigTreeList(val){
            if(val!=''){
                let params={};
                params.tableName=val;
                requestGetTableColumnInfo(params).then(data => {
                        if(data.success){
                            this.coltreedata=data.result;
                        }
                        else {
                                this.$message.error('获取数据失败！'+data.error.message);
                        }
                    }).catch(function (error) {
                            this.$message.error('网络异常！'+error);
                    });
            }
        },
        _onSubmit() {
                this.$refs.formModel.validate((valid) => {
                if (valid) {
                    var _this=this;
                    this.loading=true;
                    let params={};
                    let globconf=util.getLocalStorage('SysGlobConf');
                    this.formModel.versionNum=globconf.versionNum;
                    params.targetTableInfo=this.formModel;
                    requestCreateOrUpdateTargetTableInfo(params).then(data=>{
                    if(data.success){
                            this.$notify({
                                title: '成功',
                                message: '保存数据成功！',
                                type: 'success'
                                });
                            //关闭面板
                            this._complete(this.isClose);
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
         _complete(bool){
                this.$emit('close',bool);
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
    },
    mounted(){
       Object.assign(this.formModel,this.selectRow); 
       if(this.formModel.id==''){
           this.formModel.tableName=this.tbselectRow.tableName;
           this.formModel.itemTableName=this.tbselectRow.itemTableName;
           this.formModel.targetTableName=this.tbselectRow.targetTableName;
       }
       this.colTypes = this.loadAll();
       this._getGetTableConfigTreeList();
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
