<template>
     <yl-columnlay  
        :border="baseInfoConf.layout.border"
        :style="baseInfoConf.dialogConf.style"
        :hiddenLeft="baseInfoConf.layout.columnlay.hiddenLeft">
              <div slot="left">
                       <!--这里只能渲染带panel的树组件-->
                        <yl-renderselcoms  
                            @getCurrentNodeWithPanel="_getCurrentNodeWithPanel"
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
                                                    v-text="functionConf.searchBtn.text"  
                                                    @click="_functionClick(functionConf.searchBtn)"> 
                                                    <i :class="functionConf.searchBtn.icon"></i>
                                                    {{functionConf.searchBtn.text}}  
                                               </el-button>
                                         </el-form-item>
                                </yl-toolbar>
                                <yl-toolbar v-if="baseInfoConf.layout.columnlay.downToolFilter.visiable">
                                 <!--过滤器-->
                                        <el-form-item class="form-content-vertical" v-for="(item,index) in filterConf.searchFilterConf.down" :key="index">
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
                                   <el-button v-for="(item,index) in functionConf.funBtn"  :key="index"
                                                :type="item.type" 
                                                :name="item.name" 
                                                :size="item.size" 
                                                v-permissionSetting="item.permissionSetting"
                                                v-show="item.isShow"
                                                :disabled="item.disabled"  
                                                @click="_functionClick(item)">
                                            <i :class="item.icon"></i>{{item.text}}</el-button>
                                </el-button-group>
                             </yl-toolbar>
                        </div>
                        <div slot="secondbox" class="flexbox">
                         <!--表显示区域-->
                             <yl-table ref="selecttable"
                                    @reload="_reload"
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
                searchModel:{},
                selectRows:[],
                currentRows:{},
                inputParams:[],
                apiConf:{},
                baseInfoConf:{},
                filterConf:{},
                tableInfoConf:{},
                functionConf:{},
                refList:{},
                extensionObj:{},
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
        },
        _loadData(){
            let _this=this;
            this.selectRows=[];
            this.mainTableLoading=true;
            let inputArr=[];
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
            inputArr.push(...this.inputParams);
            this.mainInput.addqueryConditionItem(inputArr);
            this.mainInput.inputModel.sorting=this.filterConf.sorting;
            let _apiconf=this.apiConf.getMainPageList;
            _apiconf.data=this.mainInput.inputModel;
            this._beforeLoad(_apiconf);
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
        _selectionChange(val){
           //多选方法
            if(val!=null){
                this.selectRows=[];
                this.selectRows=this.selectRows.concat(val);
            }
       },
        _currentChange(val){
                //单选时的方法
                if(val!=null){
                    this.selectRows=[];
                    this.selectRows.push(val);
                }
                this._funcState();
        },
        toggleRowSelection (row) {
            this.$refs.selecttable.toggleRowSelection(row);
            this._rowclick(row);
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
            let eventConf=this.functionConf.funState.eventConf;
            if(eventConf!=undefined){
                if(eventConf.isOn){
                    eventConf.click(this.selectRows,_this);
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
        _tableSlotEvent(row,item){
            let _this=this;
            let eventConf=item.eventConf;
            if(eventConf!=undefined){
                if(eventConf.isOn){
                    if(eventConf.click!=undefined){
                        eventConf.click(row,item.name,_this);
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
    mounted(){
        this.init();
    },
   
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

