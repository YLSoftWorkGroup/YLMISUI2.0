<template>
 <div class="dibang" >
            <object id="HDAccessCom" 
                width="100%" 
                height="180"  
                progid="Serial.WBPort" 
                classid="clsid:EB691AD5-2793-43D9-9FE1-BE846404009E"
                codebase="activex/WBalance.cab">
            </object>
        <div class="title">  
            <span class="statustext">地磅链接状态：<span v-html="status"> </span></span> 
            <input id="linked" type="button" value="连接" @click="ConnectWBalance" class="dbbtn"/>
            <input id="Unlinked" type="button" value="断开" @click="disconnectWBalance" class="dbbtn"/>
       </div>  
  </div>
</template>

<script type="text/babel">
export default {
   data(){
        return{
            status:"<span style='color:red'>未连接</span>",
        }
   },
   props:{
       configs:{},
   },
   computed: {
        HDAccessCom:{
            get(){
                return document.getElementById("HDAccessCom");
            }
        } 
      },
   methods:{
       dibangInit(){
         console.log('初始化地磅')
        //为重量显示标签设置颜色，white-白色，lime-绿色，red-红色，blue-蓝色，orange-橙色等
        this.HDAccessCom.setFontColor("white"); 
        this.getStatus();
        this.ConnectWBalance();
        //this.HDAccessCom.setSize(300,180);
       },
       ConnectWBalance(){
              console.log('连接地磅')
                console.log(this.HDAccessCom.getStatus())
            //  alert(this.HDAccessCom.getRFIData());
           //连接地磅
            if (this.HDAccessCom.getStatus()=="已连接") {
                this.HDAccessCom.destory();
            }
            //start("磅秤类型","串口编号",波特率)
            //HDAccessCom.start("3","COM1",1200);   
            //init("磅秤类型","串口编号",波特率,"奇偶校验位",数据位,"停止位",门限值)
            let initconf=this.configs.order; 
            this.HDAccessCom.init(initconf.i_Col1,initconf.v_Col8,initconf.v_Col10,initconf.v_Col9,initconf.i_Col2,initconf.v_Col11,initconf.i_Col5);   
            if (this.HDAccessCom.open()) {
                this.$message.success('电子地磅连接成功！');
                this.HDAccessCom.setFontColor("lime"); 
               //修改地磅连接状态,**= HDAccessCom.getStatus();
             //document.getElementById('Label5').innerHTML = "地磅连接状态：<font color='red'>"+HDAccessCom.getStatus()+"</font>";
            } else {
                   this.$message.error('初始化失败，请检查地磅是否连接正常!');
                   this.HDAccessCom.setFontColor("red"); 
              //修改地磅连接状态,**= HDAccessCom.getStatus();
             //document.getElementById('Label5').innerHTML = "地磅连接状态：<font color='red'>"+HDAccessCom.getStatus()+"</font>";
            }
            this.getStatus();
            
       },
       dbStatus(){
           return  this.HDAccessCom.getStatus();
       },
       disconnectWBalance(){
           //地磅断开
            console.log('断开地磅')
            if (this.HDAccessCom.getStatus()=="已连接") {
                this.HDAccessCom.destory();    
                this.$message.warning('电子地磅已断开!');
            //修改地磅连接状态,**= HDAccessCom.getStatus();
             //document.getElementById('Label5').innerHTML = "地磅连接状态：<font color='red'>"+HDAccessCom.getStatus()+"</font>";
            }
            else {
                 this.$message.error('断开电子地磅时出现异常!');
                 
                    //修改地磅连接状态,给一个自定义的提示即可
                    //document.getElementById('Label5').innerHTML = "地磅连接状态：<font color='red'>连接异常</font>";
            }
            this.HDAccessCom.setFontColor("white"); 
            this.getStatus();
        },
        getStatus(){
                if(this.HDAccessCom.getStatus()==="已连接"){
                    this.status="<span style='color:green'>已连接</span>"
                }else{
                    this.status="<span style='color:red'>未连接</span>";
                }
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
        redWBPortData(){
              //读取过磅数据
              return this.HDAccessCom.getWBPortData();
              //  return Math.random(100)*100
        }
   },
   components:{
   },
   mounted(){
     
   },
  
   beforeDestroy() {
       console.log('我即将销毁...');
        return false
   },
   watch:{
       configs:function(n,o){
             this.dibangInit();
       }
   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css" rel="stylesheet/css" scoped>
 .dibang{position:relative;}
 .title {background-color: #333;width:100%;height:20px;color:aliceblue;padding-left:5px;font-size:12px;line-height:20px;}
 .dbbtn {margin-left:10px;width:40px;background:#555;color:#d7d7d7;border:solid 1px #222; border-radius:5px;text-align: center;cursor: pointer;} 
 .dbbtn:hover{background:#222;}
</style>
