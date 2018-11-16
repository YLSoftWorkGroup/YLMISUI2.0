<template>
    <yl-treeselect  
        :value="value" 
        :treedata="treedata" 
        :defaultProps="defaultProps" 
        :textOnly="textOnly"
        :isexpand="isexpand" 
        :size="size"
        :readonly="readonly"
        :disabled="disabled"
        :autofocus="autofocus"
        :placeholder="placeholder"
        :displaytoolBar="displaytoolBar"
        :filterTextVisibe="filterVisibe"
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
import {requestGetProvinceCityTreeList} from '@/api/provincecity'
export default {
    data(){
        return{
            treedata:[],
            defaultProps: {
              children: 'children',
              label: 'text',
              id: 'id'
            },
            textOnly:false
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
       filterVisibe:{
                    type: Boolean,
                    default: true,
       },
       nodeStateConf:{
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
    methods:{
        _reload(node){
            //重新加载
            this._getProvincecityTreeList();
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
        _getProvincecityTreeList(){
            requestGetProvinceCityTreeList().then(data=>{
                    if(data.success){
                           this.treedata=data.result;
                        }
                        else {
                            this.$message.error('获取数据失败！');
                        }
            })
        }
    },
    mounted(){
        this._getProvincecityTreeList();
    },
    components:{

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
