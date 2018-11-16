<template>
           <el-input 
                :placeholder="placeholder" 
                :size="size" 
                :value="currentValue"
                :readonly="true"
                >
                <template slot="append">
                     <el-upload  
                        :disabled="propsData.disabled"
                        :action="fileAction" 
                        :headers="headers"
                        :show-file-list="false"
                        :multiple="false"
                        :on-success="_onSuccess"
                        :on-remove="_removeFile"
                        :on-error="_onError"
                        :before-upload="_beforeUpload"
                        style="width:100%;">
                        <el-button  :loading="loading" > <i class="icon-upload3"></i></el-button>
                    </el-upload>
            </template>
         </el-input>
</template>

 <script type="text/babel">
 import emitter from '@/mixns';
 import store from '../../vuex/store';
export default {
    data(){
        return {
            loading:false,
            currentValue: this.value,
            file:{},
            fileAction:'',
            headers:{Authorization:''},
            propsData:{
                disabled:this.disabled
            }
        }
    },
    mixins: [emitter],
    props:{
        value:[String,Number],
        size:{
            type:String,
            default:''
         },
        placeholder:{
            type:String,
            default:""
         },
        disabled:{
            type:Boolean,
            default:false
         },
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
            required:false,
            default:window.getClientObj().sysConf.url+"/api/upload/uploadFile",
         },
    },
    computed:{

    },
    methods:{
        _setCurrentValue(value) {
            if (value === this.currentValue) return;
                this.currentValue = value;
            if (this.validateEvent) {
                this.dispatch('ElFormItem', 'el.form.change', [value]);
            }
        },
        _removeFile(file, fileList){

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
                this.$emit('change',file);
                this.currentValue=file.response.result;
                this.$emit('input',this.currentValue);
                this.loading=false;
        },
        _onError(err, file, fileList){
                this.$emit('change','error');
                 this.loading=false;
        }
    },
    mounted(){
        this.fileAction=this.action+"?moduleName="+this.moduleName;
        this.headers.Authorization=store.getters.getToken;
        
    },
    watch:{
        value:function(val, oldVal){
            this._setCurrentValue(val);
        },
        currentValue:function(n,o){
            if(n!=''){
                this.fileAction=this.action+"?moduleName="+this.moduleName+"&filePath="+n;
            }
        }
    }
}
</script>
<style lang="css" rel="stylesheet/css" scoped>
</style>