
<template>
<div>
<el-form  :model="formModel"  :rules="rules"  ref="formModel" label-width="100px" >
         <el-row>
             <el-col :span="24">
                <el-form-item label="模块名称" prop="moudleName">
                   <div>{{formModel.moudleName}}</div>
                </el-form-item>
             </el-col>
              
         </el-row>
           <el-row>
             <el-col :span="24">
                <el-form-item label="内容" prop="content">
                         <yl-editor 
                            isPreView
                            :content="formModel.content"
                            @onchange="_change"></yl-editor>
                </el-form-item>
            </el-col>
         </el-row>
          <el-row>
             <el-col :span="24">
                    <el-form-item style="text-align:right;" >
                        <el-button @click="_resetForm">重置</el-button>
                        <el-button type="primary" @click="_onSubmit" :loading="loading">保存</el-button>
                    </el-form-item>
      </el-col>
         </el-row>
</el-form>
</div>
</template>

<script type="text/babel">
import {
    requestCreateOrUpdateInformationPublish
}from '@/api/informationpublish';
export default {
    data(){
    return{
        isShowPreview:true,
        editorOption: {
            placeholder: '请在这里输入内容...',
            readOnly: false,
            
        },
        formModel:{
                 orgId:'',
                 accessoryId:'',
                 title:'',
                 type:'',
                 content:'',
                 moudleName:'',
                 content:'',
                 clickTimes:'',
                 useful:'',
                 unUseful:'',
                 extendColumn1:'',
                 extendColumn2:'',
                 extendColumn3:'',
               sortCode: 1,
        },
         rules: {
                    title: [
                      { required: true, message: '请输入标题！', trigger: 'blur' }
                    ],
                    content: [
                      { required: true, message: '请输入详细内容！', trigger: 'blur' }
                    ]
         },
        loading:false,
       }       
    },
    props:{
        selectRow:{},
        selectNode:{},
        isVisible:false
    },       
    methods:{
         _onSubmit() {
                this.$refs.formModel.validate((valid) => {
                if (valid) {
                    var _this=this;
                    this.loading=true;
                    let params={};
                    params.order=this.formModel;
                    requestCreateOrUpdateInformationPublish(params).then(data=>{
                    if(data.success){
                            this.$notify({
                                title: '成功',
                                message: '保存数据成功！',
                                type: 'success'
                                });
                            //关闭面板
                            this._complete();
                        }
                        else {
                             this.$message.error('失败！'+data.error.message);
                        }
                            this.loading=false;
                    }).catch(function(error){
                        _this.loading=false;
                    })
                } else {
                    this.$message.warning('请按照条件填充表单！');
                    return false;
                }
                
            });
            },
         _resetForm() {
                this.$refs.formModel.resetFields();
         },
         _complete(){
                this.$emit('close');
            },
        _change(html){
            this.formModel.content=html;
        }
    },
    computed:{
      editor() {
        return this.$refs.myTextEditor.quill;
      }
    },
    beforeMount(){
         Object.assign(this.formModel,this.selectRow);
    },
     mounted(){
       if(this.selectRow.id==undefined){
           this.formModel.moudleName=this.selectNode.text;
           this.formModel.extendColumn1=this.selectNode.funcCode;
       }
       
    },
     watch:{
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
