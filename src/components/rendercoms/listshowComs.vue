
<template>
   <!-- html展示组件 -->
     <yl-htmlRaw ref="htmlRaw"
        v-if="option.type==='htmlRaw'" 
        :content="option.elmentConfig.content" 
        :style="option.elmentConfig.style"
    >
    </yl-htmlRaw>

    <!-- 卡片展示 -->
     <yl-card ref="card"
        v-else-if="option.type==='card'" 
        :schema="option.elmentConfig.schema" 
        :item="item" 
        :style="option.elmentConfig.style"
    >
    </yl-card>


     <yl-treecard ref="treecard"
        v-else-if="option.type==='treecard'" 
        :schema="option.elmentConfig.schema" 
        :item="item" 
        :nodeClick="option.elmentConfig.nodeClick"
        :style="option.elmentConfig.style"
    >
    </yl-treecard>

</template>
  
<script type="text/babel">
import fetch from '@/api/fetch';
import util from '@/common/js/util';
export default {
    data(){
        return  {
        }
    },
    props:{
       option:{
            type:Object,
            require:true,
            default:function(){
                return {}
            }
       },
       item:{
            type:Object,
            require:true,
            default:function(){
                return {}
            } 
        }
    },
    methods:{
       _initComs(){
            let _this=this;
            if(_this.option.eventConf!=undefined){
                let eventConf=_this.option.eventConf;
                    if(eventConf!=undefined){
                        if(eventConf.isOn){
                            eventConf.init(_this);
                        }
                    }  
            }
        },
    },
    created(){
    },
    beforeMount(){
       this._initComs()
    },
    mounted(){
    },
    

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>