<template>
    <yl-treeselect 
        :value="value" 
        :treedata="treedata" 
        :loaddata="loaddata" 
        :stepByOne="stepByOne" 
        :defaultProps="defaultProps" 
        :size="size"
        :readonly="readonly"
        :disabled="disabled"
        :autofocus="autofocus"
        :placeholder="placeholder"
        :filterTextVisibe="filterVisibe"
        :defaultText="defaultText"
        :nodeStateConf="nodeStateConf"
        :displaytoolBar="displaytoolBar"
        :defaultExpandedKeys="defaultExpandedKeys"
        @getCurrentNode="_getCurrentNode" 
        @nodeExpend="_nodeExpend"
        @reload="_reload"
        @clear="_clear"
    >
    </yl-treeselect>
</template>

<script type="text/babel">
import {requestGetGHByParent} from '@/api/gh'
export default {
    data(){
        return{
            defaultExpandedKeys:[], 
            treedata:[],
            loaddata:[],
            defaultProps: {
              children: 'children',
              label: 'text',
              id: 'id'
            },
            stepByOne:true
        }
    },
    props:{
        isexpand:{type: Boolean,default: false },
        value:[String,Number],
        defaultText:{
                    type:String,
                    default:''
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
           },     
    },
    methods:{
         _reload(node){
            //重新加载
             this.treedata=[{
                    id: this.guidOfNull(),
                    text:this.getUserInfo().user.manageOrgName,
                    fullName:this.getUserInfo().user.manageOrgName,
                    isCheck:false,
                    isDelivery:false,
                }]
            this.defaultExpandedKeys=[this.guidOfNull()];
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
        _nodeExpend(node){
                let params=node.data.id; 
                this._getGHTreeList(params);
             
        },
        _getGHTreeList(val){
            requestGetGHByParent(
                {
                    parentId:val,
                    orgId:this.getUserInfo().user.realOrgId
                    }
            ).then(data=>{
                    if(data.success){
                          this.loaddata=data.result; 
                    }
                    else {
                        this.$message.error('获取数据失败！');
                    }
            })
        }
    },
    mounted(){  
        this.treedata=[{
            id: this.guidOfNull(),
            text:this.getUserInfo().user.manageOrgName,
            fullName:this.getUserInfo().user.manageOrgName,
            isCheck:false,
            isDelivery:false,
          }]
          this.defaultExpandedKeys=[this.guidOfNull()];
    },
    components:{
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
