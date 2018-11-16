<template>
<div slot="content">
    <yl-layout>
        <div slot="fristbox" >
          <yl-toolbar>
                <el-form  :inline="true"  >
                        <el-form-item class="form-content-vertical">
                      <el-input  placeholder="目标表" size="small" style="width:200px" v-model="searchModel.labourName"></el-input> 
                        </el-form-item>
                        <el-form-item class="form-content-vertical">
                            <el-button type="primary" icon="search" size="small"  @click="_reload">查 询</el-button>
                        </el-form-item>
                </el-form>
          </yl-toolbar>
        <yl-toolbar>
            <el-button-group>
                    <el-button type="primary"  icon="plus" size="small"  v-permissionSetting="'Pages.System.Config.TargetTableInfos.Create'"  @click="_add" >添加</el-button>
                    <el-button type="primary"  icon="edit"  size="small" v-permissionSetting="'Pages.System.Config.TargetTableInfos.Delete'" :disabled="selectRows.length===0" @click="_edit">编辑</el-button>
                    <el-button type="danger"   icon="delete" size="small" v-permissionSetting="'Pages.System.Config.TargetTableInfos.Delete'" :disabled="selectRows.length===0" @click="_delete" >删除</el-button>
                </el-button-group>
        </yl-toolbar>
        </div>
        <div slot="secondbox" class="flexbox" style="height:500px">
            <yl-table ref="table"
                @reload="_reload"
                @current-change="_currentChange"
                :configs="tableConfig" 
                :input="mainInput.inputModel"
                :tableloading="mainTableLoading" 
                >
                <!-- 自定义列模板 -->
                    <template slot="isOnly" scope="scope">
                        <el-tag type="primary" v-if="scope.row.isOnly">是</el-tag>
                        <el-tag type="danger" v-else>否</el-tag>
                    </template>
                    <template slot="isCompute" scope="scope">
                        <el-tag type="primary" v-if="scope.row.isCompute">是</el-tag>
                        <el-tag type="danger" v-else>否</el-tag>
                    </template>
                    <template slot="unAuditIsCompute" scope="scope">
                        <el-tag type="primary" v-if="scope.row.unAuditIsCompute">是</el-tag>
                        <el-tag type="danger" v-else>否</el-tag>
                    </template>
                     <template slot="computeType" scope="scope">
                        <div v-for="(item,index) in computeTypesa" :key="index">
                            <el-tag :type="item.type" v-if="scope.row.computeType==item.value">{{item.text}}</el-tag>
                        </div>
                    </template>
                     <template slot="unAuditComputeType" scope="scope">
                        <div v-for="(item,index) in computeTypesa" :key="index">
                            <el-tag :type="item.type" v-if="scope.row.unAuditComputeType==item.value">{{item.text}}</el-tag>
                        </div>
                    </template>
            </yl-table>
        </div>
    </yl-layout>
    <!--编辑界面-->
          <el-dialog ref="mainDialog" title="编辑" v-model="addFormVisible" size="small"  top="10%" 
                    :modal-append-to-body="false" :close-on-click-modal="false"  >
                     <Edit :selectRow="currentRows" :tbselectRow="tselectRow" @close="_close"  v-if="addFormVisible"></Edit> 
         </el-dialog> 
 </div>
</template>

 <script type="text/babel">
import  {inputModel} from '@/api/inputmodel';
import Edit from './TargetTableEdit';
import {
            requestGetTargetTableInfoPageList,
            requestDeleteTargetTableInfo
        }   from '@/api/targettableinfo';
export default {
    data(){
        return{
            tableData: {},
                mainTableLoading:false,
                selectRows:[],
                currentRows:{},
                searchModel:{
                    labourName:'',  
                    },
                addFormVisible:false,
                mainInput:new inputModel(),
                computeTypesa:[//0判断唯一性列（不变） 1覆盖 2累加 3 newid() 4文本，使用 5 累减
                {text:'0判断唯一性列（不变）',value:0,type:'danger'},
                {text:'1覆盖',value:1,type:'success'},
                {text:'2累加',value:2,type:'primary'},
                {text:'3newid()',value:3,type:'warning'},
                {text:'4文本，使用',value:4,type:'warning'},
                {text:'5累减',value:5,type:'primary'}
            ],
            
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
                                {attr: { type: 'index',label: '序号', width:80,align: 'center' }},
                                {attr: { prop: 'tableName', label: '表名', width:120,  } },   
                                {attr: { prop: 'itemTableName', label: '明细表', width:120,  } },   
                                {attr: { prop: 'targetTableName', label: '目标表', width:120,  } },   
                                {attr: { prop: 'itemColName',label: '明细列',width:120,} }, 
                                {attr: { prop: 'targetColName', label: '目标列', width:120,  } },   
                                {attr: { prop: 'colType', label: '列类型', width:120,  } },   
                                {attr: { prop: 'isOnly', label: '唯一', width:50,  scopedSlot:'isOnly'} },   
                                {attr: { prop: 'isCompute', label: '是否计算', width:80,align: 'center',  scopedSlot:'isCompute' } },   
                                {attr: { prop: 'computeType', label: '计算类型',width:100, scopedSlot:'computeType' } }, 
                                {attr: { prop: 'unAuditComputeType', label: '撤销计算类型',width:100 ,align: 'center', scopedSlot:'unAuditComputeType' } }, 
                                {attr: { prop: 'unAuditIsCompute', label: '撤销是否计算',width:100,align: 'center',  scopedSlot:'unAuditIsCompute' } }, 
                                {attr: { prop: 'textValue', label: '默认值',width:80,  } }, 
                                {attr: { prop: 'versionNum', label: '系统版本号', width:130,  } },         
                                {attr: { prop: 'sortCode', label: '排序',width:80,  } },  
                            ]
                        }
                    }
                }
        },
    props:{
        tselectRow:{}
    },
    methods:{
        _getTargetTableInfoPageList(){
                var _this=this;
                this.selectRows=[];
                this.mainTableLoading=true; //开启加载
                var inputArr=[ 
                              {key:"TableName",op:"EQ",value:this.tselectRow.tableName},
                             ];
                this.mainInput.addqueryConditionItem(inputArr);
                this.mainInput.inputModel.sorting='SortCode'
                requestGetTargetTableInfoPageList(this.mainInput.inputModel).then(data =>{
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
        _reload(){
            this._getTargetTableInfoPageList();
        },
        _add(){
            this.addFormVisible=true;
            this.currentRows={};
        },
        _edit(){
                this.addFormVisible=true;
                this.currentRows=this.selectRows[0];
        },
        _currentChange(val){
                //单选时的方法
                if(val!=null){
                     this.selectRows=[];
                     this.selectRows.push(val);
                }
            },
        _delete(){
            this.$confirm('确认要删除所选项目吗?', '提示', {
                type: 'warning'
            }).then(() => {
                var obj={}; 
                obj.id=this.selectRows[0].id;
                requestDeleteTargetTableInfo(obj).then(data =>{
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
        _close(bool){
            if(bool){
                this.addFormVisible=false;
            }
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
