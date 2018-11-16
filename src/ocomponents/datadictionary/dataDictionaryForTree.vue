<template>
    <yl-treeselect 
    :value='value' 
    :treedata="treedata" 
    :textOnly="textOnly"
    :defaultProps="defaultProps" 
    :isexpand="isexpand"
    :size="size"
    :readonly="readonly"
    :disabled="propsData.disabled"
    :autofocus="autofocus"
    :placeholder="placeholder"
    :nodeStateConf="nodeStateConf"
    :displaytoolBar="displaytoolBar"
    :filterTextVisibe="filterVisibe"
        @getCurrentNode="_getCurrentNode"
        @reload="_reload"
        @clear="_clear" >
    </yl-treeselect>
</template>

<script type="text/babel">
import util from '@/common/js/util';
import fetch from '@/api/fetch';
export default {
    data(){
        return{
            treedata:[],
            defaultProps: {
              children: 'children',
              label: 'text',
              id: 'id'
            },
            propsData:{
                disabled:this.disabled,
            },
            textOnly:true,
        }
    },
    props:{
       code:{
			required: true,
            type: String,
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
       isexpand:{
           required: false,
           type: Boolean,
           default: false 
       },
       value:[String,Number],
    },
    methods:{
         _reload(node){
            //重新加载
            this._getTreeList();

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
        _getTreeList(){
                fetch({
                    url:'api/services/app/commonLibrary/GetDataDictionaryByCode?code='+this.code,
                    method:'post'
                    }).then(data => {
                        if(data.success){
                            if(data.result.isTree){
                                this.treedata=data.result.selectModelDtos;
                            }
                        }
                        else {
                            this.$message.error('获取数据失败！');
                        }
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
