<template>
    <el-select 
        v-model="currentValue" 
        filterable 
        :placeholder="placeholder" 
        :size="size" 
        :clearable="clearable" 
        :disabled="propsData.disabled"
        @clear="_clear" 
        @change="_change">
            <el-option v-for="item in data" 
                style="width:100%;height:auto;" 
                :key="item[defaultProps.value]"  
                :label="item[defaultProps.text]" 
                :value="item[defaultProps.value]" >
                <div style="height:18px; font-size: 12px">{{item[defaultProps.text]}}</div> 
                <div v-for="(listitem,index) in lists"  :key="index" style="height:15px;color: #8492a6; font-size: 10px" >
                    {{ item[listitem]}}
                </div>
            </el-option>
    </el-select>
</template>

<script type="text/babel">
import fetch from '@/api/fetch';
import  {inputModel} from '@/api/inputmodel';
import emitter from '@/mixns';
export default {
     name:'yl-commonselect',
     data() {
      return {
        data: [],
        currentValue: this.value,
        mainInput:new inputModel(),
        currentNode:[],
        propsData:{
            disabled:this.disabled,
        }
      }
    },
    mixins: [emitter],
    props:{
        apiConf:{
            type:Object,
            default:function(){
               return {  
                        url:"",
                        query:[],
                        maxRows:100,
                        sorting:""
                      }
            }
        },
        lists:{//下拉列表显示选项
            type:Array,
            default:function () {
               return []
            }
        },
        initData:{
            type:Array,
            default:function () {
                        return []
                    }
        },
        defaultProps:{//select的Text值和唯一的ID的设置
            type:Object,
            default:function () {
                return {
                        text:"",
                        value:""
                    }
           }
        },
        size:{
            type:String,
            default:''
        },
        disabled:{
            type:Boolean,
            default:false
        },
        clearable:{
            type:Boolean,
            default:true
        },
        placeholder:{
            type:String,
            default:""
        },
        value:[String,Number],
    },
    methods:{
        loadAll() {
            //排序
           if(this.apiConf.url!==""){
                this.mainInput.inputModel.sorting=this.apiConf.sorting;
                this.mainInput.inputModel.maxResultCount=this.apiConf.maxRows;
                this.mainInput.addqueryConditionItem(this.apiConf.query);
                fetch({
                    url: this.apiConf.url,
                    method: "post",
                    data: this.mainInput.inputModel
                    }).then(data =>{
                    if(data.success){
                            this.data=data.result.data;
                        }
                    else{
                        this.data=[];
                    }
            })
           }
        },
        _change(nodes){
              let _this=this;
                 _this.currentNode=[];
                if(nodes!=''){
                    let val=_this.defaultProps.value;
                    this.$emit('input',nodes);
                        if(_this.data.length!==0){
                            let item=_this.data.filter(function(item){
                                return  item[val] == nodes; 
                            })
                                _this.currentNode.push(item[0]);
                                this.$emit('getCurrentNode',_this.currentNode);
                        }
                }
        },
        _clear(){
            this.$emit('clear',this.currentNode);
        },
        _setCurrentValue(value) {
            if (value === this.currentValue) return;
                this.currentValue = value;
                //this.loadAll();
            if (this.validateEvent) {
                this.dispatch('ElFormItem', 'el.form.change', [value]);
            }
        }
    },
    mounted(){
        if(this.initData.length>0){
            this.data=this.initData;
        }else{
            this.loadAll();
        }
    },
    watch:{
        initData:function (val, oldVal) {
             if(val.length>0){
                 this.data=val;
            }
        },
        value:function(val, oldVal){
            this._setCurrentValue(val);
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>