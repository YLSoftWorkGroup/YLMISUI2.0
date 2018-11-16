<template>
<div class="treeSelect"  v-clickoutside="_hiddenBlock">
    <el-input ref="inputText"
        type="text" 
        :size="size"
        :readonly="readonly"
        :disabled="propsData.disabled"
        :placeholder="placeholder"
        :autofocus="autofocus"
        :icon="icon"
        @focus="_focus" 
        :on-icon-click="_iconClick"
        :value="currentValue">
    </el-input>
    <div :class="{'visibility':inputTreeIsVisibe}"  
            class="inputTree" 
            >
         <div class="toolbar" v-if="displaytoolBar">
             <span class="btn-icon" @click="_clear"><i class="icon-cancel3"></i>清空</span> | 
             <span class="btn-icon" @click="_reset"><i class="icon-spinner2"></i>重新加载</span> 
         </div>
        <el-input
            v-if="filterVisibe"
            placeholder="输入关键字进行过滤"
            v-model="filterText"
            size="small"
            class="filter-style">
        </el-input>
        <el-tree 
            class="elTree"
            ref="treeSelect"
            :lazy="stepByOne" 
            :empty-text="ememptyText"
            :default-expand-all="isexpand"  
            :data="treedata" 
            :expand-on-click-node="false" 
            :props="defaultProps" 
            :load="loadNode"
            :node-key="defaultProps.id"
            :default-expanded-keys="defaultExpandedKeys"
            :filter-node-method="filterNode"
            :render-content="renderContent"
            @node-click.self="handleNodeClick"
        >
        </el-tree>
        
    </div>
</div>
</template>

<script type="text/babel">
import treeMixn from '@/mixns/tree.js';
import util from '@/common/js/util'
export default {
    name: 'YlTreeSelect',
    componentName: 'YlTreeSelect',
    mixins: [treeMixn],
     data() {
      return {
         inputTreeIsVisibe:true,
         selectNode:{},
         loadNodeParams:{},
         icon: "caret-bottom",
         filterText:'',
         propsData:{
             disabled:this.disabled
         },
         inputText:'',
         emptyText:false,
         ememptyText:'数据获取中...'
      };
    },
    props:{
		treedata:{
                    type: Array,
                    default:[] 
                 },
        loaddata:{
                    required: false,
                    type: Array,
                    default: function () {
                        return []
                    }
                  },
        defaultExpandedKeys:{
                    required: false,
                    type: Array,
                    default: function () {
                        return []
                    }
                  },
        isexpand:{
                    type: Boolean,
                    default: false,
                    required: false,
                  },
        defaultProps:{
                     },
        value:[String,Number],//显示名称
        textOnly:{
                    //是否值使用文本值
                    type:Boolean,
                    default:false,
                  }, 
        stepByOne:{
                   //是否一次加载一级
                    type:Boolean,
                    default:false,
                   },
        defaultText:{
                    type:String,
                    default:'',
         },
        size:{
                    type: String,
                    default: "", 
         },
        readonly:{
                    type: Boolean,
                    default: false 
         }, 
        disabled:{
                    type: Boolean,
                    default: false 
         }, 
       placeholder:{
                    type: String,
                    default: "" ,
        }, 
       autofocus:{
                    type: Boolean,
                    default: false,
        },
       filterTextVisibe:{
                    type: Boolean,
                    default:true,
        },
       nodeStateConf: {
                    required: false,
                    type: Array,
                    default: function () {
                        return []
                    }
        },
        displaytoolBar:{
                    type: Boolean,
                    default: false
        }
	},
    computed:{
        filterVisibe:{
             get(){
                if(this.stepByOne) {
                    return false;
                }else{
                    return this.filterTextVisibe;
                }
            }
        },
        currentValue:{
            get(){
                    if(this.textOnly){
                        //只使用文本时显示文本信息
                        this.inputText=this.value;
                    }  
                    else if(this.stepByOne){
                        //异步赋值时，显示名称为传进来的值
                        if(this.selectNode.id==undefined){
                            this.inputText=this.defaultText
                        }
                        else{
                            this.inputText=this.selectNode.text;
                        }
                    } 
                    else if(this.treedata.length!=0){
                        if(this.selectNode.id==undefined){
                            util.node.getNameByID(this.treedata,this.value);
                            let text=util.node.nodeName;
                            if(this.value!=''){
                                this.inputText=text;
                            }else{
                                this.inputText="";
                            } 
                        }else{
                            this.inputText=this.selectNode.text;
                        }
                    }
                  if(this.emptyText){
                        this.inputText="";
                  }
                  return this.inputText;
            }
        }
    },
    methods: {
        handleNodeClick(result) {  
                    //点击加载 
                    this.emptyText=false;
                    this.selectNode=result;  
                      if(this.textOnly){ 
                            this.$emit('input',this.selectNode.text);
                            }
                        else{ 
                            this.$emit('input',this.selectNode.id);
                            }
                    this.$emit('getCurrentNode',this.selectNode);
                    this.inputTreeIsVisibe=true;
        },
        loadNode(node, resolve){
            let on=true;
            this.loadNodeParams.node=node;
            this.loadNodeParams.resolve=resolve;
            if (node.level === 0) {
              resolve(this.treedata);
            }else
            {
              if(this.stepByOne){
                  this.nodeStateConf.map(item=>{
                    if(item.leafflag){
                        if(node.data[item.name]){
                            node.isLeaf=true;
                            node.loaded=true;
                            node.loading=false;
                            on=false;
                            return;
                        }
                   }
                  })
                  if(on){
                        this.$emit('nodeExpend',node);
                    }
              }
            }
            //在此处通过递归处理node 获取逐步情况的全称
        },
        _loadNode(data){
            this.loadNodeParams.resolve(data);
        },
        _focus(){
            this.inputTreeIsVisibe=false;
        },
        _iconClick(val){
             this.inputTreeIsVisibe=!this.inputTreeIsVisibe;
        },
        _hiddenBlock(val,ss){
            this.inputTreeIsVisibe=true;
           
        },
        _clear(){
           this.emptyText=true;
           this.$emit('clear',this.selectNode);
        },
        _reset(){
            this.$emit('reload',this.selectNode);
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.text.indexOf(value) !== -1;
        },
    },
    mounted(){
    },  
    watch:{
        loaddata:function (val, oldVal) {
            this._loadNode(val);
        },
        inputTreeIsVisibe:function (val, oldVal) {      
           if(val){
                this.icon="caret-bottom";
           }else{
                this.icon="caret-top";
           }
        },
        filterText(val) {
            this.$refs.treeSelect.filter(val);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" >
.treeSelect
    font-size 12px
    .inputTree
        position absolute
        z-index 1000
        left 0
        top 32px
        min-width 100%
        width auto
        height 200px
        background #fff
        overflow auto
        box-sizing  border-box   
        padding 5px 
        border  1px solid rgb(191, 203, 217)
        .filter-style.el-input__inner 
            border  1px solid rgb(191, 203, 217)
        .elTree
            overflow hidden
        .toolbar
            height 22px
            text-align right 
            padding-right 10px
            line-height 22px
            border 1px solid #fff
            background-color #EFF2F7
            span
                cursor pointer
                font-size 12px
                display inline-block
                width auto
                &:hover
                    color #20A0FF

    .visibility
        visibility:hidden

</style>
