
<template>
<div class="yl-linkblock">
            <div class="block" v-for="(item,index) in confList" :key="index" :style="item.style">
                <div class="icon">
                    <i :class="item.icon"></i>
                </div>
                <div class="content">
                    <div class="title">{{item.title}}</div>
                    <div class="list">
                        <p class="item" v-for="(i,index) in item.item" :key="index" @click="_goUrl(i.url)">
                            {{i.text}}
                        </p>
                    </div>
                </div>
                
            </div>
</div>
</template>

<script type="text/babel">
const COMPONENT_NAME = 'yl-linkblock'
export default {
    name:COMPONENT_NAME,
    data(){
        return {

        }
    },
    props:{
        confList:{
           type:Array,
            default:function(){
               return []
           }
        }
    },
    methods:{
         _goUrl(url){ 
             this.goUrl(url)  
         },
    },
    mounted(){
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped> 
    .yl-linkblock
        display flex
        align-items baseline
        flex-wrap wrap
        color #FFF
        font-size 14px
        padding 10px
        .block
            margin 5px
            padding 10px
            min-height 100px
            display flex
            flex-wrap wrap
            background-color #47BF68
            .icon
                width 35%
                font-size 60px
                color #EAEAEA
            .content
                flex 1
                .title
                    font-size 22px
                    padding 5px 0px
                    border-bottom 1px solid  #EAEAEA
                    text-align right 
                .list
                    padding 10px
                    line-height 25px
                    text-align right 
                    cursor pointer


</style>
