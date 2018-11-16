s<template>
        <yl-layout class="gbpt">
            <div slot="fristbox" class="editor">
                    <el-form  :model="formModel"  ref="formModel" label-width="80px" class="formStyle">
                       <el-row>
                             <el-col :span="6" v-if="isCarNumAutoRead">
                                  <el-form-item label="车牌号" v-clickoutside="_hiddenKeyboard">
                                     <el-col :span="10" >
                                       <el-input 
                                            v-model="carNum"  
                                            class="car-num"
                                            size="small" 
                                            disabled>
                                       </el-input>
                                    </el-col>
                                    <el-col :span="14">
                                        <el-autocomplete style="width:100%" id="keyboard" ref="v_Col11"
                                            :fetch-suggestions="_carNumSearch"
                                            placeholder="请输入车牌号"
                                            v-model="formModel.order.v_Col11" 
                                            size="small"    
                                            icon="setting"
                                            :disabled="saveBtnState"
                                            :props="carNumConf.defaultProps"
                                            @select="_carNumSel"
                                            @change.native="_carNumChange"
                                            :on-icon-click="_displayKeyboard">
                                        </el-autocomplete>
                                        <yl-keyboard 
                                            @rmchart="_rmchart" 
                                            @getchart="_getchart"  
                                            :isClose="isClose">
                                        </yl-keyboard>
                                    </el-col>
                                </el-form-item> 
                              </el-col>
                              <el-col :span="6" v-else>
                                  <el-form-item label="车牌号" v-clickoutside="_hiddenKeyboard">
                                     <el-autocomplete style="width:100%" id="keyboard" ref="v_Col11"
                                            :fetch-suggestions="_carNumSearch"
                                            placeholder="请输入车牌号"
                                            v-model="formModel.order.v_Col11" 
                                            size="small"    
                                            icon="setting"
                                            :disabled="saveBtnState"
                                            :props="carNumConf.defaultProps"
                                            @select="_carNumSel"
                                            @change.native="_carNumChange"
                                            :on-icon-click="_displayKeyboard">
                                        </el-autocomplete>
                                        <yl-keyboard 
                                            @rmchart="_rmchart" 
                                            @getchart="_getchart"  
                                            :isClose="isClose">
                                        </yl-keyboard>
                                </el-form-item> 
                            </el-col>
                        
                            <el-col :span="6">
                                <el-form-item label="用料单位" prop="o_Col36">
                                    <yl-commonselect ref="commonselect" 
                                            style="width:100%"
                                            v-model="formModel.order.o_Col36" 
                                            size="small"
                                            placeholder="请选择用料单位"
                                            :initData="labourConf.dataList"
                                            :defaultProps="labourConf.defaultProps"
                                            @clear="formModel.order.v_Col12=''"
                                            @getCurrentNode="_labourChange">
                                      </yl-commonselect> 
                                </el-form-item> 
                            </el-col>

                           <el-col :span="6">
                                <el-form-item label="材料名称" prop="infoNM">
                                     <yl-commonselect ref="commonselect" 
                                            style="width:100%"
                                            v-model="formModel.order.infoNM" 
                                            size="small"
                                            placeholder="请选择材料"
                                            :initData="materialConf.dataList"
                                            :lists="materialConf.lists"
                                            :defaultProps="materialConf.defaultProps"
                                            @clear="formModel.order.infoName=''"
                                            @getCurrentNode="_materialChange">
                                      </yl-commonselect> 
                                </el-form-item> 
                           </el-col>

                           <el-col :span="6">
                                <el-form-item label="规格|辅单位" >
                                     <el-col :span="18">
                                       <el-input v-model="formModel.order.infoModel"  size="small" :readonly="true"></el-input>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-input v-model="formModel.order.v_Col15"  size="small" :readonly="true"></el-input>
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
                                    <el-form-item label="工号" prop="o_Col37">
                                            <yl-commonselect ref="commonselect" 
                                                style="width:100%"
                                                v-model="formModel.order.o_Col37" 
                                                size="small"
                                                placeholder="请选择工号"
                                                :initData="GHConf.dataList"
                                                :defaultProps="GHConf.defaultProps"
                                                @getCurrentNode="_getGHChange">
                                        </yl-commonselect> 
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
                            <el-col :span="6">
                                    <el-col :span="12">
                                         <el-form-item label="转化率(%)">
                                                     <el-input 
                                                        v-model.number="formModel.order.d_Col38"  
                                                        @blur="_inputCol38" 
                                                        type="number"  
                                                        size="small" :readonly="false">
                                                     </el-input>
                                         </el-form-item> 
                                    </el-col>
                                     <el-col :span="12">
                                         <el-form-item label="主单位">
                                                     <el-input v-model="formModel.order.infoUnit"  size="small" :readonly="true"></el-input>
                                         </el-form-item> 
                                    </el-col>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="6">
                                    <el-form-item label="进场时间" >
                                        <el-input v-model="formModel.order.v_Col16" size="small" :readonly="true"></el-input>
                                    </el-form-item> 
                            </el-col>
                           <el-col :span="6">
                                       <el-form-item label="净重(辅)" >
                                            <el-input 
                                                type="number"
                                                v-model.number="jinZ" 
                                                size="small" 
                                                icon="more"
                                                :on-icon-click="handleIconClick"
                                                :readonly="true"> 
                                            </el-input >
                                          </el-form-item> 
                            </el-col>
                            <el-col :span="12">
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
                                                v-model="formModel.order.b_Col26" 
                                                style="color:red;margin-left:10px" 
                                                :disabled="saveBtnState"
                                                @change="_backOrder"
                                          >是否退料</el-checkbox>
                                           <el-checkbox 
                                                v-model="formModel.order.b_Col28" 
                                                style="color:red;margin-left:10px" 
                                                :disabled="true"
                                                @change="_unCP"
                                           >不称皮重
                                           </el-checkbox>
                                           <el-checkbox 
                                                v-model="formModel.order.b_col33" 
                                                style="color:blue;margin-left:10px" 
                                                :disabled="saveBtnState"
                                          >非混凝土材料</el-checkbox>
                                          <span style="font-size:12px;margin-left:10px">转化率运算：</span>
                                           <el-checkbox 
                                                v-model="isComputations" 
                                                style="color:blue;margin-left:10px" 
                                                @change="_changeText"
                                          >{{isComputationsText}}</el-checkbox>

                                            <el-button  
                                                 style="margin-left:20px"
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
                                            <el-tag type="primary" v-if="!scope.row.b_Col27">未出料</el-tag>
                                            <el-tag type="success" v-else>已出料</el-tag>
                                        </template>

                                        <template slot="backflag" scope="scope">
                                            <el-tag type="primary" v-if="!scope.row.b_Col26">正常</el-tag>
                                            <el-tag type="success" v-else>退料</el-tag>
                                        </template>
                                       <template slot="upload" scope="scope">
                                            <el-tag type="primary" v-if="!scope.row.b_Col30">未上传</el-tag>
                                            <el-tag type="success" v-else>已上传</el-tag>
                                        </template>

                                         <template slot="bdstate" scope="scope">
                                            <el-tag type="primary" v-if="_getdbstate(scope.row)">正常</el-tag>
                                            <el-tag type="danger" v-else>异常</el-tag>
                                        </template>
                                        
                                        <template slot="print" scope="scope"  > 
                                        <div v-if="scope.row.b_Col27">
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

                                                <el-tooltip 
                                                    effect="dark" 
                                                    :hide-after="0"
                                                    content="打印（带扣重）"
                                                    placement="bottom-start" 
                                                > 
                                                <span class="yl-table-icon" style="margin:0px 5px 0px 5px"  >  
                                                        <i  class="yl-text-color icon-diff-modified"   @click="_printPage(scope.row,1)" ></i>
                                                </span>
                                                </el-tooltip>
                                                <el-tooltip 
                                                effect="dark" 
                                                :hide-after="0"
                                                content="打印（电子磅单）"
                                                placement="bottom-start" 
                                                > 
                                                <span class="yl-table-icon" style="margin:0px 5px 0px 5px"  >  
                                                        <i  class="yl-text-color icon-clipboard2"   @click="_printPage(scope.row,2)" ></i>
                                                </span>
                                                </el-tooltip>
                                                 </div>
                                                <div v-else>
                                                    <el-tag type="primary">未出场暂不打印</el-tag>
                                                </div>
                                        </template>

                                </yl-table>
                        </div>
                    </yl-layout>         
            
            </div>
        </yl-layout>
</template>

<script type="text/babel">
import { getLodop } from '@/common/print/lodop/LodopFuncs'
import  {inputModel} from '@/api/inputmodel';
import { mapGetters,mapActions } from 'vuex';
import util from '@/common/js/util'
import fetch from '@/api/fetch';
export default {
    data(){
        return{
            selectRows:[],
            mainInput:new inputModel(),
            mainTableLoading:false,
            tableData:[],
            carNumConf:{
                dataList:[],
                defaultProps:{
                    label: 'v_Col6',
                    value: 'v_Col6'
                },
             },
            labourConf:{
              defaultProps: {
                        text:"labourName",
                        value:"id"
              },
              dataList:[],
                },
            materialConf:{
              defaultProps: {
                        text:"infoName",
                        value:"id"
              },
              lists:['infoModel','infoUnit'],
              dataList:[],
                },
            GHConf:{
                defaultProps: {
                        text:"ghFullName",
                        value:"id"
              },
              dataList:[],
                },
                
            bakUpData:{
                carNumConf:{},
                labourConf:{},
                materialConf:{},
                GHConf:{}
                },
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
                    b_col33:false,
                    o_Col36:'',
                    o_Col37:'',
                    oriStrOrgId:''
                },
                items:[],
                config:{
                    "isGenerateCode":true
                },
                },
            moduleConf:{},
            jinZ:0,
            isComputations:false,
            isComputationsText:'除（默认）',
            isClose:false,
            carNum:'',
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
            default:function(){
                return {}
            }
        },
        cameraList:{
            type:Object,
            default:function(){
                return {}
            }
        },
        icCardData:{
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
        },
        gbIoConf:{
            type:Object,
            default:function(){
                return {}
            }
        }
  },
  computed: {
             isCarNumAutoRead:{
                get(){
                     let carNumRecognite=this.gbGlobConf.commonConf.ccConf.carNumRecognite;
                     if(carNumRecognite){
                         return !carNumRecognite.disabled
                     }else{
                         return false
                     }  
                     
                }
            },
            computedKoudun:{
                get(){
                    //计算扣吨 |(毛重-皮重)|*扣率/100
                  if(Number(this.formModel.order.d_Col40)===0){
                         let koudun=0;
                         koudun=new Decimal(Math.abs(new Decimal(this.formModel.order.d_Col36).sub(this.formModel.order.d_Col37))).mul(new Decimal(this.formModel.order.d_Col39).div(100));
                         return koudun.toNumber().getToFixed(this.gbGlobConf.commonConf.baseConf.gbFloatLength.jzl);
                   }else{
                       return  this.formModel.order.d_Col40.getToFixed(this.gbGlobConf.commonConf.baseConf.gbFloatLength.jzl);
                   }
                  
                }
            },
           computedjingWeight:{
                get(){  //辅单位净重
                       //计算净重 |(毛重-皮重)|-扣吨
                      let jz= new Decimal(Math.abs(new Decimal(this.formModel.order.d_Col36).sub(this.formModel.order.d_Col37))).sub(this.formModel.order.d_Col40);
                        if(this.formModel.order.b_Col26){
                            jz=new Decimal(0).minus(jz);
                        }
                        return jz.toNumber().getToFixed(this.gbGlobConf.commonConf.baseConf.gbFloatLength.jzl);
                }
             },
            computedjingWeight2:{
                get(){ //主单位净重
                       let jz= new Decimal(Math.abs(new Decimal(this.formModel.order.d_Col36).sub(this.formModel.order.d_Col37))).sub(this.formModel.order.d_Col40);
                        if(this.formModel.order.b_Col26){
                           jz=new Decimal(0).minus(jz);
                        }
                        if(this.isComputations){
                            //乘法
                             if(this.formModel.order.d_Col38>0){
                                    return jz.mul(this.formModel.order.d_Col38).toNumber().getToFixed(this.gbGlobConf.commonConf.baseConf.gbFloatLength.jzl);
                             }else{
                                    return jz.toNumber().getToFixed(this.gbGlobConf.commonConf.baseConf.gbFloatLength.jzl);
                             }
                        }else{
                            //除法
                            if(this.formModel.order.d_Col38>0){
                                return jz.div(this.formModel.order.d_Col38).toNumber().getToFixed(this.gbGlobConf.commonConf.baseConf.gbFloatLength.jzl);
                            }else{
                                return jz.toNumber().getToFixed(this.gbGlobConf.commonConf.baseConf.gbFloatLength.jzl);
                            }
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
                                {attr: { headerAlign:"center",prop: 'id', label: '打印', width:120,scopedSlot: 'print'} },
                                {attr: { prop: 'b_Col27', label: '状态', width:80,scopedSlot: 'flag'} },
                                {attr: { prop: 'v_Col11', label: '磅单状态', width:80,scopedSlot: 'bdstate'} },     
                                {attr: { prop: 'orderCode', label: '磅单号', width:120,} },   
                                {attr: { prop: 'v_Col11', label: '车牌号', width:120,  } },
                                {attr: { prop: 'v_Col12', label: '用料单位名称', width:120, } },
                                {attr: { prop: 'infoName', label: '材料名称', width:120,  } },   
                                {attr: { prop: 'infoModel', label: '规格型号', width:150,  } },   
                                {attr: { prop: 'infoUnit', label: '主单位', width:80,  } },
                                 {attr: { prop: 'v_Col15', label: '辅单位', width:80,  } },    
                                {attr: { prop: 'd_Col36', label: '毛重', width:80, } },
                                {attr: { prop: 'd_Col37', label: '皮重', width:80, } },
                                {attr: { prop: 'd_Col40', label: '扣吨', width:80, } },
                                 {attr: { prop: 'd_Col43', label: '净重(主)', width:80, } },
                                {attr: { prop: 'd_Col42', label: '净重(辅)', width:80, } },
                                 {attr: { prop: 'd_Col38', label: '转化率', width:80,  } },   
                                {attr: { prop: 'v_Col16', label: '进场时间', width:120,  } }, 
                                {attr: { prop: 'v_Col17', label: '出场时间', width:120,  } }, 
                                {attr: { prop: 'v_Col13', label: '工号', width:100,  } }, 
                                {attr: { prop: 'b_Col26', label: '是否退料', width:80,scopedSlot: 'backflag'} }, 
                                {attr: { prop: 'b_Col30', label: '上传状态', width:80,scopedSlot: 'upload'} },  
                                {attr: { prop: 'maker', label: '制单人', width:100, } },
                                {attr: { prop: 'orderRemark', label: '备注信息',  } },
                            ]
                        }
                    }
                },
                 ...mapGetters(['getGlobString1' ]),
        },
   methods:{
        ...mapActions(['setGlobString1']),
        _inputCol38(){
           if(!this.formModel.order.d_Col38){
               this.formModel.order.d_Col38=1
           }
       },
        _displayKeyboard(){
            this.isClose=!this.isClose;
        },
        _hiddenKeyboard(e){
             this.isClose=false;
        },
        _getdbstate(rows){
            if(rows.v_Col25==rows.v_Col11){
                return this.isCarNumAutoRead;
            }else{
                 return !this.isCarNumAutoRead;
            }
        },
        _rmchart(){
            if(!this.$refs.v_Col11.disabled){
                this.$refs.v_Col11.handleFocus();
                if(this.formModel.order.v_Col11.length>0)
                this.formModel.order.v_Col11=this.formModel.order.v_Col11.substring(0,this.formModel.order.v_Col11.length-1);
                this._carNumChange();
            }
        },  
        _getchart(chart){
            if(!this.$refs.v_Col11.disabled){
                this.$refs.v_Col11.handleFocus();
                this.formModel.order.v_Col11=this.formModel.order.v_Col11+chart;
                this._carNumChange();
            }
        },
       _changeText(a,b){
            if(this.isComputations){
                this.isComputationsText='乘法';
                }
                else{
                    this.isComputationsText='除法（默认）';
                }
            },
        _validatorFelids(type=1){
          //字段校验验证
            if(type===1){
                if(this.formModel.order.d_Col36<=0){
                    this.$message({ message: '进场重量必须大于0！',type: 'warning'});
                    return false;
                }
                if(this.formModel.order.v_Col11==''){
                            this.$message({ message: '请填写车牌信息！',type: 'warning'});
                            return false;
                        }
               
                if(this.formModel.order.b_Col28){
                        //不称皮重
                         if(this.formModel.order.infoName==''){
                            this.$message({ message: '请填写材料信息！',type: 'warning'});
                            return false;
                        }
                        if(this.formModel.order.v_Col12==''){
                            this.$message({ message: '请填写用料单位信息！',type: 'warning'});
                            return false;
                        }
                }
            }
            if(type===2){
                if(this.formModel.order.d_Col37<=0){
                    this.$message({ message: '出场重量必须大于0！',type: 'warning'});
                    return false;
                }
                 if(this.formModel.order.v_Col11==''){
                    this.$message({ message: '请填写车牌信息！',type: 'warning'});
                    return false;
                }
                if(this.formModel.order.infoName==''){
                    this.$message({ message: '请填写材料信息！',type: 'warning'});
                    return false;
                }
                if(this.formModel.order.v_Col12==''){
                    this.$message({ message: '请填写用料单位信息！',type: 'warning'});
                    return false;
                }
            }
            return true
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
                //给所有控件赋初始值
                this.jinZ=0;
                this.selectRows=[];
                
          },
        _resetFunc(){
                this._initCompoentData();
                this._resetFormModel();
                 //清除控件
                this._clearCarNum(true);
                this._reload();
         }, 
          handleIconClick(){
              //计算辅单位净重
            this.$emit('getDbData');
             let kd=this.formModel.order.d_Col40;
             if(this.formModel.order.id===''){
                 if(!this.formModel.order.b_Col28){
                         //陈皮
                        this.$message({ message: '请先入场称重！',type: 'warning'});
                 }
                 else{
                     //不陈皮
                   if(kd===0){
                        kd=new Decimal(Math.abs(new Decimal(this.formModel.order.d_Col37).sub(this.dbData.Num))).mul(this.formModel.order.d_Col39).div(100);
                    }
                    this.jinZ=Math.abs(new Decimal(this.formModel.order.d_Col37).sub(this.dbData.Num))-kd;
                 }
             }else{
                   if(kd===0){
                        kd=new Decimal(Math.abs(new Decimal(this.formModel.order.d_Col36).sub(this.dbData.Num))).mul(this.formModel.order.d_Col39).div(100);
                    }
                  this.jinZ=Math.abs(new Decimal(this.formModel.order.d_Col36).sub(this.dbData.Num))-kd;
             }
             if(this.formModel.order.b_Col26){
                           this.jinZ=0-this.jinZ;
             }
             this.jinZ=Number(this.jinZ).getToFixed(this.gbGlobConf.commonConf.baseConf.gbFloatLength.jzl);
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
        _initCompoentData(){
                this.carNumConf=util.deepCopy(this.bakUpData.carNumConf);
                this.supplierConf=util.deepCopy(this.bakUpData.supplierConf);
                this.materialConf=util.deepCopy(this.bakUpData.materialConf);
                this.LcConf=util.deepCopy(this.bakUpData.LcConf);
         },
        _backOrder(){
            //退料事件
            //数据初始化
         },
        async _printPage(params1,type){
                let _this=this;
                let params=Object.assign({},params1);
                //获取打印模板
                let printModelID='';
                if(type==0){
                    //不带扣重
                  printModelID=_this.gbGlobConf.commonConf.ccConf.print.nonkzTemplate.id;
                }else if(type==1){
                    //代扣重
                    printModelID=_this.gbGlobConf.commonConf.ccConf.print.kzTemplate.id;
                }else if(type==2){
                    //电子磅单
                    printModelID=_this.gbGlobConf.commonConf.ccConf.print.imgTemplate.id;
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
                                url:_this.apiList.cCApiConf.getMainObjectForEdit,
                                method:'post',
                                data:{
                                    queryConditionItem:[
                                                        {dataField:"OrgId",op:'EQ',dataValue:_this.getUserInfo().user.manageOrgId},
                                                        {dataField:"Id",op:'EQ',dataValue:params.id},
                                                    ],
                                }
                            },'获取磅单对象信息');  
                    if(result==null){
                        result=_this.formModel;
                    }  
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
        async  _assignmentModel(model){
            //给表单赋值
            //重置表单
            this._resetFormModel();
            let dataModel=util.deepCopy(model);
            if(dataModel.order.id===''){
                //IC卡赋值
                  let  result= await  this.asyncFunc({
                                                    url:this.apiList.cCApiConf.getMainObjectForEdit,
                                                    method:'post',
                                                    data:{
                                                        queryConditionItem:[
                                                            {dataField:"OrgId",op:'EQ',dataValue:_this.getUserInfo().user.manageOrgId},
                                                            {dataField:"OrderDataType",op:'EQ',dataValue:4,relation:"or"},
                                                            {dataField:"OrderDataType",op:'EQ',dataValue:3},
                                                            {dataField:"IsDeleted",op:'EQ',dataValue:0},
                                                            {dataField:"V_Col11",op:'EQ',dataValue:_this.formModel.order.v_Col11}
                                                        ],
                                                        sorting:'V_Col16 desc'
                                                    }
                                                },'获取磅单对象信息');                                              
                if(result.order!=null){
                        if(result.order.b_Col27){
                            //已出场 加载IC卡数据
                            this.formModel.order=Object.assign(this.formModel.order,dataModel.order) ;
                        }else{
                            //已进场未出场   加载选中数据
                            this.formModel.order=Object.assign(this.formModel.order,result.order) ;
                        }   
                }else{
                        //没有当前车辆信息 加载IC卡信息
                       // this.formModel.order=Object.assign(this.formModel.order,dataModel.order) ;
                } 
            }else{
                    //已进场未出场 进行出场过磅
                    this.formModel.order=Object.assign(this.formModel.order,dataModel.order) ;
            }
            this._btnState();
         },
        async _getDataPageList(){
             let _this=this;
            //获取磅单列表信息
            _this.mainTableLoading=true;
             let inputArr=[{key:"OrgId",op:'EQ',value:_this.getUserInfo().user.manageOrgId},
                           {key:"OrderDataType",op:'EQ',value:4,relation:"or"},
                           {key:"OrderDataType",op:'EQ',value:3},
                           {key:"B_Col29",op:'EQ',value:0},
                           {key:"IsDeleted",op:'EQ',value:0}];

             this.mainInput.addqueryConditionItem(inputArr);
             this.mainInput.inputModel.sorting="V_Col18 desc";
             let  result= await  _this.asyncFunc({
                            url:_this.apiList.cCApiConf.getMainPageList,
                            method:'post',
                            data:this.mainInput.inputModel
                        },'获取磅单列表信息');
              _this.tableData=result; 
              _this.mainTableLoading=false;                            
         },
          _uploadData(dataModel){ 
            let _this=this;
                //请求前拦截
                let gbrow = util.deepCopy(dataModel);
                let updateRow=util.deepCopy(dataModel);
                 let cCBeforeEvent=_this.gbIoConf.module.upload.cc.interceptEvent.beforeUplod;
                let cCAfterEvent=_this.gbIoConf.module.upload.cc.interceptEvent.afterUplod;
                if(cCBeforeEvent.isOn){
                let params=cCBeforeEvent.event(gbrow,_this);
                fetch(params.apiData,params.token).then(function(data) {
                            if(cCAfterEvent.isOn){
                                let result=cCAfterEvent.event(data,_this);
                                    if(result){
                                        let info = updateRow;
                                        info.order.b_Col30 = 1;
                                        info.config={
                                            isGenerateCode:false
                                            };
                                        info.permissionType=4;
                                        fetch({
                                            url: '/api/services/app/table32Order/createOrUpdateMainObject',
                                            method: 'post',
                                            data: info
                                        }).then(function(data) {
                                        if(data.result){ console.log('更新状态成功！');}
                                        }).catch((err)=>{});
                                }else{
                                    console.log('上传数据失败！');
                                }
                            }
                        }).catch((err)=>{console.log('上传数据异常！'+err);})
                }
        },   
        async  _importWight(){
            //进场称重
            let _this=this;
            //称重
            _this._weightMZ();
            if(_this._validatorFelids(1)){
            _this.importLoading=true;
            //抓拍
            _this._getcameraImg();
            _this.formModel.order.oriBigOrgId=this.gbIoConf.commonConf.orgInfo.orgIdInt;
            _this.formModel.order.oriStrOrgId=this.gbIoConf.commonConf.orgInfo.orgIdStr;
            _this.formModel.permissionType=4;
            //处理数据
            if(this.formModel.order.b_Col26){
                _this.formModel.order.orderDataType='3';
            }else{
                _this.formModel.order.orderDataType='4';
            }
             _this.formModel.order.b_Col27=true;
             _this.formModel.order.v_Col25=_this.carNum;
            _this.formModel.order.orderDataId='';
            _this.formModel.order.i_Col6=0;
            _this.formModel.order.b_Col29=0;
            _this.formModel.order.b_Col30=0;
            _this.formModel.order.orgId=_this.getUserInfo().user.manageOrgId;
            _this.formModel.order.v_Col16=this.formatDate(new Date(),"YYYY-MM-DD HH:mm:ss");
            _this.formModel.order.v_Col18=this.formatDate(new Date(),"YYYY-MM-DD HH:mm:ss");
            _this.formModel.order.orderDate=this.formatDate(new Date(),"YYYY-MM-DD");
            _this.formModel.order.b_Col31=this.isComputations;
            _this.formModel.order.orgName=this.getUserInfo().user.manageOrgName;
            if(!_this.formModel.order.b_Col28){
                //称皮
                _this.formModel.config.isGenerateCode=false;
                _this.formModel.order.b_Col27=false;
                _this.formModel.order.d_Col42=0;
                _this.formModel.order.d_Col43=0;
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
                  _this.formModel.order.d_Col43=_this.computedjingWeight2;
                  _this.formModel.order.d_Col42=_this.computedjingWeight;
                  _this.formModel.order.isAudit=1;
                  _this.formModel.order.orgName=this.getUserInfo().user.manageOrgName;

            }
             //保存数据
             let  result= await  _this.asyncFunc({
                                                url:_this.apiList.cCApiConf.createOrUpdateMainObject,
                                                method:'post',
                                                data:this.formModel
                                            },'保存磅单信息');
             if(result===null){
                       
                        _this.$notify({
                                title: '成功',
                                message: '进场称重成功！',
                                type: 'success'
                                });
                        if(_this.formModel.order.b_Col28){
                            //不称皮
                            //实时上传
                            if(_this.gbGlobConf.commonConf!=undefined){
                                if(_this.gbGlobConf.commonConf.ccConf.upload.realTime){
                                    //先获去数据
                                    let  orderModel= await  _this.asyncFunc({
                                                                        url:_this.apiList.cCApiConf.getMainObjectForEdit,
                                                                            method:'post',
                                                                            data:{
                                                                                queryConditionItem:[
                                                                                                    {dataField:"OrgId",op:'EQ',dataValue:_this.getUserInfo().user.manageOrgId},
                                                                                                    {dataField:"OrderDataType",op:'EQ',dataValue:4,relation:"or"},
                                                                                                    {dataField:"OrderDataType",op:'EQ',dataValue:3},
                                                                                                    {dataField:"IsDeleted",op:'EQ',dataValue:0},
                                                                                                    {dataField:"V_Col11",op:'EQ',dataValue:_this.formModel.order.v_Col11}
                                                                                                ],
                                                                                sorting:'V_Col18 desc'
                                                                            }
                                                                    },'获取磅单信息');
                                    //实时上传
                                    _this._uploadData(orderModel);
                                }
                            }  
                            //打印提示
                                if(_this.gbGlobConf.commonConf===undefined){
                                    _this._printPage(_this.formModel.order,0);
                                }
                                else{
                                    if(_this.gbGlobConf.commonConf.ccConf.print.isPrint){
                                        //打印提示
                                        if(_this.gbGlobConf.commonConf.ccConf.print.isPrintView){
                                            //预览
                                            _this._printPage(_this.formModel.order,_this.gbGlobConf.commonConf.ccConf.print.type);
                                                
                                        }else{
                                            //直接打印
                                            _this._printPage(_this.formModel.order,_this.gbGlobConf.commonConf.ccConf.print.type);
                                        }
                                    }
                                }
                      }
                 _this._resetFormModel();
                 _this._reload();  
             }
                //清除
                this._clearCarNum();
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
            //处理数据
            _this.formModel.permissionType=4;
            _this.formModel.config.isGenerateCode=true;
            //判断皮重毛重
           if(_this.formModel.order.d_Col36<_this.formModel.order.d_Col37){
                    let num=_this.formModel.order.d_Col36;
                    _this.formModel.order.d_Col36=_this.formModel.order.d_Col37;
                    _this.formModel.order.d_Col37=num;
            }
            _this.formModel.order.v_Col17=_this.formatDate(new Date(),"YYYY-MM-DD HH:mm:ss");
            _this.formModel.order.v_Col18=this.formatDate(new Date(),"YYYY-MM-DD HH:mm:ss");
            _this.formModel.order.b_Col27=true;
            _this.formModel.order.b_Col31=this.isComputations;
            _this.formModel.order.d_Col40=_this.computedKoudun;
            _this.formModel.order.d_Col43=_this.computedjingWeight2;
            _this.formModel.order.d_Col42=_this.computedjingWeight;
            _this.formModel.order.isAudit=1;
            _this.formModel.order.orgName=this.getUserInfo().user.manageOrgName;
            //保存数据
             let  result= await  _this.asyncFunc({
                                                    url:_this.apiList.cCApiConf.createOrUpdateMainObject,
                                                    method:'post',
                                                    data:this.formModel
                                                },'保存磅单信息');
             if(result===null){
               
                _this.$notify({
                        title: '成功',
                        message: '出场称重成功！',
                        type: 'success'
                    });
                    //上传数据
                    if(_this.gbGlobConf.commonConf!=undefined){
                        if(_this.gbGlobConf.commonConf.ccConf.upload.realTime){
                            //先获去数据
                            let  orderModel= await  _this.asyncFunc({
                                                        url:_this.apiList.cCApiConf.getMainObjectForEdit,
                                                        method:'post',
                                                        data:{
                                                            queryConditionItem: [{
                                                                dataField: 'Id',
                                                                op: 'EQ',
                                                                dataValue: _this.formModel.order.id
                                                            }],
                                                            sorting: ''
                                                        }
                                                    },'获取磅单信息');
                            //实时上传
                            _this._uploadData(orderModel);
                        }
                    } 
                    //打印提示
                    if(_this.gbGlobConf.commonConf===undefined){
                        _this._printPage(_this.formModel.order,0);
                    }
                    else{
                        if(_this.gbGlobConf.commonConf.ccConf.print.isPrint){
                            //打印提示
                            if(_this.gbGlobConf.commonConf.ccConf.print.isPrintView){
                                //预览
                                 _this._printPage(_this.formModel.order,_this.gbGlobConf.commonConf.ccConf.print.type);
                            }else{
                                //直接打印
                                _this._printPage(_this.formModel.order,_this.gbGlobConf.commonConf.ccConf.print.type);
                               
                            }

                        }
                        _this._resetFormModel();
                        _this._reload() 
                    }
             }
                //清除
              this._clearCarNum();
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
                                                    url:this.apiList.cCApiConf.deleteMainObject,
                                                    method:'post',
                                                    data:{id:this.formModel.order.id,permissionType:4}
                                                },'取消常规磅单');
                                             
                    if(result===null){
                            //清除车牌号
                            this._clearCarNum();
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
        _getGHChange(node){
           if(node[0]!=undefined){
            //工号获取事件
            this.formModel.order.v_Col13=node[0].ghFullName;
            this.formModel.order.v_Col14=node[0].ghName;
            this.formModel.order.v_Col19=node[0].ghCode;
            this.formModel.order.i_Col3=node[0].oriBigId;
            this.formModel.order.v_Col22=node[0].oriStrId;
            }
         },
        _materialChange(node){
            if(node[0]!=undefined){
            //材料信息选择(区分过滤和未过滤)
            let Obj={};
            Obj=node;
            this.formModel.order.infoCode=Obj[0].infoCode;
            this.formModel.order.infoModel=Obj[0].infoModel;
            this.formModel.order.infoName=Obj[0].infoName;
            this.formModel.order.v_Col15=Obj[0].infoSecUnit;
            this.formModel.order.infoUnit=Obj[0].infoUnit;
            this.formModel.order.cId=Obj[0].cId;
            this.formModel.order.classNodeBh=Obj[0].classNodeBh;
            this.formModel.order.b_Col34=Obj[0].sB_Col9;
            if(!this.formModel.order.d_Col38){
                    this.formModel.order.d_Col38=Obj[0].infoSecUnitPreci;
                }
            this.formModel.order.o_Col38=Obj[0].sO_Col15;
            this.formModel.order.i_Col1=Obj[0].oriBigId;
            this.formModel.order.v_Col20=Obj[0].oriStrId;
            this.formModel.order.v_Col23=Obj[0].sV_Col5;
            this.formModel.order.i_Col5=Obj[0].oriBigClassId;
            this.formModel.order.v_Col24=Obj[0].oriStrClassId;
            }
         },
       async _labourChange(node){ 
            //改变供应商的值
            let _this=this;
            if(node[0]!=undefined){
              _this.formModel.order.v_Col12=node[0].labourName;
              _this.formModel.order.i_Col2=node[0].oriBigId;
              _this.formModel.order.v_Col21=node[0].oriStrId;
             }
        },
      
       _unCP(){
         

       },
       async _carNumDell(){
            let _this=this;
            //选择车牌后的逻辑事件
            let  dataModel= await  _this.asyncFunc({
                                            url:_this.apiList.cCApiConf.getMainObjectForEdit,
                                            method:'post',
                                            data:{
                                                queryConditionItem:[
                                                                    {dataField:"OrgId",op:'EQ',dataValue:_this.getUserInfo().user.manageOrgId},
                                                                    {dataField:"OrderDataType",op:'EQ',dataValue:4,relation:"or"},
                                                                    {dataField:"OrderDataType",op:'EQ',dataValue:3},
                                                                    {dataField:"V_Col11",op:'EQ',dataValue:_this.formModel.order.v_Col11}
                                                                ],
                                                sorting:'V_Col18 desc'
                                            }
                                        },'获取磅单对象信息'); 
            //非退料情况 
            if(!this.formModel.order.b_Col26){

                    //已有历史数据
                    if(dataModel.order!==null){
                            //判断上次出场时间是否大于车的时间间隔
                            if(dataModel.order.v_Col17){
                                let carObj=this.bakUpData.carNumConf.dataList.filter(i=>{
                                    return i.v_Col6===this.formModel.order.v_Col11;
                                })
                                let resultTime='';
                                let nowDate=_this.formatDate(new Date(),"YYYY-MM-DD HH:mm:ss");
                                if(carObj[0].i_Col2){
                                    //先从车辆信息中判断
                                         resultTime=this.moment()(dataModel.order.v_Col17).add(carObj[0].i_Col2, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                                }else if(_this.gbGlobConf.commonConf.baseConf.carConf.frequency){
                                        //从配置中判断
                                       let configitme=_this.gbGlobConf.commonConf.baseConf.carConf.frequency;
                                        resultTime=this.moment()(dataModel.order.v_Col17).add(configitme, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                                }

                                if(resultTime!=''){
                                    if(resultTime>nowDate){
                                        //不能入场
                                        _this.formModel.order.v_Col11='';
                                        _this.$message.warning('当前车辆下次入场时间为【'+resultTime+'】以后！');
                                    }else{
                                        this._initData(dataModel);
                                    }
                                }else{
                                     this._initData(dataModel);
                                }
                            }
                            else{
                                 this._initData(dataModel);
                            }
                    }
            }
            else{
                    //退料情况
                    if(dataModel.order!==null){
                        if(!dataModel.order.b_Col27){
                            this.formModel.order=Object.assign(this.formModel.order,dataModel.order) ;
                            this._btnState();
                        }   
                    }
                   
            }

            //判断是否陈皮
            if(this.formModel.order.id==''){
                        this._getPZ();
                    }
            
        },
        _initData(dataModel){
            //给表单赋值
            if(dataModel.order.b_Col27){
                //已出场 选中当前行数据为默认项
                //处理数据
                dataModel.order.id="";
                dataModel.order.b_Col27=false;
                dataModel.order.b_Col26=false;
                dataModel.order.b_Col33=false;
                dataModel.order.b_Col42=0;
                dataModel.order.d_Col36=0;
                dataModel.order.d_Col37=0;
                dataModel.order.d_Col39=0;
                dataModel.order.d_Col40=0;
                dataModel.order.d_Col42=0;
                dataModel.order.v_Col16='';
                dataModel.order.v_Col17='';
                dataModel.order.orderDate='';
                dataModel.order.orderCode='';
                dataModel.order.orderRemark='';
                delete dataModel.order.creationTime;
                delete dataModel.order.creatorUserId;
                delete dataModel.order.creatorUserName;
            }
            this.formModel.order=Object.assign(this.formModel.order,dataModel.order) ;
            this._btnState();
        },

        _getPZ(){
            //判断是否称皮
            let carObj=this.bakUpData.carNumConf.dataList.filter(i=>{
                return i.v_Col6===this.formModel.order.v_Col11;
            })
            if(!carObj[0].b_Col17){
                //不称皮重
                this.formModel.order.b_Col28=true;
                this.formModel.order.d_Col37=carObj[0].d_Col20|0;
            }else{
                this.formModel.order.b_Col28=false;
                this.formModel.order.d_Col37=0;
            }
        },
       _carNumSel(){
           //车牌选择事件
           this._carNumDell();
        },
       _carNumChange(){
         
            if(this.formModel.order.v_Col11.length===7){
                    //车牌失去焦点事件
                    this._carNumDell();
                        //判断是否加载车牌号
                    this._autoAddCarNum();
            }
        },
        async _autoAddCarNum(){
             var cPattern = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
            if(cPattern.test(this.formModel.order.v_Col11)){
               //查询是否有该车牌
                let _this=this;
                     //选择车牌后的逻辑事件
                      let  dataModel= await  _this.asyncFunc({
                                                    url:_this.apiList.carNumApiConf.getMainObjectForEdit,
                                                    method:'post',
                                                    data:{
                                                        queryConditionItem:[
                                                                            {dataField:"OrgId",op:'EQ',dataValue:_this.getUserInfo().user.manageOrgId},
                                                                            {dataField:"V_Col6",op:'EQ',dataValue:_this.formModel.order.v_Col11}
                                                                        ],
                                                        sorting:''
                                                    }
                                                },'获取车牌信息');  
                    if(dataModel.order===null){
                              //是否要加入车牌维护列表
                             let  result= await  this.asyncFunc({
                                                                url:this.apiList.carNumApiConf.createOrUpdateMainObject,
                                                                method:'post',
                                                                data:{
                                                                    order:{
                                                                    orgId:_this.getUserInfo().user.manageOrgId,
                                                                    v_Col6:_this.formModel.order.v_Col11,
                                                                    b_Col17:1,
                                                                }}
                                                            },'添加车牌');

                            // 添加提示
                            this.$message.success('添加车牌为：【'+_this.formModel.order.v_Col11+'】的信息成功！');
                                                            //更新车牌列表
                           _this.carNumConf.dataList= await  _this.asyncFunc({
                                                                        url:_this.apiList.carNumParams,
                                                                        method:'post',
                                                                        data:{
                                                                            queryConditionItem:[
                                                                                                {dataField:"OrgId",op:'EQ',dataValue:_this.getUserInfo().user.manageOrgId,DataFieldTwo:"",TwoFieldRelation:""}
                                                                                            ],
                                                                            sorting:''
                                                                        }   
                                                                    },'获取车牌号列表信息');
                          _this.bakUpData.carNumConf=util.deepCopy(_this.carNumConf);
                    }                            

            }else{
                 this.$message.warning('请输入正确的车牌号!');
            }
        },
       _carNumSearch(queryString,cb){
           //车牌查询
            var restaurants =this.carNumConf.dataList;
            var results = queryString ? restaurants.filter(
                (restaurant) => {
                    return (restaurant.v_Col6.indexOf(queryString) >= 0);
                 }) : restaurants;
            // 调用 callback 返回建议列表的数据
            cb(results);
        },
        _clearCarNum(val){
            this.carNum='';
            if(val){
                this.setGlobString1('');
            }
        },
       async loadComponentData(){
            //初始化控件数据
            let _this=this;
             //获取车牌号列表
              _this.carNumConf.dataList= await  _this.asyncFunc({
                                                    url:_this.apiList.carNumParams,
                                                    method:'post',
                                                    data:{
                                                        queryConditionItem:[
                                                                            {dataField:"OrgId",op:'EQ',dataValue:_this.getUserInfo().user.manageOrgId,DataFieldTwo:"",TwoFieldRelation:""}
                                                                        ],
                                                        sorting:''
                                                    }   
                                                },'获取车牌号列表信息');
            _this.bakUpData.carNumConf=util.deepCopy(_this.carNumConf);    
            //获取用料单位列表信息
             _this.labourConf.dataList= await  _this.asyncFunc({
                                                    url:_this.apiList.commonLabourParams,
                                                    method:'post',
                                                    data:{
                                                        queryConditionItem:[
                                                                            {dataField:"OrgId",op:'EQ',dataValue:_this.getUserInfo().user.manageOrgId,DataFieldTwo:"",TwoFieldRelation:""}
                                                                        ],
                                                        sorting:'SortCode desc'
                                                    }
                                                },'获取用料单位列表信息');  
            _this.bakUpData.labourConf=util.deepCopy(_this.labourConf); 
             //获取材料列表信息
             _this.materialConf.dataList= await  _this.asyncFunc({
                                                            url:_this.apiList.commonMaterialParams,
                                                            method:'post',
                                                            data:{
                                                                queryConditionItem:[
                                                                                    {dataField:"OrgId",op:'EQ',dataValue:_this.getUserInfo().user.manageOrgId,DataFieldTwo:"",TwoFieldRelation:""}
                                                                                ],
                                                                sorting:'SortCode desc'
                                                            }
                                                },'获取常用材料列表信息');
            _this.bakUpData.materialConf=util.deepCopy(_this.materialConf);
            //加载核算工号节点
            let ghData= await  _this.asyncFunc({
                                                url:_this.apiList.gHParams,
                                                method:'post',
                                                data:{
                                                    queryConditionItem:[
                                                                        {dataField:"OrgId",op:'EQ',dataValue:_this.getUserInfo().user.manageOrgId},
                                                                        {dataField:"IsCheck",op:'EQ',dataValue:true}
                                                                    ],
                                                    sorting:''
                                                }
                                                },'获取核算工号信息');
                 _this.GHConf.dataList=ghData;
                 _this.bakUpData.GHConf=util.deepCopy(_this.GHConf);
        },
 
   },
   beforeMount(){
       console.log('出场称重')
        this.setGlobString1('');
   },
   mounted(){
     //加载控件准备数据
    this.loadComponentData();
      //获取磅单表信息
     this._getDataPageList();
   },   
   activated(){
       // this.setGlobString1('');
   },
   beforeDestroy(){
        console.log('出料过磅页面销毁中...') 
   },
   destroyed(){
       
   },
   watch:{
       getGlobString1:function(n,o){
            console.log(n)
           if(n!==''){
               let newVal=util.convertBety(n);
               this.carNum=newVal;  
               
               this.formModel.order.v_Col11=newVal;
               this._carNumChange();

           }
       }
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
