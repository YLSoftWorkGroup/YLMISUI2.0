<template>
<div class="yl-filter">
     <el-form :model="searchModel" ref="filterContainer" :label-width="filterConf.labelWidth" >
        <el-col :span="24">
            <!-- timeBar -->
                <yl-timebar v-if="filterConf.timebar" 
                            :format="filterConf.timebar.format"
                            :dataPickOptions="filterConf.timebar.dataPickOptions"
                            :btnItems="filterConf.timebar.btnItems"
                            :currentValue="filterConf.timebar.currentValue"
                            @click="_timeBarEvent"
                            @init="_timeBarInit"
                            ref="timeBar"
                        >
                </yl-timebar>
        </el-col>
        <el-col :span="item.position.spanNum" 
                :style="item.position.style"
                v-for="(item,index) in filterConf.formConfig" :key="index" >
                <el-form-item class="form-label"
                    :label="item.title"
                    :key="index"
                    :prop="item.name">
                    <yl-rendercoms 
                        :option="item"
                        :refList="refList"
                        :model="searchModel"
                        @change="_change"
                        @blur="_blur"
                        @init="_initComs"
                        @method1="_method1"
                        @method2="_method2"
                    >
                    </yl-rendercoms>
                </el-form-item>
        </el-col>
    </el-form>
   
</div>
</template>

<script type="text/babel">
import { mapGetters,mapActions } from 'vuex';
import fetch from '@/api/fetch';
import util from '@/common/js/util';
import filterParams from '@/mixns/filterParams.js';
export default {
    mixins:[filterParams],
    data(){
        return {
            refList:{},
            timeNode:{},
            inputParams:{
                    firstKeys:[],
                    firstValues:[]
                },
        }
    },
    props:{
        filterConf:{
            type:Object,
            default: function(){
                    return []
                }
        },
        searchModel:{
            type:Object,
            default: function(){
                    return {
                    }
                }
        }
    },
    computed:{
        ...mapGetters([ 'getGlobObject1','getGlobObject2','getGlobString1','getGlobString2','getGlobArray1' ]),
    },
    methods:{
        ...mapActions(['setGlobObject1','setGlobObject2','setGlobString1','setGlobString2','setGlobalArray1']),
         _loadData(){
            this._getParams();
            this.setGlobString2('reload_'+Math.round(Math.random()*100000));
         },
         _getParams(){
            //该方法重置数据集
            if(this.filterConf.type==='report'){
                //报表情形
                let inputArr={};
                inputArr.firstKeys=[];
                inputArr.firstValues=[];
                if(this.filterConf.formConfig.length>0){
                    this.filterConf.formConfig.map((i)=>{
                        if(i.name!=''){
                            inputArr.firstKeys.push(i.name);
                            inputArr.firstValues.push(i.op+this.searchModel[i.name]+i.op);
                        }
                    })
                };
                //inputArr
                if(this.inputParams.firstKeys!==undefined){
                    inputArr.firstKeys.push(...this.inputParams.firstKeys);
                    inputArr.firstValues.push(...this.inputParams.firstValues);
                }

                //添加时间过滤
                if(this.timeNode.beginDate!=undefined){
                    this.timeNode=this.$refs.timeBar.getDate();
                    inputArr.firstKeys.push(...['BeginDate','EndDate']);
                    let op=this.filterConf.timebar.op?this.filterConf.timebar.op:"#";
                    inputArr.firstValues.push(op+this.timeNode.beginDate+op);
                    inputArr.firstValues.push(op+this.timeNode.endDate+op);
                }
                let params={};     
                params.firstKeys=inputArr.firstKeys.join(",");  
                params.firstValues=inputArr.firstValues.join(",");

                //缓存参数写入
                this.setFilterParams(params,'filter')

                this.setGlobObject2(params);
            }else{
                //带条件的过滤转化
                
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
         //时间工具条
        _timeBarEvent(node){
            let _this=this;
            if(this.filterConf.timebar!=undefined){
                this.timeNode=node;
                let eventConf=this.filterConf.timebar.eventConf;
                if(eventConf!=undefined){
                    if(eventConf.isOn){
                        eventConf.click(node,_this);
                    }
                }
            }
        },
         _timeBarInit(node){
             let _this=this;
             this.timeNode=node;
             let eventConf=this.filterConf.timebar.eventConf;
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
        },
        //过滤控件方法
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
    },
    mounted(){
             this._inputArrInit(); 
             this._getParams();     
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.yl-filter
    height auto 
    width 100%
    box-sizing border-box

.form-label
    margin-bottom 5px
    margin-top 5px
</style>
