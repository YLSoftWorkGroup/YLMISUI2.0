
<template>
<div class="yl-treecard">
    <div class="main">
        <div class="content" v-if="schema.content">
            <div class="treebtn">
                    <i :class="icon" @click="_expend"></i>
            </div>
            <div class="item"
                v-for="(i,index) in schema.content" :key="index" :style="{ 'width': i.width}">
                <i class="icon" :class="i.icon"></i>
                <span class="label">{{i.label}}：</span>
                <span class="text" :style="i.textStyle" v-html="format(i)"> </span>
            </div>
        </div>
        <div class="link" v-if="schema.link">
            <el-button :type="schema.link.type" :size="schema.link.size" @click="_btnClick()"><i :class="schema.link.icon" ></i>{{schema.link.text}}</el-button>
        </div>
    </div>
    <div class="loading" v-if="loading">  <img src="img/loading3.gif" alt="加载数据"><span class="text">数据加载中...</span> </div>
    <div class="children" v-show="isExpend">

            <!-- 子节点 -->
            <yl-treecard v-for="(i,index) in itemDataList" :key="index" v-if="!isItemLeaf"
                :schema="i.schema"
                :item="i.item"
                :nodeClick="nodeClick"
                :leave="_leave"
                :isleaf="isItemLeaf"
            >
            </yl-treecard>
            
            <!-- 末级节点 -->
            <yl-leafcard v-for="(i,index) in itemDataList" :key="index" v-if="isItemLeaf"  :style="{'backgroundColor':getcolor(index)}"
                :schema="i.schema"
                :item="i.item"
                :leave="_leave"
                :isleaf="isItemLeaf"
            >
            </yl-leafcard>

    </div>
</div>
</template>

<script type="text/babel">
import { mapGetters,mapActions } from 'vuex';
import fetch from '@/api/fetch';
import util from '@/common/js/util';
import leafcard from './leafcard';
export default {
    data(){
        return {
            loading:false,
            icon:'icon-diff-added',
            isExpend:false,
            itemDataList:[],
            isItemLeaf:false,
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
        nodeClick:{
            type:Function,
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
            ...mapGetters([ 'getGlobObject1','getGlobObject2','getGlobString1','getGlobString2','getGlobArray1' ]),
    },
    components:{
        'yl-leafcard':leafcard
    },
    methods:{
            ...mapActions(['setGlobObject1','setGlobObject2','setGlobString1','setGlobString2','setGlobalArray1']),
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
            _expend(){
                this.isExpend=!this.isExpend;
                if(this.isExpend){
                    this.icon='icon-diff-removed'
                    if(this.itemDataList.length===0){
                        //加载数据
                        this.loading=true;
                        this.nodeClick(this);
                    }
                }else{
                    this.loading=false;
                    this.icon='icon-diff-added'
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
.yl-treecard
    .main
        display flex
        align-items center
        color #545454
        font-size 12px
        box-sizing border-box
        border 1px solid #e2e2e2
        padding 5px
        margin 10px
        &:hover
            background #e7e7e7
        .content
            flex 1
            display flex
            align-items center
            height 30px
            line-height 30px
            .treebtn
                width 50px
                text-align center
                font-size 18px
                color #3c99d5
                cursor pointer
                display inline-block
            .item
                white-space nowrap
                overflow hidden
                text-overflow ellipsis
                border-right 1px solid #e2e2e2
                padding-left 5px
                .icon
                    color #3c99d5
                    font-size 14px 
                .label
                    color #838383
                    
                .text
                    font-size 14px
        .link
            width 100px
            text-align center
            line-height 100%
    .loading
        height 20px
        line-height 20px
        width 100%
        text-align center
        background-color rgba(0,0,0,0.1)
        .text   
            padding-left 15px
            font-size 12px
            color #545454
    .children
        height auto
        margin-left 20px
        box-sizing border-box
        

                        

                        

                    







                




    

</style>
