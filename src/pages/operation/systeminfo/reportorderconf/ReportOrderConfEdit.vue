<template>
        <el-form  :model="formModel"   :rules="rules"  ref="formModel" label-width="100px">
             <el-form-item label="父节点" prop="o_Col26" >
                 <yl-commontree code="reportorderconf" 
                    v-model="formModel.o_Col26" 
                    :defaultText="formModel.v_Col12"
                     @getCurrentNode="_parentChange">
                 </yl-commontree>
            </el-form-item>
            <el-form-item label="菜单名称" prop="v_Col6">
                <el-input v-model="formModel.v_Col6" ></el-input>
            </el-form-item>
            <el-form-item label="单据名称" prop="v_Col11">
                <el-input v-model="formModel.v_Col11" ></el-input>
            </el-form-item>
             <el-form-item label="子节点" prop="b_Col17">
            <el-switch  v-model="formModel.b_Col17"
                        on-text="是"
                        off-text="否">
            </el-switch>
        </el-form-item>
            <el-form-item label="排序" prop="sortCode" >
                <el-input-number v-model="formModel.sortCode" :min="1" ></el-input-number>
            </el-form-item>
            <el-form-item style="text-align:right;" >
                <el-button class="icon-spinner11" @click="_resetForm">重置</el-button>
                <el-button class="icon-floppy-disk" type="primary" @click="_onSubmit" :loading="loading">保存</el-button>
            </el-form-item>
        </el-form>
</template>

<script type="text/babel">
import util from '@/common/js/util';
import fetch from '@/api/fetch';
export default {
    data(){
        return{
            formModel:{
                    id:'',
                    orgId:this.getUserInfo().user.manageOrgId,
                    o_Col26:'',
                    v_Col6:'',
                    v_Col11:'',
                    v_Col12:'',
                    b_Col17:false,
                    b_Col19:false,
                    b_Col18:false,
                    sortCode: 1
            },
            rules: {
                        o_Col26: [
                        { required: true, message: '父级角色不能为空！', trigger: 'change' }
                        ],
                        v_Col6: [
                        { required: true, message: '菜单名称不能为空！', trigger: 'blur' }
                        ],
            },
            loading:false,
        }       
    },
    props:{
        selectRow:{},
        isVisible:false
    },
    methods:{
         _onSubmit(){
                    let _this=this;
                    this.$refs.formModel.validate((valid) => {
                    if (valid) {
                        this.loading=true;
                        let params={};
                        params.order=this.formModel;
                        fetch({
                            url:'/api/services/app/reportorderconf/createOrUpdateMainObject',
                            method:"post",
                            data:params
                        }).then(data=>{
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
                                _this.$message.error('保存数据失败！'+data.error.message);
                            }
                                this.loading=false;
                        }).catch(function(error){
                        this.loading=false;
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
        _parentChange(node){
            this.formModel.v_Col12=node.text;
        }
    },
    components:{
    },
    mounted(){
       Object.assign(this.formModel,this.selectRow); 
    },
    watch:{
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.yl-tab-pane {
    height: 250px;
}
.yl-tab-pane > div{
    height: 100%;
}
</style>
