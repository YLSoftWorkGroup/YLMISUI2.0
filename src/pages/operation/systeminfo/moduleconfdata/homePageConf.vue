<template>
    <yl-layout >
                    <div slot="fristbox" >
                        <yl-toolbar>
                                    <el-form  :inline="true"  >
                                        <el-form-item class="form-content-vertical">
                                            <yl-roleTree 
                                                placeholder="角色名称" 
                                                size="small"
                                                style="width:200px" 
                                                v-model="searchModel.roleId"
                                                ></yl-roleTree>  
                                        </el-form-item>
                                        <el-form-item class="form-content-vertical">
                                            <el-input  
                                                    placeholder="版本号" 
                                                    size="small" 
                                                    style="width:120px" 
                                                    v-model="searchModel.versionNum"
                                            ></el-input>   
                                        </el-form-item>
                                        <el-form-item class="form-content-vertical">
                                            <el-button type="primary" icon="search" size="small" @click="_reload">查 询</el-button>
                                        </el-form-item>
                                    </el-form>
                            </yl-toolbar>
                             <yl-toolbar>
                                    <el-form  :inline="true"  >
                                        <el-form-item class="form-content-vertical">
                                            <el-button type="primary"  :loading="pullLoading" size="small"   :disabled="searchModel.roleId===''" @click="_pull" ><i class="icon-alignment-aligned-to"></i>拉取</el-button>
                                              <el-button type="primary"  :loading="pushLoading" size="small"  :disabled="selectRows.length===0"  @click="_push"><i class="icon-alignment-align"></i>推送</el-button>
                                        </el-form-item>
                                    </el-form>
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
                                <template slot="formatTime" scope="scope">
                                    {{ formatDate(scope.row.createTime,'YYYY/MM/DD-HH:mm:ss')}}
                                </template>
                        </yl-table>
                    </div>
               </yl-layout>
</template>

<script type="text/babel">
import util from '@/common/js/util';  
import fetch from '@/api/fetch';
import roleTree from '@/ocomponents/role/roleTree';
import {inputModel} from '@/api/inputmodel';
export default {
		data() {
			    return {
                tableData:[],
                mainTableLoading:false,
                selectRows:[],
                currentRows:{},
                selectNode:{},
                pullLoading:false,
                pushLoading:false,
                moduleAccessFlag:false,
                searchModel:{
                       roleId:'',  
                       versionNum:'',
                    },
                mainInput:new inputModel(),
			};
        },
        props:{
            serviceUrl:{
                type:String,
                default:'',
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
                                {attr: { prop: 'roleName', label: '角色名称', width:150,  } },
                                {attr: { prop: 'versionNum', label: '版本号',   width:120} },
                                {attr: { prop: 'lastPushTime',label: '推送时间', width:150} },
                                {attr: { prop: 'pushPerson', label: '推送人', width:120} },
                                {attr: { prop: 'lastPullTime',label: '拉取时间', width:150} },
                                {attr: { prop: 'pullPerson', label: '拉取人', width:120} },
                                {attr: { prop: 'createTime', label: '更新时间',  width:150, } },
                            ]
                        }
                    }
                },
            globalConf:{
                    get(){
                        return util.getLocalStorage('SysGlobConf');
                    }
			 },
        },
		methods: { 
            _getCurrentNode(node){
            },
            _getDataList(){
                let _this=this;
                this.selectRows=[];
                this.mainTableLoading=true; //开启加载
                var inputArr=[ 
                               {key:"RoleId",op:"EQ",value:this.searchModel.roleId},
                             ];
                if(this.searchModel.versionNum!=''){
                    inputArr.push(  {key:"VersionNum",op:"EQ",value:this.searchModel.versionNum})
                }             
                this.mainInput.inputModel.sorting='createTime desc';
                this.mainInput.addqueryConditionItem(inputArr);
                fetch({
                    url:'/api/services/app/homePageConf/getMainPageList',
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
                this._getDataList();
            },
            _pull(){
                //拉取
                let _this=this;
                if(this.serviceUrl==''){
                      this.$message.warning('服务器地址为空！');
                      return false;
                }
                _this.pullLoading=true;
                fetch(
                    {
                        url:'/api/services/app/homePageConf/GetMainObjectForEdit',
                        method:'post',
                        data:{
                                queryConditionItem:[
                                                    {dataField:"RoleId",op:"EQ",dataValue:_this.searchModel.roleId},
                                                    {dataField:"VersionNum",op:"EQ",dataValue:_this.searchModel.versionNum},
                                                ],
                                sorting:''
                            }
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
                            url:'/api/services/app/homePageConf/Push',
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
            },
            _push(){
                //推送
                let _this=this;
                if(this.serviceUrl==''){
                      this.$message.warning('服务器地址为空！');
                      return false;
                }
                if(_this.selectRows.length>0){
                    _this.currentRows=_this.selectRows[0];
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
                        url:'/api/services/app/homePageConf/Push',
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
            }
		},
        components:{
            'yl-roleTree':roleTree
        },
        mounted() {
            //this._reload();
            this.searchModel.versionNum=this.globalConf.versionNum;
           
        },
        watch:{
        }
	};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

