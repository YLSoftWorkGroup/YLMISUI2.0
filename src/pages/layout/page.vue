
<template>
    <div class="page-wrapper page-border page-background" >
            <yl-tab class="tab"></yl-tab>
            <div class="dynamicmodel background-color-base">
               <transition name="el-fade-in-linear" >
                    <!-- <keep-alive :include="includedComponents"> -->
                        <router-view :key="key"></router-view>
                    <!-- </keep-alive> -->
               </transition>
            </div>
    </div>
</template>  

<script type="text/babel">
import tab from './tab'
export default {
    name:"yl-page",
    components:{
		'yl-tab':tab
    },
    computed:{
        key() {
            return this.$route.fullPath
            }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.page-wrapper
    flex 1
    margin 0px 8px
    padding:8px
    display flex
    flex-direction column
    .tab
        height 26px
    .dynamicmodel
        flex 1
        overflow auto
</style>
