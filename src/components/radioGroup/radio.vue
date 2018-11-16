 

<template>
    <el-radio-group v-model="currentValue" @change="_change">
        <el-radio :label="i.label" v-for="(i,index) in options.list" :key="index">{{i.text}}</el-radio>
    </el-radio-group>
</template>

<script type="text/babel">
export default {
    data(){
        return {
            currentValue:this.value
        }
    },
    props:{
        options:{
            type:Object,
            default:function(){
                return {
                    list:[]
                }
            }
        },
        value:[String],
    },
    methods:{
        _change(label){
             this.$emit('input',label);
             this.$emit('change',label);
        }
    },
    mounted(){
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

