<template>
    <yl-panelpage  
        :treeLoading="treeLoading" 
        isZone
        :helpIsShow="false"
        reloadIsShow
        @reload="_treeReload"  
        :titleName="'标准工号树'" 
        :icon="'icon-tree'" 
        :widthNum="panelWidth" >
        <div slot="content">
            <el-tree 
                    :highlight-current="highlightCurrent"
                    :data="treeData" 
                    :expand-on-click-node="expandOnClickNode"  
                    :props="defaultProps" 
                    lazy
                    :load="loadNode"
                    :render-content="renderContent"
                    @node-click="_handleNodeClick" 
                    style="height:100%">
            </el-tree>
        </div>
    </yl-panelpage>
</template>

<script type="text/babel">
import treeMixn from '@/mixns/tree.js';
import {requestGetStandardGHByParent} from '@/api/standardgh';
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
                 let params=this.guidOfNull();
                 this._getGHByParent(params);
        },
        loadNode(node, resolve){
            if (node.level === 0) {
                 let params=this.guidOfNull();
                 this._getGHByParent(params);
            }
            else{
                requestGetStandardGHByParent(node.data.id).then(data=>{
                    if(data.success){
                             resolve(data.result)
                        }
                        else {
                            this.$message.error('获取数据失败！');
                        }
                    this.treeLoading=false;
                })
            }
        },
        _getGHByParent(val){
            let _this=this;
            this.treeLoading=true;
            requestGetStandardGHByParent(val).then(data=>{
                if(data.success){
                         this.treeData=data.result;
                    }
                    else {
                        this.$message.error('获取数据失败！');
                    }
                 this.treeLoading=false;
            }).catch(function(error){
                 _this.$message.error('获取数据失败！');
                 this.treeLoading=false;
            })
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
