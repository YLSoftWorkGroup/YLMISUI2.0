<template>
    <div >
        <el-button  v-for="(item,index) in options"
                :key="index"
                v-show="item.isShow"
                :disabled="item.disabled"  
                :type="item.type" 
                :size="item.size" 
                @click="_click(item)"
            > 
            <i :class="item.icon"></i>
            {{item.text}}  
        </el-button>
    </div>
</template>

<script type="text/babel">
export default {
    data(){
        return {}
    },
    props:{
        options:{
            type:Array,
            default:function(){
                return []
            }
        }
    },
    methods:{
        _click(item){
              this.$emit('click',item)
        }
    },
    mounted(){
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


