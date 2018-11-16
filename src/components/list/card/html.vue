<template>
    <div v-html="content">
    </div>
</template>

<script type="text/babel">
export default {
    data(){
        return {
            emptyContent:'<div style="width:100%;height:200px;line-height:200px;text-align:center;font-size:12px;">暂无数据</div>',
            loading:'<p style="text-align:center;font-size:14px;height:40px;margin-top:100px;"><img src="img/loading3.gif"></img> 数据加载中···</p>'
        }
    },
    props:{
        content:{
            type:String,
            default:''
        },
    },
    methods:{
    },
    mounted(){
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
