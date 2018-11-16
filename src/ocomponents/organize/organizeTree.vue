<template>
    <yl-treeselect 
            :value="value" 
            :treedata="treedata" 
            :loaddata="loaddata" 
            :stepByOne="stepByOne" 
            :defaultProps="defaultProps" 
            :defaultText="defaultTxt"
            :size="size"
            :readonly="readonly"
            :disabled="disabled"
            :autofocus="autofocus"
            :placeholder="placeholder"
            :displaytoolBar="displaytoolBar"
            :defaultExpandedKeys="defaultExpandedKeys"
            :nodeStateConf="nodeStateConf"
            @getCurrentNode="_getCurrentNode" 
            @nodeExpend="_nodeExpend"
            @reload="_reload"
            @clear="_clear"
     >
    </yl-treeselect>
</template>

<script type="text/babel">
import util from '@/common/js/util';
import fetch from '@/api/fetch';
import {requestGetOrganizeTreeList,requestGetOrganizeTreeListByParent} from '@/api/organize'
export default {
    data(){
        return{
            treedata:[],  
            loaddata:[], 
            defaultExpandedKeys:[],
            defaultProps: {
              children: 'children',
              label: 'text',
              id: 'id'
            },
            textOnly:false,
            stepByOne:true,
            defaultTxt:''
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
       defaultText:{
                    type:String,
                    default:''
       },
       displaytoolBar:{
                    type: Boolean,
                    default: false
        }
    },
    methods:{
        _reload(node){
            //重新加载
            let params=this.guidOfNull();
            this._getTreeList(params);
        },
       _clear(){
            //清除值
            this.$emit('clear');
        },
        _nodeExpend(result){
             if(this.stepByOne){
                 //逐步加载
               let params=result.data.id; 
               this._getTreeList(params);
             }
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
        _getTreeList(val){
            requestGetOrganizeTreeListByParent(val).then(data=>{
                    if(data.success){
                        if(val!=this.guidOfNull()){
                           this.loaddata=data.result;
                        }else{
                            this.treedata=data.result;
                         }  
                    }
                    else {
                        this.$message.error('获取数据失败！');
                    }
            })
        }
    },
    mounted(){
        this.treedata=[{
            id:this.getUserInfo().user.manageOrgId,
            text:this.getUserInfo().user.manageOrgName,
            code:this.getUserInfo().user.orgCode,
            funcCode:this.getUserInfo().user.orgCategory,
          }]
          if(this.defaultText!=''){
                this.defaultTxt=this.defaultText;
          }else{
              this.defaultTxt=this.getUserInfo().user.manageOrgName;
          }
          this.defaultExpandedKeys=[this.getUserInfo().user.manageOrgId];
    },
    components:{
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
