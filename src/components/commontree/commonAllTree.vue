<template>
    <yl-treeselect 
        :value="value" 
        :treedata="treedata" 
        :defaultProps="defaultProps" 
        :isexpand="isexpand" 
        :textOnly="textOnly"
        :size="size"
        :readonly="readonly"
        :disabled="propsData.disabled"
        :autofocus="autofocus"
        :placeholder="placeholder"
        :filterTextVisibe="filterVisibe"
        :nodeStateConf="nodeStateConf"
        :defaultExpandedKeys="defaultExpandedKeys"
        @getCurrentNode="_getCurrentNode"
        @reload="_reload"
        @clear="_clear" >
    </yl-treeselect>
</template>

<script type="text/babel">
import fetch from '@/api/fetch';
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
            propsData:{
                disabled:this.disabled,
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
       filterVisibe:{
            type: Boolean,
            default: true,
       },
       textOnly:{
            type: Boolean,
            default: false,
       },
       code:{
            type: String,
            default: "" ,
       },
       orgId:{
            type: String,
            default:'',
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
            let params={};
            if(this.orgId==''){
                params.orgId=this.getUserInfo().user.manageOrgId;
            }else if(this.orgId!==this.guidOfNull){
                params.orgId=this.orgId;
            }
            fetch({
                url:'api/services/app/'+this.code+'/GetTreeList',
                data:params,
                method:'post'
            }).then(data=>{
                    if(data.success){
                        this.treedata=data.result;
                        if(data.result.length>0){
                             this.defaultExpandedKeys=[data.result[0].id];
                         }
                    }
                    else {
                        this.$message.error('获取数据失败！');
                    }
            })
        }
    },
    mounted(){
         this.defaultExpandedKeys=[this.guidOfNull()];
        this._getTreeList();
    },
    components:{

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
