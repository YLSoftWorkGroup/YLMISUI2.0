<template>
            <el-upload  
                        :action="fileAction" 
                        :headers="headers"
                        :show-file-list="true"
                        :multiple="multiple"
                        :on-success="_onSuccess"
                        :on-remove="_removeFile"
                        :on-error="_onError"
                        :drag="drag"
                        :file-list="fileList"
                        :list-type="listType"
                        :before-upload="_beforeUpload"
                        style="width:100%;">
                        <el-button  :loading="loading" > <i class="icon-upload3"></i>上传文件</el-button>
            </el-upload>
</template>

 <script type="text/babel">
 import store from '../../vuex/store';
 import fetch from '@/api/fetch';
export default {
    data(){
        return {
            loading:false,
            file:{},
            fileAction:'',
            headers:{Authorization:''},
        }
    },
    props:{
        allowFormat:{
            type:String,
            default:""
         },
        moduleName:{
            type:String,
            required: true,
            default:""
         },
        allowSize:{
            type:Number,
            default:1024*1024*10
         },
        action:{
            type:String,
            required: true,
            default:window.getClientObj().sysConf.url+"/api/upload/uploadFile",
         },
         drag:{
             type:Boolean,
             required:true,
             default:false,
         },
         listType:{
             type:String,
             required:true,
             default:'',
         },
         fileList:{
             type:Array,
             default:function(){
                 return []
             },
         },
         multiple:{
             type:Boolean,
             default:true,
         },
         maxLength:{
             type:Number,
             default:5
         }
    },
    computed:{

    },
    methods:{
        _removeFile(file, fileList){
                let url='';
                if(file.response!=undefined){
                      url=window.getClientObj().sysConf.url+"/api/upload/DeleteFile?fileName="+file.response.result;
                }else if(file.url){
                        let ll=window.getClientObj().sysConf.url+"/api/upload/img/";
                        url=window.getClientObj().sysConf.url+"/api/upload/DeleteFile?fileName="+file.url.substring(ll.length-4);
                     }
                if(url){
                        fetch({
                            url:url,
                            methods:"get"
                        }).then(
                            data=>{
                                if(data.success){
                                     let fileArr=[];
                                     if(file.response){
                                        fileArr=fileList.map(data=>{
                                             let isReturn=true;
                                             if(data.response){
                                                 if(data.name==file.name){
                                                     isReturn=false;
                                                 }
                                             }
                                             if(isReturn){
                                                 return data;
                                             }
                                         }); 
                                     }else{
                                        fileArr=fileList.map(data=>{
                                             let isReturn=true;
                                             if(!data.response){
                                                 if(data.name==file.name){
                                                     isReturn=false;
                                                 }
                                             }
                                             if(isReturn){
                                                 return data;
                                             }
                                         }); 
                                     }
                                    
                                    this.$emit('change',fileArr);
                                    console.log('删除成功！');
                                }
                            }
                        ).catch(
                            err=>{
                                console.log(err);
                            }
                        )
                }
        },
        _beforeUpload(file){
            this.loading=true;
            //上传之前拦截
            const sizeOK = file.size < this.allowSize;
            let formatOK = true;
            if(this.allowFormat!=''){
                let Arr=file.name.split(".");
                let fileFormat=Arr[Arr.length-1].toUpperCase();
                if(this.allowFormat.toUpperCase().indexOf(fileFormat)<0){
                    formatOK=false;
                    this.$message({ message: '上传文件的格式有误！只能上传后缀为'+this.allowFormat+'的文件！',type: 'warning'});
                    this.loading=false;
                }
            }
            if(!sizeOK){
                 this.$message({ message: '上传的文件大小不能超过'+this.allowSize/1024/1024+'M！',type: 'warning'});
                 this.loading=false;
            }
            return sizeOK&&formatOK;
        },
        _onSuccess(response, file, fileList){
                this.file=file;
                this.$emit('change',fileList);
                this.loading=false;
        },
        _onError(err, file, fileList){
                this.$emit('change',fileList);
                 this.loading=false;
        }
    },
    mounted(){
        this.fileAction=this.action+"?moduleName="+this.moduleName;
        this.headers.Authorization=store.getters.getToken;
    },
    watch:{
    }
}
</script>
<style lang="css" rel="stylesheet/css" scoped>
</style>