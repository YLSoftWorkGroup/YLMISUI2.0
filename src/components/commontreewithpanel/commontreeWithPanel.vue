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
                    :data="treeData" 
                    :highlight-current="highlightCurrent"
                    :expand-on-click-node="expandOnClickNode"  
                    :props="defaultProps" 
                     lazy
                    :load="loadNode"
                    :node-key="defaultProps.id"
                    :default-expanded-keys="defaultExpandedKeys"
                    :render-content="renderContent"  
                    @node-click="_handleNodeClick" 
                    style="height:100%">
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
            defaultExpandedKeys:[],
            treeData:[],
            nodeParams:[],
            selectNode:{},
            defaultProps: {
                    children: 'children',
                    label: 'text',
                    id: 'id'
                },
            treeLoading:false,
        }
    },
    props:{
            expandOnClickNode:{
                type:Boolean,
                default:false
            },
            highlightCurrent:{
                type:Boolean,
                default:false
            },
            nodeStateConf:{
                            required: false,
                            type: Array,
                            default: function () {
                                return []
                            }
            },
            titleName:{
                type:String,
                default:'通用逐步加载树'
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
            }
    },
    computed:{
	},
    methods:{
        _handleNodeClick(result, resolve){
            this.selectNode=result;
            this.$emit('getCurrentNode',result);
        },
        _treeReload(){
                 let params=this.guidOfNull();
                 this.defaultExpandedKeys=[this.guidOfNull()];
                 this._gettreeList(params); 
        },
        loadNode(node, resolve){
            if (node.level === 0) {
                 let params=this.guidOfNull();
                 this._gettreeList(params); 
            }
            else{
                 this._gettreeList(node.data.id,resolve);
            }
        },
        _gettreeList(val,resolve){
            let _this=this;
            this.treeLoading=true;
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
                                    resolve(data.result);
                                }else{
                                    //首次加载...
                                    this.treeData=data.result;
                                    if(data.result.length===0){
                                        this.treeData=[{
                                                id: this.guidOfNull(),
                                                text:this.getUserInfo().user.manageOrgName,
                                            }]
                                      //  this.defaultExpandedKeys=[this.guidOfNull()];
                                    }else{
                                        this.defaultExpandedKeys=[data.result[0].id];
                                    }
                                }  
                        }
                        else {
                            this.$message.error('获取数据失败！');
                        }
                            this.treeLoading=false;
                }).catch(function(error){
                            _this.treeLoading=false;
                })  
        }
    },
    mounted(){
    },
    components:{

    },
    watch:{
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
