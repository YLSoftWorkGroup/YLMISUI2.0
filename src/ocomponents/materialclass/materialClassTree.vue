<template>
    <yl-treeselect 
        :value="value" 
        :treedata="treedata" 
        :loaddata="loaddata" 
        :stepByOne="stepByOne" 
        :defaultProps="defaultProps" 
        :defaultText="defaultText"
        :size="size"
        :readonly="readonly"
        :disabled="disabled"
        :autofocus="autofocus"
        :placeholder="placeholder"
        :displaytoolBar="displaytoolBar"
        :nodeStateConf="nodeStateConf"
        @getCurrentNode="_getCurrentNode" 
        @nodeExpend="_nodeExpend"
        @reload="_reload"
        @clear="_clear"
    >
    </yl-treeselect>
</template>

<script type="text/babel">
import {requestGetMaterialClassByParent} from '@/api/materialclass'
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
            stepByOne:true,
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
            let params=this.guidOfNull();
            this._getMaterialClassList(params);
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
               this._getMaterialClassList(params);
             }
        },
        _getMaterialClassList(val){
            requestGetMaterialClassByParent(val).then(data=>{
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
        let params=this.guidOfNull();
        this._getMaterialClassList(params);
    },
    components:{
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>