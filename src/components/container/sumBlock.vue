
<template>
<div class="yl-sumBlock">
        <div v-if="isReport" class="report">
            <!-- 报表展示 -->
            <div class="item" v-for="(i,index) in dataList"  :key="index">
                <div class="icon"><i :class="i.icon"></i></div>
                <div class="sum">
                    <p class="num" :style="i.valueStyle"><span v-html="format(i)"></span><span class="unit" >{{i.unit}}</span></p>
                    <p class="label">{{i.text}}</p>
                </div>
            </div>
        </div>
         <div v-if="!isReport" class="detail">
            <!-- 明细展示 -->
            <div class="item" v-for="(i,index) in dataList"  :key="index">
                <div class="icon"><i :class="i.icon"></i></div>
                <div class="label">{{i.text}}：</div>
                <div class="num" :style="i.valueStyle"> <span v-html="format(i)"></span> <span class="unit" >{{i.unit}}</span></div>
            </div>
        </div>
</div>
</template>

<script type="text/babel">
export default {
    data(){
        return {

        }
    },
    props:{
        isReport:{
            type:Boolean,
            default:false
        },
        dataList:{
            type:Array,
            default:function(){
                return []
            }
        },
        item:{
            type:Object,
            default:function(){
                return {}
            }
        }
    },
    methods:{
        format(i){
            if(i.format!==undefined){
                if(this.item[i.name]!==undefined){
                    return i.format(this.item[i.name])
                }else{
                    return ''
                }
            }else{
                return this.item[i.name]
            }
        }
    }

    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.yl-sumBlock
    border-top #e1e5ea 1px solid
    border-bottom #e1e5ea 1px solid
    background-color #f1f6f7
    min-height 10px 
    padding 5px
    .report
        display flex
        flex-wrap wrap
        align-items center 
        .item
            width 200px
            height 50px
            color #959595
            font-size 12px
            border-right 1px solid #e1e5ea
            display flex
            align-items center 
            .icon
                width 70px
                font-size 22px
                text-align right
                padding-right 5px
                color #20A0FF
            .sum
                flex 1
                .num
                    font-size 18px
                    color #1F2D3D
                    .unit
                        font-size 14px
                .label
                    padding-top 5px
    .detail
        display flex
        flex-wrap wrap
        align-items center 
        .item
            width 220px
            height 35px
            color #959595
            font-size 12px
            display flex
            align-items center 
            .icon
                width 30px
                font-size 14px
                text-align right
                padding-right 3px
                color #20A0FF
            .label
                text-align left
                padding-right 2px
                width 75px
            .num
                font-size 16px
                color #1F2D3D
                flex 1
                .unit
                    font-size 12px
                    color #959595

           



</style>


