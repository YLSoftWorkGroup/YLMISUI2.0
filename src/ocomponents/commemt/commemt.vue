
<template>
<div class="commemt">
    <div class="header">
        评论
        <span>共{{listData.recordsTotal}}条</span> 
    </div>
    <div class="list">

            <div class="item" v-for="(i,index) in listData.data" :key="index">
                <div class="userimg">
                    <div class="img" :style="{'background-color':getcolor()}">{{i.commentUserName.substring(0,1)}}</div>
                </div>
                <div class="content">
                    <div class="username">{{i.commentUserName}}
                        <span class="right" 
                            @click="_reply(i.commentUserName,i.id,i.comment)" 
                            v-if="i.sI_Col1===0"><i class="icon-chat2"></i>回复
                        </span>
                    </div>
                    <div class="commemtAttr">{{i.sortCode}}楼 {{i.commentTime}}</div>
                    <div class="fcommemt" v-if="i.sI_Col1===1">
                        <div class="title">引用来自【{{i.sV_Col3}}】的评论</div>
                           <span v-html="i.sV_Col6"></span>
                    </div>
                    <div class="rcommemt" v-html="i.comment">
                    </div>
                </div>
            </div>
    </div>
    <div class="pageSplit" v-if="listData.recordsTotal>pageSize">
        <el-pagination
            small
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :page-size="pageSize"
            :total="listData.recordsTotal">
            </el-pagination>
    </div>
    <div class="editor">
        <div class="reply" v-if="editorDisplay">
           <div>  回复: {{puserName}}<span class="right" @click="_replyc" > <i class="icon-cancel"></i> 取消</span>
           </div>
        </div>
        <yl-editor class="content" ref="editor" id="editor" 
            content=""
            :editorOptions=editorOptions
             @onchange="_change"
            
        ></yl-editor>
        <div class="tool">
             <el-button   type="text" @click="_clear">清空</el-button>
            <el-button   
                type="primary"  
                icon="circle-check" 
                :loading="loading"
                @click="_commemt">发表评论</el-button>
        </div>
    </div>
    
</div>
</template>

<script type="text/babel">
import fetch from '@/api/fetch';
import util from '@/common/js/util';
import  {inputModel} from '@/api/inputmodel';
export default {
    data(){
        return{
            editorOptions:{
                    menus:[ //菜单配置
                    'link',  // 插入链接
                    'emoticon',  // 表情
                ],
            },
            loading:false,
            editorDisplay:false,
            mainInput:new inputModel(),
            formModel:{
                order:{
                    parentId: "",
                    orgId: this.getUserInfo().user.manageOrgId,
                    dataId: this.dataId,
                    commentModule:this.commentModule,
                    commentUserId: this.getUserInfo().user.id,
                    commentUserName: this.getUserInfo().user.realName,
                    commentTime:'',
                    comment: "",
                    sI_Col1:0, //评论类型
                    id: ""
                }
            },
            listData:{},
            puserName:'',
            puserId:'',
            pusercommemt:''
            
        }
    },
    props:{
        dataId:{
            type:String,
            default:''
        },
        commentModule:{
            type:String,
            default:''
        },
        maxContent:{
            type:Number,
            default:200
        },
        pageSize:{
            type:Number,
            default:10
        }

    },
    methods:{
        getcolor(){
            return util.getColor();
        },
        _reply(name,id,cont){
            this.editorDisplay=true;
            this.puserName=name;
            this.puserId=id;
            this.pusercommemt=cont;
        },
         _replyc(){
            this.editorDisplay=false;
            this.puserName='';
            this.puserId='';
            this.pusercommemt='';
        },
        _clear(){
            this.formModel.order.comment='';
            this._replyc();
            this.$refs.editor.setText('');
        },
        _commemt(){
               let  _this=this;
                if(this.editorDisplay){
                    //回复
                    this.formModel.order.sI_Col1=1;
                    this.formModel.order.parentId=this.puserId;
                    this.formModel.order.sV_Col3=this.puserName;
                    this.formModel.order.sV_Col6=this.pusercommemt.substring(0,50);
                }else{
                    //评论
                    this.formModel.order.sI_Col1=0;
                    this.formModel.order.parentId=this.guidOfNull();
                }
                this.formModel.order.sortCode=this.listData.recordsTotal+1;
                this.formModel.order.commentTime=new Date();
            if(this.formModel.order.comment.length>0&this.formModel.order.comment.length<=this.maxContent){
                this.loading=true;
                fetch({
                    url:'api/services/app/comment/createOrUpdateMainObject',
                    method: 'post',
                    data:this.formModel
                }).then(data=>{
                    if(data.success){
                        this._reload();
                    }else{
                         this.$message.error('提交评论失败！');
                    }   
                    this.loading=false;
                }).catch(err=>{
                    _this.loading=false;
                    this.$message.error('提交评论数据异常！');
                })
            }else{
                  this.$message.warning('提交评论数据文本数不符！');
            }
        },
         _change(html){
            this.formModel.order.comment=html;
        },
        _reload(val){
            this._getDataList(val);
            this._clear();
        },
        _getDataList(val){
                var _this=this;
                var inputArr=[ 
                               {key:"DataId",op:"EQ",value:this.dataId},
                             ];
                this.mainInput.addqueryConditionItem(inputArr);
                this.mainInput.inputModel.sorting='CommentTime desc';
                if(val){this.mainInput.inputModel.draw=val;}
                this.mainInput.inputModel.maxResultCount=this.pageSize;
                this.mainInput.inputModel.skipCount=this.mainInput.inputModel.maxResultCount*(this.mainInput.inputModel.draw-1);
                 fetch({
                    url:'api/services/app/comment/getMainPageList',
                    method: 'post',
                    data:this.mainInput.inputModel
                }).then(data=>{
                    if(data.success){
                        this.listData=data.result;
                    }else{
                         this.$message.error('获取评论失败！');
                    }   
                }).catch(err=>{
                         this.$message.error('获取评论数据异常！');
                })
        },
        handleCurrentChange(currentPage){
            this._reload(currentPage);
        }

    },
    mounted(){
        this._getDataList();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="stylus" rel="stylesheet/stylus" scoped>
.commemt
    height auto
    display block
    font-size 13px
    background-color #fff
    padding 0px 15px
    overflow auto
    .header
        height 30px
        line-height 30px
        font-size 16px
        font-weight 800 
        background-color #EFF2F7
    .pageSplit
        text-align right 
        height 25px
        line-height 25px
    .editor
        margin-top 15px
        .content
            height 150px
            overflow hidden
        .tool
            margin-top 10px
            text-align right
        .reply
            height 20px
            font-weight 800
            color #20A0FF
    .list
        height auto 
        margin-top 5px
        .item
            border-bottom 1px #EFF2F7 solid
            padding 5px
            display flex
            &:hover
                background-color #EFF2F7
            .userimg 
                width 60px
                line-height 25px
                .img
                    margin-left 10px
                    border-radius 20px 
                    border 1px solid #eee
                    width 40px
                    height 40px
                    text-align center 
                    font-size 20px
                    font-weight 800
                    line-height 40px 
                    color #fff
            .content
                flex 1
                line-height 25px
                .username
                    font-weight 600 
                .commemtAttr
                    color #99A9BF
                .rcommemt
                    padding 3px
                .fcommemt
                    padding 3px
                    border-left 6px #EFF2F7 solid
                    border-bottom 1px #EFF2F7 solid
                    .title
                        color #20A0FF
.right
    float right 
    &:hover
        cursor pointer
        color #20A0FF
    
    
   


</style>

