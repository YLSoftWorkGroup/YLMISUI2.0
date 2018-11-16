<template>
    <yl-panelpage  
    :treeLoading="treeLoading" 
    isZone
    :helpIsShow="false"
    :reloadIsShow="true" 
    @reload="_treeReload"  
    :titleName="titleName" 
    :icon="'icon-tree'" 
    :widthNum="panelWidth" >
        <div slot="content">
            <el-tree 
                    :data="treedata" 
                    :highlight-current="highlightCurrent"
                    :expand-on-click-node="expandOnClickNode"  
                    :props="defaultProps" 
                    :node-key="defaultProps.id"
                    :default-expanded-keys="defaultExpandedKeys"
                    :default-expand-all="isexpand"
                    :render-content="renderContent"  
                    @node-click="_handleNodeClick" 
                    style="height:100%;">
            </el-tree>
        </div>
    </yl-panelpage>
</template>

<script type="text/babel">
import treeMixn from '@/mixns/tree.js';
import fetch from '@/api/fetch';
export default {
    mixins: [treeMixn],
    data(){
        return{
            treedata:[],
            selectNode:{},
            defaultExpandedKeys:[],
            defaultProps: {
                    children: 'children',
                    label: 'text',
                    id: 'id'
                },
            treeLoading:false,
        }
    },
    props:{
        isexpand:{
            type: Boolean,
            default: false 
            },
        expandOnClickNode:{
            type:Boolean,
            default:false
        },
        highlightCurrent:{
            type:Boolean,
            default:false
        },
        titleName:{
            type:String,
            default:'通用全部加载树'
        },
        panelWidth:{
            type:String,
            default:'200px'
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
    },
    methods:{
        _handleNodeClick(result, resolve){
             this.selectNode=result;
             this.$emit('getCurrentNode',result);
        },
        _treeReload(){
            this._getTreeList();
        },
        _getTreeList(){
            this.treeLoading=true;
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
                    this.treeLoading=false;
            }).catch(function(error){
                 this.treeLoading=false;
                })  
        },
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
