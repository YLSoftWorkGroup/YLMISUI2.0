<template>
     <yl-columnlay  
        :border="baseInfoConf.layout.border"
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
                                        <el-form-item 
                                            class="form-content-vertical" 
                                            v-for="(item,index) in filterFormConf.up" :key="index">
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
                                            <i :class="item.icon"></i>{{item.text}}</el-button>
                                </el-button-group>
                             </yl-toolbar>
                        </div>
                        <div slot="secondbox" class="flexbox">
                         <!--报表显示区域-->
                                <yl-echarts 
                                    :options="options" 
                                    ref="chartref" 
                                    auto-resize>
                                </yl-echarts>
                        </div>
                    </yl-layout> 

            <!--动态容器-->
                <el-dialog ref="dynamicDialog" 
                    v-model="itemFormVisible" 
                    :close-on-click-modal="true"
                    lock-scroll
                    :modal-append-to-body="false"
                    :title="itemConf.dialogConf.title" 
                    :size="itemConf.dialogConf.size"
                    :top="itemConf.dialogConf.top">
                     <yl-containercoms     
                            v-if="itemFormVisible"
                            :option="itemConf.option"
                            :outParams="itemConf.outParams"
                            @init="_initContainerComs"
                    > 
                    </yl-containercoms>
                </el-dialog>

               </div>  
                
      </yl-columnlay>
</template>

<script type="text/babel">
import fetch from '@/api/fetch';
import util from '@/common/js/util';
import globalJS from '@/common/js/globalJS';
import { mapGetters,mapActions } from 'vuex';
import filterParams from '@/mixns/filterParams.js';
export default {
    mixins:[filterParams],
    data(){
        return {
                searchModel:{},
                filterFormConf:{},
                inputParams:{
                    firstKeys:[],
                    firstValues:[]
                },
                refList:{},
                extensionObj:{},
                itemFormVisible:false,
                itemConf:{
                    dialogConf:{
                        title:'',
                        size:'small',
                        top:'8%',
                        }, 
                        option:{}
                   },
               funBtnConf:{},
               options:{},
               listenEvent:{},
               timeNode:{},
            }
    },
    props:{
            apiConf:{
                require:true,
                type:Object,
                default:function(){
                    return {};
                    }
            },
            baseInfoConf:{
                require:true,
                type:Object,
                default:function(){
                    return {};
                    }
            },
            filterConf:{
                require:true,
                type:Object,
                default:function(){
                    return {};
                    }
            },
            tableInfoConf:{
                require:true,
                type:Object,
                default:function(){
                    return {};
                    }
            },
            functionConf:{
                require:true,
                type:Object,
                default:function(){
                    return {};
                    }
            },
            outParams:{
                require:true,
                type:Object,
                default:function(){
                        return {
                            firstKeys:[],
                            firstValues:[]
                        }
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
                ...mapGetters([ 'getGlobObject1','getGlobObject2','getGlobString1','getGlobString2','getGlobArray1' ]),
        },
    methods:{
        ...mapActions(['setGlobObject1','setGlobObject2','setGlobString1','setGlobString2','setGlobalArray1']),
        _reload(){
            this._loadData();
            this._funcState();
        },
        _loadData(){
            let _this=this;
             //清除选中值
            let inputArr={};
            inputArr.firstKeys=[];
            inputArr.firstValues=[];
            //外来参数
            _this._formatOutParams(this.outParams);
            if(this.outParams.firstKeys!=undefined){
                inputArr.firstKeys.push(...this.outParams.firstKeys);
                inputArr.firstValues.push(...this.outParams.firstValues);
            }
            if(this.filterConf.selfFilterConf.length>0){
                inputArr.firstKeys.push(this.filterConf.selfFilterConf[0].name);
                inputArr.firstValues.push(this.filterConf.selfFilterConf[0].op+this.searchModel[this.filterConf.selfFilterConf[0].name]+this.filterConf.selfFilterConf[0].op);
            };
            this.filterConf.searchFilterConf.up.forEach((item,index)=>{
                inputArr.firstKeys.push(item.name);
                inputArr.firstValues.push(item.op+this.searchModel[item.name]+item.op);
            });
            this.filterConf.searchFilterConf.down.forEach((item,index)=>{
                 inputArr.firstKeys.push(item.name);
                 inputArr.firstValues.push(item.op+this.searchModel[item.name]+item.op);
            });
            if(this.inputParams.firstKeys!==undefined){
                 inputArr.firstKeys.push(...this.inputParams.firstKeys);
                 inputArr.firstValues.push(...this.inputParams.firstValues);
            }
             //添加时间过滤
            if(this.timeNode.beginDate!=undefined){
               this.timeNode=this.$refs.timeBar.getDate();
               inputArr.firstKeys.push(...['BeginDate','EndDate']);
              let op=this.filterConf.searchFilterConf.timebar.op?this.filterConf.searchFilterConf.timebar.op:"#";
               inputArr.firstValues.push(op+this.timeNode.beginDate+op);
               inputArr.firstValues.push(op+this.timeNode.endDate+op);
            }
            let params=this.apiConf.filterParams;     
            params.firstKeys=inputArr.firstKeys.join(",");  
            params.firstValues=inputArr.firstValues.join(",");
            this._beforeLoad(params);
            //缓存参数写入
            this.setFilterParams(params)
            fetch({
                  url: '/api/services/app/sqlExecute/ExecuteSqlAndProcCommand',
                  method: 'post',
                  data:params
            }).then(data=>{    
                        if(data.success){
                            if(data.result.resultType===0){
                                  this.extensionObj.table=data.result.items;
                                  this._afterLoad();
                            }
                        }
                        else {
                            this.$message.error('失败！'+data.error.message);
                        }
                    }).catch(function(error){
                        _this.$message.error('获取数据失败！');
                    });
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
        _functionClick(item){
            let _this=this;
            let eventConf=item.eventConf;
            if(eventConf!=undefined){
                if(eventConf.isOn){
                    eventConf.click(item.name,_this);
                }
            }
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
        //事件触发方法----
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
        // _tableSlotEvent(row,item){
        //     let _this=this;
        //             let eventConf=item.eventConf;
        //             if(eventConf!=undefined){
        //                 if(eventConf.isOn){
        //                     if(eventConf.click!=undefined){
        //                         //对配置内容进行拦截处理
        //                        if(item.isContainer){
        //                             let conf=_this.tableInfoConf.itemConf[item.name];
        //                             eventConf.click(row,item.name,_this,conf);
        //                             this.itemConf=conf;
        //                             this.itemFormVisible=true;
        //                        }else{
        //                            eventConf.click(row,item.name,_this);
        //                        }
        //                     }
        //                 }
        //             }

        // },
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
        _initContainerComs(_coms){
            let _this=this,option=_coms.option;
            if(option.InterceptEvent!=undefined){
                let eventConf=option.InterceptEvent.init;
                 if(eventConf!=undefined){
                        if(eventConf.isOn){
                            eventConf.event(_this,option,_coms.outParams);
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
        _listenEvent(){
                let _this=this;
                if(this.filterConf.InterceptEvent!=undefined){
                    let eventConf=this.filterConf.InterceptEvent.listenEvent;
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
            //加载数据
            if(this.filterConf.immediately||this.filterConf.immediately==undefined){
                this._loadData();
            }
              //一些初始化逻辑
            if(this.filterConf.loadListen!==undefined){
                if(this.filterConf.loadListen.isOn){
                        this.listenEvent=setInterval(()=>{
                           //监听拦截事件
                           this._listenEvent();
                        },this.filterConf.loadListen.Num);  
                 }
            }
        },
    },
    created(){
        this.searchModel=this.filterConf.searchModel;
        this.filterFormConf=this.filterConf.searchFilterConf;
        this.funBtnConf=this.functionConf.funBtn;
        this.options=this.tableInfoConf.options;
    },
    beforeMount(){
    },
    mounted(){
        this.init();  
    },
    beforeDestroy() {
        //清除监听
        if(this.filterConf.loadListen!==undefined){
                 if(this.filterConf.loadListen.isOn){
                     window.clearInterval(this.listenEvent);
                 }
            } 
   },
   components: {
    },
    watch:{
        outParams:function(n,o){
            this._reload();
        }
    }
   
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.echarts
    width 100%
    height 100%
</style>

