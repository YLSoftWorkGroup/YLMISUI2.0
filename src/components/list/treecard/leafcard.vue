
<template>
<div class="yl-leafcard">
    <div class="content" v-if="schema.content">
        <div class="item"
            v-for="(i,index) in schema.content" :key="index" :style="{ 'width': i.width}" >
            <P>
            <i class="icon" :class="i.icon"></i>
            <span class="text" :style="i.textStyle"  v-html="format(i)"></span>
            </P>
            <P class="label">{{i.label}}</P>
           
        </div>
    </div>
    <div class="link" v-if="schema.link">
         <el-button :type="schema.link.type" :size="schema.link.size" @click="_btnClick()"><i :class="schema.link.icon" ></i>{{schema.link.text}}</el-button>
    </div>
</div>
</template>

<script type="text/babel">
export default {
    data(){
        return {
            _leave:0
        }
    },
    props:{
        schema:{
              type:Object,
                default:function(){
                    return {}
                }
        },
        item:{
              type:Object,
                default:function(){
                    return {}
                }
        },
        leave:{
            type:Number,
                default:0
        },
        isleaf:{
            type:Boolean,
                default:false
        }
    },
   computed:{
    },
    components:{
    },
    methods:{
            format(i){
                if(i.format!==undefined){
                    return i.format(this.item[i.name])
                }else{
                    return this.item[i.name]
                }
            },
            _btnClick(){
                let eventConf=this.schema.link.eventConf;
                if(eventConf!=undefined){
                    if(eventConf.isOn){
                        eventConf.event(this);
                    }
                }
            },
            getcolor(i){
                if(i%2==0){
                    return '#EEF1F6'
                }else{
                    return '#fff'
                }
            }
    },
    mounted(){
        this._leave=this.leave+1;
    }
    // "schema": {
    //                     "content": [
    //                       {
    //                         "name": "receiveUnit",
    //                         "label": "分包队",
    //                         "icon": "",
    //                         "width": "80%",
    //                         "textStyle": {}
    //                       },
    //                        {
    //                         "name": "quantity",
    //                         "label": "数量",
    //                         "icon": "icon-table",
    //                         "width": "20%",
    //                         "textStyle": {
    //                           "color":"#1abba0",
    //                           "fontWeight":"500"
    //                         }
    //                       }
    //                     ],
    //                     "link": {
    //                       "icon": "icon-table",
    //                       "text": "查看磅单",
    //                       "type": "success",
    //                       "size":"small",
    //                       "eventConf": {
    //                         "isOn": true,
    //                         "event": "function(_this){let url=location.host+'/#/ReportCenter/suppermodule/pages/weightreceivetz/index';window.open(url);}"
    //                       }
    //                     }
}
</script>





<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.yl-leafcard
    display flex
    align-items center
    color #545454
    font-size 12px
    padding 10px
    margin 0px 10px
    box-sizing border-box
    border 1px solid #e2e2e2
    border-bottom none
    &:hover
        background #e7e7e7
    &:last-child
        border-bottom 1px solid #e2e2e2
    .content
        flex 1
        display flex
        align-items center
        height 35px
        .item
            white-space nowrap
            overflow hidden
            text-overflow ellipsis
            border-right 1px solid #e2e2e2
            text-align center
            .icon
                color #3c99d5
                font-size 14px 
            .text
                font-size 14px
            .label
                padding-top 8px
                color #838383
    .link
        width 100px
        text-align center
        line-height 100%
        

                        

                        

                    







                




    

</style>
