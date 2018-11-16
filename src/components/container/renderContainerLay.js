import fetch from '@/api/fetch';
import util from '@/common/js/util';
export default{
    data(){
        return {
            refList:{}
        }
    },
    props: {
        options:{
            type:Array,
            default:function(){
                return []
            }
        },
        constPrams:{
            type:Object,
            default:function(){
                return {}
            }
        },
    },
    methods:{
            renderItem(conf){
                    return conf.map((itemData,index)=>{
                        if(itemData.isLeaf){
                            //子节点
                            if(itemData.panelZone===undefined){
                            return  <el-col span={itemData.position.spanNum} style={itemData.style}>
                                        <yl-containercoms     
                                            option={itemData.option}
                                            constPrams={this.constPrams}
                                            outParams={itemData.outParams}
                                            refList={this.refList}
                                        >
                                        </yl-containercoms>
                                    </el-col>
                            }else{
                                return <el-col span={itemData.position.spanNum} style={itemData.style}>
                                                <yl-panelpage 
                                                    titleName={itemData.panelZone.titleName} 
                                                    icon={itemData.panelZone.icon} 
                                                    fullScreenIsShow={itemData.panelZone.fullScreenIsShow}
                                                    helpIsShow={itemData.panelZone.helpIsShow}
                                                    isZone={itemData.panelZone.isZone}
                                                    reloadIsShow={itemData.panelZone.reloadIsShow} 
                                                    theme={itemData.panelZone.theme} 
                                                    heightNum={itemData.panelZone.heightNum} 
                                                    widthNum={itemData.panelZone.widthNum}
                                                    linkUrl={itemData.panelZone.linkUrl}
                                                    hiddenTitle={itemData.panelZone.hiddenTitle}
                                                    BackIsShow={itemData.panelZone.BackIsShow}
                                                >
                                                <div slot="content">
                                                    <yl-containercoms     
                                                        option={itemData.option}
                                                        constPrams={this.constPrams}
                                                        outParams={itemData.outParams}
                                                        refList={this.refList}
                                                    >
                                                    </yl-containercoms>
                                                </div>
                                            </yl-panelpage>
                                    </el-col>
                            }
                        }else{
                            return  <el-col span={itemData.position.spanNum} style={itemData.style}>
                                    {
                                        this.renderItem(itemData.childContent)
                                    }
                                    </el-col>
                        }
                        
                    })  
         },
         
    },
    computed:{
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
    },
    components:{
    },
    mounted(){
    },
    render: function(h){
        let conf=this.options;
        if(conf.length>0){
          return  <el-row style="height:100%">
                     { 
                          this.renderItem(conf)
                     }
                 </el-row>
        }
    }
}