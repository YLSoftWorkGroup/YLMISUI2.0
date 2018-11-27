<template>
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
                                <el-form-item label="供应单位" prop="o_Col36">
                                    <yl-commonselect ref="commonselect" 
                                            style="width:100%"
                                            v-model="formModel.order.o_Col36" 
                                            size="small"
                                            placeholder="请选择供应单位"
                                            :initData="supplierConf.dataList"
                                            :defaultProps="supplierConf.defaultProps"
                                            @clear="formModel.order.v_Col12=''"
                                            @getCurrentNode="_supplierChange">
                                      </yl-commonselect> 
                                </el-form-item> 
                            </el-col>

                           <el-col :span="6">
                                <el-form-item label="物料集" prop="infoNM">
                                     <el-col :span="18">
                                       <!-- <yl-commonselect ref="commonselect" 
                                            style="width:100%"
                                            v-model="formModel.order.infoNM" 
                                            size="small"
                                            placeholder="请选择材料"
                                            :initData="materialConf.dataList"
                                            :lists="materialConf.lists"
                                            :defaultProps="materialConf.defaultProps"
                                            @clear="formModel.order.infoName=''"
                                            @getCurrentNode="_materialChange">
                                      </yl-commonselect>  -->
                                        <yl-dataDictionaryForSel
                                            code="WLJH"
                                            v-model="formModel.order.infoName" 
                                            placeholder="请选择物料集"
                                            clearable
                                            size="small"
                                            @clear="formModel.order.infoName=''"
                                            @getCurrentvalue="_materialChange">
                                        </yl-dataDictionaryForSel>

                                    </el-col>
                                    <el-col :span="6">
                                        <el-input v-model="formModel.order.infoUnit"  size="small" :readonly="true"></el-input>
                                    </el-col>
                                    
                                </el-form-item> 
                           </el-col>

                           <!-- <el-col :span="6">
                                <el-form-item label="规格|辅单位" >
                                     <el-col :span="18">
                                       <el-input v-model="formModel.order.infoModel"  size="small" :readonly="true"></el-input>
                                    </el-col>
                                    <el-col :span="6">
                                        <el-input v-model="formModel.order.v_Col15"  size="small" :readonly="true"></el-input>
                                    </el-col>
                                </el-form-item> 
                           </el-col>       -->
                             <el-col :span="6">
                                    <el-form-item label="料仓" prop="o_Col37">
                                            <yl-commonselect ref="commonselect" 
                                                style="width:100%"
                                                v-model="formModel.order.o_Col37" 
                                                size="small"
                                                placeholder="请选择料仓"
                                                :initData="LcConf.dataList"
                                                :defaultProps="LcConf.defaultProps"
                                                 @clear="_ClearLC"
                                                @getCurrentNode="_getLCChange">
                                        </yl-commonselect> 
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
                                                :readonly="true"> 
                                            </el-input>
                                          </el-form-item> 
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="出场重量" prop="d_Col37" >
                                                <el-input 
                                                    type="number"
                                                    v-model.number="formModel.order.d_Col37" 
                                                    size="small" 
                                                    :readonly="true"> 
                                                </el-input>
                                            </el-form-item> 
                                        </el-col>
                            </el-col>

                           
                            <el-col :span="6">
                                   <el-col :span="12">
                                       <el-form-item label="净重" >
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
                                    <el-form-item label="原始净重" prop="d_Col41">
                                        <el-input 
                                            type="number"
                                            v-model="formModel.order.d_Col41" 
                                            @blur="_inputCol41" 
                                            size="small">

                                        </el-input>
                                            <!-- <el-input v-model="formModel.order.orderRemark" size="small" ></el-input> -->
                                    </el-form-item> 
                                </el-col>
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
                            
                            <!-- <el-col :span="6">
                                    <el-col :span="12">
                                         <el-form-item label="转化率(%)">
                                                     <el-input 
                                                        v-model.number="formModel.order.d_Col38"   
                                                        type="number"  
                                                        size="small" 
                                                        :readonly="false">
                                                     </el-input>
                                         </el-form-item> 
                                    </el-col>
                                     <el-col :span="12">
                                         <el-form-item label="主单位">
                                                     <el-input v-model="formModel.order.infoUnit"  size="small" :readonly="true"></el-input>
                                         </el-form-item> 
                                    </el-col>
                            </el-col> -->

                              <el-col :span="6">
                                    <el-form-item label="进场时间" prop="v_Col16">
                                        <el-input v-model="formModel.order.v_Col16" size="small" :readonly="true"></el-input>
                                    </el-form-item> 
                            </el-col>
                        </el-row>
                        <el-row>
                          
                                <el-col :span="6">
                                    <el-form-item label="加工中心" prop="o_Col61">
                                            <yl-commonselect ref="commonselect" 
                                                style="width:100%"
                                                v-model="formModel.order.o_Col61" 
                                                size="small"
                                                placeholder="请选择钢筋加工中心"
                                                :initData="jgzxConf.dataList"
                                                :defaultProps="jgzxConf.defaultProps"
                                                 @clear="_ClearJgzx"
                                                @getCurrentNode="_getJgzxChange">
                                        </yl-commonselect> 
                                    </el-form-item> 
                            </el-col>
                            <el-col :span="18">
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
                                            <!-- <span style="font-size:12px;margin-left:10px">转化率运算：</span>
                                            <el-checkbox 
                                                    v-model="isComputations" 
                                                    style="color:blue;margin-left:10px" 
                                                    @change="_changeText"
                                            >{{isComputationsText}}</el-checkbox> -->
                                            <span style="font-size:12px;">启用原始净重：</span>
                                            <el-checkbox 
                                                    v-model="formModel.order.b_Col33" 
                                                    style="color:blue;margin-left:10px" 
                                            ></el-checkbox>
                                           <el-button 
                                                style="margin-left:20px"
                                                type="primary" 
                                                size="" 
                                                v-if="isCameraEditShow"
                                                :disabled="isCameraEditDisable"
                                                @click="_openCameraEdit">
                                                <i class="icon-camera"></i>高拍仪拍照
                                           </el-button>


                                           <el-button 
                                                type="danger" 
                                                size="small" 
                                                :disabled="cancelBtnState"
                                                @click="_canelImportWight">
                                                <i class="icon-cancel"></i>取消入场
                                            </el-button>
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
                                            <el-tag type="primary" v-if="!scope.row.b_Col27">未回皮</el-tag>
                                            <el-tag type="success" v-else>已回皮</el-tag>
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

                                        <template slot="breakUp" scope="scope">
                                            <el-button type="info" size="small" @click="_breakUp(scope.row)">分 解</el-button>
                                        </template> 

                                        <template slot="print" scope="scope" > 
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
                                                <el-tag type="primary">未进场暂不打印</el-tag>
                                            </div>
                                        </template>
                                          
                                </yl-table>
                        </div>
                    </yl-layout>         
                         <!--编辑界面-->
                        <el-dialog ref="cameraEdit" :title="'拍照信息'" v-model="openCameraEdit" size="normal"  top="35%" 
                                    :modal-append-to-body="false" :close-on-click-modal="false"  :modal="true"   @close="_closeCamera" >
                                    <cameraEidt  type="dl" :orderModel="selectRows[0]"  v-if="openCameraEdit"></cameraEidt>
                        </el-dialog>

                          <!--分解明细-->
                        <el-dialog ref="cameraEdit" :title="'分解明细'" v-model="openDLFJ" size="normal"  top="35%" 
                                    :modal-append-to-body="false" :close-on-click-modal="false"  :modal="true" >
                                    <DLFJ   :orderModel="selectRows[0]" @closeFJ="_closeFJ"  v-if="openDLFJ"></DLFJ>
                        </el-dialog>
            </div>
        </yl-layout>
</template>

<script type="text/babel">
import { getLodop } from '@/common/print/lodop/LodopFuncs'
import  {inputModel} from '@/api/inputmodel';
import dataDictionaryForSel from '@/ocomponents/datadictionary/dataDictionaryForSel'
import { mapGetters,mapActions } from 'vuex';
import util from '@/common/js/util'
import fetch from '@/api/fetch';
import cameraEidt from './cameraEidt'
import DLFJ from './commonGB_DLFJ'
export default {
  data(){
        return{
            selectRows:[],
            openDLFJ:false,
            openCameraEdit:false,
            isCameraEditDisable:true,
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
            supplierConf:{
              defaultProps: {
                        text:"supplierName",
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
            LcConf:{
                defaultProps: {
                        text:"v_Col10",
                        value:"id"
              },
              dataList:[],
                },
            jgzxConf:{
                defaultProps: {
                        text:"v_Col6",
                        value:"id"
              },
              dataList:[],
                },
            bakUpData:{
                carNumConf:{},
                supplierConf:{},
                materialConf:{},
                LcConf:{},
                jgzxConf:{}
                },
            saveBtnState:false,
            cancelBtnState:true,
            importLoading:false,
            exportLoading:false,
            jinZ:0,
            isClose:false,
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
                    b_Col28:true,
                    b_Col29:false,
                    o_Col36:'',
                    o_Col37:'',
                    o_Col61:'',
                },
                items:[],
                config:{
                    "isGenerateCode":true
                },
             },
            moduleConf:{},
            extensionObj:{},
            // isComputations:false,
            // isComputationsText:'除（默认）',
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
   components:{
       cameraEidt
   },
  computed: {
            isCarNumAutoRead:{
                get(){
                     let carNumRecognite=this.gbGlobConf.commonConf.dlConf.carNumRecognite;
                     if(carNumRecognite){
                         return !carNumRecognite.disabled
                     }else{
                         return false
                     }  
                     
                }
            },
            isCameraEditShow:{
                get(){
                     let speedCamera=this.gbGlobConf.commonConf.dlConf.speedCamera;
                     if(speedCamera){
                         return !speedCamera.disabled
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
                         return new Decimal(koudun).toNumber().getToFixed(this.gbGlobConf.commonConf.baseConf.gbFloatLength.jzl);
                   }else{
                       return new Decimal(this.formModel.order.d_Col40).toNumber().getToFixed(this.gbGlobConf.commonConf.baseConf.gbFloatLength.jzl);
                   }
                }
             },
            computedjingWeight:{
                get(){  //辅单位净重
                       //计算净重 |(毛重-皮重)|-扣吨   辅单位
                       let jz= new Decimal(Math.abs(new Decimal(this.formModel.order.d_Col36).sub(this.formModel.order.d_Col37))).sub(this.formModel.order.d_Col40);
                        if(this.formModel.order.b_Col26){
                           jz=new Decimal(0).minus(jz);
                        }
                        return new Decimal(jz).toNumber().getToFixed(this.gbGlobConf.commonConf.baseConf.gbFloatLength.jzl);
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
                                {attr: { headerAlign:"center",prop: 'id', label: '分解明细', width:90,scopedSlot: 'breakUp'} },   
                                {attr: { prop: 'orderCode', label: '磅单号', width:120,} },   
                                {attr: { prop: 'v_Col11', label: '车牌号', width:120,  } },
                                {attr: { prop: 'v_Col12', label: '供应商名称', width:120, } },
                                {attr: { prop: 'infoName', label: '物料集', width:120,  } },   
                                // {attr: { prop: 'infoModel', label: '规格型号', width:150,  } },   
                                {attr: { prop: 'infoUnit', label: '单位', width:80,  } },  
                                // {attr: { prop: 'v_Col15', label: '辅单位', width:80,  } },    
                                {attr: { prop: 'd_Col36', label: '毛重', width:80, } },
                                {attr: { prop: 'd_Col37', label: '皮重', width:80, } },
                                {attr: { prop: 'd_Col40', label: '扣吨', width:80, } },
                                {attr: { prop: 'd_Col42', label: '净重(辅)', width:80, } },
                                {attr: { prop: 'd_Col41', label: '净重(原始)', width:80, } },
                                {attr: { prop: 'd_Col45', label: '净重(核算)', width:80, } },
                                 {attr: { prop: 'd_Col38', label: '转化率', width:80,  } },   
                                {attr: { prop: 'v_Col16', label: '进场时间', width:120,  } }, 
                                {attr: { prop: 'v_Col17', label: '出场时间', width:120,  } },
                                {attr: { prop: 'v_Col13', label: '料仓', width:100,  } }, 
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
       _inputCol41(){
           if(!this.formModel.order.d_Col41){
               this.formModel.order.d_Col41=0
           }
       },
       _closeCamera(){
           this.openCameraEdit=false;
       },
       _closeFJ(){
           this.openDLFJ=false
       },
       _breakUp(row){
           if(row.b_Col27){
            this.selectRows=[];
            this.selectRows.push(row);
            this.openDLFJ=true;
           }else{
                this.$message({ message: '单据状态未出场！',type: 'warning'});
           }
       },
       _openCameraEdit(){
           this.openCameraEdit=true;
       },
        _ClearLC(){
           this.formModel.order.v_Col13='';
           this.formModel.order.v_Col14='';
           this.formModel.order.o_Col37='';
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
        // _changeText(a,b){
        //     if(this.isComputations){
        //         this.isComputationsText='乘法';
        //         }
        //         else{
        //             this.isComputationsText='除法（默认）';
        //         }
        //     },
       
        async _printPage(params1,type){
                let _this=this;
                let params=Object.assign({},params1);
                //获取打印模板
                let printModelID='';
                if(type==0){
                    //不带扣重
                   printModelID=_this.gbGlobConf.commonConf.dlConf.print.nonkzTemplate.id;
                }else if(type==1){
                    //代扣重
                    printModelID=_this.gbGlobConf.commonConf.dlConf.print.kzTemplate.id;
                }else if(type==2){
                    //电子磅单
                    printModelID=_this.gbGlobConf.commonConf.dlConf.print.imgTemplate.id;
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
                                url:_this.apiList.pTApiConf.getMainObjectForEditAll,
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
        _validatorFelids(type=1){ //1是进场2是出场
            //字段校验验证
            if(this.formModel.order.v_Col11==''){
                this.$message({ message: '请填写车牌信息！',type: 'warning'});
                return false;
            }
            if(this.formModel.order.v_Col12==''){
                this.$message({ message: '请填写供应单位！',type: 'warning'});
                return false;
            }
            if(this.formModel.order.infoName==''){
                this.$message({ message: '请选择物料集！',type: 'warning'});
                return false;
            }
            if(this.formModel.order.b_Col33){
                if(this.formModel.order.d_Col41<=0){
                    this.$message({ message: '原始净重必须大于0（已启用原始净重作为核算净重）',type: 'warning'});
                    return false;
                }
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
            return true;
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
        _uploadData(dataModel){ 
            let _this=this;
                //请求前拦截
                let gbrow = util.deepCopy(dataModel);
                let updateRow=util.deepCopy(dataModel);
                let ptBeforeEvent=_this.gbIoConf.module.upload.pt.interceptEvent.beforeUplod;
                let ptAfterEvent=_this.gbIoConf.module.upload.pt.interceptEvent.afterUplod;
                if(ptBeforeEvent.isOn){
                let params=ptBeforeEvent.event(gbrow,_this);
                fetch(params.apiData,params.token).then(function(data) {
                            if(ptAfterEvent.isOn){
                                let result=ptAfterEvent.event(data,_this);
                                    if(result){
                                        let info = updateRow;
                                        info.order.b_Col30 = 1;
                                        info.config={
                                            isGenerateCode:false
                                            };
                                        info.permissionType=4;    
                                        fetch({
                                            url: '/api/services/app/table31Order/createOrUpdateMainObject',
                                            method: 'post',
                                            data: info
                                        }).then(function(data) {
                                        if(data.result){ 
                                                console.log('更新状态成功！');
                                            }
                                        }).catch((err)=>{});
                                }else{
                                    console.log('上传数据失败！');
                                }
                            }
                        }).catch((err)=>{console.log('上传数据异常！'+err);})
                }
        },   
        _clearCarNum(val){
            console.log('清除中...')
            this.carNum='';
            if(val){
                this.setGlobString1('');
            }
        },
        _resetFormModel(){
                let  model=this.formModel.order;
                for(let item in model)
                { 
                    if(typeof model[item]==="string"){
                        model[item]="";
                    }else if(typeof model[item]==="number"){
                        model[item]=0.0;
                    }else if(typeof model[item]==="boolean"){
                        model[item]=false;
                    }
                }
                //处理items
                if(this.formModel.items){
                    this.formModel.items=[];
                }
                this.jinZ=0;
                this.selectRows=[];
                
            },
        _resetFunc(){
                //给所有控件赋初始值
                this._initCompoentData();
                this._resetFormModel();
                  //清除控件
                this._clearCarNum(true);
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
        handleIconClick(){
            //计算辅单位净重
             this.$emit('getDbData');
             let kd=this.formModel.order.d_Col40;
             if(this.formModel.order.id===''){ 
                 //进料
                  this.$message({ message: '请先入场称重！',type: 'warning'});
             }else{
                  if(kd===0){
                        kd=new Decimal(Math.abs(new Decimal(this.formModel.order.d_Col36).sub(this.dbData.Num))).mul(this.formModel.order.d_Col39).div(100);
                    }
                  this.jinZ=Math.abs(new Decimal(this.formModel.order.d_Col36).sub(this.dbData.Num))-kd;
             }
             if(this.formModel.order.b_Col26){
                   this.jinZ=0-this.jinZ;
             }
              this.jinZ=new Decimal(this.jinZ).toNumber().getToFixed(this.gbGlobConf.commonConf.baseConf.gbFloatLength.jzl);

        },
        _currentChange(val){
                    if(val){
                        this.selectRows=[];
                        this.selectRows.push(val);
                        //赋值当前数据
                        let dataModel={};
                        dataModel.order=val;
                        if(!dataModel.order.b_Col27){
                            this._assignmentModel(dataModel);
                        }
                        this.isCameraEditDisable=false;
                    }else{
                        this.isCameraEditDisable=true;
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
                //this.materialConf=util.deepCopy(this.bakUpData.materialConf);
                this.LcConf=util.deepCopy(this.bakUpData.LcConf);
            },
        _backOrder(){
                //退料事件
                //数据初始化
                // this.formModel.order.b_Col26=true
             
             },
        async  _assignmentModel(dataModel){
                //给表单赋值
                //行选中或者车号过滤赋值
                if(dataModel.order.b_Col27){
                    //已出场 选中当前行数据为默认项
                    //处理数据
                    dataModel.order.id="";
                    dataModel.order.b_Col27=false;
                    dataModel.order.b_Col26=false;
                    dataModel.order.d_Col36=0;
                    dataModel.order.d_Col37=0;
                    dataModel.order.d_Col38=0;
                    dataModel.order.d_Col39=0;
                    dataModel.order.d_Col40=0;
                    dataModel.order.d_Col42=0;
                    dataModel.order.d_Col41=0;
                    dataModel.order.d_Col45=0;
                    dataModel.order.v_Col16='';
                    dataModel.order.v_Col17='';
                    dataModel.order.orderDate='';
                    dataModel.order.orderCode='';
                    dataModel.order.orderRemark='';
                    delete dataModel.order.creationTime;
                    delete dataModel.order.creatorUserId;
                    delete dataModel.order.creatorUserName;
                }
                //已进场未出场 进行出场过磅
                this.formModel.order=Object.assign(this.formModel.order,dataModel.order) ;
                this._btnState();
               
               
            },
        async _getDataPageList(){
             let _this=this;
            //获取磅单列表信息
            _this.mainTableLoading=true;
             let inputArr=[{key:"OrgId",op:'EQ',value:_this.getUserInfo().user.manageOrgId},
                           {key:"OrderDataType",op:'EQ',value:4,relation:"or"},
                           {key:"OrderDataType",op:'EQ',value:3},
                           {key:"V_Col24",op:'EQ',value:'一车多料'},
                           {key:"B_Col29",op:'EQ',value:0},
                           {key:"IsDeleted",op:'EQ',value:0}];
             this.mainInput.addqueryConditionItem(inputArr);
             this.mainInput.inputModel.sorting="V_Col18 desc";
             let  result= await  _this.asyncFunc({
                            url:_this.apiList.pTApiConf.getMainPageList,
                            method:'post',
                            data:this.mainInput.inputModel
                        },'获取磅单列表信息');
              _this.tableData=result; 
              _this.mainTableLoading=false;                            
         },
        async  _importWight(){
            //进场称重
            let _this=this;
             //称重
            _this._weightMZ();
            if(_this._validatorFelids(1)){
            _this.importLoading=true;
            //抓拍
            this._getcameraImg();
            //处理数据
            _this.formModel.config.isGenerateCode=false;
            _this.formModel.permissionType=4;
            if(this.formModel.order.b_Col26){
                _this.formModel.order.orderDataType='3';
            }else{
                _this.formModel.order.orderDataType='4';
            }
            _this.formModel.order.orgId=_this.getUserInfo().user.manageOrgId;
            _this.formModel.order.orderDataId='';
            _this.formModel.order.v_Col24='一车多料';
            _this.formModel.order.v_Col25=this.carNum;
            _this.formModel.order.isAudit=1;
            _this.formModel.order.i_Col6=0;
            _this.formModel.order.b_Col29=0;
            _this.formModel.order.b_Col30=0;
            _this.formModel.order.v_Col16=this.formatDate(new Date(),"YYYY-MM-DD HH:mm:ss");
            _this.formModel.order.v_Col18=this.formatDate(new Date(),"YYYY-MM-DD HH:mm:ss");
            _this.formModel.order.b_Col27=false;
            _this.formModel.order.orderDate=this.formatDate(new Date(),"YYYY-MM-DD");
            _this.formModel.order.d_Col42=0;
            _this.formModel.order.d_Col43=0; 
            _this.formModel.order.oriBigOrgId=this.gbIoConf.commonConf.orgInfo.orgIdInt;
            _this.formModel.order.oriStrOrgId=this.gbIoConf.commonConf.orgInfo.orgIdStr;

             //保存数据
             let  result= await  _this.asyncFunc({
                                                    url:_this.apiList.pTApiConf.createOrUpdateMainObject,
                                                    method:'post',
                                                    data:this.formModel
                                                },'保存磅单信息');
             if(result===null){
                 //清除
                 this._clearCarNum();
                _this._resetFormModel();
                _this._reload();

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
            //处理数据
            _this.formModel.config.isGenerateCode=true;
            _this.formModel.permissionType=4;
            _this.formModel.order.v_Col17=_this.formatDate(new Date(),"YYYY-MM-DD HH:mm:ss");
            _this.formModel.order.v_Col18=this.formatDate(new Date(),"YYYY-MM-DD HH:mm:ss");

            //判断皮重毛重
            if(_this.formModel.order.d_Col36<_this.formModel.order.d_Col37){
                let num=_this.formModel.order.d_Col36;
                _this.formModel.order.d_Col36=_this.formModel.order.d_Col37;
                _this.formModel.order.d_Col37=num;
            }
            
            _this.formModel.order.b_Col27=true;
            _this.formModel.order.d_Col40=_this.computedKoudun;
            _this.formModel.order.d_Col43=_this.computedjingWeight;
            _this.formModel.order.d_Col42=_this.computedjingWeight;
            //存储净重的值
            if(this.formModel.order.b_Col33){
                _this.formModel.order.d_Col45=_this.formModel.order.d_Col41;
            }else{
                _this.formModel.order.d_Col45=_this.formModel.order.d_Col42;
            }
           // _this.formModel.order.b_Col31=this.isComputations;
            _this.formModel.order.orgName=this.getUserInfo().user.manageOrgName;
            //保存数据
             let  result= await  _this.asyncFunc({
                                                    url:_this.apiList.pTApiConf.createOrUpdateMainObject,
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
                    if(_this.gbGlobConf.commonConf.dlConf.upload.realTime){
                           //先获去数据
                         let  orderModel= await  _this.asyncFunc({
                                                    url:_this.apiList.pTApiConf.getMainObjectForEdit,
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
                 //打印
                if(_this.gbGlobConf.commonConf===undefined){
                    _this._printPage(_this.formModel.order,0);
                }
                else{
                    if(_this.gbGlobConf.commonConf.dlConf.print.isPrint){
                        //打印提示
                        if(_this.gbGlobConf.commonConf.dlConf.print.isPrintView){
                            //预览
                               _this._printPage(_this.formModel.order,_this.gbGlobConf.commonConf.dlConf.print.type);
                               
                        }else{
                            //直接打印
                             _this._printPage(_this.formModel.order,_this.gbGlobConf.commonConf.dlConf.print.type);
                            
                        }
                    }
                }
                    //清除车牌号
                    this._clearCarNum();
                    _this._resetFormModel();
                    _this._reload(); 
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
                                                    url:this.apiList.pTApiConf.deleteMainObject,
                                                    method:'post',
                                                    data:{
                                                            id:this.formModel.order.id,
                                                            permissionType:4
                                                         }
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
        
        _getLCChange(node){
            //料仓获取事件
            if(node[0]!=undefined){
                this.formModel.order.v_Col13=node[0].v_Col10;
                this.formModel.order.v_Col14=node[0].v_Col6;
            }
         },
        async _materialChange(node){
            this.formModel.order.infoUnit='吨'
            this.formModel.order.b_Col34=1;
            //材料信息选择(区分过滤和未过滤)
            // if(node[0]!=undefined){
            //     let Obj={};
            //     Obj=node;
            //     this.formModel.order.infoCode=Obj[0].infoCode;
            //     this.formModel.order.infoModel=Obj[0].infoModel;
            //     this.formModel.order.infoName=Obj[0].infoName;
            //     this.formModel.order.v_Col15=Obj[0].infoSecUnit;
            //     this.formModel.order.infoUnit=Obj[0].infoUnit;
            //     this.formModel.order.cId=Obj[0].cId;
            //     this.formModel.order.classNodeBh=Obj[0].classNodeBh;
            //     this.formModel.order.d_Col38=Obj[0].infoSecUnitPreci;
            //     this.formModel.order.o_Col38=Obj[0].sO_Col15;
            //     this.formModel.order.i_Col1=Obj[0].oriBigId;
            //     this.formModel.order.v_Col19=Obj[0].oriStrId;
            //     this.formModel.order.v_Col21=Obj[0].sV_Col5;
            //     this.formModel.order.i_Col4=Obj[0].oriBigClassId;
            //     this.formModel.order.v_Col22=Obj[0].oriStrClassId;
            //     //根据材料信息加载料仓
            //     let newLcList=[],dataSource=util.deepCopy(this.bakUpData.LcConf.dataList);
            //     //查询关联表中是否有匹配料仓
            //     let bindingData=await  this.asyncFunc({
            //                         url:this.apiList.lCBindParams,
            //                         method:'post',
            //                         data:{
            //                             queryConditionItem:[ //根据供应商加载材料
            //                                                 {dataField:"OrgId",op:'EQ',dataValue:this.getUserInfo().user.manageOrgId},
            //                                                 {dataField:'InfoNM',op:'EQ',dataValue:Obj[0].id}
            //                                             ],
            //                             sorting:''
            //                         }
            //                     },'获取料仓绑定信息');
            //     if(bindingData.order!=null){
            //         newLcList=dataSource.filter(i=>{
            //             return i.id===bindingData.order.o_Col31;
            //         });
            //         if(newLcList.length>0){
            //             this.LcConf.dataList=newLcList;
            //             this.formModel.order.v_Col13=newLcList[0].v_Col10;
            //             this.formModel.order.v_Col14=newLcList[0].v_Col6;
            //             this.formModel.order.o_Col37=newLcList[0].id;
            //         }
            //     }else{
            //         //加载全部
            //         this.LcConf=util.deepCopy(this.bakUpData.LcConf);
            //     }
            // }
         },
       async _supplierChange(node){ 
            //改变供应商的值
            let _this=this;
             if(node[0]!=undefined){
                _this.formModel.order.v_Col12=node[0].supplierName;
                _this.formModel.order.i_Col2=node[0].oriBigId;
                _this.formModel.order.v_Col20=node[0].oriStrId;
              }
            //  if(!this.formModel.order.b_Col26){ //非退料情况
            //         //根据供应商加载材料信息
            //         let bindingData=await  _this.asyncFunc({
            //                         url:_this.apiList.bindInfo.getMainAllList,
            //                         method:'post',
            //                         data:{
            //                             queryConditionItem:[ //根据供应商加载材料
            //                                                 {dataField:"OrgId",op:'EQ',dataValue:_this.getUserInfo().user.manageOrgId},
            //                                                 {dataField:'O_Col27',op:'EQ',dataValue:_this.formModel.order.o_Col36},
            //                                                 {dataField:'I_Col1',op:'EQ',dataValue:1},
            //                                             ],
            //                             sorting:''
            //                         }
            //                     },'获取绑定材料信息');
            //             if(bindingData.length>0){
            //                     //过滤材料信息列表  
            //                     let newList=util.filterArr(_this.bakUpData.materialConf.dataList,'id',bindingData,'o_Col28');
            //                     _this.materialConf.dataList=newList;
            //                 }
            //                 else{
            //                     //赋给初始数据
            //                     _this.materialConf=util.deepCopy(_this.bakUpData.materialConf);
            //                 }    
            //   }         
        },
       async _carNumDell(){
                    let _this=this;
                    //选择车牌后的逻辑事件
                    let  dataModel= await  _this.asyncFunc({
                                                    url:_this.apiList.pTApiConf.getMainObjectForEdit,
                                                    method:'post',
                                                    data:{
                                                        queryConditionItem:[
                                                                            {dataField:"OrgId",op:'EQ',dataValue:_this.getUserInfo().user.manageOrgId},
                                                                            {dataField:"OrderDataType",op:'EQ',dataValue:4,relation:"or"},
                                                                            {dataField:"OrderDataType",op:'EQ',dataValue:3},
                                                                            {dataField:"V_Col24",op:'EQ',dataValue:'一车多料'},
                                                                            {dataField:"V_Col11",op:'EQ',dataValue:_this.formModel.order.v_Col11},
                                                                            {dataField:"IsDeleted",op:'EQ',dataValue:0}
                                                                        ],
                                                        sorting:'V_Col18 desc'
                                                    }
                                                },'获取磅单对象信息');  
                    if(!this.formModel.order.b_Col26){ //非退料情况
                     //根据车牌获取车牌最近一条过磅数据
                        if(dataModel.order===null){
                            //直接筛选供应商信息
                                let bindingData=await  _this.asyncFunc({
                                                url:_this.apiList.bindInfo.getMainAllList,
                                                method:'post',
                                                    data:{
                                                        queryConditionItem:[ //根据车牌选供应商
                                                                            {dataField:"OrgId",op:'EQ',dataValue:_this.getUserInfo().user.manageOrgId},
                                                                            {dataField:'V_Col6',op:'EQ',dataValue:_this.formModel.order.v_Col11},
                                                                            {dataField:'I_Col1',op:'EQ',dataValue:0},
                                                                        ],
                                                        sorting:''
                                                    }
                                                },'获取绑定供应商信息');
                                if(bindingData.length>0){
                                        //过滤供应商信息列表  
                                        let newList=util.filterArr(_this.bakUpData.supplierConf.dataList,'id',bindingData,'o_Col27');
                                        _this.supplierConf.dataList=newList;
                                }
                                else{
                                    //赋给初始数据
                                    _this.supplierConf=util.deepCopy(_this.bakUpData.supplierConf);
                                }
                        }
                        else{ 
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
                                        //先从车辆中判断
                                       let configitme=_this.gbGlobConf.commonConf.baseConf.carConf.frequency;
                                        resultTime=this.moment()(dataModel.order.v_Col17).add(configitme, 'minutes').format("YYYY-MM-DD HH:mm:ss");
                                }
                                if(resultTime!=''){
                                    if(resultTime>nowDate){
                                        //不能入场
                                        _this.formModel.order.v_Col11='';
                                        _this.$message.warning('当前车辆下次入场时间为【'+resultTime+'】以后！');
                                    }else{
                                         //给表单赋值
                                         this._assignmentModel(dataModel);
                                    }
                                }else{
                                    //给表单赋值
                                    this._assignmentModel(dataModel);
                                    }
                            }else{
                                //给表单赋值
                                this._assignmentModel(dataModel);
                            }
                            
                        } 
                     }else{
                        //退料情况
                        if(dataModel.order!==null){
                            if(!dataModel.order.b_Col27){
                                 this.formModel.order=Object.assign(this.formModel.order,dataModel.order);
                                 this._btnState();
                            }   
                        }
                        
                    }
        },
       _carNumSel(){
           //车牌选择事件
           this._carNumDell();
        },
       _carNumChange(){
           //车牌失去焦点事件
           if(this.formModel.order.v_Col11.length>=7){
                this._carNumDell();
                //判断是否加载车牌号
                this._autoAddCarNum();
           }
        },
       //自动加车牌号
       async _autoAddCarNum(){
           const cPattern = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
           
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
                                                            },'添加车牌信息');
                                                        
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
              // this.formModel.order.v_Col11='';
               this.$message.warning('请输入正确的车牌号!');
           }
        },
        //车牌检索方法
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
       //初始化控件值
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
            //获取供应商列表信息
             _this.supplierConf.dataList= await  _this.asyncFunc({
                                                    url:_this.apiList.commonSupplierParams,
                                                    method:'post',
                                                    data:{
                                                        queryConditionItem:[
                                                                            {dataField:"OrgId",op:'EQ',dataValue:_this.getUserInfo().user.manageOrgId,DataFieldTwo:"",TwoFieldRelation:""}
                                                                        ],
                                                        sorting:'SortCode desc'
                                                    }
                                                },'获取供应商列表信息');  
            _this.bakUpData.supplierConf=util.deepCopy(_this.supplierConf); 
             //获取材料列表信息
            //  _this.materialConf.dataList= await  _this.asyncFunc({
            //                                                 url:_this.apiList.commonMaterialParams,
            //                                                 method:'post',
            //                                                 data:{
            //                                                     queryConditionItem:[
            //                                                                         {dataField:"OrgId",op:'EQ',dataValue:_this.getUserInfo().user.manageOrgId,DataFieldTwo:"",TwoFieldRelation:""}
            //                                                                     ],
            //                                                     sorting:'SortCode desc'
            //                                                 }
            //                                     },'获取常用材料列表信息');
            //_this.bakUpData.materialConf=util.deepCopy(_this.materialConf);
            //加载料仓末级节点
             _this.LcConf.dataList= await  _this.asyncFunc({
                                                            url:_this.apiList.lCParams,
                                                            method:'post',
                                                            data:{
                                                                queryConditionItem:[
                                                                                    {dataField:"OrgId",op:'EQ',dataValue:_this.getUserInfo().user.manageOrgId},
                                                                                    {dataField:"B_Col17",op:'EQ',dataValue:true}
                                                                                ],
                                                                sorting:''
                                                            }
                                                },'获取料仓末级信息');
            _this.bakUpData.LcConf=util.deepCopy(_this.LcConf);
            //加载钢筋加工中心组织机构
             _this.jgzxConf.dataList= await  _this.asyncFunc({
                                                            url:_this.apiList.jgzxParams,
                                                            method:'post',
                                                            data:{
                                                                queryConditionItem:[ 
                                                                                    {dataField:"I_Col1",op:'EQ',dataValue:2}
                                                                                ],
                                                                sorting:'I_Col1'
                                                            }
                                                },'获取料仓末级信息');
            _this.bakUpData.LcConf=util.deepCopy(_this.jgzxConf);
        },
        _getJgzxChange(node){
            this.formModel.order.o_Col61=node[0].id;
            this.formModel.order.v_Col56=node[0].v_Col6;
        },
        _ClearJgzx(){
            this.formModel.order.o_Col61='';
            this.formModel.order.v_Col56=''
        }
   },
   beforeMount(){
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
   components:{
      'yl-dataDictionaryForSel': dataDictionaryForSel,
      cameraEidt,
      DLFJ
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
