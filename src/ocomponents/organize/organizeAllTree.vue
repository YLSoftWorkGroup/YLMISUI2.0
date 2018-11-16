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
        :nodeStateConf="nodeStateConf"
        :filterTextVisibe="filterVisibe"
        :displaytoolBar="displaytoolBar"
        :defaultExpandedKeys="defaultExpandedKeys"
        @getCurrentNode="_getCurrentNode"
        @reload="_reload"
        @clear="_clear"
     >
    </yl-treeselect>
</template>

<script type="text/babel">
import {requestGetAllOrganizeTreeList} from '@/api/organize'
export default {
    data(){
        return{
            treedata:[],  
            defaultExpandedKeys:[], 
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
       nodeStateConf:{
                        required: false,
                        type: Array,
                        default: function () {
                            return []
                        }
       }, 
       filterVisibe:{
                    type: Boolean,
                    default: false,
       },
       displaytoolBar:{
                    type: Boolean,
                    default: false
           }
    },
    methods:{
        _reload(node){
            //重新加载
            this._getOrganizeTreeList();
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
        _getOrganizeTreeList(){
            requestGetAllOrganizeTreeList().then(data=>{
                    if(data.success){
                           this.treedata=data.result;
                           this.defaultExpandedKeys=[this.getUserInfo().user.manageOrgId];
                        }
                        else {
                            this.$message.error('获取数据失败！');
                        }
            })
        }
    },
    mounted(){
        this._getOrganizeTreeList();
    },
    components:{

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
