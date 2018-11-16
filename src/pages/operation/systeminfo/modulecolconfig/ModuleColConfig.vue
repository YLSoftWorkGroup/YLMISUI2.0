<template>
<yl-panelpage :titleName="'模块列信息说明'" :reloadisShow="false" :fullscreenisShow="true" >
    <div slot="content">
                <yl-layout>
                    <div slot="fristbox" >
                        <yl-toolbar>
                            <el-form  :inline="true"  >
                                 <el-form-item class="form-content-vertical">
                               <yl-menuItemTree  
                                    placeholder="请选择菜单" 
                                    size="small" 
                                    style="width:200px" 
                                    v-model="menuItemId"
                                    displaytoolBar
                                    @clear="_clear"
                                    @getCurrentNode="_handleNodeClick"
                               ></yl-menuItemTree>   
                            </el-form-item>
                            <el-form-item  class="form-content-vertical">
                                    <el-select v-model="tableName" @change="_reload()" style="width:100%;" size="small"   placeholder="请选择表名">
                                        <el-option
                                        v-for="item in treedata"
                                        :key="item.name"
                                        :label="item.name"
                                        :value="item.name">
                                        </el-option>
                                    </el-select>
                                </el-form-item> 
                                 <el-form-item class="form-content-vertical">
                                    <el-input  placeholder="版本号" size="small" style="width:120px" v-model="versionNum"></el-input>
                                </el-form-item>
                                <el-form-item class="form-content-vertical">
                                    <el-button type="primary" icon="search" size="small" @click="_reload()" >查 询</el-button>
                                    <el-tooltip placement="top" effect="light">
                                        <div slot="content">提示：表和模块都选才可以添加，修改不影响，<br/>删除的时候会删除当前条件下的所有数据，请谨慎操作^o^</div>
                                        <el-button>提示</el-button>
                                    </el-tooltip>
                                </el-form-item>
                            </el-form>
                        </yl-toolbar>
                        <yl-toolbar>
                            <el-button-group>
                                <el-button type="primary" v-permissionSetting="'Pages.System.Config.ModuleColInfoConfigs.Create'"   icon="plus" size="small" :disabled="this.tableName===''" @click="_add" >添加</el-button>
                                <el-button type="primary" v-permissionSetting="'Pages.System.Config.ModuleColInfoConfigs.Edit'"   icon="edit"  size="small" :disabled="selectRows.length===0" @click="_edit">编辑</el-button>
                                <el-button type="danger"  v-permissionSetting="'Pages.System.Config.ModuleColInfoConfigs.Delete'"   icon="delete" size="small"  :disabled="tableName===0" @click="_delete" >删除</el-button>
                                <el-button type="success"  icon="icon-file-excel" size="small" v-permissionSetting="'show'"  @click="_exportExecl" >导出execl</el-button>
                            </el-button-group>
                        </yl-toolbar>
                    </div>
                    <div slot="secondbox" class="flexbox">
                        <yl-table ref="table"
                            @reload="_reload"
                            @current-change="_currentChange"
                            @selection-change="handleSelectionChange"
                            @row-click="toggleRowSelection"
                            :configs="tableConfig" 
                            :input="mainInput.inputModel"
                            :tableloading="mainTableLoading" 
                            :pagination="pagination"
                            >
                                <!-- <template slot="content" scope="scope">
                                    <el-button icon="search" @click="_viewContent(scope.row)"></el-button>
                                </template> -->
                        </yl-table>
                    </div>
                </yl-layout>
           
         <el-dialog ref="mainDialog" title="编辑" v-model="addFormVisible" size="small"  top="10%" 
                    :modal-append-to-body="false" :close-on-click-modal="false"  >
                    <Edit :colInfo="tableCol" :moduleInfo="moduleInfos" :versionNum="versionNum"  @close="_close"  v-if="addFormVisible"></Edit>
         </el-dialog>
    </div>
</yl-panelpage>
</template>

<script type="text/babel">
import {requestGetTableInfos}from '@/api/tableconfig';
import util from '@/common/js/util';
import menuItemTree from '@/ocomponents/menuitem/menuItemTree';
import {
    requestGetTableColumnInfo
}from '@/api/tablecolconfig';
import Edit from './Edit'
import {
    requestGetMainPageList,
    requestDeleteMainObject
}from '@/api/modulecolconfig';
import  {inputModel} from '@/api/inputmodel';
export default {
    data(){
        return{
            treeLoading:false,
            selectNode:{id:""},
            defaultProps: {
                    children: 'children',
                    label: 'text',
                    id: 'id'
                },
            selectRows:[],
            treedata:[],
            coltreedata:[],
            addFormVisible:false,
            tableCol:[],
            moduleInfos:{},
            mainTableLoading:false,
            tableData:[],
            multipleSelection:[],
            mainInput:new inputModel(),
            showTips:false,
            menuItemId:'',
            tableName:'',
            versionNum:util.getLocalStorage('SysGlobConf').versionNum,
            pagination:{ //分页默认配置
                    pageSizes:[20,50,200],
                    layout:"total, sizes, prev, pager, next, jumper",
                    pageSize:20
                }
        }
    },
    computed: {
        tableConfig: {
                get () {
                    return {
                        table: {
                            attr: {
                                data: this.tableData,
                                highlightCurrent:true,
                            }
                        },
                        columns: [
                            {attr: { type: 'selection',label: '全选', width:80,align: 'center' ,headerAlign:'center'}},
                            {attr: { prop: 'tableName', label: '表', width:200,  } },   
                            {attr: { prop: 'columnName', label: '列名', width:200,  } },   
                            {attr: { prop: 'columnExplain', label: '列说明', width:250,  } },
                            {attr: { prop: 'versionNum', label: '系统版本号', width:130,  } },   
                            {attr: { prop: 'sortCode', label: '排序'} },
                        ]
                    }
                }
            }
    },
    methods:{
         _handleNodeClick(node) {  
                 //点击加载 
                 this.tableName=node.commonDataOne;
                 this.selectNode.id=node.id;
                 this.selectNode.text=node.text;
                 this._getGetTableConfigTreeList();
            },
        _treeReload(){
            this.selectNode={id:this.guidOfNull()};
        },
        _clear(){
            this.tableName='';
            this.menuItemId='';
            this.selectNode.text='';
            this._getGetTableConfigTreeList();
        },
        //获取数据库列表
        _getGetTableConfigTreeList(){
            let _this=this;
            requestGetTableInfos().then(data => {
                    if(data.success){
                        this.treedata=data.result.filter((item)=>{
                            return item.name.indexOf(this.tableName)==0});
                    }
                    else {
                        this.$message.error('获取数据失败！'+data.error.message);
                    }
                }).catch(function (error) {
                        _this.$message.error('网络异常！'+error);
                });
        },
         _exportExecl(){
           this.exportCommonTemplate(this.tableConfig.columns,this.tableConfig.table.attr.data.data,'模块列信息')
        },
        //构造formModel
        _formModelConstruction(){
            for(var i=0;i<this.coltreedata.length;i++){
                this.tableCol.push({
                    mouduleId:this.selectNode.id,
                    mouduleTableName:this.selectNode.commonDataOne,
                    id:'',
                    tableName:this.coltreedata[i].table_NAME,
                    columnName:this.coltreedata[i].columN_NAME,
                    columnExplain:'',
                    sortCode:i+1
                })
            };
        },
        //获取列信息
        _getcol(){
            let val=this.tableName;
            if(val!=''){
            let params={};
            params.tableName=val;
            requestGetTableColumnInfo(params).then(data => {
                    if(data.success){
                        this.coltreedata=data.result;
                        this._formModelConstruction();
                    }
                    else {
                            this.$message.error('获取数据失败！'+data.error.message);
                    }
                }).catch(function (error) {
                        this.$message.error('网络异常！'+error);
                });
            }
            
        },
        _close(){
                this.addFormVisible=false;
                this._reload();
        },
        _add(){
            this.tableCol=[];
            if(this.tableName!=''){
                if(this.tableData.data.length===0){
                    this._getcol();
                    this.addFormVisible=true;
                    this.moduleInfos={
                        mouduleName:this.selectNode.text,
                        tableName:this.tableName,
                    }
                }else{
                    this.$message.warning('需要清除该条件下的列表信息才能新添加！');
                }
            }else{
                this.$message.warning('请选择编辑表！');
            }
        },
        _edit(){
            this.tableCol=[];
            this.moduleInfos={
                    mouduleName:this.selectNode.text,
                    tableName:this.tableName,
                }
            this.tableCol=this.selectRows;
            this.addFormVisible=true;
        },
        _delete(){
             this.$confirm('这个操作会清除该条件所有的条目，确认要删除所选项目吗?', '提示', {
                type: 'warning'
            }).then(() => {
                var inputArr=[ 
                              {key:"TableName",op:"EQ",value:this.tableName},
                              {key:"MouduleId",op:"EQ",value:this.selectNode.id}
                             ];
                this.mainInput.addqueryConditionItem(inputArr);
                requestDeleteMainObject(this.mainInput.inputModel).then(data =>{
                        if(data.success){
                                this._reload();
                                this.$notify({
                                    title: '成功',
                                    message: '删除数据成功！',
                                    type: 'success'
                                    });
                            }
                            else {
                                this.$notify.error({
                                    title: '错误',
                                      message: '删除数据失败！'+data.error.message,
                                    });
                            }
                });
            });
        },
        _reload(){
            this._getMainPageList();
        },
        toggleRowSelection(row) {
            this.$refs.table.toggleRowSelection(row)
        },
       _getMainPageList(){
            var _this=this;
            this.selectRows=[];
            this.mainTableLoading=true; //开启加载
            var inputArr=[ {key:"TableName",op:"EQ",value:this.tableName}];
            if(this.menuItemId!=''){
                inputArr.push( {key:"MouduleId",op:"EQ",value:this.menuItemId})
            }
            inputArr.push({key:"VersionNum",op:"EQ",value:this.versionNum})
            this.mainInput.addqueryConditionItem(inputArr);
            this.mainInput.inputModel.sorting="SortCode";
            requestGetMainPageList(this.mainInput.inputModel).then(data =>{
                        if(data.success){
                            this.tableData=data.result;
                            }
                        else {
                                this.$message.error('失败！'+data.error.message);
                        }
                        this.mainTableLoading=false;
            }).catch(function(error){
                    _this.mainTableLoading=false;
            });
       },
       _currentChange(val){
           
       },
       handleSelectionChange(val) {
        this.selectRows = val;
      }

    },
    components:{
        Edit,
        'yl-menuItemTree':menuItemTree
    },
    mounted(){
         this._getGetTableConfigTreeList();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
