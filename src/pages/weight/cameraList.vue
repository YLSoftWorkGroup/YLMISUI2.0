<template>
   <div v-if="isRender" class="cameralist">
    <cameraComponents  v-for="(item,index) in configs"  :key="index" 
        :ref="item.id"
        :configs="item"
        :desCode="desCode"
        >
    </cameraComponents>
   </div>
</template>

<script type="text/babel">
import cameraComponents from './cameraComponents';
export default {
    data(){
        return{
            isRender:false
        }   
    },
    props:{
       configs:{
           type:Array,
           default:function(){
               return []
           }
       },
       desCode:'',
    },
    components:{
       cameraComponents,
   },
   methods:{
        //获取摄像机列表参数
        getCameraListInfo(){
            let CameraInfoList=[];
            this.configs.map((i,index)=>{
                let obj=this.$refs[i.id][0].getImginfo();
                CameraInfoList.push(obj);
            })
            return CameraInfoList;
        }
   },
   watch:{
       configs:function(n,o){
           if(n.length>0){
                this.isRender=true;
           }
           
       }
   }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.cameralist
    display:flex;
    flex-direction:row;
</style>


