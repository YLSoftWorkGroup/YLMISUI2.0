<template>
<div class="cameraEdit">
    <div class="top">
        <div class="snap">
             <div class="preview">显示</div>
              <div id="my_camera"></div>   
        </div>
        <div class="preview">
            <div class="preview">抓拍预览</div>
            <img width="100%" height="95%"  id="preView_img" src="" alt="">
        </div>
        <div class="operation">
            <div class="funcBtn">
                <el-button  
                    class="snapBtn"
                    type="success" 
                    size="large" 
                    :loading="false" 
                    :disabled="false" 
                    @click="_snap">
                    <i class="icon-camera" ></i>抓拍</el-button>

                <el-button  
                    type="info" 
                    size="large" 
                    class="snapBtn"
                    :loading="isUpload" 
                    :disabled="false" 
                    @click="_upload">
                    <i class="icon-upload" ></i>上传</el-button>
            </div>
            <div class="imgName">
                <el-input v-model="model.gV_Col3" placeholder="请输入照片名称"></el-input>
            </div>

        </div>
    </div>
    <div class="list-warper">
        <div class="item" v-for="(item,index) in imgList" :key="index">
             <img width="200px" height="90%"  id="preView_img" :src="item.gV_Col6" alt="">
             <p class="titleName">{{item.gV_Col3}}</p>
             <div class="btn" @click="_deleteImg(item)">
                 <i class="icon-cancel"></i>
             </div>
        </div>
    </div>
</div>
</template>

<script type="text/babel">
import fetch from '@/api/fetch';
import {inputModel} from '@/api/inputmodel';
export default {
    data(){
        return{
            model:{
                    orderId:this.orderModel.id,
                    orgId:this.orderModel.orgId,
                    gV_Col3:'GPY'+Math.ceil(Math.random()*100),
                    gV_Col4:this.type,
                    gV_Col6:""
                },
            isUpload:false,
            inputObj:new inputModel(),
            imgList:[]
        }
    },
    props:{
        orderModel:{
            type:Object,
            default:function(){
                return {}
            }
        },
        type:{
            type:String,
            default:'pt'
        },
    },
    methods:{
        _snap(){
            let _this=this;
            Webcam.snap(function(data_uri) {
               document.getElementById("preView_img").src=data_uri;
			});
        },
        _initCamera(){
            Webcam.set({
                width: 320,
                height: 240,
                dest_width: 960,
                dest_height: 720,
                image_format: 'jpeg',
                jpeg_quality: 90
            });
            Webcam.attach( '#my_camera' );
        },
        _deleteImg(item){
             this.$confirm('确定要删除当前照片信息吗?', '提示', {
                type: 'warning',
                modal:false
                }).then(() => {
                         fetch({
                            url:'/api/services/app/table31Order/deleteItemGpyObject',
                            method:'post',
                            data:{
                                id: item.id,
                                 queryConditionItem: []
                            }
                        }).then((data)=>{
                            if(data.success){
                                this.$message({type:'success',message:'删除信息成功！'})
                            }else{
                                this.$message({type:'error',message:'删除信息失败！'})
                            }
                            this.loadList();
                        }).catch(e=>{
                            console.log(e)
                        })
                }).catch(()=>{});
        },
        loadList(){
            this.inputObj.inputModel.queryConditionItem=[
                {
                    DataFieldTwo: "",
                    TwoFieldRelation: "",
                    dataField: "OrderId",
                    dataValue: this.orderModel.id,
                    op: "EQ",
                    relation: "and",
                },
                {
                    DataFieldTwo: "",
                    TwoFieldRelation: "",
                    dataField: "OrgId",
                    dataValue: this.orderModel.orgId,
                    op: "EQ",
                    relation:"and",
                },
                {
                    DataFieldTwo: "",
                    TwoFieldRelation: "",
                    dataField: "GpyIsDeleted",
                    dataValue: 0,
                    op: "EQ",
                    relation:"and",
                }
            ];
            this.inputObj.inputModel.maxResultCount=1000;
            fetch({
                url:'/api/services/app/table31Order/getItemGpyPageList',
                method:'post',
                data:this.inputObj.inputModel
            }).then((data)=>{
                if(data.success){
                    this.imgList=data.result.data;
                }else{
                    this.$message({type:'error',message:'列表数据获取失败！'})
                }
                
            }).catch(e=>{
                console.log(e)
            })
        },
        _upload(){
            if(!this.model.gV_Col3){
                this.$message({type:'warning',message:'请输入图片名称！'})
                return false
            }
            this.model.gV_Col6=document.getElementById("preView_img").src;
            if(!this.model.gV_Col6){
                this.$message({type:'warning',message:'请先抓拍图片！'})
                return false
            }
            this.isUpload=true;
            let Params={};
            Params.items=[];
            Params.items.push(this.model);
            Params.judgeColumns={
                orderColumns: "",
                itemColumns: "Id"
            };
            
            fetch({
                url:'/api/services/app/table31Order/CreateGpyList',
                method:'post',
                data:Params
            }).then((data)=>{
                if(data.success){
                    this.$message({type:'success',message:'图片上传成功！'})
                }else{
                   this.$message({type:'error',message:'图片上传失败！'})
                }
                this.model.gV_Col3='GPY'+Math.ceil(Math.random()*100);
                this.model.gV_Col6=document.getElementById("preView_img").src='';
                this.model.gV_Col6='';
                this.isUpload=false;
                this.loadList();
            }).catch(e=>{
                 this.isUpload=false
                console.log(e)
            })
       }

    },
    mounted(){
        this._initCamera();
        this.loadList();
    },
    beforeDestroy(){
        Webcam.off();
    },
    watch:{
        preViewImg:function(n,o){
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.cameraEdit
    background #fff
    .top
        height 220px
        border 1px solid #ddd
        margin-bottom 10px
        padding 10px
        display flex
        .snap
            width 380px
            border-right 1px solid #ddd
            overflow hidden
        .preview
            width 380px
            border-right 1px solid #ddd
        .operation
            flex 1
            padding 10px
            text-align center
            .funcBtn
                height 50px

    .list-warper
        height 150px
        border 1px solid #ddd
        overflow auto 
        display flex
        .item
            padding 5px
            width 200px
            position relative
            .titleName
                white-space nowrap
                overflow hidden
                text-overflow ellipsis
            .btn
                position absolute
                top 5px
                right 5px
                color #fff
                &:hover
                    color #ddd

        

    .preview
        font-size 12px
        line-height 16px
        color #58B7FF
        padding-left 5px
</style>


