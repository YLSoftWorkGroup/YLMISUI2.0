<template>
    <yl-layout >
                    <div slot="fristbox" >
                        <yl-toolbar>
                                    <el-form  :inline="true"  >
                                        <el-form-item class="form-content-vertical">
                                            <el-input  
                                                    placeholder="模块名称" 
                                                    size="small" 
                                                    style="width:200px" 
                                                    v-model="searchModel.menuName"
                                            ></el-input>   
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
                                              <el-button type="primary"   size="small"    @click="_pullNew" ><i class="icon-alignment-aligned-to"></i>拉取</el-button>
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
              <el-dialog  title="拉取新模块" v-model="moduleAccessFlag" size="tiny" top="30%" 
                    :modal-append-to-body="false" 
                    :close-on-click-modal="false" >
					<el-form   label-width="80px" >
							<el-form-item label="拉取模块" >
								<yl-menuItemTree  
                                    placeholder="请选择菜单" 
                                    style="width:100%" 
                                    v-model="menuItemId"
                                    @getCurrentNode="_getCurrentNode"
                               ></yl-menuItemTree>   
							</el-form-item>  
                            <el-form-item label="来源版本号" >
                                    <el-input  
                                        style="width:100%" 
                                        v-model="menuVersion"
                                    ></el-input>   
                             </el-form-item>
                             <el-form-item label="目标版本号" >
                                    <el-input  
                                        style="width:100%" 
                                        v-model="targetMenuVersion"
                                    ></el-input>   
                             </el-form-item>
						<el-form-item style="text-align:right;" >
							<el-button type="primary" :loading="pullNewLoading" @click="_onPullNew" >拉取</el-button>
						</el-form-item>
				</el-form>
	</el-dialog>
                    </div>
               </yl-layout>
</template>

<script type="text/babel">
import util from '@/common/js/util';  
import fetch from '@/api/fetch';
import menuItemTree from '@/ocomponents/menuitem/menuItemTree';
import {inputModel} from '@/api/inputmodel';
export default {
		data() {
			    return {
                tableData:[],
                mainTableLoading:false,
                selectRows:[],
                currentRows:{},
                menuItemId:'',
                menuVersion:'',
                targetMenuVersion:'',
                selectNode:{},
                pullLoading:false,
                pullNewLoading:false,
                pushLoading:false,
                moduleAccessFlag:false,
                searchModel:{
                       menuName:'',  
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
                                {attr: { prop: 'extensionThere', label: '模块名称', width:150,  } },
                                {attr: { prop: 'extensionTwo', label: '系统编码', width:120, } },
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
            this.selectNode.code=node.funcCode;
         },
            _getDataList(){
                let _this=this;
                this.selectRows=[];
                this.mainTableLoading=true; //开启加载
                var inputArr=[ 
                               {key:"ExtensionThere",op:"LIKE",value:this.searchModel.menuName},
                             ];
                if(this.searchModel.versionNum!=''){
                    inputArr.push(  {key:"VersionNum",op:"EQ",value:this.searchModel.versionNum})
                }             
                this.mainInput.inputModel.sorting='createTime desc';
                this.mainInput.addqueryConditionItem(inputArr);
                fetch({
                    url:'/api/services/app/moduleConf/GetModuleConfPageList',
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
            _pullNew(){
                this.moduleAccessFlag=true;
                this.menuItemId='';
                this.menuVersion=this.globalConf.versionNum;
                this.targetMenuVersion=this.globalConf.versionNum;
            },
            _onPullNew(){
                let _this=this;
                if(this.serviceUrl==''){
                      this.$message.warning('服务器地址为空！');
                      return false;
                }
                _this.pullNewLoading=true;
                fetch(
                    {
                        url:'/api/services/app/moduleConf/GetModuleConfForEdit',
                        method:'post',
                        data:[ 
                            {dataField:"ExtensionTwo",op:"EQ",dataValue:this.selectNode.code},
                            {dataField:"VersionNum",op:"EQ",dataValue:_this.menuVersion},
                        ]
                    },
                    {
                        baseURL:_this.serviceUrl,
                        authorization:localStorage.getItem('confAuthorization'),
                        formatData:false
                    }
                ).then(data=>{
                    if(data.success){
                        //插入本地
                        let paramsModel=data.result.moduleConf;
                        paramsModel.id=''
                        let date=new Date();
                        paramsModel.versionNum=this.targetMenuVersion;
                        paramsModel.pullPerson=this.getUserInfo().user.realName;
                        paramsModel.lastPullTime=this.formatDate(date,'YYYY/MM/DD-HH:mm:ss');
                        fetch({
                            url:'/api/services/app/moduleConf/Push',
                            method:'post',
                            data:{moduleConf:paramsModel}
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
                            _this.pullNewLoading=false;
                        })
                    }
                }).catch(e=>{
                     this.$message.error('拉取异常！'+e);
                     _this.pullNewLoading=false;
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
                        url:'/api/services/app/moduleConf/Push',
                        method:'post',
                        data:{moduleConf:paramsModel}
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
            'yl-menuItemTree':menuItemTree
        },
        mounted() {
            this._reload();
            this.searchModel.versionNum=this.globalConf.versionNum;
           
        },
        watch:{
        }
	};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

