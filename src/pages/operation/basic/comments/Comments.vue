<template>
<yl-panelpage :titleName="'评论管理'" :reloadisShow="false" :fullscreenisShow="true" >
<div slot="content">
     <yl-columnlay>
        <div slot="left" >        
            <yl-menuItemTreeWithPanel 
            :highlightCurrent="true"  
            :treeLoading="treeLoading" 
            :reloadIsShow="true"
             @getCurrentNode="_getCrureentNode"  
             style="width:200px"> </yl-menuItemTreeWithPanel>
        </div>
        <div slot="right" >
    <yl-layout>
        <div slot="fristbox" >
          <yl-toolbar>
                <el-form  :inline="true"  >
                        <el-form-item class="form-content-vertical">
                            <el-date-picker v-model="searchModel.commentTime"  style="width:120px" type="date" size="small" :editable="false" placeholder="请选择日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item class="form-content-vertical">
                            <el-input  placeholder="用户名称" size="small" style="width:150px" v-model="searchModel.commentUserName"></el-input>  
                        </el-form-item>
                        <el-form-item class="form-content-vertical">
                            <el-input  placeholder="发帖内容" size="small" style="width:200px" v-model="searchModel.comment"></el-input>  
                        </el-form-item>
                        <el-form-item class="form-content-vertical">
                            <el-button type="primary" icon="search" size="small"  @click="_reload">查 询</el-button>
                        </el-form-item>
                </el-form>
          </yl-toolbar>
        <yl-toolbar>
            <el-button-group>
                    <el-button type="danger"  v-permissionSetting="'Comments.Delete'"   icon="delete" size="small"  :disabled="selectRows.length===0" @click="_delete" >删除</el-button>
                    <el-button type="primary"  icon="plus" size="small"  :disabled="selectRows.length===0"  @click="_addItem" >回复列表</el-button>
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
                    <template slot="content" scope="scope"> 
                                    <div class="yl-table-icon">  
                                        <i class="icon-eye3 yl-text-color"  @click="_viewContent(scope.row)" ></i>
                                    </div>
                   </template> 
                </yl-table>
         </div>
    </yl-layout>
   </div>
    </yl-columnlay>
       
          <el-dialog ref="mainDialog" title="回复列表" v-model="addItemFormVisible"  :modal="false"   size="large"  top="10%" 
                    :modal-append-to-body="false" :close-on-click-modal="false"  >
                    <CommentsItem @close="_closeItem" :selectRow="currentRows" v-if="addItemFormVisible"></CommentsItem>
         </el-dialog>
        <el-dialog ref="mainDialog" title="发送内容" v-model="addFormVisible1" size="small"  top="10%" 
                    :modal-append-to-body="false" :close-on-click-modal="false"  >
                    <div v-if="addFormVisible1" v-html="content" style="overflow:auto"  class="w-e-text"></div>
         </el-dialog>
 </div>
</yl-panelpage>
</template>

<script type="text/babel">
import CommentsItem from './CommentsItem';
import  {inputModel} from '@/api/inputmodel';
import {
            requestGetCommentPageList,
            requestDeleteComment
        }   from '@/api/comments';
import {requestGetMenuItemTreeList}   from '@/api/menuitem';
import menuItemTreeWithPanel from '@/ocomponents/menuitem/menuItemTreeWithPanel'
import treeMixn from '@/mixns/tree.js';
import util from '@/common/js/util';

export default {
    mixins: [treeMixn],
    data(){
        return {
             tableData: {},
                mainTableLoading:false,
                selectRows:[],
                currentRows:{},
                searchModel:{
                     commentUserName:'',  
                     sI_Col1:'',
                     comment:'',
                     category:'',
                     commentTime: new Date(),
                     id:'',
                    },
                treeLoading:false,
                addFormVisible:false,
                addFormVisible1:false,
                addItemFormVisible:false,
                mainInput:new inputModel(),
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
                                {attr: { type: 'index',label: '序号', width:80, align: 'center', headerAlign: 'center' }},
                                {attr: { prop: 'comment', label: '发送内容', width:80,scopedSlot:"content",align: 'center', headerAlign: 'center' } },   
                                {attr: { prop: 'commentModule', label: '模块名称', width:150,} }, 
                                {attr: { prop: 'commentUserName', label: '发帖人', width:150,} },    
                                {attr: { prop: 'commentTime', label: '发帖时间', width:240,  } },   
                                {attr: { prop: 'sortCode', label: '排序', } },
                            ]
                        }
                    }
                }
        },
    methods:{

           _getCrureentNode(node){
            this.selectNode=node;
            this._reload(); 
        },
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
                               {key:"CommentModule",op:"EQ",value:this.selectNode.text},
                               {key:"CommentUserName",op:"LIKE",value:this.searchModel.commentUserName},
                               {key:"Comment",op:"LIKE",value:this.searchModel.comment},
                               {     key: "CommentTime", op: "LIKE", value:this.formatDate(this.searchModel.commentTime,"YYYY-MM-DD") },
                               {key:"SI_Col1",op:"EQ",value:0},
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
       _closeItem(){
           this.addItemFormVisible=false;
           this._reload();
       },
      
           _addItem(){
            this.addItemFormVisible=true;
            this.currentRows=this.selectRows[0];

        },
        _delete(){
            this.$confirm('确认要删除所选项目吗?', '提示', {
                type: 'warning'
            }).then(() => {
                var obj={}; 

                obj.id=this.selectRows[0].id;
                if(obj.id!=''||obj.id!=undefined){
                        requestDeleteComment(obj).then(data =>{
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
                }  
            
            });
        },
        _close(bool){
            if(bool){
                this.addFormVisible=false;
            }
                this._reload();
        },
    },
    components:{
         CommentsItem,
          'yl-menuItemTreeWithPanel':menuItemTreeWithPanel,
        // Edit,
        },
    mounted(){
        this._reload();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>



