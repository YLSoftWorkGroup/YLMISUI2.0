<template>
<yl-panelpage :titleName="'门户自定义配置'" >
<div slot="content">
    <yl-layout>
        <div slot="fristbox" >
            <yl-toolbar>
                <el-form  :inline="true"  >
                <el-form-item class="form-content-vertical">
                                <el-tag v-if="switchValue"
                                    type="primary"
                                >
                                已设置
                                </el-tag>
                                <el-tag v-if="!switchValue"
                                    type="danger"
                                >
                                    未设置
                                </el-tag> 
                        </el-form-item>
                        <el-form-item class="form-content-vertical">
                            <el-input  
                                    placeholder="服务地址  http://" 
                                    size="small" 
                                    style="width:300px" 
                                    v-model="serviceUrl"
                            ></el-input>   
                        </el-form-item>
                        <el-form-item class="form-content-vertical">
                            <el-button type="success"  
                                :loading="Loading" 
                                size="small"   
                                :disabled="serviceUrl===''" 
                                @click="_getToken" ><i class="icon-alignment-aligned-to"></i>获取Token
                            </el-button> 
                        </el-form-item>
                    </el-form>
            </yl-toolbar> 
          <yl-toolbar>
                <el-form  :inline="true"  >
                        <el-form-item class="form-content-vertical">
                                <yl-roleTree
                                        size="small"
                                        v-model="searchModel.roleId"
                                        @getCurrentNode="_getCurrentNode"
                                ></yl-roleTree>
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
                    <el-button type="primary"    icon="plus" size="small"  @click="_add" >添加</el-button>
                    <el-button type="primary"    icon="edit"  size="small" :disabled="selectRows.length===0" @click="_edit">编辑</el-button>
                    <el-button type="primary"    icon="document"  size="small" :disabled="selectRows.length===0" @click="_copy">拷贝</el-button>
                    <el-button type="danger"     icon="delete" size="small"  :disabled="selectRows.length===0" @click="_delete" >删除</el-button>
                     <!-- <el-button type="primary"    icon="edit"  size="small"  @click="_editdefault">编辑默认门户</el-button> -->
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
                     <template slot="homeType" scope="scope">
                        <el-tag type="primary" v-if="scope.row.homeType==0">PC端</el-tag>
                       <el-tag type="success" v-if="scope.row.homeType==1">手机端</el-tag>
                    </template>
                     <template slot="extensionTwo" scope="scope">
                       <el-tag type="success" v-if="scope.row.extensionTwo==='assemblePage'">assemblePage</el-tag>
                       <el-tag type="warning" v-if="scope.row.extensionTwo==='dynamicPage'">dynamicPage</el-tag>
                    </template>
                    <template slot="operation" scope="scope">
                        <el-button type="danger" size="small" @click="_pull(scope.row)">拉取</el-button>
                        <el-button type="info" size="small"   @click="_push(scope.row)">推送</el-button>
                    </template> 
                </yl-table>
         </div>
    </yl-layout>
    <!--编辑界面-->
         <el-dialog ref="mainDialog" title="编辑" v-model="addFormVisible" size="full"  top="5%" 
                    :modal-append-to-body="false" :close-on-click-modal="false"  >
                    <Edit :selectRow="currentRows" @close="_close" :isCopy="isCopy"  v-if="addFormVisible"></Edit>
         </el-dialog>

    <!--默认门户界面-->
         <el-dialog ref="mainDialog" title="编辑" v-model="addDefaultForm" size="full"  top="5%" 
                    :modal-append-to-body="false" :close-on-click-modal="false"  >
                    <yl-EditDefault :selectRow="currentRows" @close="_close"  v-if="addDefaultForm"></yl-EditDefault>
         </el-dialog>
 </div>
</yl-panelpage>
</template>

<script type="text/babel">
import Edit from './userHomePageConfEdit';
import EditDefault from './DefaultEdit';
import fetch from '@/api/fetch';
import util from  '@/common/js/util';
import  {inputModel} from '@/api/inputmodel';
import roleTree from '@/ocomponents/role/roleTree';
export default {
    data(){
        return {
             tableData: {},
                mainTableLoading:false,
                selectRows:[],
                currentRows:{},
                searchModel:{
                      roleId:'',
                      versionNum:''
                    },
                addFormVisible:false,
                addDefaultForm:false,
                mainInput:new inputModel(),
                menuItemId:"",
                isCopy:false,
                serviceUrl:'',
                Loading:false,
                switchValue:false,
                pullLoading:false,
                pushLoading:false
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
                                {attr: { type: 'index',label: '序号',width:55,align: 'center',headerAlign:'center'}},
                                {attr: { prop: 'id', label: '推送/拉取', width:120, scopedSlot:'operation' } }, 
                                {attr: { prop: 'extensionTwo', label: '门户类型', width:120, scopedSlot:'extensionTwo' } },
                                {attr: { prop: 'roleName', label: '角色名称'  ,width:150,  } },   
                                {attr: { prop: 'versionNum', label: '版本号', width:100, } }, 
                                {attr: { prop: 'homePageConf', label: '门户配置'  ,width:150,  } },  
                                 {attr: { prop: 'homeType', label: '终端'  ,width:80, scopedSlot: 'homeType', } },   
                                {attr: { prop: 'isEnable', label: '是否启用', width:80,scopedSlot: 'isEnable', } },   
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
            this._reload();
        },
        _clear(){
            this.searchModel.menuCode='';
        },
        _getMainPageList(){
                var _this=this;
                this.selectRows=[];
                this.mainTableLoading=true; //开启加载
                if(this.searchModel.versionNum===''){
                    this.searchModel.versionNum=this.VersionNum;
                }
                var inputArr=[ 
                            {key:"VersionNum",op:"EQ",value:this.searchModel.versionNum},
                        ];
                if(this.searchModel.menuCode!==''){
                     inputArr.push({key:"RoleId",op:"EQ",value:this.searchModel.roleId})
                }
                this.mainInput.addqueryConditionItem(inputArr);
                this.mainInput.inputModel.sorting="createTime DESC"
                fetch({
                    url:'/api/services/app/userhomePageConf/GetMainPageList',
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
            this.isCopy=false;
            this.addFormVisible=true;
            this.currentRows={};
        },
        _edit(){
                this.isCopy=false;
                this.addFormVisible=true;
                this.currentRows=this.selectRows[0];
        },
        _copy(){
                this.isCopy=true;
                this.addFormVisible=true;
                this.currentRows=this.selectRows[0];
        },
        _editdefault(){
                this.isCopy=false;
                this.addDefaultForm=true;
        },
        _delete(){
            this.$confirm('确认要删除所选项目吗?', '提示', {
                type: 'warning'
            }).then(() => {
                var obj={}; 
                obj.id=this.selectRows[0].id;
                fetch({
                    url:'/api/services/app/userhomePageConf/DeleteMainObject',
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
                this.addDefaultForm=false;
                this._reload();
        },
         _getToken(){
             fetch( { 
                        url: '/Token',
                        method: 'post',
                        data: "grant_type=client_credentials"
                    },
                    {
                        baseURL:this.serviceUrl,
                        authorization:util.getDefaultToken(),
                        formatData:false
                    }
                ).then(data=>{
                       localStorage.setItem('confAuthorization',"Bearer " +data.access_token);
                       localStorage.setItem('serviceUrl',this.serviceUrl);
                       this.switchValue=true;
                })
        },
         _push(row){
                //推送
                let _this=this;
                if(this.serviceUrl==''){
                      this.$message.warning('服务器地址为空！');
                      return false;
                }
                if(row){
                    _this.currentRows=row;
                }else{
                      this.$message.warning('请选择推送数据对象!');
                      return false;
                }
                _this.pushLoading=true;
                let paramsModel=_this.currentRows;
                    paramsModel.id=''
                    let date=new Date();
                    paramsModel.pushPerson=this.getUserInfo().user.realName;
                    paramsModel.lastPushTime=this.formatDate(date,'YYYY/MM/DD-HH:mm:ss');
                fetch(
                    {
                        url:'/api/services/app/userhomePageConf/Push',
                        method:'post',
                        data:{order:paramsModel}
                    },
                    {
                        baseURL:_this.serviceUrl,
                        authorization:localStorage.getItem('confAuthorization'),
                        formatData:false
                    }
                ).then(data=>{
                         if(data.success){
                                this.$notify({
                                    title: '成功',
                                    message: '推送数据成功！',
                                    type: 'success'
                                    });
                                this._reload();
                            }else{
                                this.$notify({
                                    title: '失败',
                                    message: '推送数据失败！',
                                    type: 'error'
                                    });
                            }
                            _this.pushLoading=false;
                }).catch(e=>{
                     this.$message.error('推送异常！'+e);
                     _this.pushLoading=false;
                });
            },
            _pull(row){
                //拉取
                  let _this=this;
                if(this.serviceUrl==''){
                      this.$message.warning('服务器地址为空！');
                      return false;
                }
                if(row){
                    _this.currentRows=row;
                }else{
                      this.$message.warning('请选择要更新的数据对象!');
                      return false;
                }
                _this.pullLoading=true;
                let params={};
                params.queryConditionItem=[ 
                            {dataField:"RoleId",op:"EQ",dataValue:this.currentRows.roleId},
                            {dataField:"HomeType",op:"EQ",dataValue:this.currentRows.homeType},
                            {dataField:"VersionNum",op:"EQ",dataValue:this.currentRows.versionNum},
                        ];
                fetch(
                    {
                        url:'/api/services/app/userhomePageConf/GetMainObjectForEdit',
                        method:'post',
                        data:params
                    },
                    {
                        baseURL:_this.serviceUrl,
                        authorization:localStorage.getItem('confAuthorization'),
                        formatData:false
                    }
                ).then(data=>{
                    if(data.success){
                        //插入本地
                        let paramsModel=data.result.order;
                        paramsModel.id=''
                        let date=new Date();
                        paramsModel.pullPerson=this.getUserInfo().user.realName;
                        paramsModel.lastPullTime=this.formatDate(date,'YYYY/MM/DD-HH:mm:ss');
                        fetch({
                            url:'/api/services/app/userhomePageConf/Push',
                            method:'post',
                            data:{order:paramsModel}
                        }).then(data=>{
                            if(data.success){
                                this.$notify({
                                    title: '成功',
                                    message: '拉取数据成功！',
                                    type: 'success'
                                    });
                                this._reload();
                            }else{
                                this.$notify({
                                    title: '失败',
                                    message: '拉取数据失败！',
                                    type: 'error'
                                    });
                            }
                            _this.pullLoading=false;
                        })
                    }
                }).catch(e=>{
                     this.$message.error('拉取异常！'+e);
                     _this.pullLoading=false;
                })
            }
        
    },
    components:{
         Edit,
         'yl-roleTree':roleTree,
         'yl-EditDefault':EditDefault
        },
    mounted(){
        this._reload();
        if(localStorage.getItem('confAuthorization')!=null){
            this.serviceUrl=localStorage.getItem('serviceUrl');
            this.switchValue=true;
        }else{
             this.switchValue=false;
        }
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

