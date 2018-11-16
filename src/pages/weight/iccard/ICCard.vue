<template>
<yl-panelpage :titleName="'IC卡管理'" >
<div slot="content">
    <yl-layout>
        <div slot="fristbox" >
          <yl-toolbar>
                <el-form  :inline="true" >
                     <el-form-item class="form-content-vertical">
                        <el-select v-model="searchModel.o_Col26"
                             filterable
                            style="width:100%" 
                            :placeholder="'供应商'"   
                            :clearable="true" 
                            :disabled="false"
                            size="small"
                            @change="_supplierchange"
                            @clear="_supplierClear">
                                <el-option v-for="item in supplierData" 
                                    style="width:100%;height:auto;" 
                                    :key="item.id"  
                                    :label="item.supplierName" 
                                    :value="item.id"> 
                                </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="form-content-vertical">
                      <el-input  placeholder="卡号" size="small" style="width:150px" v-model="searchModel.v_Col12"></el-input> 
                    </el-form-item>
                        <el-form-item class="form-content-vertical">
                            <el-button type="primary" icon="search" size="small"  @click="_reload">查 询</el-button>
                        </el-form-item>
                </el-form>
          </yl-toolbar>
        <yl-toolbar>
            <el-button-group>
                    <el-button type="primary" v-permissionSetting="'show'"   icon="plus" size="small"  @click="_add" >录入信息</el-button>
                </el-button-group>
        </yl-toolbar>
        </div>
         <div slot="secondbox" class="flexbox">
              <yl-table ref="table"
                    @reload="_reload"
                    @current-change="_currentChange"
                    :configs="tableConfig" 
                    :input="mainInput.inputModel"
                    :tableloading="mainTableLoading" 
                    >      
                 <template slot="v_Col13" scope="scope">
                    <el-tag type="primary" v-if="scope.row.v_Col13=='commonGb_PT'">普通过磅</el-tag>
                    <el-tag type="warning" v-else-if="scope.row.v_Col13=='commonGb_CC'">出场过磅</el-tag>
                    <el-tag type="danger" v-else>临时过磅</el-tag>
                </template>    
                <template slot="b_Col18" scope="scope">
                    <el-tag type="primary" v-if="scope.row.b_Col18">是</el-tag>
                    <el-tag type="danger" v-else>否</el-tag>
                </template>    
                <template slot="b_Col17" scope="scope">
                    <el-tag type="primary" v-if="scope.row.b_Col17">是</el-tag>
                    <el-tag type="danger" v-else>否</el-tag>
                </template>    
                </yl-table>
         </div>
    </yl-layout>
     <!--编辑界面-->
         <el-dialog ref="mainDialog" title="编辑" v-model="addFormVisible" size="normal"  top="10%" 
                    :modal-append-to-body="false" :modal="true" :close-on-click-modal="false"  >
                    <Edit  @close="_close"  v-if="addFormVisible"></Edit>
         </el-dialog>
 </div>
</yl-panelpage>
</template>

<script type="text/babel">
import  {inputModel} from '@/api/inputmodel';
import Edit from './ICCardEdit';
import fetch from  '@/api/fetch';
export default {
    data(){
        return{
             tableData: {},
                mainTableLoading:false,
                selectRows:[],
                currentRows:{},
                searchModel:{
                    o_Col26:'',  
                    v_Col12:''
                    },
                addFormVisible:false,
                mainInput:new inputModel(),
                supplierData:[]
        }
    },
    computed: {
            tableConfig: {
                    get () {
                        return {
                            table: {
                                attr: {
                                    data: this.tableData,
                                    highlightCurrent:true,
                                }
                            },
                            columns: [
                                {attr: { type: 'index',label: '序号', width:80,align: 'center' }},
                                {attr: { prop: 'v_Col12', label: '卡号', width:100,  } },
                                {attr: { prop: 'v_Col13', label: '过磅类型', width:80,scopedSlot:'v_Col13',  } },    
                                {attr: { prop: 'v_Col7', label: '车牌', width:120,  } },    
                                {attr: { prop: 'v_Col6', label: '供应商/用料单位', width:200,  } },    
                                {attr: { prop: 'v_Col14', label: '料仓', width:80,  } }, 
                                 {attr: { prop: 'v_Col36', label: '工号', width:150,  } }, 
                                {attr: { prop: 'b_Col17', label: '是否启用', width:80, scopedSlot:'b_Col17', } }, 
                                {attr: { prop: 'b_Col18', label: '自动过磅', width:80, scopedSlot:'b_Col18', } },       
                                {attr: { prop: 'v_Col8',label: '材料名称',width:140,} }, 
                                {attr: { prop: 'v_Col9', label: '规格型号', width:100,  } },   
                                {attr: { prop: 'v_Col10', label: '单位', width:50,  } }, 
                                {attr: { prop: 'v_Col15', label: '副单位', width:80,  } }, 
                                {attr: { prop: 'd_Col20', label: '转换率', width:80,  } }, 
                                {attr: { prop: 'd_Col21', label: '扣率', width:50,  } }, 
                                {attr: { prop: 'd_Col22', label: '扣吨', width:50,  } }, 
                            ]
                        }
                    }
                }
        },
    methods:{
        _getIcCardPageList(){
                var _this=this;
                this.selectRows=[];
                this.mainTableLoading=true; //开启加载
                var inputArr=[{key:"V_Col12",op:"LIKE",value:this.searchModel.v_Col12},
                {key:"OrgId",op:"EQ",value:this.getUserInfo().user.manageOrgId}];
                if(this.searchModel.o_Col26!=''){
                    inputArr.push({key:"O_Col26",op:"EQ",value:this.searchModel.o_Col26});
                }
                this.mainInput.addqueryConditionItem(inputArr);
                fetch({
                    url: '/api/services/app/singleTable26/getMainPageList',
                    method: 'post',
                    data: this.mainInput.inputModel
                }).then(data =>{
                            if(data.success){
                                this.tableData=data.result;
                                }
                            else {
                                 this.$message.error('失败！'+data.error.message);
                            }
                          this.mainTableLoading=false;
                }).catch(function(error){
                       _this.mainTableLoading=false;
                });
        },
        _reload(){
            this._getIcCardPageList();
        },
        _add(){
             this.addFormVisible=true;
        },
        _currentChange(){

        },
         _close(bool){
            if(bool){
                this.addFormVisible=false;
            }
                this._reload();
        },
        _supplierClear(){
            this.searchModel.o_Col26='';
        },
        _supplierchange(id){
            if(id != undefined&id!=''){
                let d=this.supplierData.filter(function(item){
                                return  item.id == id; 
                            })
                this.searchModel.o_Col26=d[0].id;
            }
        },
        _getSupplierSelectInfo(){
            let _this=this;
            //供应商
            fetch({
                url: '/api/services/app/commonSupplier/getMainPageList',
                method: 'post',
                data: {
                    draw:1,
                    maxResultCount:10,
                    skipCount:0,
                    sorting:'',
                    queryConditionItem:[ {dataField:"OrgId",op:"EQ",dataValue:this.getUserInfo().user.manageOrgId}]
                }
            }).then(function (data) {
                if (data.success) {
                    _this.supplierData=data.result.data;
                } else {
                    _this.$message.error('保存数据失败！' + data.error.message);
                }
            })
        },
    },
    components:{
         Edit,
        },
    mounted(){
        this._reload();
        this._getSupplierSelectInfo();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


