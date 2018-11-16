<template>
    <yl-panelpage  
        :treeLoading="treeLoading" 
         isZone
        :helpIsShow="false"
        :reloadIsShow="true" 
        @reload="_treeReload"  
        :titleName="'工号树'" 
        :icon="'icon-tree'" 
        :widthNum="panelWidth" >
        <div slot="content">
            <el-tree 
                :highlight-current="highlightCurrent"
                :data="treeData" 
                :expand-on-click-node="expandOnClickNode"  
                :props="defaultProps" 
                :load="loadNode"
                :render-content="renderContent"
                lazy
                :node-key="defaultProps.id" 
                :defaultExpandedKeys="defaultExpandedKeys"
                @node-click="_handleNodeClick" 
                style="height:100%">
            </el-tree>
        </div>
    </yl-panelpage>
</template>

<script type="text/babel">
import treeMixn from '@/mixns/tree.js';
import {requestGetGHByParent} from '@/api/gh'
export default {
    mixins: [treeMixn],
    data(){
        return{
            treeData:[],
            loaddata:[],
            defaultExpandedKeys:[],
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
        panelWidth:{
            type:String,
            default:'200px'
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
            //实现加载第一级
            this.treeData=[{
                        id: this.guidOfNull(),
                        text:this.getUserInfo().user.manageOrgName,
                        isCheck:false,
                        isDelivery:false,
                    }]
              this.defaultExpandedKeys=[this.guidOfNull()];
        },
        loadNode(node, resolve){
            let on=true;
            if (node.level === 0) {
              resolve([{
                        id: this.guidOfNull(),
                        text:this.getUserInfo().user.manageOrgName,
                        isCheck:false,
                        isDelivery:false,
                    }]);
                 this.defaultExpandedKeys=[this.guidOfNull()];
            }
            else{
                this.nodeStateConf.map(item=>{
                    if(item.leafflag){
                        if(node.data[item.name]){
                            node.isLeaf=true;
                            node.loaded=true;
                            node.loading=false;
                            on=false;
                            return;
                        }
                   }
                  })
                  if(on){
                    requestGetGHByParent({
                            parentId:node.data.id,
                            orgId:this.getUserInfo().user.realOrgId
                            }).then(data=>{
                        if(data.success){
                                resolve(data.result)
                            }
                            else{
                                this.$message.error('获取数据失败！');
                            }
                        this.treeLoading=false;
                    })
                  }
                
            }
        },
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
