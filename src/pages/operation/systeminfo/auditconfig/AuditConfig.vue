<template>
<yl-panelpage :titleName="'审核配置'" :reloadisShow="false" :fullscreenisShow="true" >
<div slot="content">
    <yl-columnlay>
          <div slot="left" >        
          <yl-panelpage isZone :helpIsShow="false" :treeLoading="treeLoading" :reloadIsShow="false" @reload="_treeReload" :titleName="'菜单树'" :icon="'icon-tree'" :widthNum="'210px'" >
                     <div slot="content"> <el-tree :data="menuTreeData" :render-content="renderContent" :expand-on-click-node="false"  :props="defaultProps"  @node-click="_handleNodeClick"  style="height:100%"></el-tree> </div>
         </yl-panelpage> 
            </div>
        <div slot="right" >
            <yl-layout>
                <div slot="fristbox" >
                <yl-toolbar>
                        <el-form  :inline="true"  >
                               <el-form-item class="form-content-vertical">
                                         <el-input  placeholder="表名称查询" size="small" style="width:200px" v-model="searchModel.tableName"></el-input>
                                         </el-form-item>
                                <el-form-item class="form-content-vertical">
                                    <el-button type="primary" icon="search" size="small"  @click="_reload">查 询</el-button>
                                </el-form-item>
                        </el-form>
                </yl-toolbar>
                <yl-toolbar>
                    <el-button-group>
                            <el-button type="primary" v-permissionSetting="'Pages.System.Config.TableInfos.Create'"   icon="plus" size="small"  @click="_add" >添加</el-button>
                            <el-button type="primary" v-permissionSetting="'Pages.System.Config.TableInfos.Edit'"   icon="edit"  size="small" :disabled="selectRows.length===0" @click="_edit">编辑</el-button>
                            <el-button type="danger"  v-permissionSetting="'Pages.System.Config.TableInfos.Delete'"   icon="delete" size="small"  :disabled="selectRows.length===0" @click="_delete" >删除</el-button>
                            <el-button type="primary"  icon="plus" size="small" :disabled="selectRows.length===0" @click="_addOrigiTable"  >来源表</el-button>
                            <el-button type="primary"  icon="plus" size="small" :disabled="selectRows.length===0" @click="_addTargetTable"   >目标表</el-button>
                        </el-button-group>
                </yl-toolbar>
                </div>
                <div slot="secondbox" class="flexbox">
                        <yl-table ref="table"
                            @reload="_reload"
                            @current-change="_currentChange"
                            :configs="tableConfig" 
                            :input="mainInput.inputModel"
                            :tableloading="mainTableLoading" 
                            >
                                <template slot="type" scope="scope">
                                        <el-tag type="danger" v-if="scope.row.type==0">只修改审核状态</el-tag>
                                        <el-tag type="warning" v-else-if="scope.row.type==1" >只有目标</el-tag>
                                        <el-tag type="primary" v-else-if="scope.row.type==2" >有目标有来源</el-tag>
                                        <el-tag type="success" v-else-if="scope.row.type==3" >只有来源</el-tag>
                                </template>
                                 <template slot="isUnAuditItem" scope="scope">
                                        <el-tag type="danger" v-if="scope.row.isUnAuditItem==0">否</el-tag>
                                        <el-tag type="warning" v-else-if="scope.row.isUnAuditItem==1" >是</el-tag>
                                </template>
                                 <template slot="isDeleteItem" scope="scope">
                                        <el-tag type="danger" v-if="scope.row.isDeleteItem==0">否</el-tag>
                                        <el-tag type="warning" v-else-if="scope.row.isDeleteItem==1" >是</el-tag>
                                </template>
                        </yl-table>
                </div>
            </yl-layout>
        </div>
    </yl-columnlay>
    <!--编辑界面-->
         <el-dialog ref="mainDialog" title="编辑" v-model="addFormVisible" size="small"  top="10%" 
                    :modal-append-to-body="false" :close-on-click-modal="false"  >
                    <Edit :selectRow="currentRows" :selectNode="selectNode" @close="_close"  v-if="addFormVisible"></Edit>
         </el-dialog>
         <el-dialog ref="mainDialog1" title="来源表" v-model="addFormVisible1" size="full"  top="10%" 
                    :modal="false"  >
                    <OriginTable :oselectRow="currentRows" :selectNode="selectNode" @close="_close"  v-if="addFormVisible1"></OriginTable>
         </el-dialog>
         <el-dialog ref="mainDialog2" title="目标表" v-model="addFormVisible2" size="full"  top="10%" 
                    :modal="false"  >
                    <TargetTable :tselectRow="currentRows" :selectNode="selectNode" @close="_close"  v-if="addFormVisible2"></TargetTable>
         </el-dialog>
       
 </div>
</yl-panelpage>
</template>

<script type="text/babel">
import Edit from './Edit';
import OriginTable from './OriginTable'
import TargetTable from './TargetTable'
import  {inputModel} from '@/api/inputmodel';
import {
            requestGetTableInfoPageList,
            requestDeleteTableInfo
        }   from '@/api/tableinfo';
import {requestGetMenuItemTreeList}   from '@/api/menuitem';
import treeMixn from '@/mixns/tree.js';
import util from '@/common/js/util';

export default {
    mixins: [treeMixn],
    data(){
        return {
             tableData: {},
                mainTableLoading:false,
                selectRows:[],
                menuItemWithPanel:[],
                currentRows:{},
                searchModel:{
                      tableName:'',  
                    },
                addFormVisible:false,
                addFormVisible1:false,
                addFormVisible2:false,
                mainInput:new inputModel(),
                content:'',
                title:'',
                menuTreeData:[],
                treeLoading:false,
                selectNode:{},
                defaultProps: {
                        children: 'children',
                        label: 'text',
                        id: 'id'
                    },
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
                                {attr: { type: 'index',label: '序号',width:55,align: 'center',headerAlign:'center'}},
                                {attr: { prop: 'moduleName', label: '模块', width:130,  } }, 
                                {attr: { prop: 'type', label: '类型', width:120, scopedSlot:'type' } },
                                {attr: { prop: 'tableName', label: '表', width:150,  } },   
                                {attr: { prop: 'itemTableName', label: '明细表', width:150,  } },   
                                {attr: { prop: 'origiTableName', label: '来源表', width:150,  } },   
                                {attr: { prop: 'targetTableName', label: '目标表', width:150,  } }, 
                                {attr: { prop: 'isUnAuditItem', label: '撤销验证明细', width:100, scopedSlot:'isUnAuditItem' } },
                                {attr: { prop: 'unAuditTable', label: '撤销关联表', width:100,  } },
                                {attr: { prop: 'unAuditJudgeStr', label: '撤销关联关系', width:100,  } },  
                                {attr: { prop: 'isDeleteItem', label: '删除目标明细', width:100,  scopedSlot:'isDeleteItem'} },
                                {attr: { prop: 'deleteItemJudgeStr', label: '删除条件', width:100,  } }, 
                                {attr: { prop: 'versionNum', label: '系统版本号', width:130,  } },    
                                {attr: { prop: 'sortCode', label: '排序'} },
                            ]
                        }
                    }
                }
        },
    methods:{
        _getCrureentNode(node){
            this.menuItemWithPanel=node.text;
            this.selectNode.id=node.id;
            this._reload(); 
        },
        _handleNodeClick(result, resolve) {  
                 //点击加载 
                  this.selectNode=result;
                  this._reload();
            },
        _treeReload(){
            this.selectNode.id=this.guidOfNull();
            this._getGetMenuItemTreeList();
        },
        //一次加载树
        _getGetMenuItemTreeList(){
            let _this=this;
            this.treeLoading=true;
            requestGetMenuItemTreeList().then(data => {
                    if(data.success){
                        this.menuTreeData=util.returnDatabyTree(data.result,this.guidOfNull());
                    }
                    else {
                        this.$message.error('获取数据失败！'+data.error.message);
                    }
                        this.treeLoading=false;
                }).catch(function (error) {
                        _this.treeLoading=false;
                });
        },
        _getTableInfoPageList(){
                var _this=this;
                this.selectRows=[];
                this.mainTableLoading=true; //开启加载
                var inputArr=[]
                if(this.selectNode.commonDataOne!=undefined){
                 inputArr=[ 
                              {key:"TableName",op:"LIKE",value:this.selectNode.commonDataOne}
                             ];
                }
                this.mainInput.addqueryConditionItem(inputArr);
                requestGetTableInfoPageList(this.mainInput.inputModel).then(data =>{
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
                //单选时的方法
                if(val!=null){
                     this.selectRows=[];
                     this.selectRows.push(val);
                }
               
            },
        _selectionChange(val){
            //多选时的方法
            if(val!=null){
                this.selectRows=[];
                this.selectRows=this.selectRows.concat(val);
            }
        },
        toggleRowSelection (row) {
            this.$refs.table.toggleRowSelection(row)
        },
        _reload(){
            this._getTableInfoPageList();
        },
        _add(){
            if(this.selectNode.id!=this.guidOfNull()){
                this.addFormVisible=true;
                this.currentRows={};
            }else{
                this.$message.warning('请选择模块！');
            }
        },
        _addOrigiTable(){
            this.addFormVisible1=true;
            this.currentRows=this.selectRows[0];
        },
        _addTargetTable(){
            this.addFormVisible2=true;
            this.currentRows=this.selectRows[0];
        },
        _edit(){
                this.addFormVisible=true;
                this.currentRows=this.selectRows[0];
        },
        _delete(){
            this.$confirm('确认要删除所选项目吗?', '提示', {
                type: 'warning'
            }).then(() => {
                var obj={}; 
                obj.id=this.selectRows[0].id;
                requestDeleteTableInfo(obj).then(data =>{
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
        _close(){
                this.addFormVisible=false;
                this.addFormVisible1=false;
                this.addFormVisible2=false;
                this._reload();
        },
        _viewContent(val){
            this.addFormVisible1=true;
            this.content=val.content;
            this.title=val.title;
        }

    },
    components:{
         Edit,
         OriginTable,
         TargetTable,
        },
    mounted(){
        this._reload();
        this._getGetMenuItemTreeList();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

