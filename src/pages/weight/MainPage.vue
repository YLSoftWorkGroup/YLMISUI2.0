<template>
<yl-panelpage :titleName="companyInfo?'西安易龙过磅影像称重系统V8.0—客服电话（029-88227793）':'过磅影像称重系统V8.0'" >
    <div slot="content">
        <div class="main">
            <div class="top">
                 <yl-lazyrender :time="100" class="dibangs">
                    <dbComponents ref="dbComponent"
                        :configs="dbconfigs">
                    </dbComponents>
                 </yl-lazyrender >
                  <yl-lazyrender :time="100"  class="cameras">
                     <cameraList ref="cameraList"
                        :configs="cameraconfigs"
                        :desCode="desCode"
                     >
                     </cameraList>
                  </yl-lazyrender>
            </div>  
            <div class="middle">
                 <yl-layout>
                        <div slot="fristbox" >
                              <yl-toolbar>
                                    <el-button-group>
                                        <el-button 
                                        v-for="(item,index) in commonGbType"
                                        :key="index"
                                        v-if="!item.disable"
                                        :plain="true" 
                                        type="primary" 
                                        :class="{'btn_active':currentView==item.name}"  
                                        size="" @click="changePage(item.name)" >{{item.text}}</el-button>


                                    </el-button-group>   
                              </yl-toolbar>
                        </div>
                        <div slot="secondbox" class="flexbox">
                            <!-- <keep-alive> -->
                                <component 
                                    :is="currentView"
                                    :apiList="apiObject"
                                    :dbData="dbData"
                                    :cameraList="cameraList"
                                    :currentView="currentView"
                                    :gbGlobConf="gbGlobConf"
                                    :gbIoConf="gbIoConf"
                                    @getDbData="_getDbData"
                                    @getcameraListImg="_getcameraListImg"
                                ></component> 
                               

                            <!-- </keep-alive> -->
                        </div>
                   </yl-layout>
            </div>
        </div>    
    </div>
</yl-panelpage>
</template>

<script type="text/babel">
import commonGb_PT from './commonGb_PT';
import commonGb_LS from './commonGb_LS';
import commonGb_CC from './commonGb_CC';
import commonGb_ZC from './commonGb_ZC';
import commonGb_DL from './commonGb_DL';
import dbComponents from './dbComponents';
import cameraList from './cameraList';
import fetch from '@/api/fetch';
import util from '@/common/js/util';
export default {
    data(){
        return{
            currentView:'commonGb_PT',
            commonGbType:[],
            computeType:'',
            desCode:'',//加密锁
            dbconfigs:{},
            cameraconfigs:[],
            mACAddress:'',
            companyInfo:window.getClientObj().sysConf.companyInfo,
            apiObject:{
                //获取操作机类型
                macType:'/api/services/app/singleTable28/getMainObjectForEdit',
                //地磅参数
                dbParams:'api/services/app/singleTable29/getMainObjectForEdit',
                //摄像头参数
                cameraParams:'api/services/app/singleTable30/getMainAllList',
                //车牌列表获取
                carNumParams:'api/services/app/singleTable25/getMainAllList',
                //获取车牌
                carNumApiConf:{
                    getMainObjectForEdit:'api/services/app/singleTable25/getMainObjectForEdit',
                    createOrUpdateMainObject:'api/services/app/singleTable25/createOrUpdateMainObject'
                },
                //供应商列表获取
                commonSupplierParams:'api/services/app/commonSupplier/getMainAllList',
                //用料单位列表获取
                commonLabourParams:'api/services/app/commonLabour/getMainAllList',
                //材料列表获取
                commonMaterialParams:'api/services/app/commonMaterial/getMainAllList',
                 //IC卡信息获取
                getIcConf:'api/services/app/singleTable26/getMainObjectForEdit',
                //常规过磅api
                pTApiConf:{
                    getMainPageList:'api/services/app/table31Order/getMainPageList',
                    getMainObjectForEdit:'api/services/app/table31Order/getMainObjectForEdit',
                    createOrUpdateMainObject:'api/services/app/table31Order/createOrUpdateMainObject',
                    deleteMainObject:'api/services/app/table31Order/deleteMainObject',
                    getMainObjectForEditAll:'api/services/app/table31Order/getMainObjectForEdit_All',
                },
                //出场过磅api
                cCApiConf:{
                    getMainPageList:'api/services/app/table32Order/getMainPageList',
                    getMainObjectForEdit:'api/services/app/table32Order/getMainObjectForEdit',
                    createOrUpdateMainObject:'api/services/app/table32Order/createOrUpdateMainObject',
                    deleteMainObject:'api/services/app/table32Order/deleteMainObject',
                },
                //临时过磅api
                lSApiConf:{
                    getMainPageList:'api/services/app/table33Order/getMainPageList',
                    getMainObjectForEdit:'api/services/app/table33Order/getMainObjectForEdit',
                    createOrUpdateMainObject:'api/services/app/table33Order/createOrUpdateMainObject',
                    deleteMainObject:'api/services/app/table33Order/deleteMainObject',
                },
                //车辆绑定供应商||供应商绑定材料
                bindInfo:{
                    getMainAllList:'api/services/app/singleTable27/getMainAllList',
                },
                //获取料仓平行结构
                lCParams:'api/services/app/singleTable21/getMainAllList',
                //获取料仓材料绑定信息
                lCBindParams:'api/services/app/singleTable7/getMainObjectForEdit',
                //获取工号平行结构
                gHParams:'api/services/app/gH/GetGHs',
             },
            dbData:{},
            cameraList:{},
            listenIcCardEvent:{},
            gbGlobConf:{},
            gbIoConf:{},
            carNum:''
        }
   },
   computed:{
   },
   methods:{
       changePage(val){
         this.currentView=val;
       },
       _getMACAddress(){
            let locator =new ActiveXObject ("WbemScripting.SWbemLocator");
            let service = locator.ConnectServer(".");
            let properties = service.ExecQuery("Select * from Win32_NetworkAdapterConfiguration Where IPEnabled =True");
            let e =new Enumerator (properties);
            //获取mac地址
            this.mACAddress=e.item().MACAddress;
            
       },
       _getcameraListImg(){
            //获取摄像机组画面
            this.cameraList.list=this.$refs.cameraList.getCameraListInfo();
       },
       _getDbData(){
            //读取地磅数据
           this.dbData.Num=Number(this.$refs.dbComponent.redWBPortData());
           //this.dbData.Num=Math.random(100)*100;
       },
       //读取参数
       _getConf(){
           //获取配置类型
            let inputArr=[],params={};
                inputArr.push(this.getUserInfo().user.manageOrgId);
                params.queryConditionItem=inputArr; 
            fetch({
                    url:this.apiObject.macType,
                    method: 'post',
                    data: {
                        queryConditionItem:[
                            {dataField:"V_Col7",op:'EQ',dataValue:this.mACAddress,DataFieldTwo:"",TwoFieldRelation:""},
                            {dataField:"OrgId",op:'EQ',dataValue:this.getUserInfo().user.manageOrgId,DataFieldTwo:"",TwoFieldRelation:""}
                        ],
                    }
                }).then(data=>{
                        //获取摄像机参数和地磅参数
                        if(data.success){
							//获取摄像机参数和地磅参数
                            this.computeType=data.result.order.v_Col6;
                            this.desCode=data.result.order.v_Col8;

                            //获取地磅参数
                            fetch({
                                    url:this.apiObject.dbParams,
                                    method: 'post',
                                    data: {
                                        queryConditionItem:[
                                            {dataField:"V_Col6",op:'EQ',dataValue:this.computeType,DataFieldTwo:"",TwoFieldRelation:""},
                                            {dataField:"OrgId",op:'EQ',dataValue:this.getUserInfo().user.manageOrgId,DataFieldTwo:"",TwoFieldRelation:""},
                                            {dataField:"B_Col17",op:'EQ',dataValue:1,DataFieldTwo:"",TwoFieldRelation:""},
                                        ]
                                    }
                            }).then(data=>{
                                 if(data.success){
                                     this.dbconfigs=data.result;
                                 }
                            }).catch(err=>{
                                this.$message.error('获取地磅参数异常...'+err);
                            })
                            //获取摄像机组参数
                            fetch({
                                    url:this.apiObject.cameraParams,
                                    method: 'post',
                                    data: {
                                        queryConditionItem:[
                                            {dataField:"V_Col6",op:'EQ',dataValue:this.computeType,DataFieldTwo:"",TwoFieldRelation:""},
                                            {dataField:"B_Col17",op:'EQ',dataValue:1,DataFieldTwo:"",TwoFieldRelation:""},
                                            {dataField:"OrgId",op:'EQ',dataValue:this.getUserInfo().user.manageOrgId,DataFieldTwo:"",TwoFieldRelation:""}
                                        ],
                                        sorting:'v_Col7'
                                    }
                            }).then(data=>{
                                 if(data.success){
                                     this.cameraconfigs=data.result;
                                 }
                            }).catch(err=>{
                                this.$message.error('获取摄像机参数异常...'+err);
                            })

						} else {
						 	this.$message.error('操作机类型获取失败...');
						}
                }).catch(err=>{
                    this.$message.error('操作机类型获取异常...'+err);
                })
       },
        _init(){
            //获取mac地址
            this._getMACAddress();
            //获取配置参数
            this._getConf();
        }
       
   },
   components:{
       commonGb_PT,
       commonGb_LS,
       commonGb_CC,
       commonGb_ZC,
       commonGb_DL,
       dbComponents,
       cameraList,
   },
   beforeMount(){
        //获取全局配置
        this.gbGlobConf=util.getLocalStorage('GBConf');
        this.gbIoConf=util.getLocalStorage('GBIoConf');
        if(this.gbGlobConf.commonConf.baseConf){
            this.currentView=this.gbGlobConf.commonConf.baseConf.commonGbType.default;
            this.commonGbType=this.gbGlobConf.commonConf.baseConf.commonGbType.list;
        }
   },
   mounted(){
        this._init();
   },
   beforeRouteLeave(to, from, next) {
       var browser=navigator.userAgent;
       if(IEVersion(browser)===11){
        if(this.$refs.dbComponent.dbStatus()=='已连接'){
                //this.$refs.dbComponent.disconnectWBalance();
                this.$message.warning('请断开地磅链接!');
            }
            else{  
                next()
            }
        }
        else{  
            next()
        }
   },
   beforeDestroy() {

   },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css" rel="stylesheet/css" scoped>
     .main {width:100%;height:100%;display:flex;flex-direction:column;}
     .main .top {background-color:black;height:200px;display:flex;flex-direction:row;}
     .main .top .dibangs {background-color:black;flex:1;}
     .main .top .cameras {background-color:black;width:auto;}
     .middle  {flex:1;}
     .statustext {color:green;font-size:12px}
     .btn_active{background: #fff;border-color: #20A0FF;color: #20A0FF;}
</style>
