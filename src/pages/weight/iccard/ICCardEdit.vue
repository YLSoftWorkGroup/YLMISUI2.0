<template>
    <div slot="content" style="background-color:white">
        <el-form  :model="formModel"  :rules="rules"  ref="formModel" label-width="90px" style="height:500px;padding:15px 1.5em 3ex 1%;">
            
        <h2 style="text-align:center;color:#475669" >IC卡信息录入</h2>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="卡号" prop="v_Col12">
                        <object id="HDAccessCom" 
                            width="0" 
                            height="0"  
                            progid="Serial.WBPort" 
                            classid="clsid:EB691AD5-2793-43D9-9FE1-BE846404009E"
                            codebase="activex/WBalance.cab">
                         </object>
                        <span class="span">{{formModel.v_Col12}}</span>
                    </el-form-item>
                </el-col>
                  <el-col :span="12">
                    <el-form-item label="读取状态" prop="readState">
                        <el-tag type="success" v-if="readState">已读取</el-tag>
                        <el-tag type="danger" v-else>未读取</el-tag>
                    </el-form-item>
                </el-col>
            </el-row>
           
              <el-tabs v-model="activeName2" type="card" style="height:350px" @tab-click="_tabClick(activeName2);" >
                <el-tab-pane label="进场过磅" name="commonGb_PT" :disabled="ptdisable">
                    <PT :icForm="formModel"   @complete="_complete"  ref="ptweight"></PT>
                </el-tab-pane>
                <el-tab-pane label="出场过磅" name="commonGb_CC" :disabled="ccdisable">
                    <CC  :icForm="formModel"    @complete="_complete"  ref="ccweight"></CC>
                </el-tab-pane>
                <!--<el-tab-pane label="临时过磅" name="commonGb_LS" :disabled="lsdisable">
                    <LS  :icForm="formModel"   @complete="_complete"  ref="lsweight"></LS>
                </el-tab-pane>-->
            </el-tabs>
             <el-row>
                <el-form-item style="text-align:right;" >
                     <el-checkbox v-model="isClose">保存后关闭</el-checkbox>
                      <el-button class="icon-loop2" @click="_resetForm">重置</el-button>
                    <el-button class="icon-bin" type="danger" @click="_delete">注销</el-button>
                    <el-button class="icon-floppy-disk"  :loading="loading" type="primary" @click="_onSubmit">保存</el-button>
                </el-form-item>
            </el-row>
        </el-form>
    </div>
</template>

<script type="text/babel">
import fetch from  '@/api/fetch';
import PT from './PT';
import CC from './CC';
// import LS from './LS';

export default {
    data(){
        return{
            activeName2:'commonGb_PT',
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
                v_Col13:'commonGb_LS',//过磅类型（普通过磅、临时过磅）
                v_Col14:'',
                v_Col15:'',
                v_Col16:'',
                b_Col17:true,//是否启用
                b_Col18:'',
                b_Col19:'',
                d_Col20:'',//转换率
                d_Col21:0,
                d_Col22:0,
                d_Col23:0,
                d_Col24:0,
                d_Col25:0,
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
            readState:0,
            isClose:true,
            rules:{
                 v_Col12    : [
                    { required: true, message: '卡号不能为空！', trigger: 'change' },
                ]
            },
            loading:false,
            lcData:[],
            listenIcCardEvent:{},
            beforeData:'',
            nowData:'',
            rules:{},
            ptdisable:false,
            ccdisable:false,
            lsdisable:false
        }
    },
    computed:{
        HDAccessCom:{
            get(){
                return document.getElementById("HDAccessCom");
            }
        } 
    },
     methods:{
        _tabClick(tabval){

        },
        _resetForm(){
            // this.$refs.formModel.resetFields();
            this.formModel.v_Col12 ='';
            this.readState=false;
            this.$refs.ptweight._resetForm();
            this.$refs.ccweight._resetForm();
            // this.$refs.lsweight._resetForm();
            this.ptdisable=false;
            this.ccdisable=false;
            this.lsdisable=false;
        },
        _onSubmit(){
            console.log(this.formModel);
            if(this.formModel.v_Col12!=''&this.formModel.v_Col12!=undefined){
                    this.$refs.formModel.validate((valid) => {
                    if (valid) {
                        if(this.activeName2=='commonGb_PT'){
                            this.$refs.ptweight._onSubmit();
                        }else if (this.activeName2=='commonGb_CC'){
                            this.$refs.ccweight._onSubmit();
                        }else{
                            // this.$refs.lsweight._onSubmit();
                        }
                    }else {
                        this.$message.warning('请按照条件填充表单！');
                        return false;
                    }
                })
            }else{
                this.$message.warning('卡号不能为空！');
            }
           
        },
        _delete(){
            if(this.formModel.id!=''){
            this.$confirm('确认要注销这张卡吗?该操作将无法挽回！', '提示', {
                type: 'error',
                modal:false
            }).then(() => {
                var obj={}; 
                obj.id=this.formModel.id;
                fetch({
                    url: '/api/services/app/singleTable26/deleteMainObject',
                    method: 'post',
                    data: obj
                }).then(data =>{
                        if(data.success){
                                this.$notify({
                                    title: '成功',
                                    message: '删除数据成功！',
                                    type: 'success'
                                    });
                                this.ptdisable=false;
                                this.ccdisable=false;
                                this.lsdisable=false;
                                this._resetForm();
                            }
                            else {
                                this.$notify.error({
                                    title: '错误',
                                      message: '删除数据失败！'+data.error.message,
                                    });
                            }
                })
            }).catch(() => {
                    console.log('已取消删除');       
                    });
            }else{
                this.$message.error('此卡不存在！');
            }
        },
      
        async _getMainObjectForEdit(code){
            let obj={
                sorting:'',
                queryConditionItem:[{dataField:'V_Col12',op:'EQ',dataValue:code}]
            };
             let  data= await  this.asyncFunc({
                                url:'/api/services/app/singleTable26/getMainObjectForEdit',
                                method:'post',
                                data:obj
                            },'获取IC卡信息');

            if(data.order==null){
                // this._resetForm();
                this.formModel.id ='';
                this.formModel.v_Col12=code;
            }else{ 
                if(data.order.orgId==this.getUserInfo().user.manageOrgId){
                    this.formModel=data.order;
                    this.activeName2=data.order.v_Col13;
                    console.log(this.activeName2);
                     if(this.activeName2=='commonGb_PT'){
                        this.ptdisable=false;
                        this.ccdisable=true;
                        this.lsdisable=true;
                    }else if (this.activeName2=='commonGb_CC'){
                        this.ptdisable=true;
                        this.ccdisable=false;
                        this.lsdisable=true;
                    }else if (this.activeName2=='commonGb_LS'){
                        this.ptdisable=true;
                        this.ccdisable=true;
                        this.lsdisable=false;
                    }
                }else{
                    this._resetForm();
                    this.formModel.v_Col12='';
                    this.readState=false;
                    this.$message.error('此卡已被其他单位使用！');
                }
            }
           
        },
         _listenIcCardEvent(){
            this.listenIcCardEvent=setInterval(()=>{   
                 this.beforeData=this.nowData;
                 this.nowData=this.redRFIData();
                //this.nowData=this.redEtcData();
                 if(this.beforeData!==this.nowData&&this.beforeData===''){
                     this.getFRIDSpeaker(); //发出声音
                     if(this.nowData!==undefined){
                         //获取IC卡绑定信息
                         //dosomething
                        this.formModel.v_Col12=this.nowData;
                        this.readState=true;
                        this.$refs.ccweight._setICInfo(this.nowData);//把改变以后的值传给子组件
                        this.$refs.ptweight._setICInfo(this.nowData);//把改变以后的值传给子组件
                        // this.$refs.lsweight._setICInfo(this.nowData);//把改变以后的值传给子组件
                        this._getMainObjectForEdit(this.nowData);
                     }
                      
                 }
             },3000);  
          return this.listenIcCardEvent;
        },
         redRFIData(){
                //读取IC卡数据
              return this.HDAccessCom.getFRIData();
        },
        redEtcData(){
                //读取etc卡数据
                return this.HDAccessCom.getETCData("192.168.0.200");
        },
        getFRIDSpeaker(){
             //读取IC卡发出声音
              return this.HDAccessCom.getFRIDSpeaker();
        },
         _complete(){
                this.$emit('close',this.isClose);
            }
     },  
    mounted(){
        this._listenIcCardEvent();
    },
    components:{
        // LS,
        PT,
        CC
    },
    beforeDestroy() {
            //清除监听
            window.clearInterval(this.listenIcCardEvent);
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.span
    text-decoration: underline
    line-height:34px

</style>


