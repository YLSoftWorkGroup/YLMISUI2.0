<template>
<div class="dlfj">
    <div class="top">
            <div class="item">
                <span class="label">车牌号:</span>
                <span class="val" v-text="orderModel.v_Col11"></span>
            </div>
            <div class="item" style="width:50%">
                <span class="label">供应商:</span>
                <span class="val" v-text="orderModel.v_Col12"></span>
            </div>
            <div class="item" style="width:15%">
                <span class="label">物料集:</span>
                <span class="val" v-text="orderModel.infoName"></span>
            </div>
            <div class="item" style="width:10%">
                <span class="label">单位:</span>
                <span class="val" v-text="orderModel.infoUnit"></span>
            </div>

             <div class="item">
                <span class="label">退料:</span>
                <span class="val" v-text="orderModel.b_Col26?'是':'否'"></span>
            </div>
            <div class="item">
                <span class="label">磅单编号:</span>
                <span class="val" v-text="orderModel.orderCode"></span>
            </div>
            <div class="item">
                <span class="label">进场时间:</span>
                <span class="val" v-text="orderModel.v_Col16"></span>
            </div>
            <div class="item">
                <span class="label">出场时间:</span>
                <span class="val" v-text="orderModel.v_Col17"></span>
            </div>

            <div class="item">
                <span class="label">毛重:</span>
                <span class="val" v-text="orderModel.d_Col36"></span>
            </div>
            <div class="item">
                <span class="label">皮重:</span>
                <span class="val" v-text="orderModel.d_Col37"></span>
            </div>
            <div class="item">
                <span class="label">扣吨:</span>
                <span class="val" v-text="orderModel.d_Col40"></span>
            </div>
            <div class="item">
                <span class="label">净重:</span>
                <span class="val" v-text="orderModel.d_Col45"></span>
            </div>
    </div>
    <div class="list-warper">
        <yl-layout>
                        <div slot="fristbox" >
                          <yl-toolbar>
                              <el-button  
                                class="snapBtn"
                                type="primary" 
                                size="small" 
                                :loading="false" 
                                :disabled="false" 
                                @click="_onsel">
                                <i class="icon-plus" ></i>添 加</el-button>

                                 <el-button  
                                    class="snapBtn"
                                    type="primary" 
                                    size="small" 
                                    :loading="isSave" 
                                    :disabled="false" 
                                    @click="_save">
                                <i class="icon-floppy-disk" ></i>保 存</el-button>

                                <span style="font-size:12px;margin-left:10px">转化率运算：</span>
                                            <el-checkbox 
                                                    v-model="isComputations" 
                                                    style="color:blue;margin-left:10px" 
                                                    @change="_changeText"
                                            >
                                            {{isComputationsText}}
                                            </el-checkbox>

                          </yl-toolbar>
                        </div>
                         <div slot="secondbox" class="flexbox">
                                <yl-tableedit
                                    :tableConfig="tableConfig"
                                    :tableData="tableData"
                                    :sumRowConf="sumRowConf"
                                    :mapConfig="mapConfig"
                                    :addRowCount=100
                                    @delItem="_delItem"
                                >
                                </yl-tableedit>
                         </div>
         </yl-layout>
    </div>
</div>
</template>

<script type="text/babel">
import fetch from '@/api/fetch';
import {inputModel} from '@/api/inputmodel';
import { mapGetters,mapActions } from 'vuex';
export default {
    data(){
        return{
            isSave:false,
            isComputations:false,
            isComputationsText:'除（默认）',
            inputObj:new inputModel(),
            tableData:[],
            tableConfig:{
                table:{
                    attr:{
                        highlightCurrent:true,
                        style:{
                            width:"100%",
                            height:"227px"
                        }
                    }
                },
                columns:[
                     {attr: {type: "index",label: "序号",width: 50,align: "center"}},
                     {attr: {prop: "id",label: "操作",width: 65,scopedSlot: "id"}},
                     {attr: {prop: "mInfoNM",label: "材料名称",width: 200,scopedSlot: "mInfoNM"}},
                     {attr: {prop: "mInfoModel",label: "规格型号",width: 150}},
                     {attr: {prop: "mD_Col36",label: "净重(辅)",width: 100,scopedSlot: "mD_Col36"}},
                     {attr: {prop: "mInfoUnit",label: "单位(辅)",width: 80}},
                     {attr: {prop: "mD_Col39",label: "转化率",width: 80,scopedSlot: "mD_Col39"}},
                     {attr: {prop: "mD_Col37",label: "净重(主)",width: 100}},
                     {attr: {prop: "mV_Col11",label: "单位(主)",width: 80}},
                     {attr: {prop: "mRemark",label: "备注",scopedSlot: "mRemark",width: 180}},
                ],
                solSlotConf:[
                      {
                        type: "commonselect",
                        name: "mInfoNM",
                        elmentConfig: {
                            placeholder: "请选择分解材料",
                            size: "small",
                            clearable: false,
                            defaultProps:{
                                text: "infoName",
                                value: "id"
                            },
                            lists:['infoModel','infoUnit'],
                            apiConf:{
                                 url: "/api/services/app/commonMaterial/getMainPageList",
                                query: [
                                    {
                                    "key": "OrgId",
                                    "op": "EQ",
                                    "value":this.getUserInfo().user.manageOrgId
                                    }
                                ],
                                sorting: "infoName",
                                maxRows: 10000
                            }
                        },
                        eventConf:{
                            isOn: true,
                            isSum: false,
                            init: function(option,row){},
                            change: function(node,option,row,_this){
                                row.mD_Col36=0,
                                row.mInfoCode=node[0].infoCode;
                                row.mInfoName=node[0].infoName;
                                row.mInfoModel=node[0].infoModel;
                                row.mInfoUnit=node[0].infoSecUnit; //辅单位
                                row.mV_Col11=node[0].infoUnit; //主单位
                                row.mD_Col39=node[0].infoSecUnitPreci;//转化率
                                row.mCId=node[0].cId;//类别主键
                                row.mClassNodebh=node[0].classNodeBh;// 类别编码
                                //接口字段
                                row.mO_Col36=Obj[0].sO_Col15;
                                row.mI_Col1=Obj[0].oriBigId;
                                row.mV_Col12=Obj[0].oriStrId;
                                row.mV_Col14=Obj[0].sV_Col5;
                                row.mI_Col2=Obj[0].oriBigClassId;
                                row.mV_Col13=Obj[0].oriStrClassId;
                                console.log(node[0])

                            }
                        }
                       },
                      {
                        type: "inputNum",
                        name: "mD_Col36",
                        elmentConfig: {
                            type: "text",
                            size: "small",
                            disabled: false
                        },
                        eventConf: {
                            isOn: true,
                            isSum: true,
                            init: function(option,row){},
                            blur: function(node,option,row,_this){
                                //判断净重是否超量
                                let model=_this.getGlobObject1;
                                let jinZ=new Decimal(model.d_Col45);
                                let dataList= _this.getGlobArray1;
                                dataList.map(data=>{
                                   jinZ=jinZ.minus(data.mD_Col36);
                                })
                                if(jinZ.toNumber()>=0){
                                    if(model.isComputations){
                                      //乘法
                                        row.mD_Col37=new Decimal(row.mD_Col36).times(row.mD_Col39).toNumber();  
                                    }else{
                                        //除法
                                        if(row.mD_Col36){
                                            row.mD_Col37=new Decimal(row.mD_Col36).div(row.mD_Col39).toNumber();
                                        }else{
                                            row.mD_Col37=0
                                        }
                                    }
                                }else{
                                    _this.$message.warning("分解净重超额,请重新分配！")
                                    row.mD_Col36=0
                                }
                                
                            }
                        }
                       },
                      {
                        type: "inputNum",
                        name: "mD_Col39",
                        elmentConfig: {
                            type: "text",
                            size: "small",
                            disabled: false
                        },
                        eventConf: {
                            isOn: true,
                            isSum: true,
                            init: function(option,row){},
                            blur: function(node,option,row,_this){
                                //判断净重是否超量
                                let model=_this.getGlobObject1;
                                let jinZ=new Decimal(model.d_Col45);
                                let dataList= _this.getGlobArray1;
                                dataList.map(data=>{
                                   jinZ=jinZ.minus(data.mD_Col36);
                                })
                                if(jinZ.toNumber()>=0){
                                    if(model.isComputations){
                                      //乘法
                                        row.mD_Col37=new Decimal(row.mD_Col36).times(row.mD_Col39).toNumber();  
                                    }else{
                                        //除法
                                        if(row.mD_Col36){
                                            row.mD_Col37=new Decimal(row.mD_Col36).div(row.mD_Col39).toNumber();
                                        }else{
                                            row.mD_Col37=0
                                        }
                                    }
                                }
                                
                            }
                        }
                       },
                      {
                        type: "inputText",
                        name: "mRemark",
                        elmentConfig: {
                            type: "text",
                            size: "small"
                        }
                      }
                ]
            },
            mapConfig:{
                mapconf0: [
                        {prop: "id",isplace: false,defaultval: "0",selprop: ""},
                        {prop: "orgId",isplace: false,defaultval: this.orderModel.orgId,selprop: ""},
                        {prop: "orderId",isplace: false,defaultval: this.orderModel.id,selprop: ""},
                        {prop: "mInfoNM",isplace: false,defaultval: "",selprop: ""},
                        {prop: "mInfoName",isplace:false,defaultval: "",selprop: ""},
                        {prop: "mInfoModel",isplace:false,defaultval: "",selprop: ""},
                        {prop: "mInfoUnit",isplace: false,defaultval: "",selprop: ""},
                        {prop: "mV_Col11",isplace: false,defaultval: "",selprop: ""},
                        {prop: "mD_Col36",isplace: false,defaultval:0,selprop: ""},
                        {prop: "mD_Col39",isplace: false,defaultval:0,selprop: ""},
                        {prop: "mD_Col37",isplace: false,defaultval:0,selprop: ""},
                        {prop: "mRemark",isplace: false,defaultval: "",selprop: ""},
                ],
            },
            sumRowConf:{
                disable:true,
                sumText:"",
                items:{
                  
                }
            }    
        }
    },
    props:{
        orderModel:{
            type:Object,
            default:function(){
                return {}
            }
        },
    },
    methods:{
        ...mapActions(['setGlobObject1','setGlobObject2','setGlobString1','setGlobString2','setGlobalArray1']),
        ...mapActions({ setSelectRows: 'setSelectRows',setType:'setType' }),
         _changeText(a,b){
                if(this.isComputations){
                    this.isComputationsText='乘法';
                    }
                else{
                    this.isComputationsText='除法（默认）';
                }
                this.orderModel.isComputations=this.isComputations;
                this.setGlobObject1(this.orderModel);
            },
       _onsel(){
             let row=[{id:"",mInfoName:"",mInfoModel:"",mInfoUnit:'',mD_Col36:0,mRemark:''}];
             this.setSelectRows(row);
             this.setType(0);
             this.setGlobalArray1(this.tableData);
       },
       _saveData(){
            this.isSave=true;
            let Params={};
            Params.items=this.tableData;
            Params.judgeColumns={
                orderColumns: "",
                itemColumns: "Id"
            };
            fetch({
                url:'/api/services/app/table31Order/CreateMoreMaterialList',
                method:'post',
                data:Params
            }).then((data)=>{
                if(data.success){
                    this.$message({type:'success',message:'保存成功'})
                    this.$emit("closeFJ");
                    
                }else{
                this.$message({type:'error',message:'保存失败'})
                }
                this.isSave=false;
                this.loadList();
            }).catch(e=>{
                this.isSave=false
                console.log(e)
            })
            
       },
       _save(){
            if(this.tableData.length==0){
                this.$message({type:'warning',message:'请添加分解材料！'})
                return false
            }
            //同时物料是否分解完毕
            let jinZ=new Decimal(this.orderModel.d_Col45);
            this.tableData.map(data=>{
                jinZ=jinZ.minus(data.mD_Col36);
            })
            if(jinZ.toNumber()>0){
                 this.$confirm('磅单净重还有['+jinZ+']吨未分解完，要保存单据吗?', '提示', {
                    type: 'warning',
                    modal:false
                }).then(() => {
                    this._saveData();
                }).catch(err=>{
                })
            }else if(jinZ.toNumber()===0){
                this._saveData();
            }else if(jinZ.toNumber()<0){
               this.$message({type:'warning',message:'分解材料超出分解量！'})
            }  
       },
       _sumCount(){

       },
        _delItem(item){
             this.$confirm('确定要删除当前明细吗?', '提示', {
                type: 'warning',
                modal:false
                }).then(() => {
                        if(item.id==0){
                             let index=this.tableData.indexOf(item);
                            this.tableData.splice(index,1);
                            this.$message.success('删除数据成功！');
                        }else{
                            fetch({
                            url:'/api/services/app/table31Order/deleteItemMoareMaterialObject',
                            method:'post',
                            data:{
                                id: item.id,
                                 queryConditionItem: []
                            }
                            }).then((data)=>{
                                if(data.success){
                                    this.$message({type:'success',message:'删除信息成功！'})
                                }else{
                                    this.$message({type:'error',message:'删除信息失败！'})
                                }
                                this.loadList();
                            }).catch(e=>{
                                console.log(e)
                            })
                        }
                         
                }).catch(()=>{});
        },
        loadList(){
            this.inputObj.inputModel.queryConditionItem=[
                {
                    DataFieldTwo: "",
                    TwoFieldRelation: "",
                    dataField: "OrderId",
                    dataValue: this.orderModel.id,
                    op: "EQ",
                    relation: "and",
                },
                {
                    DataFieldTwo: "",
                    TwoFieldRelation: "",
                    dataField: "OrgId",
                    dataValue: this.orderModel.orgId,
                    op: "EQ",
                    relation:"and",
                },
                {
                    DataFieldTwo: "",
                    TwoFieldRelation: "",
                    dataField: "MoreIsDeleted",
                    dataValue: 0,
                    op: "EQ",
                    relation:"and",
                }
            ];
            this.inputObj.inputModel.maxResultCount=1000;
            fetch({
                url:'/api/services/app/table31Order/getItemMoreMaterialPageList',
                method:'post',
                data:this.inputObj.inputModel
            }).then((data)=>{
                if(data.success){
                    this.tableData=data.result.data;
                }else{
                    this.$message({type:'error',message:'列表数据获取失败！'})
                }
            }).catch(e=>{
                console.log(e)
            })
        },
    },
    mounted(){
       this.orderModel.isComputations=this.isComputations;
       this.setGlobObject1(this.orderModel);
       this.loadList();
    },
    watch:{
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.dlfj
    background #fff
    .top
        border 1px solid #ddd
        margin-bottom 10px
        padding 20px 15px
        display flex
        flex-wrap wrap
        .item
            font-size 12px
            height 25px
            width 25%
            .label
                color #a1a1a1
            .val
                padding-left 10px
    .list-warper
        height 260px
        border 1px solid #ddd
        overflow auto 
        display flex
        

        
</style>


