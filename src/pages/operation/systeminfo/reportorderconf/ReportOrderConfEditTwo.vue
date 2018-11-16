<template>
        <el-form  :model="formModel"  :rules="rules"   ref="formModel" label-width="100px">
            <el-form-item label="父节点" prop="o_Col26" >
                 <yl-commontree code="reportorderconf" 
                    v-model="formModel.o_Col26" 
                    :defaultText="formModel.v_Col12"
                    @getCurrentNode="_parentChange"></yl-commontree>
            </el-form-item>
             <el-form-item label="选择菜单"  >
                   <el-tree style="height:350px" 
                        :data="MenuTreeData"
                        :empty-text="treeEmptyText"
                        show-checkbox
                        :default-expand-all="false"
                        :check-strictly="true"
                        node-key="funcCode"
                        ref="tree"
                        highlight-current
                        :render-content="renderContent"
                        @check-change="_checkchange"
                        :props="defaultProps">
                        </el-tree>
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
import treeMixn from '@/mixns/tree.js';
export default {
    mixins: [treeMixn],
    data(){
    return{
        formModel:{
                 id:'',
                 orgId:this.getUserInfo().user.manageOrgId,
                 o_Col26:'',
                 o_Col27:"",
                 v_Col6:'',
                 v_Col11:'',
                 v_Col12:'',
                 b_Col17:true,
                 b_Col19:false,
                 b_Col18:false,
                 sortCode: 1
        },
        loading:false,
        treeEmptyText:"菜单数据加载中...",
        MenuTreeData:[],
        defaultProps: {
                children: 'children',
                label: 'text',
                id: 'funcCode'
            },
        rules: {
                o_Col26: [
                    { required: true, message: '父级角色不能为空！', trigger: 'change' }
                ],
            },
       }       
    },
    props:{
        isVisible:false
    },
    methods:{
         _onSubmit(){
                    let _this=this;
                    this.$refs.formModel.validate((valid) => {
                    if (valid) {
                        this.loading=true;
                        let params={};
                        let nodelist=this.$refs.tree.getCheckedNodes();
                        let itemsList=[];
                        nodelist.map((i,index)=>{
                            let obj={};
                            Object.assign(obj,this.formModel);
                            obj.o_Col27=i.id;
                            obj.v_Col6=i.text;
                            obj.v_Col11=i.text;
                            obj.sortCode=index;
                            itemsList.push(obj);
                        });
                        params.items=itemsList;
                        params.judgeColumns={itemColumns:"Id,OrgId"}
                        fetch({
                            url:'/api/services/app/reportorderconf/CreateMainList',
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
                 this.$refs.tree.setCheckedKeys([]);
         },
         _complete(){
                this.$emit('close');
         },
        _checkchange(data,check){
            
        },
        _getMenuTreeList(){
                let _this=this;
                fetch({
                    url:"/api/services/app/menuItem/GetMenuItemTreeList",
                    method:"post",
                    data:{}
                }).then(data => {
                    if(data.success){
                        this.MenuTreeData=util.returnDatabyTree(data.result,this.guidOfNull());
                    }
                else {
                    _this.$message.error('获取数据失败！');
                }
                })
        }, 
        _parentChange(node){
            if(node.isLeaf){this.$message.warning('不能选择子节点');
                this.formModel.o_Col26='';
            }else{
                    this.formModel.v_Col12=node.text;
            }
            
        }
    },
    components:{
    },
    mounted(){
       this._getMenuTreeList();
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
