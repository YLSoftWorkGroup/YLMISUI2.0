<template>
<yl-panelpage :titleName="this.getMenuInfo().menuFullName" >
<div slot="content">
    <yl-layout>
        <div slot="fristbox" >
          <yl-toolbar>
                <el-form  :inline="true"  >
                        <el-form-item class="form-content-vertical">
                            <el-input  placeholder="系统名称" size="small" style="width:200px" v-model="searchModel.appName"></el-input>
                        </el-form-item>
                        <el-form-item class="form-content-vertical">
                            <el-button type="primary" icon="el-icon-search" size="small"   @click="_reload">查 询</el-button>
                        </el-form-item>
                </el-form>
          </yl-toolbar>
        <yl-toolbar>
            <el-button-group>
                    <el-button type="primary" icon="plus" size="small"  @click="_add" >添加</el-button>
                    <el-button type="primary" icon="edit"  size="small" :disabled="selectRows.length===0" @click="_edit">编辑</el-button>
                    <el-button type="danger"  icon="delete" size="small"  :disabled="selectRows.length===0" @click="_delete" >删除</el-button>
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
                         <template slot="isDisplay" scope="scope">
                            <el-tag type="danger" v-if="!scope.row.isDisplay">隐藏</el-tag>
                            <el-tag type="primary" v-else>可见</el-tag>
                        </template>
                        <template slot="isDisable" scope="scope">
                            <el-tag type="danger" v-if="scope.row.isDisable">禁用</el-tag>
                            <el-tag type="primary" v-else>启用</el-tag>
                        </template>
                        <template slot="appIcon" scope="scope">
                            <el-tooltip :content="scope.row.appIcon" placement="top">
                            <i :class="scope.row.appIcon"></i>
                            </el-tooltip>
                        </template>
                </yl-table>
         </div>
    </yl-layout>
    <!--编辑界面-->
         <el-dialog ref="mainDialog" title="编辑" :visible.sync="addFormVisible" width="45%"  top="10%" 
                    :modal-append-to-body="false" :close-on-click-modal="false"  >
                    <Edit :selectRow="currentRows" @close="_close"  v-if="addFormVisible"></Edit>
         </el-dialog>
 </div>
</yl-panelpage>
</template>

<script type="text/babel">
import Edit from './MenuAppEdit';
import  {inputModel} from '@/api/inputmodel';
import {
            requestGetMenuAppPageList,
            requestDeleteMenuApp
        }   from '@/api/menuapp';
export default {
    data(){
        return {
             tableData: {},
                mainTableLoading:false,
                selectRows:[],
                currentRows:{},
                searchModel:{
                       appName:'',  
                    },
                addFormVisible:false,
                mainInput:new inputModel(),
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
                                    size:"small"
                                }
                            },
                            columns: [
                                {attr: { type: 'index',label: '序号', width:50,align: 'center',headerAlign:'center' }},
                                {attr: { prop: 'appCode', label: '系统代码', width:100,  } },
                                {attr: { prop: 'appName', label: '系统名称', width:150, } },
                                {attr: { prop: 'appDescription', label: '系统描述'} },
                                {attr: { prop: 'appUrl', label: '系统配置',     width:120} },
                                {attr: { prop: 'pessionCode', label: '功能编码',     width:150} },
                                {attr: { prop: 'appIcon',label: '图标', width:60,scopedSlot: 'appIcon',align: 'center',headerAlign:'center' } },
                                {attr: { prop: 'sortCode', label: '排序', width:60,align: 'center',headerAlign:'center'} },
                                {attr: { prop: 'isDisplay', label: '是否可见', width:70 ,scopedSlot: 'isDisplay'} },
                                {attr: { prop: 'isDisable', label: '状态', width:70 ,scopedSlot: 'isDisable',} },    
                            ]
                        }
                    }
                }
        },
    methods:{
        _getMenuPageList(){
                this.selectRows=[];
                this.mainTableLoading=true; //开启加载
                var inputArr=[ 
                               {key:"AppName",op:"LIKE",value:this.searchModel.appName},
                             ];
                this.mainInput.addqueryConditionItem(inputArr);
                requestGetMenuAppPageList(this.mainInput.inputModel).then(data =>{
                            if(data.success){
                                this.tableData=data.result;
                                }
                            else {
                                   this.$message.error('获取数据失败！'+data.error.message);
                            }
                          this.mainTableLoading=false;
                }).catch(function(error){
                       this.mainTableLoading=false;
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
            this._getMenuPageList();
        },
        _add(){
            this.addFormVisible=true;
            this.currentRows={};
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
                requestDeleteMenuApp(obj).then(data =>{
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
                this._reload();
        },

    },
    components:{
         Edit,
        },
    mounted(){
        this._reload();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
