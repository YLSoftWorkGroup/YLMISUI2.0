
<template>
<div class="split-line">
    <div class="text" v-if="text" v-text="text"></div>
    <div class="line">
    </div>
    
</div>
</template>

<script type="text/babel">
export default {
    props:{
        text:{
            type:String,
            default:''
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.split-line
    padding 10px 0px
    display flex
    .text
        text-align center
        height 10px
        padding 0px 20px
        color #b1b1b1
    .line
        flex 1
        margin-top 4px
        border-top #ccc 1px dotted 

</style>
