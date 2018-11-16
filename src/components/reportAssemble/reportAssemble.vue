<template>
<yl-panelpage 
    :titleName="baseInfoConf.panelpage.titleName" 
    :icon="baseInfoConf.panelpage.icon" 
    :reloadIsShow="baseInfoConf.panelpage.reloadIsShow" 
    :fullScreenIsShow="baseInfoConf.panelpage.fullScreenIsShow" 
    :helpIsShow="baseInfoConf.panelpage.helpIsShow" 
    :isZone="baseInfoConf.panelpage.isZone"
    :theme="baseInfoConf.panelpage.theme"
    :BackIsShow="baseInfoConf.panelpage.backIsShow"
>
    <div slot="content">  
        <yl-columnlay 
            :border="baseInfoConf.layout.border"
            :hiddenLeft="baseInfoConf.layout.columnlay.hiddenLeft">
                <div slot="left">
                        <!--这里只能渲染带panel的树组件-->
                            <yl-renderselcoms  
                                @init="_initSelComs"
                                @getCurrentNodeWithPanel="_getCurrentNodeWithPanel"
                                :option="filterConf.selfFilterConf.length>0?filterConf.selfFilterConf[0]:{}">
                            </yl-renderselcoms>
                </div>
                <div slot="right" >
                        <yl-layout>
                            <div slot="fristbox" >
                                <el-form :inline="true" >
                                    <yl-toolbar v-if="baseInfoConf.layout.columnlay.upToolFilter.visiable">
                                    <!--过滤器-->
                                            <el-form-item class="form-content-vertical" v-for="(item,index) in filterFormConf.up" :key="index">
                                                    <yl-rendercoms  
                                                        :option="item"
                                                        :refList="refList"
                                                        :model="searchModel"
                                                        @change="_change"
                                                        @blur="_blur"
                                                        @method1="_method1"
                                                        @method2="_method2"
                                                        @init="_initComs">
                                                    </yl-rendercoms>
                                            </el-form-item>
                                             <el-form-item class="form-content-vertical" v-if="functionConf.searchBtn">
                                              <el-button 
                                                    v-show="functionConf.searchBtn.isShow"
                                                    :disabled="functionConf.searchBtn.disabled"  
                                                    :type="functionConf.searchBtn.type" 
                                                    :size="functionConf.searchBtn.size" 
                                                    @click="_loadData()"> 
                                                    <i :class="functionConf.searchBtn.icon"></i>
                                                    {{functionConf.searchBtn.text}}  
                                               </el-button>
                                         </el-form-item>
                                    </yl-toolbar>
                                    
                                    <yl-toolbar v-if="baseInfoConf.layout.columnlay.downToolFilter.visiable">
                                    <!--过滤器-->
                                            <el-form-item class="form-content-vertical" 
                                                v-for="(item,index) in filterFormConf.down"  
                                                :key="index">
                                                    <yl-rendercoms  
                                                        :option="item" 
                                                        :model="searchModel"
                                                        :refList="refList"
                                                        @change="_change"
                                                        @blur="_blur"
                                                        @method1="_method1"
                                                        @method2="_method2"
                                                        @init="_initComs">
                                                    </yl-rendercoms>
                                            </el-form-item>
                                            
                                    </yl-toolbar>
                                </el-form>
                            </div>
                            <div slot="secondbox" class="flexbox content">
                                         <el-tabs v-model="activeName" 
                                            :type="tableInfoConf.type" 
                                            @tab-click="_tabClick"
                                            >
                                            <el-tab-pane v-for="(item,index) in tableInfoConf.tabList"
                                                :label="item.tabpaneConf.label" 
                                                :name="item.tabpaneConf.name" 
                                                :disabled="item.tabpaneConf.disabled"
                                                :closable="item.tabpaneConf.closable"
                                                :key="index"
                                                >
                                                <yl-containercoms     
                                                        ref="containercoms"
                                                        @init="_initContainerComs"
                                                        v-if="activeName===item.tabpaneConf.name"
                                                        :option="item.childModuleConf.option"
                                                        :outParams="outParams"
                                                >
                                                </yl-containercoms> 
                                            </el-tab-pane>
                                        </el-tabs>
                             </div>
                        </yl-layout> 
                </div>  
        </yl-columnlay>
    </div>
    
</yl-panelpage>
</template>

<script type="text/babel">
import fetch from '@/api/fetch';
import util from '@/common/js/util';
import globalJS from '@/common/js/globalJS';
import { mapGetters,mapActions } from 'vuex';
export default {
    data(){
        return {
            refList:{},
            extensionObj:{},
            searchModel:{},
            filterFormConf:{},
            inputParams:{
                    firstKeys:[],
                    firstValues:[]
                },
            outParams:{
                firstKeys:[],
                firstValues:[]
            },    
            tableData:[],
            activeName:'',
            itemFormVisible:false,
            itemConf:{
                dialogConf:{  
                    title:'',
                    size:'',
                    top:'',
                }, 
                option:{}
            },
          }
     },
    props:{
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
            ...mapGetters([ 'getGlobObject1','getGlobObject2','getGlobString1','getGlobString2','getGlobArray1' ]),
     },
    methods:{
      ...mapActions(['setGlobObject1','setGlobObject2','setGlobString1','setGlobString2','setGlobalArray1']),
        _tabClick(val){
            this.activeName=val.name;
        },
        _loadData(){
                let _this=this;
                //清除选中值
                let inputArr={};
                inputArr.firstKeys=[];
                inputArr.firstValues=[];
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
                //拦截
                this._beforeLoad(inputArr);
                

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
         //请求拦截
         _beforeLoad(inputArr){
                let _this=this;
                if(this.filterConf.InterceptEvent!=undefined){
                    let eventConf=this.filterConf.InterceptEvent.beforeLoad;
                    if(eventConf!=undefined){
                        if(eventConf.isOn){
                            let params=eventConf.event(_this,inputArr);
                                if(params===undefined){
                                    this.outParams=inputArr;
                                }else{
                                    this.outParams=params;
                                }
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
                    this._loadData();
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
        _initContainerComs(_coms){
            let _this=this,option=_coms.option;
            if(option.InterceptEvent!=undefined){
                let eventConf=option.InterceptEvent.init.eventConf;
                 if(eventConf!=undefined){
                        if(eventConf.isOn){
                            eventConf.event(_this,option,_coms.outParams);
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
        async init(){
            this._inputArrInit();
            //初始化拦截
            this._mounted();
            //查询数据
           
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
        
     },
    components:{
     },
    created(){
        this.searchModel=this.filterConf.searchModel;
        this.filterFormConf=this.filterConf.searchFilterConf;
        this.activeName=this.tableInfoConf.activeName;
    },
    beforeMount(){
        this.init();
    },
    mounted(){
        this._loadData();
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
<style lang="css" rel="stylesheet/css" scoped>
.el-tabs--border-card{
    border:none;
}
.el-tab-pane{
    height:100%;
}
.content{
    overflow:auto;
}
</style>

