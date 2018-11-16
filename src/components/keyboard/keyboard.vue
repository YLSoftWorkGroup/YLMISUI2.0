
<template>
<div class="keyborder" v-if="isRender">
    <div class="content">
        <div class="main">
                <div class="num">
                    <div class="key" v-for="(i,index) in num" :key="index" @click="getchart(i)">
                        {{i}}
                    </div>
                
                </div>
                <div class="func" style="padding-right:10px">
                    <div class="key clear" style="flex:1" @click="rmchart">
                        
                    </div>
                    <!-- <div class="key" @click="close">
                        关闭
                    </div> -->
                </div>
        </div>
        <div class="borderBox">
            <div class="word">
                     <div class="key" v-for="(i,index) in word" :key="index" @click="getchart(i)">
                        {{i}}
                    </div>
            </div>
            <div class="zimu">
                    <div class="key" v-for="(i,index) in zimu" :key="index" @click="getchart(i)">
                        {{i}}
                    </div>

            </div>
        </div>
    </div>
</div>
</template>

<script type="text/babel">
export default {
    data(){
        return{
            isRender:this.isClose,
            num:[0,1,2,3,4,5,6,7,8,9],
            word:['京','津','冀','晋','蒙','辽','吉','黑','沪','苏','浙','皖','闽','赣','鲁','豫','鄂','湘','粤','桂','琼','渝','川','贵','云','藏','陕','甘','青','宁','新','港','澳','台'],
            zimu:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
        }
    },
    props:{
        isClose:{
            type:Boolean,
            default:false
        }
    },
    methods:{
        getchart(i){
            this.$emit('getchart',i)
        },
        rmchart(){
            this.$emit('rmchart')
        },
        close(){
            this.isRender=false;
        }
    },
    watch:{
        isClose:function(n,o){
            this.isRender=n;
        }
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .keyborder
        position absolute
        z-index 10
        left 250px
        background-color #F9F9F9
        border 1px #73B3EF solid
        .content
            width 610px
            font-size 14px
            .main
                display flex
                .num
                    flex 1
                    height 35px
                    display flex
                    align-items center
                    flex-wrap nowrap
                .func
                    width 120px
                    height 35px
                    display flex
                    align-items center
                    flex-wrap nowrap
            .borderBox
                display flex
                height 160px
                .word
                    width 330px
                    display flex
                    flex-wrap wrap
                .zimu
                    flex 1
                    display flex
                    flex-wrap wrap




.key
    height 25px
    width  35px
    line-height 25px
    box-sizing border-box
    background-color #F9F9F9
    border 1px #73B3EF solid
    border-radius 5px
    margin 2px 5px
    text-align center
    box-shadow 3px 2px 2px #888888
    &:hover
        background-color #73B3EF
        color #fff
        cursor pointer
.clear 
    background url(/img/clean.png) no-repeat center



</style>

