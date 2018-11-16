<template>
	<yl-panelpage
			:titleName="options.panelpage.titleName" 
			:icon="options.panelpage.icon"
			:fullScreenIsShow="options.panelpage.fullScreenIsShow"
			:helpIsShow="options.panelpage.helpIsShow"
			:BackIsShow="options.panelpage.backIsShow"
			:linkUrl="options.panelpage.linkUrl"
			:hiddenTitle="options.panelpage.hiddenTitle"
			:theme="options.panelpage.theme"
		>
		<div slot="content">
			<renderContainerLay
				:options="options.content"
				:constPrams="constPrams" 
			>
			</renderContainerLay>	
			 <el-dialog ref="dynamicDialog" 
                    v-model="itemVisible" 
                    :close-on-click-modal="true"
                    lock-scroll
                    :modal-append-to-body="false"
                    :title="itemConf.dialogConf.title" 
                    :size="itemConf.dialogConf.size"
                    :top="itemConf.dialogConf.top">
                     <yl-containercoms     
                            v-if="itemVisible"
                            :option="itemConf.option"
                            :outParams="itemConf.outParams"
                            @init="_initComs"
                    > 
                    </yl-containercoms>
                </el-dialog>
		</div>
	</yl-panelpage>
</template>

<script type="text/babel">
import fetch from '@/api/fetch';
import util from '@/common/js/util';
import { mapGetters,mapActions } from 'vuex';
import renderContainerLay from '@/components/container/renderContainerLay'
export default {
	data(){
		return {
			constPrams:{},
			itemVisible:false,
			itemConf:{
                    dialogConf:{
							title:'',
							size:'large',
							top:'8%',
                        }, 
                        option:{}
                   },
		}
	},
	props:{
		options:{
			type:Object,
			default:function(){
				return {}
			}
		}
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
		...mapGetters([ 'getGlobObject1','getGlobObject2','getGlobString1','getGlobString2','getGlobArray1' ]),
	},
	methods:{
		 ...mapActions(['setGlobObject1','setGlobObject2','setGlobString1','setGlobString2','setGlobalArray1']),
		_initEvent(){
            let _this=this,option=this.options.InterceptEvent;
            if(option!=undefined){
                let eventConf=option.init;
                 if(eventConf!=undefined){
                        if(eventConf.isOn){
							let filterParams=this.getGlobObject2;
                            eventConf.event(_this,this.options,filterParams);
                        }
                    }
            }
		},
		_initComs(_coms){
            let _this=this,option=_coms.option;
            if(option.InterceptEvent!=undefined){
                let eventConf=option.InterceptEvent.init;
                 if(eventConf!=undefined){
                        if(eventConf.isOn){
                            eventConf.event(_this,option,_coms.outParams);
                        }
                    }
			}
		}, 
		init(){
			   this._initEvent();   
		   },  
	},
	beforeMount(){
	
	},
	mounted(){
			this.init();
	},
	components:{
		renderContainerLay
	},
	watch:{
		getGlobString2:function(n,o){
			   if(n.substring(0,6)==='reload'){
				   this.init();
			   }
			   if(n.substring(0,8)==='itemOpen'){
				   this.itemVisible=true;
				   this.itemConf=this.getGlobObject1;

			   }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
