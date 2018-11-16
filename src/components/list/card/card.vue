
<template>
<div class="yl-card">
   <div class="main">
       <div class="media"  v-if="schema.media">
           <div class="card"  v-if="!schema.media.html">
               <p class="title" > <i :class="schema.media.icon " class="icon"></i>{{item[schema.media.title]}}</p>
               <p class="subtitle" v-text="item[schema.media.subtitle]"></p>
           </div>
           <div class="html" v-if="schema.media.html" v-html="schema.media.html">
           </div>
       </div>
       <div class="content">
           <div class="header" v-if="schema.content.header">
                 <span class="title" > 
                    <i :class="schema.content.header.icon"  class="icon"></i>
                    {{item[schema.content.header.title]}}
                 </span>
                 <span class="subtitle" v-text="item[schema.content.header.subtitle]"></span>
           </div>
           <div class="list"  v-if="schema.content.list">
                    <div class="item" v-for="(i,index) in schema.content.list " :key="index" :style="{ 'width': i.width}">
                        <i :class="i.icon" class="icon"></i>
                        <span class="label" >{{i.label}}：</span>
                        <span class="text"  v-html="format(i)" :style="i.textStyle"></span>
                    </div>
           </div>
       </div>
   </div>
   <div class="footer" v-if="schema.footer">
       <div class="report" v-if="schema.footer.report">
                    <div class="item" v-for="(i,index) in schema.footer.report" :key="index" :style="{ 'width': i.width}">
                        <p class="text" ><i :class="i.icon" class="icon"></i><span :style="i.textStyle"> <span v-html="format(i)"></span> </span><span class="unit" v-text="i.unit"></span></p>
                        <p class="label" v-text="i.label"></p>
                        
                    </div>
       </div>
       <div class="link" v-if="schema.footer.link" >
             <div class="item" v-for="(i,index) in schema.footer.link " :key="index" >
                   <el-button :type="i.type" :size="i.size"  @click="_btnClick(i)"><i :class="i.icon" ></i>{{i.text}}</el-button>
            </div>
       </div>
   </div>
</div>
</template>

<script type="text/babel">
import { mapGetters,mapActions } from 'vuex';
export default {
    data(){
        return {
           
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
    },
    computed:{
         ...mapGetters([ 'getGlobObject1','getGlobObject2','getGlobString1','getGlobString2','getGlobArray1']),
    },
    methods:{
        ...mapActions(['setGlobObject1','setGlobObject2','setGlobString1','setGlobString2','setGlobalArray1']),
            format(i){
                if(i.format!==undefined){
                    return i.format(this.item[i.name],this.item)
                }else{
                    return this.item[i.name]
                }
            },
            _btnClick(i){
                let eventConf=i.eventConf;
                if(eventConf!=undefined){
                    if(eventConf.isOn){
                        eventConf.event(this);
                    }
                }
            }
    },
    mounted(){

    }
    

    // card结构说明

    //  "schema":{
    //                   "media":{
    //                       "html":"<img src='../static/img/ad_bg2.png' width='180px'></img>",
    //                       "icon":"icon-table",
    //                       "title":"infoName",
    //                       "subtitle":"infoModel"
    //                   },
    //                   "content":{
    //                       "header":{
    //                           "icon":"icon-table",
    //                           "title":"infoName",
    //                           "subtitle":"infoModel"
    //                       },
    //                       "list":[
    //                           {
    //                               "icon":"",
    //                               "width":"100%",
    //                               "label":"项目部",
    //                               "name":"orgName",
    //                               "textStyle":{
    //                                 "color":"blue"
    //                               }
    //                           },
    //                           {
    //                               "icon":"",
    //                               "width":"25%",
    //                               "label":"车牌",
    //                               "name":"v_Col11",
    //                               "textStyle":{
    //                               }
    //                           },
    //                           {
    //                               "icon":"",
    //                               "width":"25%",
    //                               "label":"车牌",
    //                               "name":"v_Col11",
    //                               "textStyle":{
    //                               }
    //                           },
    //                           {
    //                               "icon":"",
    //                               "width":"25%",
    //                               "label":"车牌",
    //                               "name":"v_Col11",
    //                               "textStyle":{
    //                               }
    //                           },
    //                           {
    //                               "icon":"",
    //                               "width":"25%",
    //                               "label":"车牌",
    //                               "name":"v_Col11",
    //                               "textStyle":{
    //                               }
    //                           },
    //                           {
    //                               "icon":"",
    //                               "width":"25%",
    //                               "label":"车牌",
    //                               "name":"v_Col11",
    //                               "textStyle":{
    //                               }
    //                           },
    //                           {
    //                               "icon":"",
    //                               "width":"25%",
    //                               "label":"车牌",
    //                               "name":"v_Col11",
    //                               "textStyle":{
    //                               }
    //                           },
    //                           {
    //                               "icon":"",
    //                               "width":"25%",
    //                               "label":"车牌",
    //                               "name":"v_Col11",
    //                               "textStyle":{
    //                               }
    //                           },
    //                           {
    //                               "icon":"",
    //                               "width":"25%",
    //                               "label":"车牌",
    //                               "name":"v_Col11",
    //                               "textStyle":{
    //                               }
    //                           },
    //                           {
    //                               "icon":"",
    //                               "label":"车牌",
    //                               "name":"v_Col11",
    //                               "textStyle":{
    //                               }
    //                           },
    //                           {
    //                               "icon":"",
    //                               "label":"车牌",
    //                               "name":"v_Col11",
    //                               "textStyle":{
    //                               }
    //                           },
    //                           {
    //                               "icon":"",
    //                               "label":"车牌",
    //                               "name":"v_Col11",
    //                               "textStyle":{
    //                               }
    //                           }
    //                       ]
    //                   },
    //                   "footer":{
    //                       "report":[
    //                       ],
    //                       "link":{
    //                         "more":{
    //                           "icon":"icon-table",
    //                           "text":"查看磅单",
    //                           "type":"success",
    //                           "eventConf":{
    //                             "isOn":true,
    //                             "event":"function(_this){let url=location.host+'/#/ReportCenter/suppermodule/pages/weightreceivetz/index';window.open(url);}"
    //                           }
    //                         }
    //                       }
    //                   }
    //               }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.yl-card
    height auto
    box-sizing border-box
    border 1px solid #e2e2e2
    padding 5px
    margin 10px
    color #545454
    font-size 14px
    .main
        display flex
        align-items center
        box-sizing border-box
        .media
            width 200px
            .card
                text-align center
                .title
                    font-size 16px
                    font-weight 500
                    .icon
                        color #3c99d5 
                .subtitle
                    color #838383
                    padding-top 5px
            .html
                height auto 
        .content
            flex 1
            padding-left 10px
            .header
                text-align left
                height 30px
                line-height 30px
                border-bottom 1px solid #e2e2e2
                background-color #F1F6F7
                padding-left 10px
                .title
                    font-size 16px
                    font-weight 500
                    .icon
                        color #3c99d5 
                .subtitle
                    font-size 14px
                    color #838383
                    padding-left 5px
            .list
                padding 10px 0px
                display flex
                align-items center
                flex-wrap wrap
                .item
                    box-sizing border-box
                    min-width 100px
                    padding 5px
                    white-space nowrap
                    overflow hidden
                    text-overflow ellipsis
                    .icon
                        color #3c99d5 
                    .label
                        color #838383
                        font-size 12px
    .footer
        padding 5px
        display flex
        align-items center
        border-top 1px solid #e2e2e2
        .report
            display flex
            flex-wrap wrap
            flex 1
            .item
                box-sizing border-box
                min-width 100px
                text-align center
                padding 5px
                border-right 1px solid #e2e2e2
                .label
                    padding-top 5px 
                    font-size 12px
                    color #838383
                .text
                    font-size 14px
                    .icon
                        color #3c99d5 
                    .unit
                        padding-left 3px 
                        color #838383

        .link
            display flex
            flex-wrap wrap
            flex-direction row-reverse
            align-items center
            width 200px
            .item
                text-align center
                padding 5px

                        

                        

                    







                




    

</style>
