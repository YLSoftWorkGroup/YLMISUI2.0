<template>
 
   <!--输入框值-->
   <el-input 
        v-if="option.type==='inputNum'" 
        type="number"
        v-model.number="model[option.name]" 
        :maxlength="option.elmentConfig.maxlength"
        :minlength="option.elmentConfig.minlength"
        :size="option.elmentConfig.size"
        :disabled="option.elmentConfig.disabled"
        :placeholder="option.elmentConfig.placeholder"
        :icon="option.elmentConfig.icon"
        :readonly="option.elmentConfig.readonly"
        @blur="_blur(model[option.name])"
        @mousewheel.native="_preventmousewheel"
        
   >
   </el-input>

  <!--输入框文本-->
   <el-input 
        v-else-if="option.type==='inputText'" 
        v-model.trim="model[option.name]" 
        :maxlength="option.elmentConfig.maxlength"
        :minlength="option.elmentConfig.minlength"
        :size="option.elmentConfig.size"
        :disabled="option.elmentConfig.disabled"
        :placeholder="option.elmentConfig.placeholder"
        :icon="option.elmentConfig.icon"
        :readonly="option.elmentConfig.readonly"
        @blur="_blur(model[option.name])"
   >
   </el-input>

    <!--状态组件-->
    <el-switch
        v-else-if="option.type==='switch'"
        v-model="model[option.name]" 
        :width="option.elmentConfig.width"
        :disabled="option.elmentConfig.disabled"
        :on-color="option.elmentConfig.onColor"
        :off-color="option.elmentConfig.offColor"
        :on-text="option.elmentConfig.onText"
        :off-text="option.elmentConfig.offText"
        :on-value="option.elmentConfig.onValue"
        :off-value="option.elmentConfig.offValue"
        @change="_change"
    >
    </el-switch>

 
    <!--日期>-->
     <yl-datepicker
        v-else-if="option.type==='datePicker'" 
         v-model="model[option.name]" 
        :type="option.elmentConfig.type"
        :size="option.elmentConfig.size"
        :placeholder="option.elmentConfig.placeholder"
        :format="option.elmentConfig.format"
        :align="option.elmentConfig.align"
        :defaultValue="option.elmentConfig.defaultValue"
        :disabled="option.elmentConfig.disabled"
        :editable="option.elmentConfig.editable"
        :clearable="option.elmentConfig.clearable"
         @change="_change"
         style="width:100%"
      >
    </yl-datepicker>


    
<!--常用字典库控件-->
     <yl-comdatadictionary 
        v-else-if="option.type==='comdatadictionary'" 
        v-model="model[option.name]" 
        :code="option.elmentConfig.code"
        :size="option.elmentConfig.size"
        :readonly="option.elmentConfig.readonly"
        :disabled="option.elmentConfig.disabled"
        :placeholder="option.elmentConfig.placeholder"
        :autofocus="option.elmentConfig.autofocus"
        :nodeStateConf="option.elmentConfig.nodeStateConf"
        :filterVisibe="option.elmentConfig.filterVisibe"
        :isexpand="option.elmentConfig.isexpand"
        :style="option.elmentConfig.style"
        @getCurrentNode="_change"
      >
    </yl-comdatadictionary>


     <!--字典选择控件-->
     <yl-datadictionaryforsel
        v-else-if="option.type==='datadictionaryforsel'" 
        v-model="model[option.name]" 
        :code="option.elmentConfig.code"
        :placeholder="option.elmentConfig.placeholder"
        :size="option.elmentConfig.size"
        :disabled="option.elmentConfig.disabled"
        @getCurrentvalue="_change"
      >
    </yl-datadictionaryforsel>

     <!--字典树控件-->
     <yl-datadictionaryfortree
        v-else-if="option.type==='datadictionaryfortree'" 
        v-model="model[option.name]" 
        :code="option.elmentConfig.code"
        :size="option.elmentConfig.size"
        :readonly="option.elmentConfig.readonly"
        :disabled="option.elmentConfig.disabled"
        :placeholder="option.elmentConfig.placeholder"
        :autofocus="option.elmentConfig.autofocus"
        :nodeStateConf="option.elmentConfig.nodeStateConf"
        :filterVisibe="option.elmentConfig.filterVisibe"
        :isexpand="option.elmentConfig.isexpand"
      >
    </yl-datadictionaryfortree> 

      <!--选择-->
     <el-select
        v-else-if="option.type==='select'" 
        v-model="model[option.name]" 
        :size="option.elmentConfig.size"
        :placeholder="option.elmentConfig.placeholder"
        :disabled="option.elmentConfig.disabled"
        :clearable="option.elmentConfig.clearable"
        @change="_change"
      >
        <el-option
            v-for="item in option.elmentConfig.data"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
    </el-select>

       <!--通用选择器-->      
     <yl-commonselect ref="commonselect"
            v-else-if="option.type==='commonselect'" 
            v-model="model[option.name]" 
            :size="option.elmentConfig.size"
            :disabled="option.elmentConfig.disabled"
            :placeholder="option.elmentConfig.placeholder"
            :clearable="option.elmentConfig.clearable"
            :initData="option.elmentConfig.initData"
            :value="option.elmentConfig.value"
            :style="option.elmentConfig.style"
            :apiConf="option.elmentConfig.apiConf"
            :defaultProps="option.elmentConfig.defaultProps"
            :lists="option.elmentConfig.lists"
            @getCurrentNode="_change">
    </yl-commonselect> 
    
    <!--上传组件（单）-->
    <yl-singleupload 
        v-else-if="option.type==='singleUpload'" 
        v-model="model[option.name]" 
        :size="option.elmentConfig.size" 
        :placeholder="option.elmentConfig.placeholder"
        :allowFormat="option.elmentConfig.allowFormat"
        :moduleName="option.elmentConfig.moduleName"
        :allowSize="option.elmentConfig.allowSize"
        :action="option.elmentConfig.action"
        :style="option.elmentConfig.style"
        @change="_change"
    >
    </yl-singleupload>

     <span  
        v-else-if="option.type==='format'" 
        v-html="this.format"
        > 
    </span>


 </template>

<script type="text/babel">
import fetch from '@/api/fetch';
import util from '@/common/js/util';
import globalJS from '@/common/js/globalJS';
import { mapGetters,mapActions } from 'vuex';
import dataDictionaryForTree from '@/ocomponents/datadictionary/dataDictionaryForTree'
import dataDictionaryForSel from '@/ocomponents/datadictionary/dataDictionaryForSel'
import ComDataDictionary from '@/ocomponents/comdatadictionary/ComDataDictionary'
export default {
    data(){
        return{
           treeData:[]
        }
    },
    props:{
        option:{
            type:Object,
            require:true
        },
        model:{
            type:Object,
            require:false
        }
    },
    computed:{
       format:{
            get(){
                if(this.option.eventConf.isOn){
                    let _this=this;
                    return this.option.eventConf.format(this.option,this.model,_this);
                }else{
                    return  ''
                }
            }
        },
      fetchObject:{
        get(){
          return fetch;
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
        _preventmousewheel(event){
           event.preventDefault();
       },
      _change(node){
          let _this=this;
            if(this.option.eventConf!=undefined){
                        if(this.option.eventConf.isOn){
                            if(this.option.eventConf.change!=undefined){
                                    this.option.eventConf.change(node,this.option,this.model,_this);
                                   
                            }
                        }
                    }
      },
      _blur(node){
           let _this=this;
           if(this.option.eventConf!=undefined){
                if(this.option.eventConf.isOn){
                    if(this.option.eventConf.blur!=undefined){
                            this.option.eventConf.blur(node,this.option,this.model,_this);
                            //是否触发合计计算
                            if(this.option.eventConf.isSum!=undefined){
                            if(this.option.eventConf.isSum){
                                        this.$emit('sumCount');
                                }
                            }
                    }
                    
                }
           }
      },
      _initComs(){
           let _this=this;
           if(this.option.eventConf!=undefined){
            if(this.option.eventConf.isOn){
                 if(this.option.eventConf.init!=undefined){
                         this.option.eventConf.init(this.option,this.model,_this);
                 }
            }
         }
      },
     
     ...mapActions(['setGlobObject1','setGlobObject2','setGlobString1','setGlobString2','setGlobalArray1']),
    },
    components:{
       'yl-datadictionaryfortree':dataDictionaryForTree,
       'yl-datadictionaryforsel':dataDictionaryForSel,
       'yl-comdatadictionary':ComDataDictionary,
    },
    created(){
    },
    beforeMount(){
        this._initComs();
    },
    mounted(){
       
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
