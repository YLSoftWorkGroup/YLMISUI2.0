
<template>
<div>
<el-form  :model="formModel"  :rules="rules"  ref="formModel" label-width="100px" >
    <el-row>
        <el-col :span="12" >
            <el-form-item  label="表名" prop="tableName">
                <el-input  style="width:100%" v-model="formModel.tableName" :disabled="true"></el-input> 
            </el-form-item>
        </el-col>
        <el-col :span="12">
            <el-form-item label="来源类型" prop="type">
                <el-select v-model="formModel.type"  style="width:100%;" placeholder="请选择">
                    <el-option
                    v-for="item in textValues"
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
            <el-form-item label="来源表名" prop="origiTableName">
                <el-input  style="width:100%" v-model="formModel.origiTableName" :disabled="true"></el-input> 
            </el-form-item> 
        </el-col>
        <el-col :span="12">
            <el-form-item label="明细表名" prop="itemTableName">
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
            <el-form-item label="来源列" prop="origiColName">
                <el-select v-model="formModel.origiColName" clearable  @visible-change="_changeTable(formModel.origiTableName)" style="width:100%;" placeholder="请选择">
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
             <el-form-item label="来源计算列" prop="origiComputeColName">
                <el-select v-model="formModel.origiComputeColName" clearable  @visible-change="_changeTable(formModel.origiTableName)" style="width:100%;" placeholder="请选择">
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
            <el-form-item label="明细计算列" prop="currComputeColName">
                <el-select v-model="formModel.currComputeColName" clearable  @visible-change="_changeTable(formModel.itemTableName)" style="width:100%;" placeholder="请选择">
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
            <el-form-item label="审核计算方式" prop="auditComputeType">
                <el-select v-model="formModel.auditComputeType" clearable  style="width:100%;" placeholder="请选择">
                        <el-option
                        v-for="item in computerTypes"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value">
                        </el-option>
                </el-select>
            </el-form-item> 
        </el-col>
        <el-col :span="12">
            <el-form-item label="撤销计算方式" prop="unAuditComputeType">
                <el-select v-model="formModel.unAuditComputeType" clearable  style="width:100%;" placeholder="请选择">
                        <el-option
                        v-for="item in computerTypes"
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
            <el-form-item label="状态列" prop="stateColName">
                <el-select v-model="formModel.stateColName" clearable  @visible-change="_changeTable(formModel.origiTableName)" style="width:100%;" placeholder="请选择">
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
            <el-form-item label="排序" prop="sortCode" >
                <el-input-number v-model="formModel.sortCode" :min="1" ></el-input-number>
            </el-form-item> 
        </el-col>
    </el-row>
    <el-row>
        <el-col :span="12">
            <el-form-item label="审核状态值" prop="auditStateValue">
                <el-input v-model="formModel.auditStateValue"  :min="0" :max="100"></el-input>
            </el-form-item> 
        </el-col>
        <el-col :span="12">
            <el-form-item label="撤销状态值" prop="unAuditStateValue">
                <el-input v-model="formModel.unAuditStateValue"  :min="0" :max="100"></el-input>
            </el-form-item>
        </el-col>
    </el-row> 
    <el-row>
        <el-col :span="12">
            <el-form-item label="是否删除" prop="isDeleted">
                <el-switch
                v-model="formModel.isDeleted"
                on-text="是"
                off-text="否">
                </el-switch>
            </el-form-item>
        </el-col>
        <el-col :span="12">
             <el-form-item label="是否必须更新" prop="isStatic">
                 <el-switch
                    v-model="formModel.isStatic"
                    on-text="是"
                    off-text="否">
                    </el-switch>
            </el-form-item>
        </el-col>
    </el-row> 
    <el-form-item label="删除配置" v-if="formModel.isDeleted" prop="deletedCon">
        <el-input type="textarea" v-model="formModel.deletedCon" ></el-input>
    </el-form-item>  
    <el-row>
        <el-form-item label="配置撤销条件" prop="juConStr">
                <el-input type="textarea" rows="5" v-model="formModel.juConStr" ></el-input>
        </el-form-item>
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
    requestGetTableInfos
}from '@/api/tableconfig';
import {
    requestGetTableColumnInfo
}from '@/api/tablecolconfig';
import {
    requestCreateOrUpdateOrigiTableInfo
}from '@/api/origitableinfo';
import util from '@/common/js/util';
export default {
    data(){
    return{
        activeName:'first',
        formModel:{
            type:0,
            tableName:'',
            origiTableName: '',
            origiColName: '', 
            itemTableName:'',
            itemColName:'',
            origiComputeColName:'',
            currComputeColName:'',
            auditComputeType:'',
            unAuditComputeType:'',
            stateColName:'',
            auditStateValue:0,
            unAuditStateValue:0,
            isDeleted:'',
            deletedCon:'',
            juConStr:'',
            isStatic:'',
            sortCode:0,
            versionNum:''
          },
        isClose:true,
        treedata:[],
        coltreedata:[],
        // types:[{text:'更新来源',value:1},
        //     {text:'不更新来源',value:0}],
        computerTypes:[
            {text:'0累减',value:0},
            {text:'1累加',value:1},
            {text:'2修改状态列值',value:2},
            {text:'3计数器',value:3},
        ],
        textValues:[//0 常用材料库  消耗材料：1 进料登记选材 2 从总需用计划选材  3 进料登记（30进料登记PDA选材 31发料登记选材 32内部调拨登记选材 33外部调拨登记选材 ）4从磅单选材 5 合同选材 6从库存选材   
                {text:'6常用材料库',value:6,},  //周转材料：80：收料选材  81：调入选材  82：库存选材 83：报废选材
                {text:'1进料登记选材', value:1}, //钢筋加工中心：90：半成品材料库选材  91：半成品登记选材
                {text:'2从总需用计划选材',value:2},
                {text:'30进料登记PDA选材',value:30},
                {text:'31发料登记选材',value:31},
                {text:'32内部调拨登记选材',value:32},
                {text:'33外部调拨登记选材',value:33},
                {text:'4从磅单选材',value:4},
                {text:'5合同选材',value:5},
                {text:'0从库存选材',value:0},
                {text:'周转材料：80：收料选材',value:80},
                {text:'81：调入选材 ',value:81},
                {text:'82：库存选材',value:82},
                {text:'83：报废选材',value:83},
                {text:'90：半成品材料库选材',value:90},
                {text:'91：半成品登记选材',value:91}
            ],
         rules: {
                    // title: [
                    //   { required: true, message: '不能为空！', trigger: 'blur' }
                    // ],
         },
        loading:false
       }       
    },
    props:{
        selectRow:{},
        tbselectRow:{}
    },
    methods:{
         _onSubmit() {
             this.$refs.formModel.validate((valid) => {
                if (valid) {
                    var _this=this;
                    this.loading=true;
                    let params={}; 
                    let globconf=util.getLocalStorage('SysGlobConf');
                    this.formModel.versionNum=globconf.versionNum;
                    params.origiTableInfo=this.formModel;
                    requestCreateOrUpdateOrigiTableInfo(params).then(data=>{
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
    },
     mounted(){
       Object.assign(this.formModel,this.selectRow); 
       if(this.formModel.tableName==''){
            this.formModel.tableName=this.tbselectRow.tableName;
            this.formModel.origiTableName=this.tbselectRow.origiTableName;
            this.formModel.itemTableName=this.tbselectRow.itemTableName;
       }
       this._getGetTableConfigTreeList();
    },
     watch:{
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
