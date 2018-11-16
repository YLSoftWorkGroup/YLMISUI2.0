<template>
    <yl-panelpage :titleName="'单据菜单管理'" >
        <div slot="content"> 
         <yl-columnlay>
            <div slot="left"  >
                            <yl-commontreewithpanel 
                                titleName="单据菜单"
                                code="reportorderconf"
                                @getCurrentNode="_handleNodeClick"
                            >
                            </yl-commontreewithpanel>
                </div>
             <div slot="right" >
                 <yl-layout >
                <div slot="fristbox" >
                    <yl-toolbar>
                        <el-form  :inline="true"  >
                            <el-form-item class="form-content-vertical">
                                <el-input  placeholder="菜单名称" size="small" style="width:250px" v-model="searchModel.displayName"></el-input>  
                            </el-form-item>
                            <el-form-item class="form-content-vertical">
                                <el-button type="primary" icon="search" size="small"  @click="_reload">查 询</el-button>
                            </el-form-item>
                        </el-form>
                    </yl-toolbar>
                    <yl-toolbar>
                        <el-button-group>
                            <el-button type="primary" icon="plus" size="small" v-permissionSetting="'ReportOrderConfs.Create'"  @click="_add" >添加一级菜单</el-button>
                            <el-button type="primary" icon="plus" size="small" v-permissionSetting="'ReportOrderConfs.Create'"  @click="_add2" >添加二级菜单</el-button>
                            <el-button type="primary" icon="edit"  size="small" v-permissionSetting="'ReportOrderConfs.Edit'"   :disabled="selectRows.length===0" @click="_edit">编辑</el-button>
                            <el-button type="danger"  icon="delete" size="small" v-permissionSetting="'ReportOrderConfs.Delete'" :disabled="selectRows.length===0"  @click="_delete" >删除</el-button>
                          </el-button-group>
                    </yl-toolbar>
                </div>
                <div slot="secondbox" class="flexbox">
                    <yl-table ref="table"
                        @reload="_reload"
                        @current-change="_currentChange"
                        @selection-change="_selectionChange"
                        @row-click="toggleRowSelection"
                        :configs="tableConfig" 
                        :input="mainInput.inputModel"
                        :tableloading="mainTableLoading" 
                        >
                         <template slot="b_Col17" scope="scope">
                                    <el-tag type="primary" v-if="scope.row.b_Col17">是</el-tag>
                                    <el-tag type="danger" v-else>否</el-tag>
                         </template>
                    </yl-table>
                </div>
                </yl-layout>
                </div>
         </yl-columnlay>
            <!--编辑界面-->
                <el-dialog ref="mainDialog" title="编辑" 
                    v-model="addFormVisible" 
                    size="small"  top="8%" 
                    :modal-append-to-body="false" 
                    :close-on-click-modal="false"  >
                 <Edit :selectRow="currentRows" 
                        @close="_close"  
                        v-if="addFormVisible"></Edit>
            </el-dialog>

             <!--编辑界面2-->
                <el-dialog ref="mainDialog2" title="编辑" 
                    v-model="addFormVisible2" 
                    size="normal"  top="8%" 
                    :modal-append-to-body="false" 
                    :close-on-click-modal="false"  >
                 <Edit2 
                    @close="_close"  
                    v-if="addFormVisible2"></Edit2>
            </el-dialog>
        </div>
    </yl-panelpage>
</template>

<script type="text/babel">
import Edit from './ReportOrderConfEdit';
import Edit2 from './ReportOrderConfEditTwo';
import  {inputModel} from '@/api/inputmodel';
import util from '@/common/js/util';
import fetch from '@/api/fetch';
export default {
    data(){
        return {
             tableData: {},
                mainTableLoading:false,
                selectRows:[],
                currentRows:{},
                searchModel:{
                      displayName:'',  
                    },
                addFormVisible:false,
                addFormVisible2:false,
                mainInput:new inputModel(),
                selectNode:{id:this.guidOfNull()},
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
                               {attr: { type: 'selection',label: '选择', width:55,align: 'center' ,"headerAlign": "center" }},
                                {attr: { prop: 'v_Col6', label: '菜单名称', width:150,  } }, 
                                {attr: { prop: 'v_Col11', label: '单据名称', width:150,  } }, 
                                {attr: { prop: 'b_Col17', label: '子节点', width:60, scopedSlot: 'b_Col17', } },   
                                {attr: { prop: 'sortCode', label: '排序'} },
                            ]
                        }
                    }
                }
        },
    methods:{
        _getPageList(){
                this.selectRows=[];
                this.mainTableLoading=true; //开启加载
                var inputArr=[ 
                              {key:"V_Col6",op:"LIKE",value:this.searchModel.displayName},
                              {key:"O_Col26",op:"EQ",value:this.selectNode.id}
                             ];
                this.mainInput.addqueryConditionItem(inputArr);
                fetch({
                    url:"/api/services/app/reportorderconf/getMainPageList",
                    method:"post",
                    data:this.mainInput.inputModel
                }).then(data =>{
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
            this._getPageList();
        },
        _add(){
            this.addFormVisible=true;
            this.currentRows={};
        },
        _add2(){
            this.addFormVisible2=true;
            this.currentRows={};
        },
        _edit(){
                this.addFormVisible=true;
                this.currentRows=this.selectRows[0];
        },
        delete(id){
               var obj={}; 
                obj.id=id;
                return new Promise(function (resolve, reject){
                    fetch({
                            url:"/api/services/app/reportorderconf/deleteMainObject",
                            method:"post",
                            data:obj
                        }).then(data =>{
                            if(data.success){
                                    resolve(true);
                                }
                            else {
                                 reject(new Error('删除信息失败！'+err))
                            }
                    }).catch((err)=>{ reject(new Error('删除信息异常！'+err))});
               })
        },
       async _delete(){
            this.$confirm('确认要删除所选项目吗?', '提示', {
                type: 'warning'
            }).then(async() => {
                let resultCount=0,isflag=false;
                for(let item of this.selectRows){
                    isflag=await this.delete(item.id);
                    if(isflag){ resultCount++; }
                } 
                this._reload();
                this.$notify({
                        title: '成功',
                        message: '成功删除【'+resultCount+'】条数据！',
                        type: 'success'
                    });
            }).catch(()=>{})
        },
        _handleNodeClick(result, resolve) {  
                    //点击加载 
                    this.selectNode=result;
                    this._reload();
                }, 
        _close(){
                this.addFormVisible=false;
                this.addFormVisible2=false;
                this._reload();
        },   
    },
    components:{
         Edit,
         Edit2
        },
    mounted(){
        this._reload();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

