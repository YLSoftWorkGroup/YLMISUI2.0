<template>
     <!--数据集查询容器-->
   <yl-querycontainerR  ref="querycontainerR"
        v-if="option.type==='querycontainerR'" 
        :baseInfoConf="option.elmentConfig.baseInfoConf"
        :apiConf="option.elmentConfig.apiConf"
        :filterConf="option.elmentConfig.filterConf"
        :tableInfoConf="option.elmentConfig.tableInfoConf"
        :functionConf="option.elmentConfig.functionConf"
        :style="option.elmentConfig.style"
        :outParams="outParams"
   >
   </yl-querycontainerR>


    <!--list列表数据集查询容器-->
   <yl-querylistR  ref="querylistR"
        v-else-if="option.type==='querylistR'" 
        :baseInfoConf="option.elmentConfig.baseInfoConf"
        :apiConf="option.elmentConfig.apiConf"
        :filterConf="option.elmentConfig.filterConf"
        :tableInfoConf="option.elmentConfig.tableInfoConf"
        :functionConf="option.elmentConfig.functionConf"
        :style="option.elmentConfig.style"
        :outParams="outParams"
   >
   </yl-querylistR>

    <!--模块数据集查询容器-->
   <yl-dynamicmodule ref="querycontainer"
        v-else-if="option.type==='querycontainer'" 
        :baseInfoConf="option.elmentConfig.baseInfoConf"
        :apiConf="option.elmentConfig.apiConf"
        :filterConf="option.elmentConfig.filterConf"
        :tableInfoConf="option.elmentConfig.tableInfoConf"
        :functionConf="option.elmentConfig.functionConf"
        :formConf="option.elmentConfig.formConf"
        :outPutConf="option.elmentConfig.outPutConf"
        :outParams="outParams"
        :style="option.elmentConfig.style"
   >
   </yl-dynamicmodule>


  <!--图表展示容器-->
   <yl-queryChart  ref="queryChart"
        v-else-if="option.type==='queryChart'" 
        :baseInfoConf="option.elmentConfig.baseInfoConf"
        :apiConf="option.elmentConfig.apiConf"
        :filterConf="option.elmentConfig.filterConf"
        :tableInfoConf="option.elmentConfig.tableInfoConf"
        :functionConf="option.elmentConfig.functionConf"
        :style="option.elmentConfig.style"
        :outParams="outParams"
   >
   </yl-queryChart>

   
    <!--html容器-->
   <yl-htmlContainer ref="htmlContainer"
        v-else-if="option.type==='htmlContainer'" 
        :baseInfoConf="option.elmentConfig.baseInfoConf"
        :apiConf="option.elmentConfig.apiConf"
        :filterConf="option.elmentConfig.filterConf"
        :tableInfoConf="option.elmentConfig.tableInfoConf"
        :functionConf="option.elmentConfig.functionConf"
        :style="option.elmentConfig.style"
        :outParams="outParams"
    >
   </yl-htmlContainer>   
   
   

   <!--html内容渲染静态页面-->
     <yl-htmlRaw ref="htmlRaw"
        v-else-if="option.type==='htmlRaw'" 
        :content="option.elmentConfig.content" 
        :style="option.elmentConfig.style"
    >
    </yl-htmlRaw>

    <!--提醒块-->
     <yl-alert ref="alert"
        v-else-if="option.type==='alert'" 
        :title="option.elmentConfig.title" 
        :description="option.elmentConfig.description" 
        :type="option.elmentConfig.type" 
        :showIcon="option.elmentConfig.showIcon" 
        :closable="option.elmentConfig.closable" 
        :closeText="option.elmentConfig.closeText" 
        :style="option.elmentConfig.style"
    >
    </yl-alert>
     <!--评论插件-->
   <yl-commemt ref="commemt"
        v-else-if="option.type==='commemt'" 
        :dataId="option.elmentConfig.dataId"
        :commentModule="option.elmentConfig.commentModule"
        :maxContent="option.elmentConfig.maxContent"
        :pageSize="option.elmentConfig.pageSize"
        :style="option.elmentConfig.style"
    >
   </yl-commemt>   
   
   <!--统计块容器-->
   <yl-statisticsBlock ref="statisticsBlock"
        v-else-if="option.type==='statisticsBlock'" 
        :style="option.elmentConfig.style"
        :backgroudColor="option.elmentConfig.backgroudColor"
        :theme="option.elmentConfig.theme"
        :duration="option.elmentConfig.duration"
        :number="option.elmentConfig.number"
        :unit="option.elmentConfig.unit"
        :title="option.elmentConfig.title"
        :linkUrl="option.elmentConfig.linkUrl"
        :icon="option.elmentConfig.icon"
        :eventConf="option.eventConf"
    >
   </yl-statisticsBlock>   

    <!-- echart组件 -->
     <yl-echarts ref="echarts"
        v-else-if="option.type==='echarts'" 
        :options="option.elmentConfig.options"
        :autoResize="option.elmentConfig.autoResize"
        :initOptions="option.elmentConfig.initOptions"
        :group="option.elmentConfig.group"
        :watchShallow="option.elmentConfig.watchShallow"
        :style="option.elmentConfig.style"
   >
   </yl-echarts>

    <!-- 实时分页表格组件 -->
      <yl-table ref="queryTable"
            v-else-if="option.type==='queryTable'" 
            @reload="_method1"
            @loading="_loading"
            :configs="option.elmentConfig.tableInfoConf"
            :tableData="option.elmentConfig.tableData" 
            :pagination="option.elmentConfig.pagination" 
            :tableloading="option.elmentConfig.tableloading"
            :style="option.elmentConfig.style" 
            >
            <template :slot="item.name" scope="scope" v-for="(item,index) in option.elmentConfig.tableInfoConf.solSlotConf"> 
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

    <!-- 后分页表格组件 -->
      <yl-tableR ref="queryTableR"
            v-else-if="option.type==='queryTableR'" 
            @reload="_method1"
            @loading="_loading"
            :configs="option.elmentConfig.tableInfoConf"
            :tableData="option.elmentConfig.tableData" 
            :pagination="option.elmentConfig.pagination" 
            :tableloading="option.elmentConfig.tableloading"
            :style="option.elmentConfig.style" 
            >
            <template :slot="item.name" scope="scope" v-for="(item,index) in option.elmentConfig.tableInfoConf.solSlotConf"> 
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


     <!-- 不分页table -->
      <yl-onlytable ref="onlyTable"
            v-else-if="option.type==='onlyTable'" 
            @reload="_method1"
            :configs="option.elmentConfig.tableInfoConf"
            :tableData="option.elmentConfig.tableData" 
            :tableloading="option.elmentConfig.tableloading"
            :style="option.elmentConfig.style" 
            >
            <template :slot="item.name" scope="scope" v-for="(item,index) in option.elmentConfig.tableInfoConf.solSlotConf"> 
                    <yl-tableSlotComs 
                        :key="index"
                        :option="item" 
                        :row="scope.row" 
                        :name="item.name"
                        @tableSlotEvent="_tableSlotEvent"
                        >
                    </yl-tableSlotComs>
            </template>
     </yl-onlytable>

    <!-- list组件 -->
    <yl-list ref="list"
            v-else-if="option.type==='list'" 
            :dataList="option.elmentConfig.dataList" 
            :listOptions="option.elmentConfig.listOptions"
            :pagination="option.elmentConfig.pagination" 
            :tableloading="option.elmentConfig.tableloading" 
            :style="option.elmentConfig.style"
            @loading="_loading"
            >
    </yl-list>


    <!-- 过滤器组件 -->
    <yl-filter ref="filter"
            v-else-if="option.type==='filter'" 
            :filterConf="option.elmentConfig.filterConf" 
            :searchModel="option.elmentConfig.searchModel"
            :style="option.elmentConfig.style"
            >
    </yl-filter>


    <!-- 表单组件 -->
    <yl-formContainer ref="formContainer"
            v-else-if="option.type==='formContainer'" 
            :style="option.elmentConfig.style"
            >
    </yl-formContainer>

    <!-- 合计块 -->
    <yl-sumblock ref="sumblock"
            v-else-if="option.type==='sumblock'" 
            :isReport="option.elmentConfig.isReport" 
            :dataList="option.elmentConfig.dataList" 
            :item="option.elmentConfig.item"
            :style="option.elmentConfig.style"
            >
    </yl-sumblock>
    
    <!-- 链接块 -->
    <yl-linkblock ref="linkblock"
            v-else-if="option.type==='linkblock'" 
            :confList="option.elmentConfig.confList" 
            :style="option.elmentConfig.style"
            >
    </yl-linkblock>

     <!-- 地图块 -->
    <yl-map ref="map"
            v-else-if="option.type==='map'" 
            :styl="option.elmentConfig.styl"
            :cursor="option.elmentConfig.cursor"
            :isHotspot="option.elmentConfig.isHotspot"
            :showIndoorMap="option.elmentConfig.showIndoorMap"
            :expandZoomRange="option.elmentConfig.expandZoomRange"
            :dragEnable="option.elmentConfig.dragEnable"
            :zoomEnable="option.elmentConfig.zoomEnable"
            :doubleClickZoom="option.elmentConfig.doubleClickZoom"
            :keyboardEnable="option.elmentConfig.keyboardEnable"
            :jogEnable="option.elmentConfig.jogEnable"
            :scrollWheel="option.elmentConfig.scrollWheel"
            :mapStyle="option.elmentConfig.mapStyle"
            :center="option.elmentConfig.center"
            :plugin="option.elmentConfig.plugin"
            :searchBox="option.elmentConfig.searchBox"
            :style="option.elmentConfig.style"
            >
    </yl-map>


 </template>

<script type="text/babel">
import globalJS from '@/common/js/globalJS';
import fetch from '@/api/fetch';
import util from '@/common/js/util';
import { mapGetters,mapActions } from 'vuex';
export default {
    data(){
        return{
        }
    },
    props:{
        option:{
            type:Object,
            require:true,
            default:function(){
                return {}
            }
        },
        outParams:{   
            type:Object,
            require:false,
            default:function(){
                return {}
            }
        },
        constPrams:{
            type:Object,
            default:function(){
                return {}
            }
        },
        
        refList:{
            type:Object,
            require:false,
            default:function(){
                return {}
            }
        },
    },
    computed:{
         globalFunObject:{
            get(){
                return globalJS;
            }
        },
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
         ...mapGetters([ 'getGlobObject1','getGlobObject2','getGlobString1','getGlobString2','getGlobArray1' ]),
    },
    methods:{
        ...mapActions(['setGlobObject1','setGlobObject2','setGlobString1','setGlobString2','setGlobalArray1']),
        _initComs(){
            let _this=this;
            if(_this.option.InterceptEvent!=undefined){
                let eventConf=_this.option.InterceptEvent.init;
                    if(eventConf!=undefined){
                        if(eventConf.isOn){
                            eventConf.event(_this);
                            //在此处赋值
                        }
                    }  
            }
        },
        _loading(isloading){
             this.option.elmentConfig.tableloading=!isloading;
        },
        _watchConstParams(n){
            let _this=this;
            if(_this.option.WatchEvent!=undefined){
                let eventConf=_this.option.WatchEvent.constPrams;
                 if(eventConf!=undefined){
                        if(eventConf.isOn){
                            eventConf.event(_this,n);
                        }
                    }  
            }
        },
        _watchGlobParams(n){
            let _this=this;
            if(_this.option.WatchEvent!=undefined){
              
                let eventConf=_this.option.WatchEvent.getGlobString2;
                 if(eventConf!=undefined){
                        if(eventConf.isOn){
                            eventConf.event(_this,n);
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
                                    let conf=_this.option.elmentConfig.tableInfoConf.itemConf[item.name];
                                    eventConf.click(row,item.name,_this,conf);
                                    this.setGlobObject1(conf);
                                    this.setGlobString2('itemOpen_'+Math.round(Math.random()*100000));
                               }else{
                                   eventConf.click(row,item.name,_this);
                               }
                            }
                        }
                    }

        },
        _method1(node){
            this.$emit('method1',node,this);
        },
        _method2(node){
            this.$emit('method2',node,this);
        },
        _method3(node){
            this.$emit('method3',node,this);
        },
        _method4(node){
            this.$emit('method4',node,this);
        },
        collect(){
             let name='';
             if(this.option.name){
                 name=this.option.name
             }else{
                 name=this.option.type
             }
            this.refList[name]=this.$refs;
        }
    },
    components:{
    },
    beforeMount(){
       this._initComs();   
       this.collect();
    },
    watch:{
        constPrams:{
            handler(n,o){
                this._watchConstParams(n);
            },
        },
        getGlobString2:{
             handler(n,o){
                this._watchGlobParams(n);
            },   
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
