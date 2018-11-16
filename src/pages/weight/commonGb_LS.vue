<template>
        <yl-layout class="gbpt">
            <div slot="fristbox" class="editor">
                    <el-form  :model="formModel"  ref="formModel" label-width="80px" class="formStyle">
                       <el-row>
                            <el-col :span="6">
                                <el-form-item label="车牌号" prop="v_Col11">
                                        <el-input style="width:100%"
                                            placeholder="请填写车牌号"
                                            v-model="formModel.order.v_Col11" 
                                            size="small" 
                                            icon="setting"
                                            :disabled="saveBtnState"
                                            @select="_carNumSel"
                                            @change.native="_carNumChange"
                                            :on-icon-click="_displayKeyboard">
                                        </el-input>
                                </el-form-item> 
                            </el-col>
                        
                            <el-col :span="6">
                                <el-form-item label="供应单位" prop="v_Col12">
                                    <el-input 
                                            style="width:100%"
                                            v-model="formModel.order.v_Col12" 
                                            size="small"
                                            placeholder="请填写供应单位">
                                      </el-input> 
                                </el-form-item> 
                            </el-col>

                           <el-col :span="6">
                                <el-form-item label="材料名称" prop="infoName">
                                    <el-input 
                                            style="width:100%"
                                            v-model="formModel.order.infoName" 
                                            size="small"
                                            placeholder="请填写材料名称">
                                      </el-input> 
                                </el-form-item> 
                           </el-col>

                           <el-col :span="6">
                                <el-form-item label="规格|单位" >
                                     <el-col :span="18">
                                       <el-input v-model="formModel.order.infoModel"  size="small" ></el-input>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-input v-model="formModel.order.infoUnit"  size="small" ></el-input>
                                    </el-col>
                                </el-form-item> 
                           </el-col>      
                       </el-row>
                        <el-row>
                             <el-col :span="6">
                                    <el-col :span="12">
                                         <el-form-item label="进场重量" prop="d_Col36">
                                            <el-input 
                                                type="number"
                                                v-model.number="formModel.order.d_Col36" 
                                                size="small"
                                                :readonly="true" > 
                                            </el-input>
                                          </el-form-item> 
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="出场重量" prop="d_Col37" >
                                                <el-input 
                                                    type="number"
                                                    v-model.number="formModel.order.d_Col37" 
                                                    size="small"
                                                    :readonly="true" > 
                                                </el-input>
                                            </el-form-item> 
                                        </el-col>
                            </el-col>

                             <el-col :span="6">
                                    <el-form-item label="进场时间" prop="v_Col16">
                                        <el-input v-model="formModel.order.v_Col16" size="small" :readonly="true"></el-input>
                                    </el-form-item> 
                            </el-col>
                             <el-col :span="6">
                                     <el-form-item label="委托单位" prop="v_Col13">
                                    <el-input 
                                            style="width:100%"
                                            v-model="formModel.order.v_Col13" 
                                            size="small"
                                            placeholder="请填写委托单位">
                                      </el-input> 
                                </el-form-item> 
                            </el-col>

                              <el-col :span="6">
                                    <el-col :span="12">
                                         <el-form-item label="扣率(%)">
                                                     <el-input 
                                                        v-model.number="formModel.order.d_Col39"   
                                                        type="number"  
                                                        size="small"
                                                        @blur="_kouRate" >
                                                     </el-input>
                                         </el-form-item> 
                                    </el-col>
                                     <el-col :span="12">
                                         <el-form-item label="扣吨">
                                                     <el-input 
                                                        v-model.number="formModel.order.d_Col40"   
                                                        type="number"  
                                                        size="small"
                                                        @blur="_kouDunBlur" ></el-input>
                                         </el-form-item> 
                                    </el-col>
                            </el-col>
                        </el-row>
                        <el-row>
                             <el-col :span="24">
                                     <el-form-item label="备注信息" prop="orderRemark">
                                        <input type="text" class="inputtext"  v-model="formModel.order.orderRemark" name="orderRemark" >
                                        <!-- <el-input v-model="formModel.order.orderRemark" size="small" ></el-input> -->
                                    </el-form-item> 
                             </el-col>
                        </el-row>
                    </el-form>
            </div>
            <div slot="secondbox" class="flexbox">
                <yl-layout>
                        <div slot="fristbox" >
                                <yl-toolbar class="toolbar" >
                                    <el-row>
                                        <el-button  
                                                type="primary" 
                                                size=""
                                                :loading="importLoading" 
                                                :disabled="saveBtnState" 
                                                @click="_importWight">
                                                <i class="icon-sign-in" ></i>进场称重</el-button>
                                            <el-button  
                                                type="success" 
                                                size="" 
                                                :loading="exportLoading" 
                                                :disabled="!saveBtnState" 
                                                @click="_exportWight">
                                                <i class="icon-sign-out" ></i>出场称重</el-button>
                                             
                                            <el-button 
                                                :plain="true" 
                                                type="warning" 
                                                size="small"
                                                @click="_resetFunc"
                                                ><i class="icon-spinner11" ></i> 重 置</el-button>
                                             <el-checkbox 
                                                v-model="formModel.order.b_Col28" 
                                                style="color:red;margin-left:10px" 
                                                :disabled="saveBtnState"
                                                @change="_backOrder"
                                                >不称皮重</el-checkbox>

                                             <el-button  
                                                type="danger" 
                                                size="small" 
                                                :disabled="cancelBtnState"
                                                @click="_canelImportWight">
                                                <i class="icon-cancel"></i>取消入场</el-button>
                                    </el-row>
                                  
                                </yl-toolbar>
                        </div>
                        <div slot="secondbox" class="flexbox">
                                <yl-table ref="GbTable"
                                    @reload="_reload"
                                    @current-change="_currentChange"
                                    :configs="tableConfig" 
                                    :input="mainInput.inputModel"
                                    :tableloading="mainTableLoading" 
                                    >
                                        <template slot="flag" scope="scope">
                                            <el-tag type="primary" v-if="!scope.row.b_Col27">未出场</el-tag>
                                            <el-tag type="success" v-else>已出场</el-tag>
                                        </template>
                                        <template slot="upload" scope="scope">
                                            <el-tag type="primary" v-if="!scope.row.b_Col30">未上传</el-tag>
                                            <el-tag type="success" v-else>已上传</el-tag>
                                        </template>
                                           <template slot="print" scope="scope"  > 
                                               <el-tooltip 
                                                effect="dark" 
                                                :hide-after="0"
                                                content="打印（不带扣重）"
                                                placement="bottom-start" 
                                                > 
                                                <span class="yl-table-icon" style="margin:0px 5px 0px 5px"  >  
                                                        <i  class="yl-text-color icon-printer"   @click="_printPage(scope.row,0)" ></i>
                                                </span>
                                                </el-tooltip>

                                        </template>
                                </yl-table>
                        </div>
                    </yl-layout>         
            
            </div>
        </yl-layout>
</template>

<script type="text/babel">
import  {inputModel} from '@/api/inputmodel';
import util from '@/common/js/util'
import fetch from '@/api/fetch';
import { getLodop } from '@/common/print/lodop/LodopFuncs'
export default {
    data(){
        return{
            selectRows:[],
            mainInput:new inputModel(),
            mainTableLoading:false,
            tableData:[],
            saveBtnState:false,
            cancelBtnState:true,
            importLoading:false,
            exportLoading:false,
            formModel:{
                order:{
                    id:'',
                    orgId:'',
                    orgCode:'',
                    orgName:'',
                    OrderDate:'',
                    orderCode:'',
                    orderDataType:'0',
                    orderDataId:'',
                    infoNM:'',
                    infoCode:'',
                    infoName:'',
                    infoModel:'',
                    infoUnit:'',
                    cId:'',
                    classNodebh:'',
                    maker:'',
                    makerDate:'',
                    orderRemark:'',
                    v_Col11:'',
                    v_Col12:'',
                    v_Col13:'',
                    v_Col14:'',
                    v_Col15:'',
                    d_Col36:0,
                    d_Col37:0,
                    d_Col38:0,
                    d_Col39:0,
                    d_Col40:0,
                    d_Col41:0,
                    d_Col42:0,
                    b_Col26:false,
                    b_Col27:false,
                    b_Col28:false,
                    b_Col29:false,
                    o_Col36:'',
                    o_Col37:'',
                },
                items:[],
                config:{
                    "isGenerateCode":true
                },
                moduleConf:{}
             },
            isComputations:false,
            isComputationsText:'除（默认）'
        }
    },
  props:{
        apiList:{
            type:Object,
            default:function(){
                return {}
            }
        },
        dbData:{
            type:Object,
            default:0
        },
        cameraList:{
            type:Object,
            default:function(){
                return {}
            }
        },
        isValue:{
            type:Boolean,
            default:false
        },
        currentView:{
            type:String,
            default:''
        },
        gbGlobConf:{
            type:Object,
            default:function(){
                return {}
            }
        }
  },
  computed: {
            computedKoudun:{
                get(){
                    //计算扣吨 |(毛重-皮重)|*扣率/100
                   if(Number(this.formModel.order.d_Col40)===0){
                         let koudun=0;
                         koudun=new Decimal(Math.abs(new Decimal(this.formModel.order.d_Col36).sub(this.formModel.order.d_Col37))).mul(new Decimal(this.formModel.order.d_Col39).div(100));
                         return new Decimal(koudun).toNumber().getToFixed(this.gbGlobConf.commonConf.baseConf.gbFloatLength.jzl);
                   }else{
                       return new Decimal(this.formModel.order.d_Col40).toNumber().getToFixed(this.gbGlobConf.commonConf.baseConf.gbFloatLength.jzl);
                   }
                  
                }
            },
            utilObject:{
                    get(){
                        return util;
                    }
                },
            fetchObject:{
                    get(){
                        return fetch;
                    }
                },            
            computedjingWeight:{
                get(){
                       //计算净重 |(毛重-皮重)|-扣吨
                        let jz= new Decimal(Math.abs(new Decimal(this.formModel.order.d_Col36).sub(this.formModel.order.d_Col37))).sub(this.formModel.order.d_Col40);
                        return new Decimal(jz).toNumber().getToFixed(this.gbGlobConf.commonConf.baseConf.gbFloatLength.jzl);
                }
             },
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
                                {attr: { headerAlign:"center",prop: 'id', label: '打印', width:50,scopedSlot: 'print'} },
                                {attr: { prop: 'b_Col27', label: '状态', width:80,scopedSlot: 'flag'} },   
                                {attr: { prop: 'orderCode', label: '磅单号', width:120,} },   
                                {attr: { prop: 'v_Col11', label: '车牌号', width:120,  } },
                                {attr: { prop: 'infoName', label: '材料名称', width:120,  } },   
                                {attr: { prop: 'infoModel', label: '规格型号', width:150,  } },   
                                {attr: { prop: 'infoUnit', label: '单位', width:60,  } },    
                                {attr: { prop: 'd_Col36', label: '毛重', width:80, } },
                                {attr: { prop: 'd_Col37', label: '皮重', width:80, } },
                                {attr: { prop: 'd_Col40', label: '扣吨', width:80, } },
                                {attr: { prop: 'd_Col42', label: '净重', width:80, } },
                                {attr: { prop: 'v_Col16', label: '进场时间', width:120,  } }, 
                                {attr: { prop: 'v_Col17', label: '出场时间', width:120,  } },   
                                {attr: { prop: 'v_Col12', label: '称重单位名称', width:120, } },
                                {attr: { prop: 'b_Col30', label: '上传状态', width:80,scopedSlot: 'upload'} },  
                                {attr: { prop: 'maker', label: '制单人', width:100, } },
                                {attr: { prop: 'orderRemark', label: '备注信息',  } },
                            ]
                        }
                    }
                }
        },
   methods:{
        //模块配置
       _validatorFelids(type=1){
          //字段校验验证
          if(this.formModel.order.v_Col11==''){
               this.$message({ message: '请填写车牌信息',type: 'warning'});
               return false;
          }
          if(this.formModel.order.v_Col12==''){
               this.$message({ message: '请填写供应单位',type: 'warning'});
               return false;
          }
          if(this.formModel.order.infoName==''){
               this.$message({ message: '请填写材料信息！',type: 'warning'});
               return false;
          }
          if(type===1){
              if(this.formModel.order.d_Col36<=0){
                   this.$message({ message: '进场重量必须大于0！',type: 'warning'});
                   return false;
              }
          }
          if(type===2){
              if(this.formModel.order.d_Col37<=0){
                   this.$message({ message: '出场重量必须大于0！',type: 'warning'});
                   return false;
              }
          }
          return true
       },
       //模块配置
       _getModuleConf(){
           let inputArrs=[ 
                    {dataField:"ExtensionTwo",op:"EQ",dataValue:'table33Order'},
                  ];
            fetch({ 
                     url: '/api/services/app/moduleConf/GetModuleConfForEdit',
                      method: 'post',
                      data: inputArrs
                    }).then((data)=>{
                            if(data.success){
                                let mConfigs=data.result.moduleConf;
                                this.moduleConf=JSON.parse(mConfigs.extensionOne,util.dealFunction);
                            }
                            else {
                                this.$message.error('失败！'+data.error.message);
                            }
                    }).catch((err)=>{this.$message.error('获取数据异常！'+err);});
       },
         async _printPage(params1,type){
                let _this=this;
                let params=Object.assign({},params1);
                //获取打印模板
                let printModelID='';
                if(type==0){
                    //不带扣重
                  printModelID=_this.gbGlobConf.commonConf.lsConf.print.nonkzTemplate.id;
                }else if(type==1){
                    //代扣重
                    printModelID=_this.gbGlobConf.commonConf.lsConf.print.kzTemplate.id;
                }else if(type==2){
                    //电子磅单
                    printModelID=_this.gbGlobConf.commonConf.lsConf.print.imgTemplate.id;
                }
                let  model= await  _this.asyncFunc({
                            url:'api/services/app/singleTable76/getMainObjectForEdit',
                            method:'post',
                            data:{
                                queryConditionItem:[
                                                    {dataField:"Id",op:'EQ',dataValue:printModelID}
                                                ],
                            }
                        },'获取打印模板信息');   
               
                if(model.order!=null){
                    const printConf=JSON.parse(util.deepCopy(model.order.v_Col24),util.dealFunction).printConf;
                    //获取对象
                    let  result= await  _this.asyncFunc({
                                url:_this.apiList.lSApiConf.getMainObjectForEdit,
                                method:'post',
                                data:{
                                    queryConditionItem:[
                                                        {dataField:"OrgId",op:'EQ',dataValue:_this.getUserInfo().user.manageOrgId},
                                                        {dataField:"Id",op:'EQ',dataValue:params.id}
                                                    ],
                                }
                            },'获取磅单对象信息');    
                    printConf.content.dataModel=result; 
                    let LODOP=getLodop();
                    //打印
                    if(printConf.eventConf!=undefined){
                                    if(printConf.eventConf.isOn){
                                        printConf.eventConf.event(printConf.content,_this,LODOP);
                                    }
                        }
                    LODOP.PREVIEW();
                }else{
                    this.$message('未配置打印模板！')
                }
       },
        _weightMZ(){
            //称毛重
                this.$emit('getDbData');
                let Num=Number(this.dbData.Num).getToFixed(this.gbGlobConf.commonConf.baseConf.gbFloatLength.jzl);
                if(Num==='NaN'){
                    this.formModel.order.d_Col36=0;
                }else{
                    this.formModel.order.d_Col36=Num;
                }
            },
        _weightPZ(){
            //称皮重
             this.$emit('getDbData');
             let Num=Number(this.dbData.Num).getToFixed(this.gbGlobConf.commonConf.baseConf.gbFloatLength.jzl);
                if(Num==='NaN'){
                    this.formModel.order.d_Col37=0;
                }else{
                    this.formModel.order.d_Col37=Num;
                }
            },
        _getcameraImg(orderid=""){
             this.$emit('getcameraListImg');
             //给formModel明细给值
             this.cameraList.list.map((item)=>{
                 let i={};
                 i.iV_Col6=item.Base64;
                 i.Orgid=this.getUserInfo().user.manageOrgId;
                  if(item.info!=undefined){
                    i.itemDataId=item.info.id;
                     i.iV_Col5=item.info.v_Col7;
                    i.iV_Col3=item.info.v_Col8;
                  }
                 if(orderid!==""){
                    i.orderId=orderid;   
                     i.iV_Col4='出场'; 
                 }else{
                    i.iV_Col4='入场';
                 }
                 this.formModel.items.push(i);
             })
        },   
        _resetFormModel(){
                let  model=this.formModel.order;
                for(let item in model)
                { 
                        if(typeof model[item]==="string"){
                            model[item]="";
                        }else if(typeof model[item]==="number"){
                            model[item]=0;
                        }else if(typeof model[item]==="boolean"){
                            model[item]=false;
                        }else{
                        }
                }
                //处理items
                if(this.formModel.items){
                    this.formModel.items=[];
                }
          },
        _resetFunc(){
                this._resetFormModel();
                this.selectRows=[];
                this._reload();
                
         }, 
         _kouDunBlur(){
            if(this.formModel.order.d_Col40===''){
                this.formModel.order.d_Col40=0;
            }
            if(this.formModel.order.d_Col39!=''){
                this.formModel.order.d_Col39=0;
            }
         },
        _kouRate(){
             if(this.formModel.order.d_Col39===''){
                this.formModel.order.d_Col39=0;
              }
              if(this.formModel.order.d_Col40>0){
                  this.formModel.order.d_Col39=0;
              }
         },
        _currentChange(val){
                //单选时的方法
                if(val!=null){
                     this.selectRows=[];
                     this.selectRows.push(val);
                     //赋值当前数据
                     let dataModel={};
                     dataModel.order=val;
                     if(!dataModel.order.b_Col27){
                        this._assignmentModel(dataModel);
                     }
                }
         },
        _btnState(){
             this.cancelBtnState=true;
             this.saveBtnState=false;
                if(this.selectRows.length>0){
                    if(!this.selectRows[0].b_Col27){
                        //未出场
                        this.cancelBtnState=false;
                        this.saveBtnState=true;
                    }else{
                        this.cancelBtnState=true;
                        this.saveBtnState=false;
                    }
                }
                else{
                    if(!this.formModel.order.b_Col27&&this.formModel.order.id!==''){
                        //未出场
                        this.cancelBtnState=false;
                        this.saveBtnState=true;
                    }else{
                        this.cancelBtnState=true;
                        this.saveBtnState=false;
                    }
                }
         },
        _reload(){

            this.selectRows=[];
            this._getDataPageList();
            this._btnState();
         },
        _backOrder(){
            //是否称皮重
           
         },
        async  _assignmentModel(model){
            //给表单赋值
            //重置表单
            this._resetFormModel();
            let dataModel=util.deepCopy(model);
            if(dataModel.order.id!==''){
                  //已进场未出场 进行出场过磅
                  this.formModel.order=Object.assign(this.formModel.order,dataModel.order);
            }
            this._btnState();
         },
        async _getDataPageList(){
             let _this=this;
            //获取磅单列表信息
            _this.mainTableLoading=true;
            let inputArr=[{key:"OrgId",op:'EQ',value:_this.getUserInfo().user.manageOrgId},
                           {key:"OrderDataType",op:'EQ',value:0},
                           {key:"B_Col29",op:'EQ',value:0}];
             this.mainInput.addqueryConditionItem(inputArr);
             this.mainInput.inputModel.sorting="V_Col18 desc";
             let  result= await  _this.asyncFunc({
                            url:_this.apiList.lSApiConf.getMainPageList,
                            method:'post',
                            data:this.mainInput.inputModel
                        },'获取磅单列表信息');
              _this.tableData=result; 
              _this.mainTableLoading=false;                            
         },
        async  _importWight(){
            let _this=this;
            _this._weightMZ();
            if(_this._validatorFelids(1)){
            //进场称重
            _this.importLoading=true;
            
            //抓拍
            this._getcameraImg();
            //处理数据
            _this.formModel.order.orderDataType='0';
            _this.formModel.order.i_Col6=0;
            _this.formModel.order.isAudit=1;
            _this.formModel.order.b_Col29=0;
            _this.formModel.order.b_Col30=0;
            _this.formModel.order.orgId=_this.getUserInfo().user.manageOrgId;
            _this.formModel.order.v_Col16=this.formatDate(new Date(),"YYYY-MM-DD HH:mm:ss");
            _this.formModel.order.v_Col18=this.formatDate(new Date(),"YYYY-MM-DD HH:mm:ss");
            _this.formModel.order.orderDate=this.formatDate(new Date(),"YYYY-MM-DD");
            _this.formModel.order.orgName=this.getUserInfo().user.manageOrgName;
            if(!_this.formModel.order.b_Col28){
                //称皮
                 _this.formModel.config.isGenerateCode=false;
                _this.formModel.order.b_Col27=false;
            }else{
                 //不称皮
                 _this.formModel.config.isGenerateCode=true;


                     //判断皮重毛重
                 if(_this.formModel.order.d_Col36<_this.formModel.order.d_Col37){
                    let num=_this.formModel.order.d_Col36;
                    _this.formModel.order.d_Col36=_this.formModel.order.d_Col37;
                    _this.formModel.order.d_Col37=num;
                 }
               
                  _this.formModel.order.b_Col27=true;
                  _this.formModel.order.v_Col17=this.formatDate(new Date(),"YYYY-MM-DD HH:mm:ss");
                  _this.formModel.order.d_Col40=_this.computedKoudun;
                  _this.formModel.order.d_Col42=_this.computedjingWeight;


            }
             //保存数据
             let  result= await  _this.asyncFunc({
                                                url:_this.apiList.lSApiConf.createOrUpdateMainObject,
                                                method:'post',
                                                data:this.formModel
                                            },'保存磅单信息');
             if(result===null){
                _this._resetFormModel();
                _this._reload()
                _this.$notify({
                        title: '成功',
                        message: '进场称重成功！',
                        type: 'success'
                        });
             }
            _this.importLoading=false;
           }
         },
       
        async _exportWight(){
            //出场称重
            let _this=this;
            _this._weightPZ();
             if(_this._validatorFelids(2)){
            _this.exportLoading=true;
            //抓拍
            this._getcameraImg(_this.formModel.order.id);

              //判断皮重毛重
            if(_this.formModel.order.d_Col36<_this.formModel.order.d_Col37){
                let num=_this.formModel.order.d_Col36;
                _this.formModel.order.d_Col36=_this.formModel.order.d_Col37;
                _this.formModel.order.d_Col37=num;
            }


            //处理数据
            _this.formModel.config.isGenerateCode=true;
            _this.formModel.order.v_Col17=_this.formatDate(new Date(),"YYYY-MM-DD HH:mm:ss");
            _this.formModel.order.v_Col18=this.formatDate(new Date(),"YYYY-MM-DD HH:mm:ss");
            _this.formModel.order.b_Col27=true;
            _this.formModel.order.d_Col40=_this.computedKoudun;
            _this.formModel.order.d_Col43=_this.computedjingWeight;
            _this.formModel.order.d_Col42=_this.computedjingWeight;
          
            _this.formModel.order.orgName=this.getUserInfo().user.manageOrgName;
            //保存数据
             let  result= await  _this.asyncFunc({
                                                    url:_this.apiList.lSApiConf.createOrUpdateMainObject,
                                                    method:'post',
                                                    data:this.formModel
                                                },'保存磅单信息');
             if(result===null){
                _this.$notify({
                        title: '成功',
                        message: '出场称重成功！',
                        type: 'success'
                    });
                _this._resetFormModel();
                _this._reload()    
             }
            _this.exportLoading=false;
           }
         },
        async _canelImportWight(){
            //取消入场
            if(this.formModel.order.id!==''&&!this.formModel.order.b_Col27){
                //删除磅单
                this.$confirm('确认要取消当前磅单进场吗?', '提示', {
                type: 'warning'
                }).then(async() => {
                 let  result= await  this.asyncFunc({
                                                    url:this.apiList.lSApiConf.deleteMainObject,
                                                    method:'post',
                                                    data:{id:this.formModel.order.id}
                                                },'取消临时磅单');
                                             
                    if(result===null){
                            this._resetFormModel();
                            this._reload();
                            this.$notify({
                                    title: '成功',
                                    message: '取消磅单进场成功！',
                                    type: 'success'
                                    });
                        }
                }).catch(()=>{});;
            }
         },
       _displayKeyboard(){
           //alert('此处显示车牌输入组件')
        },
        async _carNumDell(){
            let _this=this;
                //称皮重
                let  dataModel= await  _this.asyncFunc({
                            url:_this.apiList.lSApiConf.getMainObjectForEdit,
                            method:'post',
                            data:{
                                queryConditionItem:[
                                                    {dataField:"OrgId",op:'EQ',dataValue:_this.getUserInfo().user.manageOrgId},
                                                    {dataField:"V_Col11",op:'EQ',dataValue:_this.formModel.order.v_Col11}
                                                ],
                                sorting:'V_Col16 desc'
                            }
                        },'获取磅单对象信息');  
                 if(dataModel.order!==null){
                   if(!dataModel.order.b_Col27){
                       //进场未出场
                        this.formModel.order=Object.assign(this.formModel.order,dataModel.order) ;
                        this._btnState();
                   }
                }    
        },
       _carNumSel(){
           //车牌选择事件
           this._carNumDell();
        },
       _carNumChange(){
           //车牌失去焦点事件
           this._carNumDell();
        },

   },
   mounted(){
       //加载配置
       //this._getModuleConf();
      //获取磅单表信息
      this._getDataPageList();
   },
   activated(){
   },
   watch:{
   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css" rel="stylesheet/css" scoped>
.gbpt .editor{height:120px}
.gbpt .editor .formStyle{margin:5px 10px 0px 0px}
.gbpt .formStyle .el-row .el-form-item{margin-bottom:3px}
.toolbar{box-sizing: border-box;border:1px #ddd solid;}
.inputtext{width:100%;border:1px solid rgb(191, 203, 217);height:22px;}
</style>
