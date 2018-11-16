
<template>
<yl-panelpage titleName="视频监控" icon="" BackIsShow  >
    <div slot="content">
        <div class="main">
                     <div class="info">
                        <p class="name">项目名称：{{itemData.v_Col6}}</p>
                        <p class="name">设备名称：{{itemData.v_Col10}}</p>
                        <p class="name">设备序号：{{itemData.v_Col11}}</p>
                        <p class="name">设备通道：{{itemData.v_Col12}}</p>
                    </div>
                    <video :id="itemData.id" class="video" poster="" controls playsInline webkit-playsinline autoplay>
                            <source :src="itemData.v_Col8" type="rtmp/flv" />
                            <source :src="itemData.v_Col9" type="application/x-mpegURL" />
                    </video>
        </div>
    </div>
</yl-panelpage>
</template>
<script type="text/babel">
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      OrgName: "",
      itemData: {}
    };
  },
  props: {},
  computed: {
    ...mapGetters([
      "getGlobObject1",
      "getGlobObject2",
      "getGlobString1",
      "getGlobString2",
      "getGlobArray1"
    ])
  },
  methods: {
    ...mapActions([
      "setGlobObject1",
      "setGlobObject2",
      "setGlobString1",
      "setGlobString2",
      "setGlobalArray1"
    ])
  },
  beforeMount() {
    this.itemData = this.getGlobObject1;
  },
  mounted() {
      console.log(window);
      new ezuikit(this.itemData.id);
  },
  components: {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
    .main
        padding: 10px 50px;
        .video 
            width: 100%;
        .info
            color: #868847;
            padding: 10px;
            background-color: #DFF0D8;
            margin-bottom: 10px;
            font-size: 14px;
            line-height: 20px;


</style>


