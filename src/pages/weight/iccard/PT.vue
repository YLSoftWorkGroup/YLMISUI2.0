<template>
    <div slot="content" style="background-color:white">
        <el-form  :model="formModel"  :rules="rules"  ref="formModel" label-width="90px" style="height:450px;padding:15px 1.5em 3ex 1%;">
        
            <el-row>
                <el-col :span="12">
                    <el-form-item label="车牌号" prop="o_Col27">
                         <yl-commonselect 
                            :clearable="true" 
                            style="width:100%"
                            :multiple="false" 
                            :defaultProps="carCard.defaultProps"
                            :apiConf="carCard.ApiConf"
                            :lists="carCard.Lists"
                            v-model="formModel.o_Col27"
                            @getCurrentNode="_getCarCardCurrentNode"
                            @clear="_carCardClear"></yl-commonselect>
                    </el-form-item>
                </el-col>
                  <el-col :span="12">
                      <el-form-item label="供应商" prop="o_Col26" >
                         <el-select v-model="formModel.o_Col26"  
                             filterable
                            style="width:100%" 
                            :placeholder="''"   
                            :clearable="true" 
                            :disabled="false"
                            @change="_supplierchange"
                            @clear="_supplierClear">
                                <el-option v-for="item in supplierData" 
                                    style="width:100%;height:auto;" 
                                    :key="item.supplierId"  
                                    :label="item.supplierName" 
                                    :value="item.supplierId"> 
                                </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
                
            <el-row>
              
                 <el-col :span="12">
                    <el-form-item label="材料名称" prop="o_Col28">
                        <el-select v-model="formModel.o_Col28" 
                                style="width:100%" 
                                filterable 
                                :placeholder="''" 
                                :clearable="true" 
                                :disabled="false"
                                @change="_materialchange"
                                @clear="_materialClear">
                                <el-option v-for="item in materialData" 
                                    style="width:100%;height:auto;" 
                                    :key="item.infoNM"  
                                    :label="item.infoName" 
                                    :value="item.infoNM" >
                                        <div style="height:18px; font-size: 12px">{{item.infoName}}</div> 
                                        <div style="height:15px;color: #8492a6; font-size: 11px" >{{ item.infoModel}}*{{ item.infoUnit}}</div>
                                        <!-- <div style="height:15px;color: #8492a6; font-size: 11px" >{{ item.infoUnit}}</div> -->
                                </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                       <el-col :span="6">
                    <el-form-item label="扣率" prop="d_Col21">
                         <el-input v-model="formModel.d_Col21"  @blur="_coulvCompute(formModel.d_Col21)"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="扣吨" prop="d_Col22">
                         <el-input v-model="formModel.d_Col22" @blur="_coudunCompute(formModel.d_Col22)"></el-input>
                    </el-form-item>
                </el-col>
                
            </el-row>
            <el-row>
               
           <el-col :span="12">
                    <el-form-item label="规格型号" prop="v_Col9">
                         <span class="span" >{{formModel.v_Col9}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="单位" prop="v_Col10">
                         <span class="span" >{{formModel.v_Col10}}</span>
                    </el-form-item>
                </el-col>
                 <el-col :span="4">
                    <el-form-item label="副单位" prop="v_Col15">
                         <span class="span">{{formModel.v_Col15}}</span>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="转换率" prop="d_Col20">
                         <span class="span">{{formModel.d_Col20}}</span>
                    </el-form-item>
                </el-col>
               
            </el-row>
            <el-row>
                  <el-col :span="6">
                    <el-form-item label="是否启用" prop="b_Col17">
                        <el-switch  v-model="formModel.b_Col17"
                                    on-text="是"
                                    off-text="否">
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-form-item label="是否自动过磅" prop="b_Col18">
                        <el-switch  v-model="formModel.b_Col18"
                                    on-text="是"
                                    off-text="否">
                        </el-switch>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="料仓" prop="o_Col29">
                            <el-select v-model="formModel.o_Col29" 
                                style="width:100%" 
                                filterable 
                                :placeholder="''" 
                                :clearable="true" 
                                :disabled="false"
                                 @clear="_lcClear" 
                                @change="_getCurrentNode(formModel.o_Col29)">
                                <el-option v-for="item in lcData" 
                                    style="width:100%;height:auto;" 
                                    :key="item.id"  
                                    :label="item.v_Col6" 
                                    :value="item.id" >
                                        <div style="height:18px; font-size: 12px">{{item.v_Col6}}</div> 
                                        <!-- <div style="height:15px;color: #8492a6; font-size: 11px" >{{ item.infoUnit}}</div> -->
                                </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script type="text/babel">
import dataDictionaryForSel from '@/ocomponents/datadictionary/dataDictionaryForSel';
import CommonSelect from '@/components/commonselect/CommonSelect';
import fetch from  '@/api/fetch';
export default {
    data(){
        return{
            activeName2:'three',
            formModel:{
                id:'',
                orgId:this.getUserInfo().user.manageOrgId,
                i_Col1:'',
                i_Col2:'',
                i_Col3:'',
                i_Col4:'',
                i_Col5:'',
                v_Col6:'',//供应商名称
                v_Col7:'',//车牌号
                v_Col8:'',//材料名称
                v_Col9:'',//规格型号
                v_Col10:'',//单位
                v_Col11:'',//料仓
                v_Col12:'',//卡号
                v_Col13:'commonGb_PT',//过磅类型（普通过磅、临时过磅）
                v_Col14:'',
                v_Col15:'',
                v_Col16:'',
                b_Col17:true,//是否启用
                b_Col18:'',
                b_Col19:'',
                d_Col20:'',//转换率
                d_Col21:'',
                d_Col22:'',
                d_Col23:'',
                d_Col24:'',
                d_Col25:'',
                o_Col26:'',//供应商ID
                o_Col27:'',//车牌ID
                o_Col28:'',//材料ID InfoNM
                o_Col29:'',//料仓ID
                o_Col30:'',
                sortCode:'',
                v_Col31:'',
                v_Col32:'',
                v_Col33:'',
                v_Col34:'',
                v_Col35:'',
                 v_Col36:'',
                v_Col37:'',
                v_Col38:'',
                v_Col39:'',
                v_Col40:'',
                o_Col41:'',
                o_Col42:'',
                o_Col43:'',
                o_Col44:'',
                o_Col45:'',
            },
            isClose:true,
            rules:{
                o_Col27: [
                        { required: true, message: '车牌不能为空！', trigger: 'change' },
                    ],
                v_Col12: [
                    { required: true, message: '卡号不能为空！', trigger: 'change' },
                ]
            },
            carCard:{    
                defaultProps:{
                    text:"v_Col6",
                    value:"id"
                },
                ApiConf:{
                    url:"/api/services/app/singleTable25/getMainPageList",
                    query:[{key:'OrgId',op:'EQ',value:this.getUserInfo().user.manageOrgId}],
                    sorting:''
                },
                Lists:[]
            },
            supplierData:[],
            materialData:[],
            loading:false,
            lcData:[],
        }
    },
     props:{
        icForm:{}
    },
     watch:{
        icForm:{
            handler(curVal,oldVal){
                console.log(curVal,oldVal);
                if(curVal.v_Col13=='commonGb_PT'){
                    Object.assign(this.formModel,curVal);
                    this.formModel.o_Col29=curVal.o_Col29==this.guidOfNull()?'':curVal.o_Col29;
                    this.formModel.o_Col28=curVal.o_Col28==this.guidOfNull()?'':curVal.o_Col28;
                    this.formModel.o_Col27=curVal.o_Col27==this.guidOfNull()?'':curVal.o_Col27;
                    this.formModel.o_Col26=curVal.o_Col26==this.guidOfNull()?'':curVal.o_Col26;
                }
　　　　    },
　　　　　   deep:true
        }
    },
     methods:{
         _lcClear(){
             this.formModel.o_col29 =''
         },
          _getLcInfo(infoNM){
            let arr=[ {dataField:"OrgId",op:"EQ",dataValue:this.getUserInfo().user.manageOrgId}]
            if (infoNM!=''){
                arr.push({dataField:"O_Col28",op:"EQ",dataValue:infoNM})
            }
             fetch({
                url: '/api/services/app/singleTable21/getMainAllList',
                method: 'post',
                data: {
                    sorting:'',
                    queryConditionItem:arr
                }
            }).then(data=>{
                 if (data.success) {
                     this.lcData=data.result;
                } else {
                    _this.$message.error('保存数据失败！' + data.error.message);
                }
            })
        },
          _getCurrentNode(node){
             let d=this.lcData.filter(function(item){
                                return  item.id == node; 
                            })
            if(d.length>0){
             this.formModel.o_Col29=d[0].id;
             this.formModel.v_Col11=d[0].v_Col6;
             this.formModel.v_Col14=d[0].v_Col10;
            }
        },
          _coulvCompute(num){
             if(!isNaN(parseFloat(num))){
                 this.formModel.d_Col21=Decimal(num).toFixed(2).toString();
             }else{
                  this.formModel.d_Col21=0;
             }
         },
           _coudunCompute(num){
             if(!isNaN(parseFloat(num))){
                 this.formModel.d_Col22=Decimal(num).toFixed(2).toString();
             }else{
                  this.formModel.d_Col22=0;
             }
         },
        _resetForm(){
            let num = this.formModel.v_col12;
            this.$refs.formModel.resetFields();
            this.formModel.id ='';
            this.formModel.v_col12 =num;
        },
        _onSubmit(){
            this.$refs.formModel.validate((valid) => {
                if (valid) {
                    var _this=this;
                    this.loading=true;
                    let params={};
                    params.order=this.formModel;
                    fetch({
                        url: '/api/services/app/singleTable26/createOrUpdateMainObject',
                        method: 'post',
                        data: params
                    }).then(data=>{
                    if(data.success){
                            _this.$notify({
                                title: '成功',
                                message: '保存数据成功！',
                                type: 'success'
                                });
                            _this.loading=false;
                            _this.$emit('complete');
                            
                        }
                        else {
                            this.$message.error('失败！'+data.error.message);
                            _this.loading=false;
                        }
                    })
                } else {
                    this.$message.warning('请按照条件填充表单！');
                    return false;
                }
                
            });
        },
        _getCarCardCurrentNode(node){
            if(node[0]!=undefined){
                this.formModel.v_Col7=node[0].v_Col6;//车牌
                this.formModel.o_Col27=node[0].id;
            }
        },
        _carCardClear(){
            this.formModel.o_Col27='';
            this.formModel.v_Col7='';
        },
       
        _supplierClear(){
            this.formModel.o_Col26='';
            this.formModel.v_Col6='';
        },
        _materialClear(){
            this.formModel.o_Col28='';
            this.formModel.v_Col9='';
            this.formModel.v_Col10='';
            this.formModel.o_Col28='';
            this.formModel.v_Col15='';
            this.formModel.d_Col20='';
            this.formModel.o_Col30='';
            this.formModel.v_Col35='';
             //材料
                this.formModel.i_Col1='';
                this.formModel.v_Col31='';
                this.formModel.v_Col38='';
                //类别
                this.formModel.i_Col2='';
                this.formModel.v_Col32='';
        },
        _supplierchange(id){
            if(id != undefined&id!=''){
                let d=this.supplierData.filter(function(item){
                                return  item.supplierId == id; 
                            })
                this.formModel.v_Col6=d[0].supplierName;

                this.formModel.i_Col3=d[0].oriBigId;
                this.formModel.v_Col33=d[0].oriStrId;
            }
        },
        _materialchange(id){
             if(id != undefined&id!=""){
                let d=this.materialData.filter(function(item){
                                return  item.infoNM == id; 
                            })
                this.formModel.v_Col8=d[0].infoName;
                this.formModel.v_Col9=d[0].infoModel;
                this.formModel.v_Col10=d[0].infoUnit;
                this.formModel.o_Col28=d[0].infoNM;
                this.formModel.v_Col15=d[0].infoSecUnit;
                this.formModel.d_Col20=d[0].infoSecUnitPreci;
                this.formModel.o_Col30=d[0].cId;
                this.formModel.v_Col35=d[0].classNodeBh;
                //材料
                this.formModel.i_Col1=d[0].oriBigId;
                this.formModel.v_Col31=d[0].oriStrId;
                this.formModel.v_Col38=d[0].sV_Col5;
                //类别
                this.formModel.i_Col2=d[0].oriBigClassId;
                this.formModel.v_Col32=d[0].oriStrClassId;
                this._getLcInfo( this.formModel.o_Col28);
            }
        },
        async _getAllSelectInfo(){
            let _this=this;
            //供应商
            let  data= await  _this.asyncFunc({
                                    url:'/api/services/app/commonSupplier/getMainAllList',
                                    method:'post',
                                    data: {
                                        sorting:'SupplierName',
                                        queryConditionItem:[ {dataField:"OrgId",op:"EQ",dataValue:this.getUserInfo().user.realOrgId}]
                                    }
                                },'获取供应商');
                    _this.supplierData=data.map(item=>{
                        return {
                            supplierId:item.id,
                            supplierName:item.supplierName
                        }
                    });
          
            //常用材料
             let  data1= await  _this.asyncFunc({
                                    url:'/api/services/app/commonMaterial/getMainAllList',
                                    method:'post',
                                    data: {
                                        sorting:'SupplierName',
                                        queryConditionItem:[ {dataField:"OrgId",op:"EQ",dataValue:this.getUserInfo().user.realOrgId}]
                                    }
                                },'获取常用材料');
                    _this.materialData=data1.map(item=>{
                        return {
                            infoNM:item.id,
                            infoName:item.infoName,
                            infoModel:item.infoModel,
                            infoUnit:item.infoUnit,
                            infoSecUnitPreci:item.infoSecUnitPreci,
                            infoSecUnit:item.infoSecUnit
                        }
                    });
        },
        _setICInfo(num){
            this.formModel.v_Col12=num;
        },
        
        _getTreeList(){
            fetch({
                url: '/api/services/app/singleTable21/GetTreeList',
                method: 'post',
                data: {parentId:this.guidOfNull(),orgId:this.getUserInfo().user.manageOrgId}
            }).then(data=>{
                if(data.success){
                        this.treedata=data.result;
                }
                else {
                    this.$message.error('获取数据失败！');
                }
            })
        },
     },  
    mounted(){
         this._getTreeList();
        this._getAllSelectInfo();
        this._getLcInfo('');
    },
    components:{
        dataDictionaryForSel,
        'yl-commonselect':CommonSelect
    },
    beforeDestroy() {
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.span
    text-decoration: underline
    line-height:34px

</style>


