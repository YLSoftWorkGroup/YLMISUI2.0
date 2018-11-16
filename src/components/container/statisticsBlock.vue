<template>
<div class="box">
    <div class="icon" :style="{ 'background-color':_getBgColor(theme).icon}">
        <i :class="icon"></i>
    </div>
    <div class="content" :style="{ 'background-color':_getBgColor(theme).content}">
        <div class="title">{{title}}</div>
    
        <div class="text">
            <!-- <countTo :startVal='startVal' :endVal='endVal' :duration='duration'></countTo> -->
            {{endVal}}
            <span style="font-size:14px">{{unit}}</span>
        </div>
        <div class="more" v-if="linkUrl">
            <i class="icon-ellipsis" @click="_linkTo"></i>
        </div>
    </div>
</div>
</template>

<script type="text/babel">
import countTo from '@/components/countTo';
import util from '@/common/js/util';
import fetch from '@/api/fetch';
export default {
    data(){
        return{
            startVal:0,
            endVal:0
        }
    },
    props:{
        backgroudColor:{
            type:Object,
            default: function(){
                    return {
                        icon:"#0E80F7",
                        content:"#409EFF"
                    }
                }
        },
        theme:{
            type:String,
        },
        duration:{
            type:Number,
            default:3000
        },
        number:{
             type:Number,
             default:0
        },
        unit:{
            type:String,
            default:''
        },
        title:{
            type:String,
            default:''
        },
        linkUrl:{
            type:String,
            default:''
        },
        icon:{
            type:String,
            default:'icon-sphere'
        },
        eventConf:{
            type:Object,
            default: function(){
                    return {
                    }
                }
        }
    },
    computed:{
            fetchObject:{  
                get(){
                    return fetch;
                }
            },
            utilObject:{
                get(){
                    return util;
                }
            },
    },
    methods:{
        _getBgColor(str){
			if(this.theme==="primary"){return {icon:"#0E80F7",content:"#409EFF"};}
			else if(this.theme==="info"){return {icon:"#6C6D70",content:"#909399"};}
			else if(this.theme==="success"){return {icon:"#308F02",content:"#67C23A"};}
			else if(this.theme==="warning"){return {icon:"#C88B2F",content:"#E6A23C"};}
			else if(this.theme==="danger"){return {icon:"#C90404",content:"#F56C6C"};}
			else{return this.backgroudColor;}
        },
        _linkTo(){
            this.$router.push({ path:this.linkUrl});
        },
        //事件初始化方法----
        _mounted(){
           let _this=this;
           if(_this.eventConf!=undefined){
            if(_this.eventConf.isOn){
                if(_this.eventConf.mounted!=undefined){
                     _this.eventConf.mounted(_this);
                }
            }
           }
         },
    },
    components: { 
				countTo,
        },
    beforeMount(){
        
    },
    mounted(){
       this._mounted();
    },
    watch:{
        number:function(n,o){
             if(n>0){
                this.endVal=n;
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .box 
        height 80px
        width 100%
        display flex
        box-sizing border-box
        border-radius:8px
        box-shadow 6px 6px 5px rgba(0,0,0,.1)
        .icon
            width 80px
            text-align center
            padding-top 10px
            i
                font-size 55px
                color #fff
        .content
            width auto
            color #fff
            text-align left
            padding 5px
            overflow hidden
            flex 1
            .title
                padding-top 10px
                font-size 14px
            .text
                font-size 18px
                padding-top 8px
        .more
            padding-top:10px
            font-size 12px
            text-align right

</style>