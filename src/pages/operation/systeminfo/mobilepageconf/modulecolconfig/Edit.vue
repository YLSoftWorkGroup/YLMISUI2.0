<template>
    <div>
         <div><h3>版本号{{versionNum}}</h3></div>
        <div><h3>菜单名：{{moduleInfo.mouduleName}}</h3></div>
        <div><h3>表名：{{moduleInfo.tableName}}</h3></div>
        <el-table :data="formModel.items" border style="width: 100%;" max-height="500">
            <el-table-column
                label="列"
                width="180"
                prop="columnName">
            </el-table-column>
            <el-table-column
                label="描述"
                width="">
                <template scope="scope">
                    <el-input v-model="scope.row.columnExplain" :disabled="false" size="small" ></el-input>
                </template>
            </el-table-column>
        </el-table>
        <div align="right">
            <el-button type="primary" @click="_onSubmit" :loading="loading">保存</el-button>
        </div>
    </div>
</template>

<script type="text/babel">
import {
    requestCreateMainList
}from '@/api/modulecolconfig';
import util from '@/common/js/util';
export default {
    data(){
        return{
            formModel:{
                items:[]
            },
            loading:false
        }
    },
    props:{
        colInfo:{
            type:Array,
            default:[]
        },
        moduleInfo:{
            type:Object
            },
        versionNum:{
            type:String
            }
    },
    methods:{
        _onSubmit(){
            var _this=this;
            this.loading=true;
            let params={};
            let mt=this.moduleInfo.tableName;
            this.formModel.items.forEach(function(element) {
                element.mouduleTableName=mt;
                element.versionNum=_this.versionNum;
            });
            params.items=this.formModel.items;
            requestCreateMainList(params).then(data=>{
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
        },
        _complete(){
                this.$emit('close');
            },
    },
    mounted(){
        this.formModel.items=this.colInfo;

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
