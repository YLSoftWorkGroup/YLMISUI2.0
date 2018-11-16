<template>
    <yl-panelpage  
    :treeLoading="treeLoading" 
     isZone
    :helpIsShow="false"
    :reloadIsShow="true" 
    @reload="_treeReload"  
    :titleName="'组织机构树'" 
    :icon="'icon-tree'" 
    :widthNum="panelWidth" >
        <div slot="content">
             <el-tree 
                :highlight-current="highlightCurrent"
                :data="organizeTreeData" 
                :expand-on-click-node="expandOnClickNode"  
                :props="defaultProps" 
                :load="loadNode"
                :node-key="defaultProps.id" 
				:default-expanded-keys="defaultExpandedKeys"
                :render-content="renderContent"
                lazy
                @node-click="_handleNodeClick" 
                style="height:100%">
            </el-tree>
        </div>
    </yl-panelpage>
</template>

<script type="text/babel">
import treeMixn from '@/mixns/tree.js';
import {requestGetOrganizeTreeList,requestGetOrganizeTreeListByParent} from '@/api/organize'
export default {
    mixins: [treeMixn],
    data(){
        return{
            organizeTreeData:[],
            selectNode:{id:""},
            defaultProps: {
                    children: 'children',
                    label: 'text',
                    id: 'id'
                },
            treeLoading:false,
            defaultExpandedKeys:[]
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
        panelWidth:{
            type:String,
            default:'200px'
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
            //实现加载第一级
            this.organizeTreeData=[{
                        id: this.getUserInfo().user.manageOrgId,
                        text:this.getUserInfo().user.manageOrgName,
                        code:this.getUserInfo().user.orgCode,
                        funcCode:this.getUserInfo().user.orgCategory,
                    }]
            this.defaultExpandedKeys=[this.getUserInfo().user.manageOrgId];

        },
        loadNode(node, resolve){
            let on=true;
            this.treeLoading=true;
            if (node.level === 0) {
              this.defaultExpandedKeys=[this.getUserInfo().user.manageOrgId];
              resolve([{
                        id: this.getUserInfo().user.manageOrgId,
                        text:this.getUserInfo().user.manageOrgName,
                        code:this.getUserInfo().user.orgCode,
                        funcCode:this.getUserInfo().user.orgCategory,
                    }]);
              this.treeLoading=false;
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
                    requestGetOrganizeTreeListByParent(node.data.id).then(data=>{
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
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
