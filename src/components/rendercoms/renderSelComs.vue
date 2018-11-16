<template>

     <!--带panel的逐步加载树-->
     <yl-commontreewithpanel
        v-if="option.type==='commontreewithpanel'"   
        :nodeStateConf="option.elmentConfig.nodeStateConf"
        :expandOnClickNode="option.elmentConfig.expandOnClickNode"
        :highlightCurrent="option.elmentConfig.highlightCurrent"
        :panelWidth="option.elmentConfig.panelWidth"
        :titleName="option.elmentConfig.titleName"
        :code="option.elmentConfig.code"
        :orgId="option.elmentConfig.orgId"
        @getCurrentNode="_change"
      >
    </yl-commontreewithpanel>

     <!--带panel的全部加载树-->
     <yl-commonalltreewithpanel
        v-else-if="option.type==='commonalltreewithpanel'"   
        :nodeStateConf="option.elmentConfig.nodeStateConf"
        :expandOnClickNode="option.elmentConfig.expandOnClickNode"
        :highlightCurrent="option.elmentConfig.highlightCurrent"
        :isexpand="option.elmentConfig.isexpand"
        :titleName="option.elmentConfig.titleName"
        :panelWidth="option.elmentConfig.panelWidth"
        :code="option.elmentConfig.code"
        :orgId="option.elmentConfig.orgId"
        @getCurrentNode="_change"
      >
    </yl-commonalltreewithpanel>

      <!--带panel的组织机构树-->
     <yl-organizetreewithpanel
        v-else-if="option.type==='organizetreewithpanel'"   
        :nodeStateConf="option.elmentConfig.nodeStateConf"
        :expandOnClickNode="option.elmentConfig.expandOnClickNode"
        :highlightCurrent="option.elmentConfig.highlightCurrent"
        :panelWidth="option.elmentConfig.panelWidth"
        :isexpand="option.elmentConfig.isexpand"
        @getCurrentNode="_change"
      >
    </yl-organizetreewithpanel>
    
    <!--带panel的材料类别树-->
     <yl-materialclasstreewithpanel
        v-else-if="option.type==='materialclasstreewithpanel'"   
        :nodeStateConf="option.elmentConfig.nodeStateConf"
        :expandOnClickNode="option.elmentConfig.expandOnClickNode"
        :highlightCurrent="option.elmentConfig.highlightCurrent"
        :panelWidth="option.elmentConfig.panelWidth"
        @getCurrentNode="_change"
      >

    </yl-materialclasstreewithpanel>
      
    <!--带panel的工号树-->
     <yl-ghtreewithpanel
        v-else-if="option.type==='ghTreeWithPanel'"   
        :nodeStateConf="option.elmentConfig.nodeStateConf"
        :expandOnClickNode="option.elmentConfig.expandOnClickNode"
        :highlightCurrent="option.elmentConfig.highlightCurrent"
        :panelWidth="option.elmentConfig.panelWidth"
        @getCurrentNode="_change"
      >
    </yl-ghtreewithpanel>

    <!--带panel的标准工号库-->
     <yl-standardghtreewithpanel
        v-else-if="option.type==='standardghtreewithpanel'"   
        :nodeStateConf="option.elmentConfig.nodeStateConf"
        :expandOnClickNode="option.elmentConfig.expandOnClickNode"
        :highlightCurrent="option.elmentConfig.highlightCurrent"
        :panelWidth="option.elmentConfig.panelWidth"
        @getCurrentNode="_change"
      >
    </yl-standardghtreewithpanel>

 </template>

<script type="text/babel">
import GHTreeWithPanel from '@/ocomponents/gh/GHTreeWithPanel'
import organizeTreeWithPanel from '@/ocomponents/organize/organizeTreeWithPanel'
import standardGHTreeWithPanel from '@/ocomponents/standardgh/standardGHTreeWithPanel'
import materialClassTreeWithPanel from '@/ocomponents/materialclass/materialClassTreeWithPanel'
export default {
    data(){
        return{
        }
    },
    props:{
        option:{
            type:Object,
            require:true
        },
        
    },
    methods:{
        _change(node){
              this.$emit("getCurrentNodeWithPanel",node,this.option)
        },
        _initComs(){
          this.$emit('init',this);
      },
    },
    components:{
       'yl-organizetreewithpanel':organizeTreeWithPanel,
       'yl-ghtreewithpanel':GHTreeWithPanel,
       'yl-standardghtreewithpanel':standardGHTreeWithPanel,
       'yl-materialclasstreewithpanel':materialClassTreeWithPanel,
    },
    beforeMount(){
       this._initComs();   
    },
    mounted(){
       
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
