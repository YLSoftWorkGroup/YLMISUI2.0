<template>
<div class="form">
  <el-row class="yl-order-header" v-if="formConf.formHeader.isShow">
      <el-col :span="2">
        <img src="img/zgztlogo.png" alt="logo" class="yl-order-logo">
        </el-col>
      <el-col :span="18" > 
        <div class="yl-order-title">
            <span class="yl-order-small-title">{{globConf.order.title}}&nbsp;&nbsp;&nbsp;</span>
            {{formConf.formHeader.title}}
        </div>
      </el-col>
      <el-col :span="4">
            <div class="yl-order-code" v-if="moduleType==2"><span style="color: red;">NO.</span>{{formModel.order.orderCode}}</div>
      </el-col>
  </el-row>
    <el-form :model="formModel.order" ref="dynamicFormConf" label-width="100px" >
        <yl-renderFormLay  ref="renderFormLay"
            :dynamicFormConf="dynamicFormConf" 
            :model="formModel.order"
            :items="formModel.items"
            :refList="refList"
            @change="_change"
            @blur="_blur"
            @method1="_method1"
            @method2="_method2"
            @initComs="_initComs"
            @delItem="_delItem"
            @sumCount="_sumCount"
        ></yl-renderFormLay>
        <el-form-item>
            <div style="text-align:right;"  > 
                    <span class="file"
                          v-if="fileBtn">
                          <i :class="functionConf.formBtn.file.icon"></i>{{functionConf.formBtn.file.text}}
                          <input type="file"  
                                @change="_uploadClick"/>
                    </span>
                    <el-button v-for="(item,index) in functionConf.formBtn"  :key="index"
                                v-if="item.type!=='file'"
                                :type="item.type" 
                                :name="item.name" 
                                :loading="item.loading"
                                :size="item.size" 
                                :disabled="item.disabled"  
                                v-show="item.isShow"
                                @click="_functionClick(item)" >
                            <i :class="item.icon"></i>{{item.text}}
                    </el-button>  
             </div>
        </el-form-item>
    </el-form>

    </div>
</template>
<script>
import fetch from '@/api/fetch';
import renderFormLay from '../dynamicmodule/renderFormLay.js';
import util from '@/common/js/util';
import { mapGetters,mapActions } from 'vuex';
  export default {
    data() {
      return {
         isClose:true,
         menuCode:'',
         dynamicFormConf:{},
         funConf:{},
         formModel:{},
         orderDateInital:'',
         orderCodeInital:'',
         refList:{},
         extensionObj:{},
         repeatFileds:'',
         repeatValue:''
         
      };
    },
    props:{
        formConf:{
            require:true,
            default:{},
            type:Object
         },
        formType:{
            require:true,
            default:1,
            type:Number
         },
        currentRow:{   //绑定值模型
            type:Object,
            default:{},
         },
        selectRows:{ //绑定值数组
            type: Array,
            default:[] 
         },
        tableName:{
            type:String,
            required:false,
            default:'',
         }
    },
    computed:{
      fileBtn:{
          get(){
              if(this.functionConf.formBtn.file===undefined){
                  return false;
              }
              return true;
          }
      }, 
      fetchObject:{
        get(){
          return fetch;
        }
      },
      utilObject:{
        get(){
          return util;
        }
      },
      globConf:{
            get(){
                return util.getLocalStorage('SysGlobConf');
            }
        },
       ...mapGetters([ 'getGlobObject1','getGlobObject2','getGlobString1','getGlobString2','getGlobArray1']),
    },
    methods: {
      ...mapActions(['setIsVisible','setBaseinfoConf','setApiConf','setFliterConf','setTableinfoConf','setFunctionConf']),
      ...mapActions(['setGlobObject1','setGlobObject2','setGlobString1','setGlobString2','setGlobalArray1']),
      ...mapActions({ setSelectRows: 'setSelectRows',setType:'setType' }),
      //提交表单
      _submitForm() {
        let _this=this;
        this.$refs['dynamicFormConf'].validate((valid) => {
          _this.functionConf.formBtn.save.loading=true;
          if (valid) {
            //保存之前对form表单做特殊处理
            _this._beforeSubmit();
            if(_this.moduleType==2){
                //主从结构
                if(_this.formModel.items.length==0){
                            _this.$message({ message: `请选择明细！`, type: 'warning'});
                            this.functionConf.formBtn.save.loading=false;
                            return;
                    }
                 if(_this.formModel.order.id!==""){
                        //修改
                        if(_this.orderDateInital==_this.formModel.order.orderDate){
                            _this.formModel.config.isGenerateCode=false;
                        }
                 }    
            }
           let _api={};
           if(_this.moduleType==3){
               //单表多次编辑
               if(this.formModel.items.length===0){
                   this.$message({ message: `请选择明细！`, type: 'warning'});
                   this.functionConf.formBtn.save.loading=false;
                   return;
               }
                _api={
                    url:'/api/services/app/'+this.menuCode+'/createMainList',
                    method:"post",
                    data:{}
                };
                _api.data.items=_this.formModel.items;
                _api.data.judgeColumns=_this.formModel.judgeColumns;
           }else{
                 _api={
                    url:'/api/services/app/'+this.menuCode+'/createOrUpdateMainObject',
                    method:"post",
                    data:{}
                };
                _api.data=_this.formModel;
           }
           //处理api权限参数
            let permissionType=this.menuCode.split('&');
            let urlCode=_api.url.split('/');
            if(permissionType[1]!=undefined&&urlCode[4].toLowerCase()===permissionType[0].toLowerCase()){
                _api.data.permissionType=permissionType[1];
            }
           fetch(_api).then(data=>{
                    if(data.success){
                            this.$notify({
                                title: '成功',
                                message: '保存数据成功！',
                                type: 'success'
                                });
                            //关闭面板
                            this._afterSubmit();
                            this._complete(this.isClose);
                        }
                        else {
                            this.$message.error('失败！'+data.error.message);
                        }
                       _this.functionConf.formBtn.save.loading=false;
                    }).catch(function(error){
                      _this.functionConf.formBtn.save.loading=false;
                    })
          } else {
             _this.functionConf.formBtn.save.loading=false;
             this.$message.warning('请按照条件填充表单！');
             return false;
          }
        });
      },
      _resetForm() {
            this.resetFormModel();
      },
      _formInitial(){
            if(this.moduleType==1){
                //单表结构
                 Object.assign(this.formModel.order,this.selectRow);
            }
            else if(this.moduleType==2){
                 //主从表结构
                 
                 if(this.selectRow.id!=undefined){
                     //编辑
                    //this.refList.items.tableEdit.mainTableLoading=true;
                    let inputArr=[], 
                    _api={
                                    url:'/api/services/app/'+this.menuCode+'/getMainObjectForEdit',
                                    method:"post",
                                    data:{}
                                },
                    params={};
                    inputArr.push({
                                    dataField:"Id",
                                    op:'EQ',
                                    dataValue:this.selectRow.id,
                                });
                    params.queryConditionItem=inputArr;        
                    _api.data=params;
                    fetch(_api).then(data=>{
                        if(data.success){
                             Object.assign(this.formModel,data.result); 
                             this.orderDateInital=this.formModel.order.orderDate;
                             this.orderCodeInital=this.formModel.order.orderCode;
                             this._sumCount();
                        }else{
                            this.$message.error('获取编辑表信息失败！');
                        }
                         // this.refList.items.tableEdit.mainTableLoading=false;
                    });
                }
                else{
                    this._sumCount();
                }
            }else if(this.moduleType==3){
                this.formModel.items=this.selectRows;
            }
            //数据绑定好后拦截处理
            this._beforeDataRender();
            //字段重复验证处理
            if(this.repeatFileds!=''){
                let Arrf=this.repeatFileds.split(',');
                Arrf.map(item=>{
                     this.repeatValue=this.repeatValue+this.formModel.order[item]+',';
                })
                this.repeatValue=this.repeatValue.substring(0,this.repeatValue.length-1)
            }
          },


     commonJudgeRepeat(rule, value, callback){
            let columnValue='';
            let Arr=this.repeatFileds.split(',');
            Arr.map((i)=>{
                 columnValue=columnValue+this.formModel.order[i]+','
            })
            columnValue=columnValue.substring(0,columnValue.length-1)
            let str=`${this.tableName}|${this.repeatFileds}|${columnValue}|${this.repeatValue}`;
            this.IsJudgeRepeat(str,value, callback);
        },
      _sumCount(){
            let _this=this;
            let sumRowConf=this.dynamicFormConf.formConfig.filter(item=>{
                return item.type==="tableEdit"
            });
            if(sumRowConf.length>0){
                let eventConf=sumRowConf[0].elmentConfig.sumRowConf.eventConf;
                 this.extensionObj.sumRowConf=sumRowConf[0].elmentConfig.sumRowConf.items;
                if(eventConf!=undefined){
                    if(eventConf.isOn){
                        eventConf.sum(_this,sumRowConf[0].elmentConfig.sumRowConf);
                    }
                }
            }
      },
      _delItem(row){
                this.$confirm('确认要删除所选项目吗?', '提示', {
                type: 'warning',
                modal:false
            }).then(() => {
                        if(row.id!=="0"){
                            //后台删除
                             let obj={},_api={}; 
                             if(this.moduleType==2){
                                 _api={
                                    url:'/api/services/app/'+this.menuCode+'/deleteItemObject',
                                    method:"post",
                                    data:{}
                                }
                             }
                             else if(this.moduleType==3){
                                 _api={
                                    url:'/api/services/app/'+this.menuCode+'/deleteMainObject',
                                    method:"post",
                                    data:{}
                                }
                                 
                             }
                             obj.id=row.id;
                             _api.data=obj;
                            fetch(_api).then(data=>{
                                if(data.success){
                                    let index=this.formModel.items.indexOf(row);
                                    this.formModel.items.splice(index,1);
                                    this._sumCount();
                                    this.$message.success('删除数据成功！');
                            }else {
                                this.$notify.error({
                                    title: '错误',
                                      message: '删除数据失败！'+data.error.message,
                                    });
                             }
                            })
                        }else{
                         //前台删除
                            let index=this.formModel.items.indexOf(row);
                            this.formModel.items.splice(index,1);
                            this._sumCount();
                            this.$message.success('删除数据成功！');
                        }
                       
                }).catch(()=>{});
            },
      _functionClick(item){
            let _this=this;
            let eventConf=item.eventConf;
            if(eventConf!=undefined){
                if(eventConf.isOn){
                    eventConf.click(item.name,_this);
                }
            }
        },
        //上传按钮事件逻辑
        _uploadClick(evt){
                const files = evt.target.files;
                if(files && files[0]){
                    if(files[0].name.split('.')[1]==="xlsx"){
                    this.importToJsonData(files[0],(data)=>{
                        let _this=this;
                        let eventConf=_this.functionConf.formBtn.file.eventConf;
                        if(eventConf!=undefined){
                            if(eventConf.isOn){
                                eventConf.click(data,_this);
                            }
                        }
                      
                    });
                    }else{
                        this.$message.warning('选择文件格式有误！');
                    }

                }
        },
      //表单事件----------
      _initComs(_coms){
           let _this=this,option=_coms.option;
           if(option.eventConf!=undefined){
            if(option.eventConf.isOn){
                 if(option.eventConf.init!=undefined){
                         option.eventConf.init(_this,option);
                 }
            }  
           }
      },
      _change(node,_coms){
            let _this=this,option=_coms.option;
            let eventConf=option.eventConf;
            if(eventConf!=undefined){
              if(eventConf.isOn){
                   if(eventConf.change!=undefined){
                        eventConf.change(node,_this,option);
                   }
              }
            }  
      },
      _blur(node,_coms){
            let _this=this,option=_coms.option;
            let eventConf=option.eventConf;
            if(eventConf!=undefined){
              if(eventConf.isOn){
                    if(eventConf.blur!=undefined){
                         eventConf.blur(node,_this,option);
                    }
              }
            }
      },
       _method1(node,_coms){
            let _this=this,option=_coms.option;
            let eventConf=option.eventConf;
            if(eventConf!=undefined){
              if(eventConf.isOn){
                   if(eventConf.method1!=undefined){
                        eventConf.method1(node,_this,option);
                   }
              }
            }
      },
       _method2(node,_coms){
            let _this=this,option=_coms.option;
            let eventConf=option.eventConf;
            if(eventConf!=undefined){
              if(eventConf.isOn){
                  if(eventConf.method2!=undefined){
                     eventConf.method2(node,_this,option);
                  }
              }
            }
      },
      //------------
       _getCode(val,type=0){
                if(val===this.orderDateInital){
                     this.formModel.order.orderCode=this.orderCodeInital;
                }else{
                    this.globalFunObject.generateOrderCode(this.tableName,this.formModel.order.orgId,val,(val)=>{
                    this.formModel.order.orderCode=val;
                    },type);
                } 
       },
      _complete(bool){
                this.$emit('close',bool);
            },
      _onSelect(flag){
          if(flag!=""){
            let inputArr=[];
            inputArr=[ 
                    {dataField:"ExtensionOne",op:"EQ",dataValue:flag},
                    {dataField:"IsEnable",op:"EQ",dataValue:1},
                    {dataField:"VersionNum",op:"EQ",dataValue:this.globConf.versionNum},
                ];
            fetch({url: '/api/services/app/selectModuleConf/GetSelectModuleConfByKey',
                    method: 'post',
                    data: inputArr}).then((data)=>{
                    if(data.success){
                         let result=data.result.order;
                        if(result!=null){
                            this.setBaseinfoConf(JSON.parse(result.baseInfoConf,util.dealFunction).baseInfo);
                            this.setApiConf(JSON.parse(result.apiConf,util.dealFunction).apiConf);
                            this.setFliterConf(JSON.parse(result.fliterConf,util.dealFunction).filterConf);
                            this.setTableinfoConf(JSON.parse(result.tableInfoConf,util.dealFunction).tableInfoConf);
                            this.setFunctionConf(JSON.parse(result.functionConf,util.dealFunction).functionConf);
                            this.setIsVisible(true);
                        }
                    }else{  
                            this.$message.error('获取数据失败！');
                    }
                })
          }
        },
        resetFormModel(){
                let  model=this.formModel.order;
                for(let item in model)
                { 
                    if(item!='Id'||item!='OrderId'){
                        if(typeof model[item]==="string"){
                            model[item]="";
                        }else if(typeof model[item]==="number"){
                            model[item]=0;
                        }else if(typeof model[item]==="boolean"){
                            model[item]=false;
                        }else{
                        }
                    }
                }
                //处理items
                if(this.formModel.items){
                    this.formModel.items=[];
                }
        },
        init(){
            this._formInitial();  //初始化表单
        },
        _mounted(){
                let _this=this;
                let eventConf=this.formConf.InterceptEvent.mounted;
                if(eventConf!=undefined){
                    if(eventConf.isOn){
                        eventConf.event(_this);
                    }
                }
        },
        _beforeSubmit(){
                let _this=this;
                let eventConf=this.formConf.InterceptEvent.beforeSubmit;
                if(eventConf!=undefined){
                    if(eventConf.isOn){
                        eventConf.event(_this);
                    }
                }
        },
        _afterSubmit(){
                let _this=this;
                let eventConf=this.formConf.InterceptEvent.afterSubmit;
                if(eventConf!=undefined){
                    if(eventConf.isOn){
                        eventConf.event(_this);
                    }
                }
        },
        _beforeDataRender(){
                let _this=this;
                let eventConf=this.formConf.InterceptEvent.beforeDataRender;
                if(eventConf!=undefined){
                    if(eventConf.isOn){
                        eventConf.event(_this);
                    }
                }
        }
       },
      created(){
            this.dynamicFormConf=this.formConf.formConfigs;
            this.formModel=this.formConf.formModel;
            this.funConf=this.functionConf;
            this.menuCode=this.$route.params.tableName;
            //清除表单
            this.resetFormModel();
        },
      beforeMount(){
            this.init();
      },  
      mounted(){
        //自定义初始化
        this._mounted();
     },
     watch:{
        getGlobString2:function(n,o){
                let _this=this;
                let eventConf=this.formConf.WatchEvent;
                if(eventConf!=undefined){
                    if(eventConf.isOn){
                        eventConf.event(_this);
                    }
                }
        }
    },
    components:{
        'yl-renderFormLay':renderFormLay,
    },
  }
</script>
 <style scoped>

    .file {
        position: relative;
        display: inline-block;
        background: rgb(77, 179, 255);
        border: 1px solid #99D3F5;
        border-radius: 2px;
        padding: 4px 12px;
        color: #fff;
        text-decoration: none;
        text-indent: 0;
        line-height: 20px;
    }
    .file input {
        position: absolute;
        font-size: 15px;
        left: 0;
        top: 0;
        width: 80px;
        height: 28px;
        opacity: 0;
    }
    .file:hover {
        background: rgb(100, 188, 252);
        border-color: #78C3F3;
        text-decoration: none;
    }
</style>
