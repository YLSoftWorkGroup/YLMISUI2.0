<template>
    <div>
        <el-form  :model="formModel" ref="formModel" label-width="100px">
            <el-tree :data="templateGHTreeData" 
                :expand-on-click-node="false" 
                :props="defaultProps" 
                @node-click="_handleNodeClick" 
                :highlight-current="true"
                style="height:250px;">
            </el-tree>
            <el-form-item style="text-align:right;" >
                <el-button type="primary" @click="_onSubmit" :loading="loading">导入</el-button>
            </el-form-item>
         </el-form>
    </div>
</template>

<script type="text/babel">
import {
            requestGetTemplateGHTreeList
       } from '@/api/templategh';
import {
            requestImportGHTemplate
       } from '@/api/gh'
import fetch from  '@/api/fetch';
export default {
    data(){
        return{
            templateGHTreeData:[],
            selectNode:{id:""},
            defaultProps: {
                        children: 'children',
                        label: 'text',
                        id: 'id'
                    },
            loading:false,
            formModel:{}
        }
    },
    props:{
        nodeId:''
    },
    methods:{
         _getTemplateGHTreeList(){
            requestGetTemplateGHTreeList().then(data => {
                            if(data.success){
                                this.templateGHTreeData=data.result;
                            }
                            else {
                                 this.$message.error('失败！'+data.error.message);
                            }
                        })
        },
         _handleNodeClick(result, resolve) {
                  this.selectNode=result; 
            },
        _onSubmit(){
                this._submit();
        },
        _submit(){
             let params={
                    procType: 1,
                    firstKeys: "Id,TId,OrgId",
                    firstValues: this.nodeId+','+this.selectNode.id+','+this.getUserInfo().user.manageOrgId,
                    secondKeys: "",
                    secondOperates: "",
                    secondValues: "",
                    procName: "C_ImportGHTemplate"
                };
            fetch({ 
                url: '/api/services/app/gH/ExecuteSqlTwo',
                method: 'post',
                data: params
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
                        this.$message.error('失败！'+data.error.message);
                    }
                        this.loading=false;
                })
        },
         _complete(){
                this.$emit('close');
            }
    },
    mounted(){
        this._getTemplateGHTreeList();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
