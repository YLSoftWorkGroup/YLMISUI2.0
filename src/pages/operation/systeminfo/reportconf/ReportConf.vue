<template>
<yl-panelpage :titleName="'报表配置'" >
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
                                    @getCurrentNode="_getCurrentNode"
                            ></yl-menuItemTree>  
                        </el-form-item>
                        <el-form-item class="form-content-vertical">
                        <el-input  placeholder="页面名称" size="small" style="width:200px" v-model="searchModel.pageName"></el-input>
                        </el-form-item>
                        <el-form-item class="form-content-vertical">
                            <el-button type="primary" icon="search" size="small"  @click="_reload">查 询</el-button>
                        </el-form-item>
                </el-form>
          </yl-toolbar>
        <yl-toolbar>
            <el-button-group>
                    <el-button type="primary"    icon="plus" size="small"  @click="_add" >添加</el-button>
                    <el-button type="primary"    icon="edit"  size="small" :disabled="selectRows.length===0" @click="_edit">编辑</el-button>
                    <el-button type="danger"     icon="delete" size="small"  :disabled="selectRows.length===0" @click="_delete" >删除</el-button>
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
                    <template slot="isEnable" scope="scope">
                        <el-tag type="primary" v-if="scope.row.isEnable">启用</el-tag>
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
import Edit from './ReportConfEdit';
import fetch from '@/api/fetch';
import util from  '@/common/js/util';
import  {inputModel} from '@/api/inputmodel';
import menuItemTree from '@/ocomponents/menuitem/menuItemTree';
export default {
    data(){
        return {
             tableData: {},
                mainTableLoading:false,
                selectRows:[],
                currentRows:{},
                searchModel:{
                      pageName:'',  
                      menuCode:''
                    },
                addFormVisible:false,
                mainInput:new inputModel(),
                menuItemId:""
            }
    },
     computed: {
             VersionNum:{
                        get(){
                            return util.getLocalStorage('SysGlobConf').versionNum;
                        }
                    },
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
                                {attr: { type: 'index',label: '序号', width:80,align: 'center' }},
                                {attr: { prop: 'extensionTwo', label: '菜单编码', width:120,  } },
                                {attr: { prop: 'pageName', label: '页面编码', width:120,  } },
                                {attr: { prop: 'extensionThere', label: '页面标题', width:120,  } },
                                {attr: { prop: 'versionNum', label: '版本号', width:100, } }, 
                                {attr: { prop: 'isEnable', label: '是否启用', width:80,scopedSlot: 'isEnable', } }, 
                                {attr: { prop: 'sortCode', label: '排序', width:80, } },      
                                {attr: { prop: 'baseInfoConf', label: '基本信息配置'  ,width:150,  } },  
                                {attr: { prop: 'apiConf', label: 'API配置'  ,width:150,  } },  
                                {attr: { prop: 'fliterConf', label: '过滤器配置'  ,width:150,  } },  
                                {attr: { prop: 'tableInfoConf', label: '表格配置'  ,width:150,  } },  
                                {attr: { prop: 'functionConf', label: '功能配置'  ,width:150,  } },
                                 {attr: { prop: 'formConf', label: '其他配置'  ,width:150,  } },    
                                {attr: { prop: 'createTime', label: '更新时间', width:150, } }, 
                                {attr: { prop: 'pushPerson', label: '推送人', width:120, } }, 
                                {attr: { prop: 'lastPushTime', label: '上次推送时间', width:120, } }, 
                                {attr: { prop: 'pullPerson', label: '拉取人', width:120, } }, 
                                {attr: { prop: 'lastPullTime', label: '上次拉取时间', width:120, } }, 
                            ]
                        }
                    }
                }
        },
    methods:{
        _getCurrentNode(node){
            this.searchModel.menuCode=node.funcCode;
        },
        _clear(){
            this.searchModel.menuCode='';
        },
        _getMainPageList(){
                var _this=this;
                this.selectRows=[];
                this.mainTableLoading=true; //开启加载
                var inputArr=[ 
                                 {key:"VersionNum",op:"EQ",value:this.VersionNum},
                               
                             ];
                if(this.searchModel.pageName!==''){
                     inputArr.push( {key:"PageName",op:"EQ",value:this.searchModel.pageName})
                }
                if(this.searchModel.menuCode!==''){
                     inputArr.push({key:"ExtensionTwo",op:"EQ",value:this.searchModel.menuCode})
                }
                this.mainInput.addqueryConditionItem(inputArr);
                this.mainInput.inputModel.sorting="createTime DESC"
                fetch({
                    url:'/api/services/app/reportConf/getMainPageList',
                    method:'post',
                    data:this.mainInput.inputModel
                }).then(data =>{
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
                fetch({
                    url:'/api/services/app/reportConf/deleteMainObject',
                    method:'post',
                    data:obj
                }).then(data =>{
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
    components:{
        'yl-menuItemTree':menuItemTree,
        Edit
    },
    mounted(){
        this._reload();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

