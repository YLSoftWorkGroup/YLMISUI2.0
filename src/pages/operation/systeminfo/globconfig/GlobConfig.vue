<template>
<yl-panelpage :titleName="'配置模块'" >
<div slot="content">
    <yl-layout>
        <div slot="fristbox" >
          <yl-toolbar>
                <el-form  :inline="true"  >
                        <el-form-item class="form-content-vertical">
                        <el-input  placeholder="配置名称" size="small" style="width:200px" v-model="searchModel.name"></el-input>
                        </el-form-item>
                        <el-form-item class="form-content-vertical">
                            <el-button type="primary" icon="search" size="small"  @click="_reload">查 询</el-button>
                        </el-form-item>
                </el-form>
          </yl-toolbar>
        <yl-toolbar>
            <el-button-group>
                    <el-button type="primary"   icon="plus" size="small"  @click="_add" >添加</el-button>
                    <el-button type="primary"   icon="edit"  size="small" :disabled="selectRows.length===0" @click="_edit">编辑</el-button>
                    <el-button type="danger"    icon="delete" size="small"  :disabled="selectRows.length===0" @click="_delete" >删除</el-button>
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
                    <template slot="sB_Col8" scope="scope">
                        <el-tag type="primary" v-if="scope.row.sB_Col8">启用</el-tag>
                        <el-tag type="danger" v-else>禁用</el-tag>
                    </template>
                </yl-table>
         </div>
    </yl-layout>
    <!--编辑界面-->
         <el-dialog ref="mainDialog" title="编辑" v-model="addFormVisible" size="large"  top="10%" 
                    :modal-append-to-body="false" :close-on-click-modal="false"  >
                    <Edit :selectRow="currentRows" @close="_close"  v-if="addFormVisible"></Edit>
         </el-dialog>
 </div>
</yl-panelpage>
</template>

<script type="text/babel">
import Edit from './GlobConfigEdit';
import  {inputModel} from '@/api/inputmodel';
import {
            requestgetMainPageList,
            requestdeleteMainObject
        }   from '@/api/globconfig';

export default {
    data(){
        return {
             tableData: {},
                mainTableLoading:false,
                selectRows:[],
                currentRows:{},
                searchModel:{
                      name:'',  
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
                                }
                            },
                            columns: [
                                {attr: { type: 'index',label: '序号', width:80,width:55,align: 'center',headerAlign:'center'}},
                                {attr: { prop: 'name', label: '名称', width:160,  } },
                                {attr: { prop: 'remark', label: '说明', width:160, } }, 
                                {attr: { prop: 'sB_Col8', label: '是否启用', width:80,scopedSlot: 'sB_Col8', } }, 
                                {attr: { prop: 'sortCode', label: '排序',width:55,align: 'center',headerAlign:'center'} },      
                                {attr: { prop: 'describe', label: '内容配置'  ,width:220,  } }, 
                                 {attr: { prop: 'sV_Col6', label: '界面配置'  } },   
                            ]
                        }
                    }
                }
        },
    methods:{
        _getMainPageList(){
                var _this=this;
                this.selectRows=[];
                this.mainTableLoading=true; //开启加载
                var inputArr=[ 
                               {key:"Name",op:"LIKE",value:this.searchModel.name},
                             ];
                this.mainInput.addqueryConditionItem(inputArr);
                this.mainInput.inputModel.sorting="sortCode"
                requestgetMainPageList(this.mainInput.inputModel).then(data =>{
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
            this._getMainPageList();
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
                obj.permissionType=1;
                requestdeleteMainObject(obj).then(data =>{
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

