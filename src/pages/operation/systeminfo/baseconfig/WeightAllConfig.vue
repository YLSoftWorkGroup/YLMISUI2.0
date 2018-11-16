<template>
    <div slot="content" >
        <el-form  :model="formModel"  v-loading.body="formLoading" :rules="rules"  ref="formModel" label-width="100px" >
                <br>
                <el-row>
                    <el-col :span="11">
                        <el-form-item label="名称" prop="name">
                            <el-input :disabled="true" v-model="data.name" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="说明" prop="remark">
                            <el-input :disabled="true" v-model="data.remark" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                     <el-col :span="11">
                        <el-form-item label="实时上传" prop="realTime">
                            <el-switch  v-model="formModel.upload.realTime"
                                        on-text="是"
                                        off-text="否">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="打印类型" prop="type">
                            <el-select v-model="formModel.print.type" style="width:100%" placeholder="请选择">
                                <el-option
                                v-for="item in printType"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        
                    </el-col>
                    <el-col :span="4">
                         <el-form-item label="打印" prop="isPrint">
                            <el-switch  v-model="formModel.print.isPrint"
                                        on-text="是"
                                        off-text="否">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                     <el-col :span="4">
                        <el-form-item label="打印预览" prop="isPrintView">
                            <el-switch  v-model="formModel.print.isPrintView"
                                        on-text="是"
                                        off-text="否">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                </el-row>
                 <el-row>
                    
                    <el-col :span="12"></el-col>
                </el-row>
                 <el-row>
                    <el-col :span="8">
                         <el-form-item label="启用IC卡" prop="iccdisabled">
                            <el-switch  v-model="formModel.icCardConf.disabled"
                                        on-text="是"
                                        off-text="否">
                            </el-switch>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                          <el-form-item label="刷卡检测时间" prop="frequency">
                            <el-input  v-model="formModel.icCardConf.frequency" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                         <el-form-item label="刷卡时间间隔" prop="importInterval">
                            <el-input  v-model="formModel.icCardConf.importInterval" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="过磅计算小数位" prop="jzl">
                            <el-input-number  v-model="formModel.gbFloatLength.jzl" ></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                 <el-form-item style="text-align:center;" >
                    <el-button class="icon-spinner11" @click="_resetForm">重置</el-button>
                    <el-button type="primary" class="icon-floppy-disk" @click="_onSubmit" :loading="loading">保存</el-button>
                </el-form-item>
        </el-form>
    </div>
</template>

<script type="text/babel">
import fetch from  '@/api/fetch';
export default {
    data(){
        return{
            formModel:{
                upload: {
                    realTime: true
                },
                print: {
                    type: 0,
                    isPrint: true,
                    isPrintView:true
                },
                icCardConf:{
                        disabled:true,
                        frequency:0,
                        importInterval:0
                    },
                gbFloatLength:{
                    jzl:0
                }
            },
            formLoading:false,
            loading:false,
            rules:{},
            data:{
                id:'',
                name:'GBConf',
                describe:'',
                remark:'',
                sortCode:''
            },
            descrb:{},
            deepFormData:{},
            printType:[
                {label:'不带扣重0',value:0},
                {label:'带扣重1',value:1},
                {label:'电子磅单2',value:2}
            ]
        }
    },
    props:{
        confData:{
            type:Object,
            default:function(){
                return {}
            }
        }
    },
    methods:{
         _resetForm() {
                this.$refs.formModel.resetFields();
         },
         _onSubmit(){
             this.$refs.formModel.validate((valid) => {
                if (valid) {
                    var _this=this;
                    this.loading=true;
                    this.descrb.commonConf=this.formModel;
                    this.data.describe=JSON.stringify(this.descrb);
                    let params={};
                    params.globConfig=this.data;
                    params.permissionType=2;
                    fetch({
                        url: 'api/services/app/globConfig/createOrUpdateMainObject',
                        method: 'post',
                        data: params
                    }).then(data=>{
                    if(data.success){
                            _this.$notify({
                                title: '成功',
                                message: '保存数据成功！',
                                type: 'success'
                                });
                        }
                        else {
                             _this.$message.error('失败！'+data.error.message);
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
         }
    },
    mounted(){
       
    },
    watch:{
        confData:function(n,o){
            this.data=n;
            let obj=JSON.parse(this.data.describe);
            this.descrb=obj;
            Object.assign(this.formModel,obj.commonConf); 
        }
    } 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


