<template>
    <yl-treeselect 
        :value="value" 
        :treedata="treedata" 
        :defaultProps="defaultProps" 
        :isexpand="isexpand" 
        :size="size"
        :readonly="readonly"
        :disabled="disabled"
        :autofocus="autofocus"
        :placeholder="placeholder"
        :filterTextVisibe="filterVisibe"
        :displaytoolBar="displaytoolBar"
        :nodeStateConf="nodeStateConf"
        @getCurrentNode="_getCurrentNode"
        @reload="_reload"
        @clear="_clear"
         >
    </yl-treeselect>
</template>

<script type="text/babel">
import util from '@/common/js/util';
import fetch from '@/api/fetch';
import {requestGetMenuItemTreeList} from '@/api/menuitem'
export default {
    data(){
        return{
            treedata:[],   
            defaultProps: {
              children: 'children',
              label: 'text',
              id: 'id'
            },
        }
    },
    props:{
        isexpand:{type: Boolean,default: false },
        value:[String,Number],
        size:{
                    type: String,
                    default: "", 
       },
       readonly:{
                    type: Boolean,
                    default: true 
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
       nodeStateConf:{
                        required: false,
                        type: Array,
                        default: function () {
                            return []
                        }
       }, 
       filterVisibe:{
                    type: Boolean,
                    default: true,
       },
       displaytoolBar:{
                    type: Boolean,
                    default: false
           }
    },
    methods:{
        _reload(node){
            //重新加载
            this._getTreeList();
        },
        _clear(){
            //清除值
            this.$emit('clear');
        },
        _getCurrentNode(selectNode){
             if(this.textOnly){ 
                this.$emit('input',selectNode.text);
                }
            else{ 
                this.$emit('input',selectNode.id);
                }
             this.$emit('getCurrentNode',selectNode);
        },
        _getTreeList(){
            requestGetMenuItemTreeList().then(data=>{
                      if(data.success){
                            this.treedata=util.returnDatabyTree(data.result,this.guidOfNull());
                        }
                        else {
                             this.$message.error('获取数据失败！'+data.error.message);
                        }
            })
        }
    },
    mounted(){
        this._getTreeList();
    },
    components:{

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
