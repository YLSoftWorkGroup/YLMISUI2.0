<template>
   <yl-panelpage  
    :treeLoading="treeLoading" 
    isZone
    :helpIsShow="false"
    :reloadIsShow="true" 
    @reload="_treeReload"  
    :titleName="'菜单树'" 
    :icon="'icon-tree'" 
    :widthNum="panelWidth" >
        <div slot="content">
            <el-tree :data="treeData" 
                    :highlight-current="highlightCurrent"
                    :expand-on-click-node="expandOnClickNode"  
                    :props="defaultProps" 
                    :default-expand-all="isexpand"
                    :render-content="renderContent"  
                    @node-click="_handleNodeClick" 
                    style="height:100%">
            </el-tree>
        </div>
    </yl-panelpage>
</template>

<script type="text/babel">
import treeMixn from '@/mixns/tree.js';
import util from '@/common/js/util';
import {requestGetMenuItemTreeList} from '@/api/menuitem'
export default {
    mixins: [treeMixn],
    data(){
        return{
            treeData:[],
            selectNode:{id:""},
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
            default:true
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
            this._getTreeList();
        },
        _getTreeList(){
            let _this=this;
            this.treeLoading=true;
            requestGetMenuItemTreeList().then(data=>{
               if(data.success){
                            this.treeData=util.returnDatabyTree(data.result,this.guidOfNull());
                        }
                        else {
                             this.$message.error('获取数据失败！'+data.error.message);
                        }
                 this.treeLoading=false;
            }).catch(function(error){
                 _this.$message.error('获取数据失败！');
                 _this.treeLoading=false;
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
