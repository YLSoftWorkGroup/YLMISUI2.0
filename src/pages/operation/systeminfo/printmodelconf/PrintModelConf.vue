<template>
    <yl-panelpage :titleName="'打印模板库管理'" >
        <div slot="content">
            <yl-layout>
                <div slot="fristbox" >
                    <yl-toolbar>
                        <el-form  :inline="true"  >
                            <el-form-item class="form-content-vertical">
                                <el-input  placeholder="模板名称" size="small" style="width:200px" v-model="searchModel.confName"></el-input>
                            </el-form-item>
                            <el-form-item class="form-content-vertical">
                            <el-input  placeholder="版本号" size="small" style="width:120px" v-model="searchModel.versionNum"></el-input>
                        </el-form-item>
                            <el-form-item class="form-content-vertical">
                                <el-button type="primary" icon="search" size="small"  @click="_reload">查 询</el-button>
                            </el-form-item>
                        </el-form>
                    </yl-toolbar>
                    <yl-toolbar>
                            <el-button-group>
                                <el-button type="primary"  v-permissionSetting="'SingleTable76s.Create'"   icon="plus" size="small"   @click="_add" >添加</el-button>
                                <el-button type="primary" v-permissionSetting="'SingleTable76s.Edit'"   icon="edit"  size="small" :disabled="selectRows.length===0" @click="_edit">修改</el-button>
                                <el-button type="danger"  v-permissionSetting="'SingleTable76s.Delete'"   icon="delete" size="small"  :disabled="selectRows.length===0" @click="_delete" >删除</el-button>
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
                          <template slot="b_Col26" scope="scope">
                                <el-tag type="primary" v-if="scope.row.b_Col26">启用</el-tag>
                                <el-tag type="danger" v-else>禁用</el-tag>
                            </template>
                    </yl-table>
                </div>
            </yl-layout>
            <el-dialog ref="mainDialog" title="编辑" v-model="addFormVisible" size="large"  top="10%" 
                    :modal-append-to-body="false" :close-on-click-modal="false">
                <Edit :selectRow="currentRows" @close="_close"  v-if="addFormVisible"></Edit>
            </el-dialog>
        </div>
    </yl-panelpage>
</template>

<script type="text/babel">
import  {inputModel} from '@/api/inputmodel';
import Edit from './PrintModelConfEdit';
import util from  '@/common/js/util';
import fetch from '@/api/fetch';
export default {
    data(){
        return{
             tableData: {},
                mainTableLoading:false,
                selectRows:[],
                currentRows:{},
                addFormVisible:false,
                mainInput:new inputModel(),
                searchModel:{
                    confName:'',
                    versionNum:""
                }
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
                                {attr: { type: 'index',label: '序号', width:55,align: 'center',headerAlign:'center' }},
                                {attr: { prop: 'v_Col6', label: '模板名称', width:220,  } }, 
                                {attr: { prop: 'v_Col24', label: '配置信息', width:180,  } },  
                                {attr: { prop: 'v_Col9', label: '版本号', width:100  } } ,
                                {attr: { prop: 'b_Col26', label: '是否启用', width:70,scopedSlot: 'b_Col26', } }, 
                                {attr: { prop: 'v_Col10', label: '更新时间', width:150, } }, 
                                {attr: { prop: 'v_Col7', label: '备注信息'  } },  
                            ]
                        }
                    }
                }
        },
    methods:{
        _getPageList(){
                var _this=this;
                this.selectRows=[];
                this.mainTableLoading=true; //开启加载
                var inputArr=[ 
                              {key:"V_Col6",op:"LIKE",value:this.searchModel.confName},
                             ];
                if(this.searchModel.versionNum===''){
                    this.searchModel.versionNum=this.VersionNum;
                }
                inputArr.push({key:"V_Col9",op:"EQ",value:this.searchModel.versionNum});
                this.mainInput.addqueryConditionItem(inputArr);
                this.mainInput.inputModel.sorting="v_Col7 DESC"
                fetch({
                    url:"api/services/app/singleTable76/getMainPageList",
                    method:"post",
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
                    url:"api/services/app/singleTable76/deleteMainObject",
                    method:"post",
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
            })
        },
        _reload(){
            this._getPageList();
        },
        _currentChange(val){
                //单选时的方法
                if(val!=null){
                     this.selectRows=[];
                     this.selectRows.push(val);
                }
               
        },
        _close(){
                this.addFormVisible=false;
        },
    },
    components:{
        Edit
    },
    mounted(){
        this._reload();
    },
    watch:{
        addFormVisible:function(n,o){
            if(!n){
                 this._reload();
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
