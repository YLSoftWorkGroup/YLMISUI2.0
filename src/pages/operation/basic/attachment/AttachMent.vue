<template>
<yl-panelpage :titleName="'附件管理'" >
<div slot="content">
    <yl-layout>
        <div slot="fristbox" >
          <yl-toolbar>
                <el-form  :inline="true"  >
                         <el-form-item class="form-content-vertical">
                         <el-input  placeholder="附件名称" size="small" style="width:150px" 
                         v-model="searchModel.attachName"></el-input>
                         </el-form-item>
                          <el-form-item class="form-content-vertical">
                                <yl-menuItemTree  
                                    placeholder="请选择模块" 
                                    size="small" 
                                    style="width:150px" 
                                    v-model="searchModel.menuItemId"
                                    @getCurrentNode="_handleNodeClick"
                               ></yl-menuItemTree> 
                         </el-form-item>
                         
                        <el-form-item class="form-content-vertical">
                            <el-button type="primary" icon="search" size="small"  @click="_reload">查 询</el-button>
                        </el-form-item>
                </el-form>
          </yl-toolbar>
        <yl-toolbar>
            <el-button-group>
                    <el-button type="primary" v-permissionSetting="'AttachMents.Create'"   icon="plus" size="small"    @click="_add" >添加</el-button>
                    <el-button type="primary" v-permissionSetting="'AttachMents.Edit'"   icon="edit"  size="small"     :disabled="selectRows.length===0" @click="_edit">编辑</el-button>
                    <el-button type="danger"  v-permissionSetting="'AttachMents.Delete'"   icon="delete" size="small"  :disabled="selectRows.length===0" @click="_delete" >删除</el-button>
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
                     <template slot="view1" scope="scope">
                                        <div class="yl-table-icon">
                                            <i class="icon-download3 yl-text-color" @click="_download(scope.row)"></i>
                                        </div>
                       </template>
                   <!--自定义列模板
                        <template slot="isDisable" scope="scope">
                            <el-tag type="primary" v-if="scope.row.showFlag">启用</el-tag>
                            <el-tag type="danger" v-else>禁用</el-tag>
                        </template>
                        -->
                </yl-table>
         </div>
    </yl-layout>
    <!--编辑界面-->
         <el-dialog ref="mainDialog" title="编辑" v-model="addFormVisible" size="small"  top="10%" 
                    :modal-append-to-body="false" :close-on-click-modal="false"  >
                    <Edit :selectRow="currentRows" @close="_close"  v-if="addFormVisible"></Edit>
         </el-dialog>
 </div>
</yl-panelpage>
</template>

<script type="text/babel">
import Edit from './AttachMentEdit';
import  {inputModel} from '@/api/inputmodel';
import {
            requestGetAttachMentPageList,
            requestDeleteAttachMent
        }from '@/api/attachment';
import menuItemTree from '@/ocomponents/menuitem/menuItemTree';
export default {
    data(){
      return {
             tableData: {},
                mainTableLoading:false,
                selectRows:[],
                currentRows:{},
                searchModel:{
                       attachName:'', 
                       menuCode:'',
                       menuItemId:'' 
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
                                {attr: { type: 'index',label: '序号', width:55,align: 'center',headerAlign:'center' }},
                                 {attr: {prop: "attachUrl",label: "下载",width: 65,align: "center",scopedSlot: "view1",showOverflowTooltip: false}},
                                {attr: { prop: 'attachName', label: '名称', width:120,  } },   
                                {attr: { prop: 'attachModule', label: '模块', width:120,  } },   
                                {attr: { prop: 'attachUrl', label: '附件路径', width:160,  } },   
                                {attr: { prop: 'attachSize', label: '附件大小', width:120,  } },   
                                {attr: { prop: 'attachType', label: '附件类型', width:120,  } },   
                                {attr: { prop: 'creatorUserName', label: '添加人',   width:120,} }, 
                                {attr: { prop: 'creationTime', label: '添加时间',  width:120, } }, 
                                {attr: { prop: 'lastModifierUserName', label: '修改人',   width:120,} }, 
                                {attr: { prop: 'lastModificationTime', label: '修改时间',  width:120, } },
                                {attr: { prop: 'sO_Col12', label: '单据主键',  width:120, } },  
                                {attr: { prop: 'remark', label: '附件备注',  } },   
                            ]
                        }
                    }
                }
        },
   methods:{
        _getAttachMentPageList(){
               //var _this=this;
                this.selectRows=[];
                this.mainTableLoading=true; //开启加载
                var inputArr=[ 
                               {key:"AttachName",op:"LIKE",value:this.searchModel.attachName},
                             ];
                if(this.searchModel.menuCode!=""){
                    inputArr.push({key:"AttachModule",op:"EQ",value:this.searchModel.menuCode})
                }           
                this.mainInput.addqueryConditionItem(inputArr);
                requestGetAttachMentPageList(this.mainInput.inputModel).then(data =>{
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
            this._getAttachMentPageList();
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
                requestDeleteAttachMent(obj).then(data =>{
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
        _download(row){
            window.location.href=window.getClientObj().sysConf.url+'/api/Upload/DownLoadFile?fileName='+row.attachUrl
        },
        _handleNodeClick(node){
            if(node.funcCode!=null){
                this.searchModel.menuCode=node.funcCode;
            }else{
                this.searchModel.menuCode='';
            }
        }
    },
    components:{
         Edit,
         'yl-menuItemTree':menuItemTree
        },
    mounted(){
        this._reload();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
