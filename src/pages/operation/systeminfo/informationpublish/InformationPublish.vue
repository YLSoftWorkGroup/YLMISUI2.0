<template>
<yl-panelpage :titleName="'信息发布'" :reloadisShow="false" :fullscreenisShow="true" >
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
                    <el-button-group>
                            <el-button type="primary" v-permissionSetting="'InformationPublishs.Create'"   icon="plus" size="small"  @click="_add" >添加</el-button>
                            <el-button type="primary" v-permissionSetting="'InformationPublishs.Edit'"   icon="edit"  size="small" :disabled="selectRows.length===0" @click="_edit">编辑</el-button>
                            <el-button type="danger"  v-permissionSetting="'InformationPublishs.Delete'"   icon="delete" size="small"  :disabled="selectRows.length===0" @click="_delete" >删除</el-button>
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
                              <template slot="clickTimes" scope="scope"> 
                                   <el-tag type="primary">{{scope.row.clickTimes}}</el-tag>
                               </template>     
                        </yl-table>
                </div>
            </yl-layout>
        </div>
    </yl-columnlay>
    <!--编辑界面-->
         <el-dialog ref="mainDialog" title="编辑" v-model="addFormVisible" size="large"  top="10%" 
                    :modal-append-to-body="false" :close-on-click-modal="false"  >
                    <Edit :selectRow="currentRows" 
                    :selectNode="selectNode"
                     @close="_close"  
                     v-if="addFormVisible"></Edit>
         </el-dialog>
         <el-dialog ref="mainDialog" title="文档详情" v-model="addFormVisible1" size="small"  top="10%" 
                    :modal-append-to-body="false" :close-on-click-modal="false"  >
                    <div v-if="addFormVisible1" v-html="content" style="overflow:auto"  class="w-e-text"></div>
         </el-dialog>
 </div>
</yl-panelpage>
</template>

<script type="text/babel">
import Edit from './InformationPublishEdit';
import  {inputModel} from '@/api/inputmodel';
import {
            requestGetInformationPublishPageList,
            requestDeleteInformationPublish
        }   from '@/api/informationpublish';
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
                menuItemWithPanel:[],
                currentRows:{},
                searchModel:{
                      title:'',  
                    },
                addFormVisible:false,
                addFormVisible1:false,
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
                                {attr: { type: 'index',label: '序号', width:55,align: 'center',headerAlign:'center' }},
                                {attr: { prop: 'moudleName', label: '模块名称', width:120,  } },   
                                {attr: { prop: 'content', label: '预览', width:50,scopedSlot:"content"  } },   
                                {attr: { prop: 'clickTimes', label: '点击次数', width:80,scopedSlot:"clickTimes"  } },   
                                {attr: { prop: 'useful', label: '有帮助', width:80,  } },   
                                {attr: { prop: 'unUseful', label: '无帮助', width:80,  } },  
                                {attr: { prop: 'creationTime', label: '添加时间', width:120,  } }, 
                                {attr: { prop: 'creatorUserName', label: '添加人', width:120,  } },
                                {attr: { prop: 'LastModificationTime', label: '修改时间', width:120,  } }, 
                                {attr: { prop: 'LastModifierUserName', label: '修改人', width:120,  } },
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
        _getInformationPublishPageList(){
                var _this=this;
                this.selectRows=[];
                this.mainTableLoading=true; //开启加载
                var inputArr=[ 
                               {key:"MoudleName",op:"EQ",value:this.selectNode.text},
                             ];
                this.mainInput.addqueryConditionItem(inputArr);
                requestGetInformationPublishPageList(this.mainInput.inputModel).then(data =>{
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
            this._getInformationPublishPageList();
        },
        _add(){
            if(this.selectNode.id!=undefined){
                this.addFormVisible=true;
                this.currentRows={};
            }else{
                this.$message.warning('请选择模块！');
            }
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
                requestDeleteInformationPublish(obj).then(data =>{
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
        _viewContent(val){
            this.addFormVisible1=true;
            this.content=val.content;
            this.title=val.title;
        }

    },
    components:{
         Edit,
         'yl-menuItemTreeWithPanel':menuItemTreeWithPanel,
        },
    mounted(){
        this._reload();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

