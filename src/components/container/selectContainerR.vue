<template>
     <yl-columnlay  
        :border="baseInfoConf.layout.border"
        :style="baseInfoConf.dialogConf.style"
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
                    <yl-layout >
                        <div slot="fristbox" >
                              <el-form :inline="true" >
                                <yl-toolbar v-if="baseInfoConf.layout.columnlay.upToolFilter.visiable">
                                 <!--过滤器-->
                                        <el-form-item 
                                            class="form-content-vertical" 
                                            v-for="(item,index) in filterConf.searchFilterConf.up" :key="index">
                                                <yl-rendercoms  
                                                    :option="item"
                                                    :model="filterConf.searchModel"
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
                                        <el-form-item class="form-content-vertical" v-for="(item,index) in filterConf.searchFilterConf.down" :key="index">
                                                <yl-rendercoms  
                                                :option="item" 
                                                :model="filterConf.searchModel"
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
                                   <el-button v-for="(item,index) in functionConf.funBtn" :key="index"
                                                :type="item.type" 
                                                :name="item.name" 
                                                :size="item.size" 
                                                :loading="item.loading"
                                                v-permissionSetting="item.permissionSetting"
                                                v-show="item.isShow"
                                                :disabled="item.disabled"  
                                                @click="_functionClick(item)" >
                                            <i :class="item.icon"></i>{{item.text}}</el-button>
                                </el-button-group>
                             </yl-toolbar>
                        </div>
                        <div slot="secondbox" class="flexbox">
                         <!--表显示区域-->
                              <yl-tableR ref="queryTableR"
                                    @reload="_reload"
                                    @current-change="_currentChange"
                                    @selection-change="_selectionChange"
                                    @row-click="toggleRowSelection"
                                    :configs="tableInfoConf"
                                    :tableData="tableData" 
                                    :pagination="tableInfoConf.pagination" 
                                    :tableloading="mainTableLoading" 
                                    >
                                    <template :slot="item.name" scope="scope" v-for="(item,index) in tableInfoConf.solSlotConf"> 
                                            <yl-tableSlotComs 
                                                :key="index"
                                                :option="item" 
                                                :row="scope.row" 
                                                :name="item.name"
                                                @tableSlotEvent="_tableSlotEvent"
                                                >
                                            </yl-tableSlotComs>
                                    </template>
                            </yl-tableR>
                        </div>
                    </yl-layout> 
                   
               </div>  
                
      </yl-columnlay>
</template>

<script type="text/babel">
import fetch from '@/api/fetch';
import util from '@/common/js/util';
import globalJS from '@/common/js/globalJS';
import  {inputModel} from '@/api/inputmodel';
import { mapGetters,mapActions } from 'vuex';
export default {
    data(){
        return {
                mainInput:new inputModel(),
                mainTableLoading:false,
                selectRows:[],
                currentRows:{},
                inputParams:{
                    firstKeys:[],
                    firstValues:[]
                },
                refList:{},
                extensionObj:{},
                tableData:[],
                itemFormVisible:false,
                itemConf:{
                    dialogConf:{
                        title:'',
                        size:'small',
                        top:'8%',
                        }, 
                        option:{}
                   },
                apiConf:{},
                baseInfoConf:{},
                filterConf:{},
                tableInfoConf:{},
                functionConf:{},
            }
    },
    props:{
          
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
                globConf:{
                    get(){
                        return util.getLocalStorage('SysGlobConf');
                    }
                },
                ...mapGetters([ 'getIsVisible','getBaseinfoConf','getApiConf','getFliterConf','getTableinfoConf','getFunctionConf' ]),
                ...mapGetters([ 'getGlobObject1','getGlobObject2','getGlobString1','getGlobString2','getGlobArray1' ]),
        },
    methods:{
        ...mapActions(['setGlobObject1','setGlobObject2','setGlobString1','setGlobString2','setGlobalArray1']),
        ...mapActions({ setSelectRows: 'setSelectRows',setType:'setType' }),
        _reload(){
            this._loadData();
            this._funcState();
        },
        _loadData(){
            let _this=this;
             //清除选中值
            this.selectRows=[];
            this.mainTableLoading=true;
            let inputArr={};
            inputArr.firstKeys=[];
            inputArr.firstValues=[];
            //外来参数
            if(this.filterConf.selfFilterConf.length>0){
                inputArr.firstKeys.push(this.filterConf.selfFilterConf[0].name);
                inputArr.firstValues.push(this.filterConf.selfFilterConf[0].op+this.filterConf.searchModel[this.filterConf.selfFilterConf[0].name]+this.filterConf.selfFilterConf[0].op);
            };
            this.filterConf.searchFilterConf.up.forEach((item,index)=>{
                inputArr.firstKeys.push(item.name);
                inputArr.firstValues.push(item.op+this.filterConf.searchModel[item.name]+item.op);
            });
            this.filterConf.searchFilterConf.down.forEach((item,index)=>{
                 inputArr.firstKeys.push(item.name);
                 inputArr.firstValues.push(item.op+this.filterConf.searchModel[item.name]+item.op);
            });
            if(this.inputParams.firstKeys!==undefined){
                 inputArr.firstKeys.push(...this.inputParams.firstKeys);
                 inputArr.firstValues.push(...this.inputParams.firstValues);
            }
            let params=this.apiConf.filterParams;     
            params.firstKeys=inputArr.firstKeys.join(",");  
            params.firstValues=inputArr.firstValues.join(",");
            this._beforeLoad(params);
            fetch({
                  url: '/api/services/app/sqlExecute/ExecuteSqlAndProcCommand',
                  method: 'post',
                  data:params
            }).then(data=>{    
                        if(data.success){
                            if(data.result.resultType===0){
                                  this.extensionObj.table=data.result.items;
                                  this._afterLoad();
                                  this.tableData=this.extensionObj.table[0];
                            }
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
       _getSelectRows(){
             this.setSelectRows(this.selectRows);
             this.setType(this.baseInfoConf.dialogConf.dataType);
             this._close();
             
        },
         _close(){
            if(this.baseInfoConf.dialogConf.afterAddClose==undefined){
                if(this.globConf.selection.afterAddClose){
                     this.$emit('close');
                }
            }else{
                if(this.baseInfoConf.dialogConf.afterAddClose){
                     this.$emit('close');
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
        toggleRowSelection (row) {
            this.$refs.queryTableR.toggleRowSelection(row);
            this._rowclick(row);
        },
        _exportExecl(fname){
            let fileName='';
            if(fname==undefined){
                if(this.baseInfoConf.panelpage==undefined){
                    fileName='报表名缺省';
                }else{
                    fileName=this.baseInfoConf.panelpage.titleName;
                }
            }else{
                fileName=fname;
            }
            this.exportCommonTemplate(this.tableInfoConf.columns,this.tableData,fileName)
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
        //事件触发方法----
        _initComs(_coms){
           let _this=this,option=_coms.option;
           if(option.eventConf!=undefined){
            if(option.eventConf.isOn){
                if(option.eventConf.init!=undefined){
                     option.eventConf.init(_this,option);
                }
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
                            option.eventConf.init(_this,option);
                    }
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
                 this.inputParams.firstKeys.push(item.key);
                 this.inputParams.firstValues.push(item.op+item.value+item.op);
            });
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
        init(){
            
            this._inputArrInit();
            //初始化拦截
            this._mounted();
            //一些初始化逻辑
            this._loadData();
        },
    },
    components:{
        },
    created(){
        this.apiConf=this.getApiConf;
        this.baseInfoConf=this.getBaseinfoConf;
        this.filterConf=this.getFliterConf;
        this.tableInfoConf=this.getTableinfoConf;
        this.functionConf=this.getFunctionConf;
        this.searchModel=this.getFliterConf.searchModel;

    },
    beforeMount(){
    },
    mounted(){
        this.init();  
    },
    watch:{
       
    }
   
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

