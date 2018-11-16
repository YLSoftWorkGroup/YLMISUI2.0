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
        :displaytoolBar="displaytoolBar"
        :filterTextVisibe="filterVisibe"
        :nodeStateConf="nodeStateConf"
        @getCurrentNode="_getCurrentNode"
        @reload="_reload"
        @clear="_clear">
    </yl-treeselect>
</template>

<script type="text/babel">
import util from '@/common/js/util';
import fetch from '@/api/fetch';
import {requestGetRoleTreeList} from '@/api/role'
export default {
    data(){
        return{
            treedata:[],
            defaultProps: {
              children: 'children',
              label: 'text',
              id: 'id'
            }
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
                    default: false,
       },
       displaytoolBar:{
                    type: Boolean,
                    default: false
        },
       nodeStateConf:{
                        required: false,
                        type: Array,
                        default: function () {
                            return []
                        }
       }, 
    },
    methods:{
        _reload(node){
            //重新加载
            this._getRoleTreeList();
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
        _getRoleTreeList(){
            requestGetRoleTreeList().then(data=>{
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
        this._getRoleTreeList();
    },
    components:{
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
