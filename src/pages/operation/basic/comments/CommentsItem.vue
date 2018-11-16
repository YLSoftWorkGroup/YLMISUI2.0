<template>
<div>
    <yl-layout :border="true">
        <div slot="fristbox" >
          <yl-toolbar>
                <el-form  :inline="true"  >
                         <el-form-item class="form-content-vertical">
                            <el-date-picker v-model="searchModel.commentTime"  style="width:120px" type="date" size="small" :editable="false" placeholder="请选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item class="form-content-vertical">
                            <el-input  placeholder="用户名称" size="small" style="width:150px" v-model="searchModel.sV_Col3"></el-input>  
                        </el-form-item>
                        <el-form-item class="form-content-vertical">
                            <el-input  placeholder="回帖内容" size="small" style="width:200px" v-model="searchModel.comment"></el-input>  
                        </el-form-item>
                        <el-form-item class="form-content-vertical">
                            <el-button type="primary" icon="search" size="small"  @click="_reload">查 询</el-button>
                        </el-form-item>
                </el-form>
          </yl-toolbar>
        <yl-toolbar>
            <el-button-group>
                    <el-button type="danger"  v-permissionSetting="'Comments.Delete'"   icon="delete" size="small"  :disabled="selectRows.length===0" @click="_delete" >删除</el-button>
                </el-button-group>
        </yl-toolbar>
        </div>
         <div slot="secondbox" class="flexbox" style="height:420px">
                <yl-table ref="table"
                    @reload="_reload"
                    @current-change="_currentChange"
                    :configs="tableConfig" 
                    :input="mainInput.inputModel"
                    :tableloading="mainTableLoading" 
                    >
                    <template slot="content" scope="scope"> 
                                    <div class="yl-table-icon">  
                                        <i class="icon-eye3 yl-text-color"  @click="_viewContent(scope.row)" ></i>
                                    </div>
                   </template> 
                </yl-table>
         </div>
    </yl-layout>
    <!--回复内容-->
         <el-dialog ref="mainDialog" title="文档详情" v-model="addFormVisible1" size="small"    top="10%" 
                    :modal-append-to-body="false" :close-on-click-modal="false"  >
                    <div v-if="addFormVisible1" v-html="content" style="overflow:auto"  class="w-e-text"></div>
         </el-dialog>
 </div>
</template>

<script type="text/babel">
import  {inputModel} from '@/api/inputmodel';
import {
            requestGetCommentPageList,
            requestDeleteComment
        }   from '@/api/comments';

export default {
    data(){
        return {
             tableData: {},
                mainTableLoading:false,
                selectRows:[],
                currentRows:{},
                searchModel:{
                     itemCode:'',  
                     sV_Col3:'',  
                     sI_Col1:'',
                     comment:'',
                     category:'',
                     commentTime: new Date(),
                     id:'',
                    },
                addFormVisible:false,
                addFormVisible1:false,
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
                                {attr: { type: 'index',label: '序号', width:80, align: 'center', headerAlign: 'center' }},
                                {attr: { prop: 'comment', label: '回复内容', width:80,scopedSlot:"content",align: 'center', headerAlign: 'center' } },   
                                {attr: { prop: 'sV_Col3', label: '回帖人', width:150,} },   
                                {attr: { prop: 'commentTime', label: '回帖时间', width:240,  } },   
                                {attr: { prop: 'sortCode', label: '排序', } },
                            ]
                        }
                    }
                }
        },
   props:{
        selectRow:{},
        isVisible:false
    },
    methods:{
         _viewContent(val){
            this.addFormVisible1=true;
            this.content=val.comment;
            this.category=val.category;
        },
        _getCommentPageList(){
                var _this=this;
                this.selectRows=[];
                this.mainTableLoading=true; //开启加载
                var inputArr=[ 
                              {key:"ParentId",op:"EQ",value:this.selectRow.id},
                              {key:"SV_Col3",op:"LIKE",value:this.searchModel.sV_Col3},
                              {key:"Comment",op:"LIKE",value:this.searchModel.comment},
                              {key: "CommentTime", op: "LIKE", value:this.formatDate(this.searchModel.commentTime,"YYYY-MM-DD") },
                              
                             ];
                this.mainInput.addqueryConditionItem(inputArr);
                requestGetCommentPageList(this.mainInput.inputModel).then(data =>{
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
            this._getCommentPageList();
        },
        _delete(){
            this.$confirm('确认要删除所选项目吗?', '提示', {
                type: 'warning',
                modal:false
            }).then(() => {
                var obj={}; 
                obj.id=this.selectRows[0].id;
                requestDeleteComment(obj).then(data =>{
                        if(data.success){
                                this._reload();
                                this.$notify({
                                    title: '成功',
                                    message: '删除数据成功！',
                                    type: 'success',
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
        },
    mounted(){
        this._reload();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

