<template>
    <yl-columnlay 
        :hiddenLeft="baseInfoConf.layout.columnlay.hiddenLeft">
              <div slot="left">
                    <!--这里只能渲染带panel的树组件-->
                    <yl-renderselcoms  
                        @getCurrentNodeWithPanel="_getCurrentNodeWithPanel"
                        @init="_initSelComs"
                        :option="filterConf.selfFilterConf.length>0?filterConf.selfFilterConf[0]:{}">
                    </yl-renderselcoms>
              </div>
              <div slot="right" >
                    <yl-layout>
                        <div slot="fristbox" >
                              <el-form :inline="true" >
                                   <yl-timebar v-if="filterFormConf.timebar"
                                            :format="filterFormConf.timebar.format"
                                            :dataPickOptions="filterFormConf.timebar.dataPickOptions"
                                            :btnItems="filterFormConf.timebar.btnItems"
                                            :currentValue="filterFormConf.timebar.currentValue"
                                            @click="_timeBarEvent"
                                            @init="_timeBarInit"
                                            ref="timeBar"
                                   >
                                   </yl-timebar>
                                <yl-toolbar v-if="baseInfoConf.layout.columnlay.upToolFilter.visiable">
                                 <!--过滤器-->
                                        <el-form-item class="form-content-vertical" v-for="(item,index) in filterFormConf.up" :key="index">
                                                <yl-rendercoms  
                                                        :option="item" 
                                                        :model="searchModel"
                                                        :refList="refList"
                                                        @change="_change"
                                                        @blur="_blur"
                                                        @init="_initComs"
                                                        @method1="_method1"
                                                        @method2="_method2">
                                                </yl-rendercoms>
                                        </el-form-item>
                                         <el-form-item class="form-content-vertical" v-if="functionConf.searchBtn">
                                              <el-button 
                                                    v-show="functionConf.searchBtn.isShow"
                                                    :disabled="functionConf.searchBtn.disabled"  
                                                    :type="functionConf.searchBtn.type" 
                                                    :size="functionConf.searchBtn.size" 
                                                    @click="_functionClick(functionConf.searchBtn)"> 
                                                    <i :class="functionConf.searchBtn.icon"></i>
                                                    {{functionConf.searchBtn.text}}  
                                              </el-button>
                                         </el-form-item>
                                          <el-form-item class="form-content-vertical" v-if="functionConf.excelBtn">
                                               <el-button 
                                                    v-show="functionConf.excelBtn.isShow"
                                                    :disabled="functionConf.excelBtn.disabled"  
                                                    :type="functionConf.excelBtn.type" 
                                                    :size="functionConf.excelBtn.size" 
                                                    @click="_functionClick(functionConf.excelBtn)"> 
                                                    <i :class="functionConf.excelBtn.icon"></i>
                                                    {{functionConf.excelBtn.text}}  
                                               </el-button>
                                         </el-form-item>
                                </yl-toolbar>
                                
                                <yl-toolbar v-if="baseInfoConf.layout.columnlay.downToolFilter.visiable">
                                 <!--过滤器-->
                                        <el-form-item class="form-content-vertical" v-for="(item,index) in filterFormConf.down" :key="index">
                                                <yl-rendercoms  
                                                    :option="item" 
                                                    :model="searchModel"
                                                    :refList="refList"
                                                    @change="_change"
                                                    @blur="_blur"
                                                    @init="_initComs"
                                                    @method1="_method1"
                                                    @method2="_method2">
                                                </yl-rendercoms> 
                                        </el-form-item>
                                </yl-toolbar>
                             </el-form>
                             <yl-toolbar  v-if="baseInfoConf.layout.columnlay.toolFunction.visiable">
                                <!--功能-->
                                <el-button-group ref="funtoolbar">  
                                    <el-button v-for="(item,index) in funBtnConf" :key="index"
                                                    :type="item.type" 
                                                    :name="item.name" 
                                                    :size="item.size" 
                                                    :loading="item.loading"
                                                    v-permissionSetting="item.permissionSetting"
                                                    v-show="item.isShow"
                                                    :disabled="item.disabled"  
                                                    @click="_functionClick(item)" >
                                                <i :class="item.icon"></i>{{item.text}}
                                    </el-button>
                                    </el-button-group>
                             </yl-toolbar>
                        </div>
                        <div slot="secondbox" class="flexbox" >
                         <!--表显示区域-->
                              <yl-table ref="mainTable"
                                        @reload="_reload"
                                        @current-change="_currentChange"
                                        @selection-change="_selectionChange"
                                        @row-click="toggleRowSelection"
                                        :configs="tableInfoConf" 
                                        :input="mainInput.inputModel"
                                        :tableloading="mainTableLoading"
                                        :pagination="tableInfoConf.pagination" 
                              >
                                    <template :slot="item.name" scope="scope" v-for="(item,index) in tableInfoConf.solSlotConf" > 
                                            <yl-tableSlotComs 
                                                :key="index"
                                                :option="item" 
                                                :row="scope.row" 
                                                :name="item.name"
                                                @tableSlotEvent="_tableSlotEvent"
                                                >
                                            </yl-tableSlotComs>
                                    </template>
                                </yl-table>
                        </div>
                    </yl-layout> 

                <!--编辑界面-->
                        <el-dialog ref="mainDialog" 
                                v-if="formConfs.dialogConf"
                                :visible.sync="addFormVisible" 
                                :before-close="_dynamicformBeforeClose"
                                :size="formConfs.dialogConf.size"  
                                :top="formConfs.dialogConf.top"
                                :title="formConfs.dialogConf.title"
                                :modal="formConfs.dialogConf.modal"
                                :modal-append-to-body="false"  
                                :close-on-click-modal="false" >
                                    <yl-dynamicform  
                                            :afterAddClose="formConfs.dialogConf.afterAddClose"
                                            @close="_close" 
                                            v-if="addFormVisible"
                                            :formConf="formConfs"
                                            :apiConf="apiConf"
                                            :baseInfoConf="baseInfoConf"
                                            :functionConf="functionConf"
                                            :selectRow="currentRows"
                                            :selectRows="selectRows"
                                            :tableName="tableName">
                                    </yl-dynamicform>
                        </el-dialog>

                    <!--动态容器-->
                    <el-dialog ref="itemDialog" 
                            :visible.sync="itemFormVisible"
                            :title="itemConf.dialogConf.title" 
                            :size="itemConf.dialogConf.size"
                            :top="itemConf.dialogConf.top" 
                            :modal="itemConf.dialogConf.modal"
                            :before-close="_dynamicformBeforeClose"
                            :close-on-click-modal="false"
                            :modal-append-to-body="false"
                            lock-scroll >
                                <yl-containercoms     
                                    v-if="itemFormVisible"
                                    :option="itemConf.option"
                                    :outParams="itemConf.outParams"
                                    >
                                </yl-containercoms> 
                    </el-dialog>

                    <!--打印设置-->
                    <el-dialog ref="printDialog"
                            title="打印配置" 
                            :modal="false"
                            size="tiny"
                            :visible.sync="printVisible" >
                                <printConf
                                  :menuCode="menuCode"
                                  @close="_close" 
                                  v-if="printVisible"
                                ></printConf>
                    </el-dialog>

                <!--审批状态预览-->
                    <el-dialog ref="stateDialog" v-if="baseInfoConf.moduleType=='2'"
                            :title="tableInfoConf.approveConf.dialogConf.title" 
                            :visible.sync="stateVisible" 
                            :close-on-click-modal="true"
                            lock-scroll
                            :modal="false"
                            :modal-append-to-body="false"
                            :size="tableInfoConf.approveConf.dialogConf.size"
                            :top="tableInfoConf.approveConf.dialogConf.top" >
                            <approveState 
                                :orderId="orderId"
                                v-if="stateVisible">
                            </approveState>
                    </el-dialog>

                <!--审批界面-->
                    <el-dialog ref="approveDialog" title="审批" 
                                    :visible.sync="approveFormVisible" 
                                    size="small"  
                                    top="15%" 
                                    :modal="false"
                                    :lock-scroll="true"
                                    :close-on-press-escape="false"
                                    :modal-append-to-body="false" 
                                    :close-on-click-modal="false"  >
                                <roleApprove
                                    :apiUrl="approveMainObject"
                                    :propsOrderId="selectRows[0].id"
                                    :propsOrgId="selectRows[0].orgId"
                                    :tableName="tableName"
                                    @close="_close" 
                                    v-if="approveFormVisible">
                                </roleApprove>
                     </el-dialog>
               </div>  
      </yl-columnlay> 
  
</template>

<script type="text/babel">
import fetch from '@/api/fetch';
import util from '@/common/js/util';
import logicMethods from '@/common/js/logicMethods';
import globalJS from '@/common/js/globalJS';
import {inputModel} from '@/api/inputmodel';
import { mapGetters,mapActions } from 'vuex';
import { getLodop } from '@/common/print/lodop/LodopFuncs'
import roleApprove from '@/ocomponents/roleapprovestate/roleApprove'
import approveState from '@/ocomponents/roleapprovestate/approveState'
import filterParams from '@/mixns/filterParams.js';
import printConf from '@/pages/config/printConf/printConf'
export default {
    mixins:[filterParams],
    data(){
        return {
                mainInput:new inputModel(),
                mainTableLoading:false,
                searchModel:{},
                selectRows:[],
                currentRows:{},
                addFormVisible:false,
                funBtnConf:{},
                filterFormConf:{},
                inputParams:[],
                itemFormVisible:false,
                printVisible:false,
                stateVisible:false,
                approveFormVisible:false,
                approveSateInfo:{},
                orderId:'',
                reportUrl:'',
                tableName:"",
                menuCode:"",
                refList:{},
                extensionObj:{},
                timeNode:{},
                printVisible:false,
                itemConf:{
                    dialogConf:{
                        title:'',
                        size:'',
                        top:'',
                    }, 
                    option:{}
                 },
                formConfs:{
                    dialogConf:{
                        title:'',
                        size:'',
                        top:'',
                        modal:false,
                        afterAddClose:true,
                        }, 
                        option:{}
                        },
          }
    },
    props:{
        apiConf:{
            type:Object,
            require:true,
        },
         baseInfoConf:{
            type:Object,
            require:true,
        },
         filterConf:{
            type:Object,
            require:true,
        },
         tableInfoConf:{
            type:Object,
            require:true,
        },
         functionConf:{
            type:Object,
            require:true,
        },
         formConf:{
            type:Object,
            require:true,
        },
         outPutConf:{
            type:Object,
            require:true,
        },
        outParams:{
            require:true,
            type:Object,
            default:function(){
                    return { }
            }
        }

    },
     computed: {
                fetchObject:{
                    get(){
                        return fetch;
                    }
                },
                utilObject:{
                    get(){
                        return util;
                    }
                },
                globalFunObject:{
                    get(){
                        return globalJS;
                    }
                },
                getLodop:{
                    get(){
                        return getLodop;
                    }
                },
                approveMainObject:{
                    get(){
                        if(this.apiConf.approveMainObject!=undefined){
                            return this.apiConf.approveMainObject.url;
                        }else{
                            return '';
                        }
                    }
                },
                globConf:{
                        get(){
                        return util.getLocalStorage('SysGlobConf'); 
                        }
                    },
                logicMethods:{
                    get(){
                        return logicMethods;
                    }
                },    
            ...mapGetters([ 'getGlobObject1','getGlobObject2','getGlobString1','getGlobString2','getGlobArray1' ]),
        },
    methods:{
        ...mapActions(['setItem_tableConfig','setItem_selectFilter','setItem_funConfig','setItem_isvisible']),
        ...mapActions(['setIsVisible','setBaseinfoConf','setApiConf','setFliterConf','setTableinfoConf','setFunctionConf']),
        ...mapActions(['setGlobObject1','setGlobObject2','setGlobString1','setGlobString2','setGlobalArray1']),
        _reload(){
            this._loadData();
            this._funcState();
        },
        _loadData(){
            let _this=this;
            this.selectRows=[];
            this.mainTableLoading=true;
            let inputArr=[];
            //外来参数
            this._formatOutParams(this.outParams);
            if(this.outParams.list!=undefined){
                inputArr.push(...this.outParams.list);
            }
            if(this.filterConf.selfFilterConf.length>0){
            inputArr.push({key:this.filterConf.selfFilterConf[0].name,  
                           op:this.filterConf.selfFilterConf[0].op,
                           DataFieldTwo:this.filterConf.selfFilterConf[0].DataFieldTwo,
                           TwoFieldRelation:this.filterConf.selfFilterConf[0].TwoFieldRelation,
                           value:this.searchModel[this.filterConf.selfFilterConf[0].name]});
            };
            this.filterConf.searchFilterConf.up.forEach((item,index)=>{
                 if(!(item.op==="EQ"&&this.searchModel[item.name]==="")){
                    let obj={};
                    obj.key=item.name;
                    obj.op=item.op;
                    obj.DataFieldTwo=item.DataFieldTwo;
                    obj.TwoFieldRelation=item.TwoFieldRelation;
                    obj.value=this.searchModel[item.name];
                    inputArr.push(obj)
                 }
            });
            this.filterConf.searchFilterConf.down.forEach((item,index)=>{
                if(!(item.op==="EQ"&&this.searchModel[item.name]==="")){
                    let obj={};
                    obj.key=item.name;
                    obj.op=item.op;
                    obj.DataFieldTwo=item.DataFieldTwo;
                    obj.TwoFieldRelation=item.TwoFieldRelation;
                    obj.value=this.searchModel[item.name];
                    inputArr.push(obj)
                }
            });
            //添加时间过滤
            if(this.timeNode.beginDate!=undefined){
                this.timeNode=this.$refs.timeBar.getDate();
                inputArr.push({key:this.filterFormConf.timebar.beginDate,op:"BGT",value:this.timeNode.beginDate}); 
                inputArr.push({key:this.filterFormConf.timebar.endDate,op:"SGT",value:this.timeNode.endDate}); 
            }
            //审批过滤
            if(this.funBtnConf.approve!==undefined){
                if(this.approveSateInfo!=null){
                    inputArr.push({key:"IsState",op:"GTE",value:Number(this.approveSateInfo.stateValue-10)}); 
                    inputArr.push({key:"IsAudit",op:"EQ",value:1}); 
                    } 
            }
            inputArr.push(...this.inputParams);
            this.mainInput.addqueryConditionItem(inputArr);
            this.mainInput.inputModel.sorting=this.filterConf.sorting;


            //兼容queryContainer
            let _apiconf={};
            if(this.apiConf.getMainPageList==undefined){
                _apiconf=this.apiConf.getItemPageList;
            }else{
                _apiconf=this.apiConf.getMainPageList;
            }
            _apiconf.data=this.mainInput.inputModel;
            this._beforeLoad(_apiconf.data);


            //缓存参数写入
            this.setFilterParams(_apiconf.data)
            fetch(_apiconf,_apiconf.configs).then(data=>{
                            if(data.success){
                                    this.extensionObj.table=data.result;
                                    this._afterLoad();
                                    this.tableInfoConf.table.attr.data=this.extensionObj.table;
                            }
                            else {
                                    this.$message.error('失败！'+data.error.message);
                            }
                            this.mainTableLoading=false;
                    }).catch(function(error){
                        _this.mainTableLoading=false;
                        _this.$message.error('获取数据失败！');
                    });
        },
        _currentChange(val){
                //单选时的方法
                if(this.tableInfoConf.columns[0].attr.type==="index"){
                    if(val!=null){
                        this.selectRows=[];
                        this.selectRows.push(val);
                    }
                    this._funcState();
                }
        },
       _selectionChange(val){
           //多选方法
            if(this.tableInfoConf.columns[0].attr.type==="selection"){
                if(val!=null){
                    this.selectRows=[];
                    this.selectRows=this.selectRows.concat(val);
                }
                this._funcState();
            }
       },
       toggleRowSelection(row) {
            this.$refs.mainTable.toggleRowSelection(row);
            this._rowclick(row);
        },
        //时间工具条
       
        _timeBarEvent(node){
            let _this=this;
            if(this.filterConf.searchFilterConf.timebar!=undefined){
                this.timeNode=node;
                let eventConf=this.filterConf.searchFilterConf.timebar.eventConf;
                if(eventConf!=undefined){
                    if(eventConf.isOn){
                        eventConf.click(node,_this);
                    }
                }
            }
        },
         _timeBarInit(node){
             let _this=this;
             if(this.filterConf.searchFilterConf.timebar!=undefined){
                  this.timeNode=node;
                        //初始化
                    let eventConf=this.filterConf.searchFilterConf.timebar.eventConf;
                    if(eventConf!=undefined){
                        if(eventConf.isOn){
                            if(eventConf.init){
                                eventConf.init(node,_this,this.modelCache);
                            }else{
                                //过滤器默认值异步处理默认值得除外）
                                if(this.modelCache.BeginDate){
                                    this.$refs.timeBar.setDate(this.modelCache.BeginDate,this.modelCache.EndDate);
                                }
                            }
                        }
                    }
                   
             }
        },
        _functionClick(item){
            let _this=this;
            let eventConf=item.eventConf;
            if(eventConf!=undefined){
                if(eventConf.isOn){
                    eventConf.click(item.name,_this);
                }
            }
        },
        _funcState(){
            let _this=this;
            if(this.functionConf.funState!=undefined){
                let eventConf=this.functionConf.funState.eventConf;
                if(eventConf!=undefined){
                    if(eventConf.isOn){
                        eventConf.click(this.selectRows,_this);
                    }
                }
            }
        },
        _add(){  
                this.addFormVisible=true;
                this.currentRows={};
                this.selectRows=[];
        },  
        _edit(){
                this.addFormVisible=true;
                this.currentRows=this.selectRows[0];
        },
        delete(id){
              let _this=this;
               _this.apiConf.deleteMainObject.data.id=id;
                //处理权限参数
                let permissionType=this.menuCode.split('&');
                let urlCode=this.apiConf.deleteMainObject.url.split('/');
                if(permissionType[1]!=undefined&&urlCode[4].toLowerCase()===permissionType[0].toLowerCase()){
                    this.apiConf.deleteMainObject.data.permissionType=permissionType[1];
                }
               return new Promise(function (resolve, reject){
                    fetch(_this.apiConf.deleteMainObject).then(data =>{
                            if(data.success){
                                    resolve(true);
                                }
                            else {
                                 reject(new Error('删除信息失败！'+err))
                            }
                    }).catch((err)=>{ reject(new Error('删除信息异常！'+err))});
               })
        },
       async _delete(){
                this.$confirm('确认要删除所选项吗?', '提示', {
                type: 'warning'
                }).then(async() => {
                        let resultCount=0,isflag=false;
                        if(this.tableInfoConf.columns[0].attr.type==="selection"){
                            //多选
                            for(let item of this.selectRows){
                                isflag=await this.delete(item.id);
                                if(isflag){ resultCount++; }
                            }
                        }else{
                            //单选
                             isflag=await this.delete(this.selectRows[0].id);
                             if(isflag){ resultCount=1;}
                        }
                        this._reload();
                        this.$notify({
                                title: '成功',
                                message: '成功删除【'+resultCount+'】条数据！',
                                type: 'success'
                            });
            }).catch(()=>{});
        },
        _audit(procName){
             //初始化表单  
             let obj={};
             obj.id=this.selectRows[0].id;
             obj.orgId=this.selectRows[0].orgId;
             obj.tableName=this.tableName;
             if(procName===undefined||procName===''){
                 obj.procName='Pr_CommonProc';
             }else{
                 obj.procName=procName;
             }
             this.apiConf.auditObject.data=obj;
             //处理权限参数
             let permissionType=this.menuCode.split('&');
                let urlCode=this.apiConf.auditObject.url.split('/');
                if(permissionType[1]!=undefined&&urlCode[4].toLowerCase()===permissionType[0].toLowerCase()){
                    this.apiConf.auditObject.data.permissionType=permissionType[1];
                }
             this.funBtnConf.audit.loading=true;
            fetch(this.apiConf.auditObject).then(data=>{
                if(data.success){
                    if(data.result.result>0){
                        this.$notify({
                                    title: '成功',
                                    message: '审核单据成功！',
                                    type: 'success'
                                    });
                    }else{
                         this.$notify.error({
                                    title: '错误',
                                      message: data.result.errorResult,
                                    });
                    }
                    this.funBtnConf.audit.loading=false;
                    this._reload();
                }else{
                    this.$notify.error({
                                    title: '错误',
                                      message: '审核单据失败！',
                                    });
                   this.funBtnConf.audit.loading=false;
                }
            });
        },
        _unAudit(procName){
             let obj={};
             obj.id=this.selectRows[0].id;
             obj.orgId=this.selectRows[0].orgId;
             obj.tableName=this.tableName;
             if(procName===undefined||procName===''){
                 obj.procName='Pr_CommonProc_Un';
             }else{
                 obj.procName=procName;
             }
             this.apiConf.unAuditObject.data=obj;
             //处理权限参数
                let permissionType=this.menuCode.split('&');
                let urlCode=this.apiConf.unAuditObject.url.split('/');
                if(permissionType[1]!=undefined&&urlCode[4].toLowerCase()===permissionType[0].toLowerCase()){
                    this.apiConf.unAuditObject.data.permissionType=permissionType[1];
                }
             this.funBtnConf.unAudit.loading=true;
             fetch(this.apiConf.unAuditObject).then(data=>{
                if(data.success){
                    if(data.result.result>0){
                        this.$notify({
                                    title: '成功',
                                    message: '撤销审核单据成功！',
                                    type: 'success'
                                    });
                     }
                    else{
                        this.$notify.error({
                                    title: '错误',
                                    message: data.result.errorResult,
                                    });
                     }
                    this.funBtnConf.unAudit.loading=false;
                    this._reload();
                }else{
                    this.$notify.error({
                                    title: '错误',
                                    message: '撤销审核单据失败！',
                                });
                    this.funBtnConf.unAudit.loading=false;
                }
            });
         },
        _approve(){
            this.approveFormVisible=true;
         },
         _formatOutParams(inputArr){
                let _this=this;
                if(this.filterConf.InterceptEvent!=undefined){
                    let eventConf=this.filterConf.InterceptEvent.formatOutParams;
                    if(eventConf!=undefined){
                        if(eventConf.isOn){
                            eventConf.event(_this,inputArr);
                        }
                    }
                }
        },


        _exportExecl(params,userConf,type){
            let paramsType=typeof params;
            if(paramsType==='object'){
                //自定义导出
                    let _this=this;
                    const excelConf=util.deepCopy(_this.outPutConf.excelConf);
                    excelConf.content.dataModel=params;
                    //渲染模板
                if(excelConf.InterceptEvent.initTemplate!==undefined){
                                if(excelConf.InterceptEvent.initTemplate.isOn){
                                  // let _displayModel=util.deepCopy(_this.outPutConf.displayModel)
                                    excelConf.InterceptEvent.initTemplate.event(excelConf.content,_this,userConf,type);
                                }
                            }
                    //替换字符
                    if(excelConf.InterceptEvent.beforePrint!==undefined){
                                if(excelConf.InterceptEvent.beforePrint.isOn){
                                    excelConf.InterceptEvent.beforePrint.event(excelConf.content,type);
                                }
                            }
                    //导出
                    if(excelConf.eventConf!=undefined){
                                    if(excelConf.eventConf.isOn){
                                        excelConf.eventConf.event(excelConf.content,_this,userConf,type);
                                    }
                        }
            }else{
                //导出通用模板
                 let fileName='';
                if(params==undefined){
                    if(this.baseInfoConf.panelpage==undefined){
                        params='报表名缺省';
                    }else{
                        params=this.baseInfoConf.panelpage.titleName;
                    }
                }else{
                    fileName=params;
                }
                this.exportCommonTemplate(this.tableInfoConf.columns,this.tableInfoConf.table.attr.data.data,fileName)
                }
         },
        _printPage(params,userConf,type){
            let _this=this;
            const printConf=util.deepCopy(_this.outPutConf.printConf);
            let LODOP=getLodop();
             printConf.content.dataModel=params;
             //渲染模板
           if(printConf.InterceptEvent.initTemplate!==undefined){
                        if(printConf.InterceptEvent.initTemplate.isOn){
                            printConf.InterceptEvent.initTemplate.event(printConf.content,_this,userConf,type);
                        }
                    }
              //替换字符
            if(printConf.InterceptEvent.beforePrint!==undefined){
                        if(printConf.InterceptEvent.beforePrint.isOn){
                            printConf.InterceptEvent.beforePrint.event(printConf.content,type);
                        }
                    }
               //打印
            if(printConf.eventConf!=undefined){
                            if(printConf.eventConf.isOn){
                                printConf.eventConf.event(printConf.content,_this,LODOP,userConf,type);
                            }
                }
            LODOP.PREVIEW();
         },
        _state(id){
            this.stateVisible=true;
            this.orderId=id;
         },
        //事件触发方法----
         _close(bool){
            if(bool){
                this.addFormVisible=false;
            }
            this.approveFormVisible=false;
            this.printVisible=false;
            this._reload();
          },
         _dynamicformBeforeClose(){
             this.addFormVisible=false;
             this.itemFormVisible=false;
             this._reload();
          },
         _initComs(_coms){
           let _this=this,option=_coms.option;
           if(option.eventConf!=undefined){
                if(option.eventConf.isOn){
                    if(option.eventConf.init!=undefined){
                            option.eventConf.init(_this,option,this.modelCache);
                    }
                }  
           }else{
                //过滤器默认值异步处理默认值得除外）
                if(this.modelCache[option.name]){
                        this.searchModel[option.name]=this.modelCache[option.name];
                }
           }
          
          },
         _change(node,_coms){
            let _this=this,option=_coms.option;
            let eventConf=option.eventConf;
            if(eventConf!=undefined){
                if(eventConf.isOn){
                    if(eventConf.change!=undefined){
                        eventConf.change(node,_this,option);
                    }
                }
            }  
         },
        _blur(node,_coms){
                let _this=this,option=_coms.option;
                let eventConf=option.eventConf;
                if(eventConf!=undefined){
                    if(eventConf.isOn){
                         if(eventConf.blur!=undefined){
                               eventConf.blur(node,_this,option);
                           }
                        }
                }
        },
         _method1(node,_coms){
            let _this=this,option=_coms.option;
            let eventConf=option.eventConf;
            if(eventConf!=undefined){
              if(eventConf.isOn){
                   if(eventConf.method1!=undefined){
                    eventConf.method1(node,_this,option);
                   }
              }
            }
      },
        _method2(node,_coms){
                let _this=this,option=_coms.option;
                let eventConf=option.eventConf;
                if(eventConf!=undefined){
                if(eventConf.isOn){
                    if(eventConf.method2!=undefined){
                        eventConf.method2(node,_this,option);
                    }
                }
                }
        },
        _getCurrentNodeWithPanel(node,option){
        //左边树筛选事件
            let _this=this;
            let eventConf=option.eventConf;
            if(eventConf!=undefined){
                if(eventConf.isOn){
                    eventConf.change(node,_this);
                    this._reload();
                }
            }
        },
        _initSelComs(_coms){
            let _this=this,option=_coms.option;
            if(option.eventConf!=undefined){
                if(option.eventConf.isOn){
                    if(option.eventConf.init!=undefined){
                            option.eventConf.init(_this,option,this.modelCache);
                    }
                }  
            }else{
                 //过滤器默认值异步处理默认值得除外）
                if(this.modelCache[option.name]){
                        this.searchModel[option.name]=this.modelCache[option.name];
                }
            }
           
        },
        _tableSlotEvent(row,item){
              let _this=this;
                    let eventConf=item.eventConf;
                    if(eventConf!=undefined){
                        if(eventConf.isOn){
                            if(eventConf.click!=undefined){
                                //对配置内容进行拦截处理
                               if(item.isContainer){
                                    let conf=_this.tableInfoConf.itemConf[item.name];
                                    eventConf.click(row,item.name,_this,conf);
                                    this.itemConf=conf;
                                    this.itemFormVisible=true;
                               }else{
                                   eventConf.click(row,item.name,_this);
                               }
                            }
                        }
                    }

        },
        _inputArrInit(){
            this.filterConf.inputArr.forEach(item=>{
                let _this=this;
                if(item.eventConf!=undefined){
                    if(item.eventConf.isOn){
                        if(item.eventConf.init!=undefined){
                            item.eventConf.init(item,_this);
                        }
                    }
                }
                if(!(item.op==="EQ"&&item.value==="")){
                    this.inputParams.push(item);
                }
            });
        },
         _onSelect(flag){
          if(flag!=""){
            let inputArr =[ 
                    {dataField:"ExtensionOne",op:"EQ",dataValue:flag},
                    {dataField:"IsEnable",op:"EQ",dataValue:1},
                    {dataField:"VersionNum",op:"EQ",dataValue:this.globConf.versionNum},
                ];
            fetch({url: '/api/services/app/selectModuleConf/GetSelectModuleConfByKey',
                    method: 'post',
                    data: inputArr}).then((data)=>{
                    if(data.success){
                         let result=data.result.order;
                        if(result!=null){
                            this.setBaseinfoConf(JSON.parse(result.baseInfoConf,util.dealFunction).baseInfo);
                            this.setApiConf(JSON.parse(result.apiConf,util.dealFunction).apiConf);
                            this.setFliterConf(JSON.parse(result.fliterConf,util.dealFunction).filterConf);
                            this.setTableinfoConf(JSON.parse(result.tableInfoConf,util.dealFunction).tableInfoConf);
                            this.setFunctionConf(JSON.parse(result.functionConf,util.dealFunction).functionConf);
                            this.setIsVisible(true);
                        }
                    }else{  
                            this.$message.error('获取数据失败！');
                    }
                })
          }
        },
         _rowclick(currentrows){
                let _this=this;
                if(this.tableInfoConf.InterceptEvent!=undefined){
                    let eventConf=this.tableInfoConf.InterceptEvent.rowclick;
                    if(eventConf!=undefined){
                        if(eventConf.isOn){
                            eventConf.event(_this,currentrows);
                        }
                    }
                }
        },
        _beforeLoad(apiconf){
                let _this=this;
                if(this.filterConf.InterceptEvent!=undefined){
                    let eventConf=this.filterConf.InterceptEvent.beforeLoad;
                    if(eventConf!=undefined){
                        if(eventConf.isOn){
                            eventConf.event(_this,apiconf);
                        }
                    }
                }
        },
         _afterLoad(){
                let _this=this;
                if(this.filterConf.InterceptEvent!=undefined){
                    let eventConf=this.filterConf.InterceptEvent.afterLoad;
                    if(eventConf!=undefined){
                        if(eventConf.isOn){
                            eventConf.event(_this);
                        }
                    }
                }
        },
         _mounted(){
                let _this=this;
                let eventConf=this.baseInfoConf.InterceptEvent;
                if(eventConf!=undefined){
                    if(eventConf.mounted.isOn){
                        eventConf.mounted.event(_this);
                    }
                }
        },
        //---------------
        async init(){
            this.menuCode=this.$route.params.tableName;
            let menuModel=await this.getTableName(this.$route.path);
            this.tableName=menuModel.tableName;
            //判断是否有审批
            if(this.funBtnConf.approve!==undefined){
                this.approveSateInfo=await this.getApproveInfo(this.tableName);
            }
            this._inputArrInit();
            //初始化拦截
            this._mounted();
            //一些初始化逻辑
            this._loadData();
        },
        
    },
    components:{
         roleApprove,
         approveState,
         printConf
    },
    created(){
        this.searchModel=this.filterConf.searchModel;
        this.filterFormConf=this.filterConf.searchFilterConf;
        this.funBtnConf=this.functionConf.funBtn==undefined?{}:this.functionConf.funBtn;
        if(this.formConf!=undefined){
            this.formConfs=this.formConf;
        }
    },
    mounted(){
        this.init();
    },
    watch:{
        getGlobString2:function(n,o){
                let _this=this;
                let eventConf=this.baseInfoConf.WatchEvent;
                if(eventConf!=undefined){
                    if(eventConf.isOn){
                        eventConf.event(_this);
                    }
                }
        }
    }
   
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

