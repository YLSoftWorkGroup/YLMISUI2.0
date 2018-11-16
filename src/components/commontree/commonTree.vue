<template>
    <yl-treeselect 
        :value="value" 
        :treedata="treedata" 
        :loaddata="loaddata" 
        :stepByOne="stepByOne" 
        :defaultProps="defaultProps" 
        :isexpand="isexpand" 
        :textOnly="textOnly"
        :defaultText="defaultText"
        :size="size"
        :readonly="readonly"
        :disabled="propsData.disabled"
        :autofocus="autofocus"
        :placeholder="placeholder"
        :filterTextVisibe="filterVisibe"
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
import fetch from '@/api/fetch';
export default {
    data(){
        return{
            treedata:[],
            loaddata:[],
            defaultProps: {
              children: 'children',
              label: 'text',
              id: 'id'
            },
            isexpand:false,
            stepByOne:true,
            textOnly:false,
            filterVisibe:false,
            defaultExpandedKeys:[],
            propsData:{
                disabled:this.disabled,
            },
        }
    },
    props:{
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
       } ,
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
        _getCurrentNode(selectNode){
           
            if(this.textOnly){ 
                this.$emit('input',selectNode.text);
                }
            else{ 
                this.$emit('input',selectNode.id);
                }
             this.$emit('getCurrentNode',selectNode);
        },
        _nodeExpend(result){
             if(this.stepByOne){
                 //逐步加载
               let params=result.data.id; 
               this._getTreeList(params);
             }
        },
        _getTreeList(val){
            let params={};
            params.parentId=val;
            if(this.orgId==''){
                params.orgId=this.getUserInfo().user.manageOrgId;
            }else if(this.orgId!==this.guidOfNull){
                params.orgId=this.orgId;
            }
            fetch({
                url:'api/services/app/'+this.code+'/GetTreeListByParent',
                data:params,
                method:'post'
            }).then(data=>{
                    if(data.success){
                        if(val!=this.guidOfNull()){
                           this.loaddata=data.result;
                        }else{
                            //首次加载...
                            this.treedata=data.result;
                            if(data.result.length===0){
                               // this.defaultExpandedKeys=[this.guidOfNull()];
                                this.treedata=[{
                                        id: this.guidOfNull(),
                                        text:this.getUserInfo().user.manageOrgName,
                                    }]
                                
                            }else{
                                this.defaultExpandedKeys=[data.result[0].id];
                            }
                         }  
                    }
                    else {
                        this.$message.error('获取数据失败！');
                    }
            })
        }
    },
    mounted(){  
        let params=this.guidOfNull();
        this._getTreeList(params);
    },
    components:{
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>