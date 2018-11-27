<template>
    <!--列表渲染-->
    <span v-if="option.type==='tag'">
     <el-tag  
        v-for="(item,index) in option.elmentConfig" :key="index"
        v-if="row[option.name]===item.value"
        v-text="item.text"
        :size="item.size"
        :color="item.color"
        :hit="item.hit"
        :type="item.type"
     >
     </el-tag>
     </span>

    <span  v-else-if="option.type==='button'">  
        <el-button  v-for="(item,index) in option.elmentConfig"  :key="index" 
                            :type="item.type" 
                            :name="item.name" 
                            :size="item.size" 
                            v-show="item.isShow"
                            :disabled="item.disabled" 
                            @click="_tableSlotEvent(item)" 
                             >
                    <i :class="item.icon"></i>{{item.text}}
        </el-button>
    </span>

    <span  v-else-if="option.type==='view'"> 
         <el-tooltip 
            effect="dark" 
            :hide-after="item.hideAfter"
            :manual="item.manual"
            :content="item.tipText" 
            :key="index"
            :isContainer="item.isContainer"
            placement="bottom-start" 
            v-for="(item,index) in option.elmentConfig" 
            v-show="item.isShow"
            > 
            <span class="yl-table-icon" style="margin:0px 5px 0px 5px"  >  
                    <i  class="yl-text-color" :class="item.icon"  @click="_tableSlotEvent(item)" ></i>
            </span>
         </el-tooltip>
    </span>

    <span  
        v-else-if="option.type==='format'" 
        v-html="this.format"> 
    </span>
 </template>

<script type="text/babel">
import globalJS from '@/common/js/globalJS';
export default {
    data(){
        return{
        }
    },
    props:{
        option:{
            type:Object,
            require:true
        },
        row:{
            type:Object,
            require:true
        },
        name:{
            type:String,
            value:''
        }
    },
    computed:{
        format:{
            get(){
                if(this.option.eventConf.isOn){
                    let _this=this;
                    return this.option.eventConf.format(this.row,this.option,_this);
                }else{
                    return  ''
                }
            }
        },
         globalFunObject:{
            get(){
                return globalJS;
            }
        },
    },
    methods:{
        _tableSlotEvent(item){
              this.$emit("tableSlotEvent",this.row,item)
        },
    },
    components:{
    },
    mounted(){
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
