<template>
     <!--输入框值-->
   <el-input  ref="inputNum"
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
        :style="option.elmentConfig.style"
        @blur="_blur(model[option.name])"
        @mousewheel.native="_preventmousewheel"
   >
   </el-input>

  <!--输入框文本-->
    <el-input  ref="inputText"
        v-else-if="option.type==='inputText'" 
        v-model.trim="model[option.name]" 
        :maxlength="option.elmentConfig.maxlength"
        :minlength="option.elmentConfig.minlength"
        :size="option.elmentConfig.size"
        :disabled="option.elmentConfig.disabled"
        :type="option.elmentConfig.type"
        :placeholder="option.elmentConfig.placeholder"
        :icon="option.elmentConfig.icon"
        :rows="option.elmentConfig.rows"
        :readonly="option.elmentConfig.readonly"
        :style="option.elmentConfig.style"
        :autofocus="option.elmentConfig.autofocus"
        @keyup.13.native="_method1(model[option.name])"
        @blur="_blur(model[option.name])"
   >
  </el-input> 

    <!--html渲染-->
    <span  ref="span"
        v-else-if="option.type==='span'"
        v-text="model[option.name]" 
        :style="option.elmentConfig.style"
    >
    </span>
    
    <span  ref="tips"
        v-else-if="option.type==='tips'"
        v-html="option.elmentConfig.content" 
        :style="option.elmentConfig.style"
    >
    </span>

    <!-- 分割线组件 -->
     <yl-splitline   ref="splitline"
        v-else-if="option.type==='splitline'" 
        :text="option.elmentConfig.text" 
        > 
    </yl-splitline>

  <!--选择-->
     <el-select
        ref="select"
        v-else-if="option.type==='select'" 
        v-model="model[option.name]" 
        :size="option.elmentConfig.size"
        :placeholder="option.elmentConfig.placeholder"
        :disabled="option.elmentConfig.disabled"
        :clearable="option.elmentConfig.clearable"
        :style="option.elmentConfig.style"
        @change="_change"
      >
        <el-option
            v-for="item in option.elmentConfig.data"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
    </el-select>

    <!--状态组件-->
    <el-switch  ref="switch"
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
        :style="option.elmentConfig.style"
        @change="_change"
    >
    </el-switch>

 
    <!--上传组件（单）-->
    <yl-singleupload  ref="singleUpload"
        v-else-if="option.type==='singleUpload'" 
        v-model="model[option.name]" 
        :size="option.elmentConfig.size" 
        :disabled="option.elmentConfig.disabled" 
        :placeholder="option.elmentConfig.placeholder"
        :allowFormat="option.elmentConfig.allowFormat"
        :moduleName="option.elmentConfig.moduleName"
        :allowSize="option.elmentConfig.allowSize"
        :action="option.elmentConfig.action"
        :style="option.elmentConfig.style"
        @change="_change"
    >
    </yl-singleupload>

     <!--上传组件（多）-->
    <yl-multipleupload  ref="multipleUpload"
        v-else-if="option.type==='multipleUpload'" 
        :size="option.elmentConfig.size" 
        :disabled="option.elmentConfig.disabled" 
        :allowFormat="option.elmentConfig.allowFormat"
        :moduleName="option.elmentConfig.moduleName"
        :allowSize="option.elmentConfig.allowSize"
        :drag="option.elmentConfig.drag"
        :multiple="option.elmentConfig.multiple"
        :fileList="option.elmentConfig.fileList"
        :listType="option.elmentConfig.listType"
        :action="option.elmentConfig.action"
        :style="option.elmentConfig.style"
        @change="_change"
    >
    </yl-multipleupload>

    <!--计数器-->
    <el-input-number  ref="inputNumber"
        v-else-if="option.type==='inputNumber'" 
        v-model="model[option.name]" 
        :min="option.elmentConfig.min" 
        :max="option.elmentConfig.max"
        :step="option.elmentConfig.step"
        :disabled="option.elmentConfig.disabled"
        :size="option.elmentConfig.size"
        :controls="option.elmentConfig.controls"
        :style="option.elmentConfig.style"
        @change="_change"
    >
    </el-input-number>


    <!--日期>-->
     <yl-datepicker ref="datePicker"
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
        :style="option.elmentConfig.style"
        @change="_change"
      >
    </yl-datepicker>   

 <!--时间选择器-->
     <el-time-picker ref="timePicker"
         v-else-if="option.type==='timePicker'" 
         v-model="model[option.name]" 
        :type="option.elmentConfig.type"
        :size="option.elmentConfig.size"
        :placeholder="option.elmentConfig.placeholder"
        :align="option.elmentConfig.align"
        :disabled="option.elmentConfig.disabled"
        :editable="option.elmentConfig.editable"
        :clearable="option.elmentConfig.clearable"
        :start="option.elmentConfig.start"
        :end="option.elmentConfig.end"
        :step="option.elmentConfig.step"
        :minTime="option.elmentConfig.minTime"
        :maxTime="option.elmentConfig.maxTime"
        :style="option.elmentConfig.style"
        :format="option.elmentConfig.format"
         @change="_change"
      >
    </el-time-picker>   


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
            @getCurrentNode="_change"
            @clear="_method1">
         </yl-commonselect> 

    <!--明细编辑器-->       
    <yl-tableedit ref="tableEdit"
            v-else-if="option.type==='tableEdit'" 
            :tableConfig="option.elmentConfig.tableEditConfig"
            :tableData="this.items"
            :sumRowConf="option.elmentConfig.sumRowConf"
            :mapConfig="option.elmentConfig.tableEditMapConfig"
            :addRowCount="option.elmentConfig.addRowCount"
            :notRepeatFiled="option.elmentConfig.notRepeatFiled"
            @delItem="_delItem"
            @sumCount="_sumCount"
        >
    </yl-tableedit> 

 <!--富文本选择器-->
     <yl-editor ref="editor"
        v-else-if="option.type==='editor'" 
        :isPreView="option.elmentConfig.isPreView"
        :editorOptions="option.elmentConfig.editorOptions"
        :content="option.elmentConfig.content"
        :style="option.elmentConfig.style"
        @onchange="_change"
      >
    </yl-editor>


     <!--选择树控件-->
     <yl-treeselect  ref="treeselect"
         v-else-if="option.type==='treeselect'" 
         v-model="model[option.name]" 
        :size="option.elmentConfig.size"
        :defaultText="option.elmentConfig.defaultText"
        :readonly="option.elmentConfig.readonly"
        :disabled="option.elmentConfig.disabled"
        :placeholder="option.elmentConfig.placeholder"
        :autofocus="option.elmentConfig.autofocus"
        :nodeStateConf="option.elmentConfig.nodeStateConf"
        :stepByOne="option.elmentConfig.stepByOne"
        :treedata="option.elmentConfig.treedata"
        :loaddata="option.elmentConfig.loaddata"
        :defaultExpandedKeys="option.elmentConfig.defaultExpandedKeys"
        :isexpand="option.elmentConfig.isexpand"
        :defaultProps="option.elmentConfig.defaultProps"
        :textOnly="option.elmentConfig.textOnly"
        :filterTextVisibe="option.elmentConfig.filterTextVisibe"
        :displaytoolBar="option.elmentConfig.displaytoolBar"
        :style="option.elmentConfig.style"
         @getCurrentNode="_change"
         @clear="_method1"
         @reload="_method2"
        >
    </yl-treeselect>

    

   <yl-commontree ref="commonTree"
        v-else-if="option.type==='commonTree'" 
        v-model="model[option.name]" 
        :size="option.elmentConfig.size"
        :readonly="option.elmentConfig.readonly"
        :disabled="option.elmentConfig.disabled"
        :placeholder="option.elmentConfig.placeholder"
        :autofocus="option.elmentConfig.autofocus"
        :nodeStateConf="option.elmentConfig.nodeStateConf"
        :style="option.elmentConfig.style"
        :code="option.elmentConfig.code"
        :orgId="option.elmentConfig.orgId"
        :defaultText="option.elmentConfig.defaultText"
        :displaytoolBar="option.elmentConfig.displaytoolBar"
        @getCurrentNode="_change"
        @clear="_method1"
      >
    </yl-commontree>


    <yl-commonalltree ref="commonAllTree"
        v-else-if="option.type==='commonAllTree'" 
        v-model="model[option.name]" 
        :size="option.elmentConfig.size"
        :isexpand="option.elmentConfig.isexpand"
        :readonly="option.elmentConfig.readonly"
        :disabled="option.elmentConfig.disabled"
        :placeholder="option.elmentConfig.placeholder"
        :autofocus="option.elmentConfig.autofocus"
        :nodeStateConf="option.elmentConfig.nodeStateConf"
        :filterVisibe="option.elmentConfig.filterVisibe"
        :displaytoolBar="option.elmentConfig.displaytoolBar"
        :style="option.elmentConfig.style"
        :code="option.elmentConfig.code"
        :orgId="option.elmentConfig.orgId"
        @getCurrentNode="_change"
        @clear="_method1"
        >
    </yl-commonalltree>


<!--常用字典库控件-->
     <yl-comdatadictionary  ref="comdatadictionary"
        v-else-if="option.type==='comdatadictionary'" 
        v-model="model[option.name]" 
        :code="option.elmentConfig.code"
        :size="option.elmentConfig.size"
        :autofocus="option.elmentConfig.autofocus"
        :readonly="option.elmentConfig.readonly"
        :disabled="option.elmentConfig.disabled"
        :placeholder="option.elmentConfig.placeholder"
        :nodeStateConf="option.elmentConfig.nodeStateConf"
        :displaytoolBar="option.elmentConfig.displaytoolBar"
        :filterVisibe="option.elmentConfig.filterVisibe"
        :isexpand="option.elmentConfig.isexpand"
        :style="option.elmentConfig.style"
        @getCurrentNode="_change"
        @clear="_method1"
      >
    </yl-comdatadictionary>
     
     <!--字典选择控件-->
     <yl-datadictionaryforsel  ref="datadictionaryforsel"
        v-else-if="option.type==='datadictionaryforsel'" 
        v-model="model[option.name]" 
        :code="option.elmentConfig.code"
        :placeholder="option.elmentConfig.placeholder"
        :size="option.elmentConfig.size"
        :clearable="option.elmentConfig.clearable"
        :disabled="option.elmentConfig.disabled"
        :style="option.elmentConfig.style"
        @getCurrentvalue="_change"
        @clear="_method1"
      >
    </yl-datadictionaryforsel>

     <!--字典树控件-->
     <yl-datadictionaryfortree  ref="datadictionaryfortree"
        v-else-if="option.type==='datadictionaryfortree'" 
        v-model="model[option.name]" 
        :code="option.elmentConfig.code"
        :size="option.elmentConfig.size"
        :readonly="option.elmentConfig.readonly"
        :disabled="option.elmentConfig.disabled"
        :autofocus="option.elmentConfig.autofocus"
        :placeholder="option.elmentConfig.placeholder"
        :nodeStateConf="option.elmentConfig.nodeStateConf"
        :displaytoolBar="option.elmentConfig.displaytoolBar"
        :filterVisibe="option.elmentConfig.filterVisibe"
        :isexpand="option.elmentConfig.isexpand"
        :style="option.elmentConfig.style"
        @getCurrentNode="_change"
        @clear="_method1"
      >
    </yl-datadictionaryfortree>


      <!--组织机构选择-->
     <yl-organizetree ref="organizeTree"
        v-else-if="option.type==='organizeTree'" 
        v-model="model[option.name]" 
        :size="option.elmentConfig.size"
        :isexpand="option.elmentConfig.isexpand"
        :readonly="option.elmentConfig.readonly"
        :disabled="option.elmentConfig.disabled"
        :placeholder="option.elmentConfig.placeholder"
        :autofocus="option.elmentConfig.autofocus"
        :nodeStateConf="option.elmentConfig.nodeStateConf"
        :displaytoolBar="option.elmentConfig.displaytoolBar"
        :filterVisibe="option.elmentConfig.filterVisibe"
        :style="option.elmentConfig.style"
        @getCurrentNode="_change"
        @clear="_method1"
      >
    </yl-organizetree>
     
    
    
      <yl-organizealltree ref="organizeAllTree"
        v-else-if="option.type==='organizeAllTree'" 
        v-model="model[option.name]" 
        :size="option.elmentConfig.size"
        :isexpand="option.elmentConfig.isexpand"
        :readonly="option.elmentConfig.readonly"
        :disabled="option.elmentConfig.disabled"
        :placeholder="option.elmentConfig.placeholder"
        :autofocus="option.elmentConfig.autofocus"
        :nodeStateConf="option.elmentConfig.nodeStateConf"
        :displaytoolBar="option.elmentConfig.displaytoolBar"
        :filterVisibe="option.elmentConfig.filterVisibe"
        :style="option.elmentConfig.style"
        @getCurrentNode="_change"
        @clear="_method1"
      >
    </yl-organizealltree>



     <!--工号选择-->
     <yl-ghtree ref="ghtree"
        v-else-if="option.type==='ghtree'" 
        v-model="model[option.name]" 
        :size="option.elmentConfig.size"
        :defaultText="option.elmentConfig.defaultText"
        :readonly="option.elmentConfig.readonly"
        :disabled="option.elmentConfig.disabled"
        :placeholder="option.elmentConfig.placeholder"
        :autofocus="option.elmentConfig.autofocus"
        :nodeStateConf="option.elmentConfig.nodeStateConf"
        :displaytoolBar="option.elmentConfig.displaytoolBar"
        :filterVisibe="option.elmentConfig.filterVisibe"
        :style="option.elmentConfig.style"
        @getCurrentNode="_change"
        @clear="_method1"
      >
    </yl-ghtree>

 <!--标准工号选择-->
     <yl-standardghtree ref="standardghtree"
        v-else-if="option.type==='standardghtree'" 
        v-model="model[option.name]" 
        :size="option.elmentConfig.size"
        :defaultText="option.elmentConfig.defaultText"
        :readonly="option.elmentConfig.readonly"
        :disabled="option.elmentConfig.disabled"
        :placeholder="option.elmentConfig.placeholder"
        :autofocus="option.elmentConfig.autofocus"
        :nodeStateConf="option.elmentConfig.nodeStateConf"
        :displaytoolBar="option.elmentConfig.displaytoolBar"
        :filterVisibe="option.elmentConfig.filterVisibe"
        :style="option.elmentConfig.style"
        @getCurrentNode="_change"
        @clear="_method1"
      >
    </yl-standardghtree>

     <yl-materialclasstree ref="materialClassTree"
        v-else-if="option.type==='materialClassTree'" 
        v-model="model[option.name]" 
        :size="option.elmentConfig.size"
        :isexpand="option.elmentConfig.isexpand"
        :readonly="option.elmentConfig.readonly"
        :disabled="option.elmentConfig.disabled"
        :placeholder="option.elmentConfig.placeholder"
        :autofocus="option.elmentConfig.autofocus"
        :nodeStateConf="option.elmentConfig.nodeStateConf"
        :displaytoolBar="option.elmentConfig.displaytoolBar"
        :filterVisibe="option.elmentConfig.filterVisibe"
        :style="option.elmentConfig.style"
        @getCurrentNode="_change"
        @clear="_method1"
      >
    </yl-materialclasstree>

     <!--动态列控件-->
     <yl-dynamiccol ref="dynamiccol"
        v-else-if="option.type==='dynamiccol'" 
        v-model="model[option.name]" 
        :options="option.elmentConfig.options"
        :style="option.elmentConfig.style"
        @change="_change"
      >
    </yl-dynamiccol>
    
    <!--单选按钮组-->
     <yl-radio ref="radio"
        v-else-if="option.type==='radio'" 
        v-model="model[option.name]" 
        :options="option.elmentConfig.options"
        :style="option.elmentConfig.style"
        @change="_change"
      >
    </yl-radio>

    <!-- 表单内按钮 -->
     <el-button   ref="button"
        v-else-if="option.type==='button'" 
         v-show="option.elmentConfig.isShow"
        :disabled="option.elmentConfig.disabled"  
        :type="option.elmentConfig.type" 
        :size="option.elmentConfig.size" 
        @click="_method1"
        > 
        <i :class="option.elmentConfig.icon"></i>
        {{option.elmentConfig.text}}  
    </el-button>

    <!-- 表单内按钮组 -->
     <yl-buttonG   ref="buttonG"
        v-else-if="option.type==='buttonG'" 
        :options="option.elmentConfig.options" 
        @click="_method1"
        > 
    </yl-buttonG>
 </template>

<script type="text/babel">
import { mapGetters,mapActions } from 'vuex';
import btngroup from '@/components/btnGroup/btngroup'
import dataDictionaryForTree from '@/ocomponents/datadictionary/dataDictionaryForTree'
import organizeTree from '@/ocomponents/organize/organizeTree'
import organizeAllTree from '@/ocomponents/organize/organizeAllTree'
import dataDictionaryForSel from '@/ocomponents/datadictionary/dataDictionaryForSel'
import ComDataDictionary from '@/ocomponents/comdatadictionary/ComDataDictionary'
import GHTree from '@/ocomponents/gh/GHTree'
import standardGHTree from '@/ocomponents/standardgh/standardGHTree'
import materialClassTree from '@/ocomponents/materialclass/materialClassTree'
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
        },
        items:{
            type:Array,
            require:false
        },
        refList:{
            type:Object,
            require:false
        },

    },
    computed:{
        ...mapGetters([ 'getGlobObject1','getGlobObject2','getGlobString1','getGlobString2','getGlobArray1' ]),  
    },
    methods:{
      ...mapActions(['setGlobObject1','setGlobObject2','setGlobString1','setGlobString2','setGlobalArray1']),
       _preventmousewheel(event){
           event.preventDefault();
       },
       _change(node){
          this.$emit('change',node,this);
      },
      _blur(node){
          this.$emit('blur',node,this);
      },
      _method1(node){
          this.$emit('method1',node,this);
      },
      _method2(node){
          this.$emit('method2',node,this);
      },
      _initComs(){
          this.$emit('init',this);
      },
      _delItem(row){
           this.$emit('delItem',row);
      },
      _sumCount(){
           this.$emit('sumCount');
      }
    },
    components:{
       'yl-datadictionaryfortree':dataDictionaryForTree,
       'yl-datadictionaryforsel':dataDictionaryForSel,
       'yl-comdatadictionary':ComDataDictionary,
       'yl-organizetree':organizeTree,
       'yl-organizealltree':organizeAllTree,
       'yl-ghtree':GHTree,
       'yl-standardghtree':standardGHTree,
       'yl-materialclasstree':materialClassTree,
       'yl-buttonG':btngroup
    },
    created(){
       
    },
    beforeMount(){
       this._initComs();   
    },
    mounted(){
        this.refList[this.option.name]=this.$refs;
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
