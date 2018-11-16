<template>
    <div>
        <el-form  :model="formModel"  :rules="rules"  ref="formModel" label-width="100px" >
                <el-form-item label="上级" prop="parentId">
                      <yl-treeselect v-model="formModel.parentId" 
                        :readonly="true"
                        :treedata="dictionaryTreeData" 
                        :defaultProps="defaultProps"  
                        @getCurrentNode="_getCurrentNode">
                        </yl-treeselect>
                </el-form-item>
                <el-form-item label="编码" prop="code">
                        <el-input v-model="formModel.code" ></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="fullName">
                        <el-input v-model="formModel.fullName" ></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                        <el-input v-model="formModel.remark" ></el-input>
                </el-form-item>
                        <el-row>    
                            <el-col :span="10">    
                                <el-form-item label="排序" prop="sortCode" >
                                        <el-input-number v-model="formModel.sortCode" :min="1" ></el-input-number>
                                </el-form-item>
                            </el-col> 
                            <el-col :span="7">    
                                <el-form-item label="树" prop="isTree" >
                                     <el-switch  v-model="formModel.isTree"
                                                on-text="是"
                                                off-text="否">
                                    </el-switch>
                                </el-form-item>
                            </el-col> 
                            <el-col :span="7">
                                <el-form-item label="子节点"  prop="isLeaf" >
                                    <el-switch  v-model="formModel.isLeaf"
                                                on-text="是"
                                                off-text="否">
                                    </el-switch>
                                </el-form-item>
                            </el-col>
                        </el-row>
                <el-row>
                     <el-form-item label="静态"  prop="isStatic" >
                                    <el-switch  v-model="formModel.isStatic"
                                                on-text="是"
                                                off-text="否">
                                    </el-switch>
                                </el-form-item>
                </el-row>
                <el-form-item style="text-align:right;" > 
                    <el-checkbox v-model="isClose">保存后关闭</el-checkbox>
                            <el-button class="icon-spinner11"  @click="_resetForm">重置</el-button>
                            <el-button class="icon-floppy-disk" type="primary" @click="_onSubmit" :loading="loading">保存</el-button>
                </el-form-item>
        </el-form>
    </div>
</template>

<script type="text/babel">
import {
    requestCreateOrUpdateDataDictionaryDetail
} from '@/api/datadictionarydetail';
import {
    requestGetDictionarySortCode,
    requestGetDataDictionaryTreeList,
    requestCreateOrUpdateDataDictionary
} from '@/api/datadictionary';
import util from '@/common/js/util';
import dataDictionaryForTree from '@/ocomponents/datadictionary/dataDictionaryForTree'
export default {
    data(){
        return{
            formModel:{
                        id:'',
                        parentId:'',
                        code:'',
                        fullName:'',
                        remark:'',
                        sortCode: 1,
                        isTree: false,
                        isLeaf: true,
                        ocode:'',
                        isStatic:false
                    },           
            rules: {
                        id: [
                        { required: true, message: '字典编码不能为空！', trigger: 'blur' }
                        ],
                        parentId: [
                        { required: true, message: '上级编码不能为空！', trigger: 'change' }
                        ],
                        code: [
                            { required: true, message: '编码不能为空！', trigger: 'blur' },
                            { validator:this.commonJudgeRepeat, trigger: 'blur' }
                        ],
                        fullName: [ 
                        { required: true, message: '字典名称不能为空！', trigger: 'blur' }
                        ]
            },
            loading:false,
            dictionaryTreeData:[],
            defaultProps: {
                children: 'children',
                label: 'text',
                id: 'id'
            },
            isClose:true,
        }       
    },
    props:{
        selectRow:{},
        isVisible:false
    },
    methods:{
            _onSubmit() {
                        let _this=this;
                    this.$refs.formModel.validate((valid) => {
                    if (valid) {
                        this.loading=true;
                        let params={};
                        params.dataDictionary=this.formModel;
                        requestCreateOrUpdateDataDictionary(params).then(data=>{
                        if(data.success){
                            console.log(data);
                                this.$notify({
                                    title: '成功',
                                    message: '保存数据成功！',
                                    type: 'success'
                                    });
                                //关闭面板
                                this._complete(this.isClose);
                            }
                            else {
                                _this.$message.error('保存数据失败！');
                            }
                                this.loading=false;
                        }).catch(function(error){
                        this.loading=false;
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                    
                });
                },
            _resetForm() {
                    this.$refs.formModel.resetFields();
            },
            _complete(bool){
                    this.$emit('close',bool);
                }, 
            _getCurrentNode(selectNode){
                    this.formModel.parentId=selectNode.id;
                },
            _getGetDataDictionaryTreeList(){
                    let _this=this;
                    requestGetDataDictionaryTreeList().then(data => {
                            if(data.success){
                                this.dictionaryTreeData=util.returnDatabyTree(data.result,'00000000-0000-0000-0000-000000000000');
                            }
                            else {
                                _this.$message.error('获取数据失败！');
                            }
                        })
                },
            commonJudgeRepeat(rule, value, callback){
                let columnName='code',columnValue='';
                for(let item in this.formModel){
                    if(columnName.indexOf(item)>=0){
                        columnValue=columnValue+this.formModel[item]+','
                    }
                }
                columnValue=columnValue.substring(0,columnValue.length-1)
                let str=`Base_DataDictionary|${columnName}|${columnValue}|${this.formModel.ocode}`;
                this.IsJudgeRepeat(str,value, callback);
            } 
        },
    mounted(){
        Object.assign(this.formModel,this.selectRow); 
        this.formModel.ocode=this.formModel.code;
        this._getGetDataDictionaryTreeList();
    },
    components:{
        'yl-dataDictionaryForTree':dataDictionaryForTree,
    },
    watch:{
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
