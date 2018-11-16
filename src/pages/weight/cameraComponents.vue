<template>
         <div class="camera">
            <object :id="configs.id" 
                    :width="configs.i_Col2" 
                    height="180" 
                    classid="clsid:A3FC6E0D-1B70-4338-B506-4F96779996CC"  
                    codebase="activex/IPCamera.cab">
            </object>
         <div class="title" v-show="configs.i_Col2!==0">{{configs.v_Col8}}</div>  
        </div>
</template>

<script type="text/babel">
import util from '@/common/js/util'
import { mapGetters,mapActions } from 'vuex';
export default {
   data(){
        return{
            status:'E99',
            listenEvent:{},
            gbGlobConf:{},
            beforeData:'',
            nowData:'',
            isEnd:false,
            prepare:0
        }
   },
   props:{
       configs:{},
       desCode:{
           type:String,
           default:''
       }
   },
   methods:{
       ...mapActions(['setGlobString1','setGlobString2']),
       _cameraInit(){
            console.log('初始化摄像头')
            //IP摄像头IP、端口和账号
            let initConf=this.configs;
            let code=util.base64Decrypt(this.desCode); 
            this.status=this.IPCamera.init(initConf.v_Col9,initConf.i_Col1,initConf.v_Col10,initConf.v_Col11,code);
            if(this.status!="E00"){
                 this.$message.error('['+this.configs.v_Col8+']摄像头初始化失败！');
            }
            this.IPCamera.setSize(this.configs.i_Col2,180);
            //判断车牌识别
            let carNumRecognite=this.gbGlobConf.commonConf.baseConf.carNumRecognite;
            if(carNumRecognite&&!carNumRecognite.disabled){
               this.prepare=this.IPCamera.prepare('c:\snapImgs');
            }
       },
       getImginfo(){
            if(this.status=="E00"){
                let result={};
                result.info=this.configs;
                //result.Base64=this.IPCamera.snap();
                result.Base64=this.IPCamera.clip();
                
                //result.Base64=this.IPCamera.GetImgDataByBase64();
                //处理字符
                //result.Base64=result.Base64.substring(0,result.Base64.indexOf('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'));
                return result;
            }else{
                    this.$message.error('['+this.configs.v_Col8+']摄像头抓怕异常！');
                    let result={};
                    result.info=this.configs;
                    result.Base64='';
                    return result;
            }
       },
       getCarNum(){
           //识别
           if(this.status=="E00"&&this.prepare){
             // return  this.IPCamera.plate(100);
              return  this.IPCamera.recong(100);
           }
           return ''
       },
        _listenEvent(num){
            this.listenEvent=setInterval(()=>{
                //读取地磅数据
                 this.beforeData=this.nowData;
                 this.nowData=this.getCarNum();
                 console.log(this.configs.v_Col8,this.nowData)
                 if(this.beforeData===this.nowData&&this.beforeData!==''){
                        if(this.getGlobString1===''){
                            this.setGlobString1(this.nowData);
                            this.isEnd=true;
                        }
                 }
                 if(this.isEnd){
                     if(this.beforeData===this.nowData&&this.beforeData===''){
                        if(this.getGlobString1!==''){
                            this.setGlobString1('');
                            this.isEnd=false;
                        }
                     }
                 }
             },num);  
          return this.listenEvent;
        },
   },
   computed: {
        IPCamera:{
            get(){
                return document.getElementById(this.configs.id);
            }
        },
        ...mapGetters(['getGlobString1','getGlobString2' ]),
    },
   components:{
   },
   beforeMount(){
        this.gbGlobConf=util.getLocalStorage('GBConf');
   },
   mounted(){
       //console.log(this.configs)
       this._cameraInit();
       let carNumRecognite=this.gbGlobConf.commonConf.baseConf.carNumRecognite;
       if(carNumRecognite){
           if(!carNumRecognite.disabled){
                if(this.configs.b_Col18){
                    this._listenEvent(carNumRecognite.frequency);
                }
           }
       }
   },
   beforeDestroy() {
        console.log('正在销毁摄像机连接')
        this.IPCamera.destroy();
         let carNumRecognite=this.gbGlobConf.commonConf.baseConf.carNumRecognite;
            if(carNumRecognite){
                if(!carNumRecognite.disabled){
                        if(this.configs.b_Col18){
                        window.clearInterval(this.listenEvent);
                        }
                }
            }
        
   },
   watch:{
       carNum:function(n){
       }
   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css" rel="stylesheet/css" scoped>
.title {background-color: #333;width:100%;height:20px;color:aliceblue;font-size:12px;line-height:20px;padding-left:5px;}
</style>
