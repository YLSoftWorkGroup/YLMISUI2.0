
<template>
<div class="panel">
    <div class="body">
				<!-- 菜单栏区域 -->
				<div class="menu" 
					v-loading="menuLoading"
    				element-loading-text="菜单加载中..."
				>
						<div class="menuhead">
							<i class="icon-grid icon "></i>
							<span class="text">业务单据</span>
						</div>
						<ul class="second">
							<!-- 包含三级 -->
							<li v-for="(i,index) in menuList" :key="index" >
								<div class="menutag " >
									<i :class="i.icon" class="icon"></i>
									<span class="text">{{i.v_col11}}</span>
								</div>
								<ul class="thrid" > 
									<li class="menulink main-text-color" v-for="(ii,indexl) in i.children" :key="indexl"
										@click="_goPage(ii,index+'|'+indexl)"  :class="{'active-item':(index+'|'+indexl)===itemIndex }"
										>
										<i :class="ii.icon" class="icon"></i>
										<span class="text">{{ii.v_col11}}</span>
										<i class="icon-chevron-right icon right"></i>
									</li>
								</ul>
							</li>
						</ul>
				</div>
			
				<!-- 内容填充区域 -->
				<div class="main">
						 <div class="yl-config-page ">
							<div class="yl-config-loading" v-if="!isRender" >
								<div class="loading">
									<img  src="img/loading1.gif" alt="">
									<p>模块初始化中，请稍后...</p>
								</div>
								
							</div>
							<div class="yl-config-body" v-if="isRender">
								<yl-commonPage  
										v-if="moduleType==='commonPage'"
										:baseInfoConf="baseInfoConf"
										:apiConf="apiConf"
										:filterConf="filterConf"
										:tableInfoConf="tableInfoConf"
										:functionConf="functionConf"
										:formConf="formConf"
										:outPutConf="outPutConf">
								</yl-commonPage>


								<yl-reportassemble 
										v-else-if="moduleType==='assemblePage'"
										:baseInfoConf="baseInfoConf"
										:filterConf="filterConf"
										:tableInfoConf="tableInfoConf"
										:functionConf="functionConf">
								</yl-reportassemble>

								<yl-dynamicPage  
									v-else-if="moduleType==='dynamicPage'"
									:options="tableInfoConf">
								</yl-dynamicPage>
							</div>
						
						</div>
				</div>
    </div>
</div>
</template>

<script type="text/babel">
import util from '@/common/js/util.js';
import fetch from '@/api/fetch.js';
import {
         requestGetModuleConfForEdit
       } from '@/api/moduleconf';
export default {
    data(){
        return{
				menuList:[],
				menuLoading:false,
				defaultProps:{
					children:'children',
					label: 'text',
              		id: 'id'
				},
				menuIndex:-1,
				itemIndex:'0|0',
				currentUrl:'',
				isRender:false,
				mConfigs:{},
				tableInfoConf:{}
				
            }   
    },
    computed:{
				apiConf:function(){
                    return JSON.parse(this.mConfigs.apiConf,util.dealFunction).apiConf;
                },
                baseInfoConf:function(){
					let conf=JSON.parse(this.mConfigs.baseInfoConf,util.dealFunction).baseInfo;
					if(conf.moduleType!=undefined){
						conf.layout.columnlay.toolFunction.visiable=false;
					}
                    return conf
                },
                filterConf:function(){
                    return JSON.parse(this.mConfigs.fliterConf,util.dealFunction).filterConf;
                },
                functionConf:function(){
					let conf=JSON.parse(this.mConfigs.functionConf,util.dealFunction).functionConf;
					if(conf.funBtn){
						conf.funBtn={}
						conf.funState={}
					}
                    return conf
                },
                formConf:function(){
                    return JSON.parse(this.mConfigs.formConf,util.dealFunction).formConf;
                },
                outPutConf:function(){
                    return JSON.parse(this.mConfigs.extensionOne,util.dealFunction).outPutConf;
                },
                moduleType:function(){
                    return this.mConfigs.extensionFrive;
                },
		globalConf:{
                    get(){
                        return util.getLocalStorage('SysGlobConf');
                    }
                },
    },
    methods:{
			_goPage(i,index){
			  this.itemIndex=index;
			  this.currentUrl=i.url;
		  },
		   //获取菜单列表
		  _getMenu(){
			  let params={};
			  this.menuLoading=true;
			  var _this=this;
			  this.commonSqlExcute({
						firstKeys:"",
						firstValues:"",
						procName:"Pr_CommonExecuteSql",
						procType:0,
						secondKeys:"SelectOrderMenu",
						secondOperates:"",
						secondValues:""
					}).then((data) => {
							if(data.items.length>0){
										this.menuList=util.returnDatabyTree(data.items[0],this.guidOfNull())[0].children;
										this.currentUrl=this.menuList[0].children[0].url;
							}
										this.menuLoading=false;
							}).catch(function (error) {
										_this.menuLoading=false;
							});
		  },
		  createModule(url){
			 if(url!=''){
					let arr=url.split('/');
					if(arr.length!=5){
						this.$message.warning('该模块的配置不是单据配置，请重新设置该模块！');
					}else{
						this.isRender=false;
						let moduleCode=arr[3];
						let pageCode=arr[4];
						let inputArrs=[ 
								{dataField:"ExtensionTwo",op:"EQ",dataValue:moduleCode},
								{dataField:"VersionNum",op:"EQ",dataValue:this.globalConf.versionNum},
								{dataField:"PageName",op:"EQ",dataValue:pageCode},
								{dataField:"IsEnable",op:"EQ",dataValue:1},
							];
							fetch({
									url:"/api/services/app/moduleConf/GetModuleConfByKey",
									method:"post",
									data:inputArrs
								}).then((data)=>{
								if(data.success){
									if(data.result.order==null){
										this.$message.warning('该模块没有配置数据！');
									}else{
										this.mConfigs=data.result.order;
										let conf=JSON.parse(this.mConfigs.tableInfoConf,util.dealFunction).tableInfoConf;
										
										this.tableInfoConf=conf;
										this.isRender=true;
									}
								}  
								else {
									this.$message.error('失败！'+data.error.message);
								}
							}).catch(err=>{
						});
				    }
			 }
             
          },
	},
	components:{
	},
    mounted(){
		this._getMenu();
	},
	watch:{
		currentUrl:function(n,o){
			this.createModule(n);
		}
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.panel
	width 100%
	height 100%
	background-color #e1e5ea
	.body
		width 100%
		height 100%
		box-sizing border-box
		.menu
			position absolute
			z-index 0
			top 5px
			left 10px
			bottom 0px
			width 220px
			background-color #fff
			font-size 12px
			box-sizing border-box
			box-shadow 3px 3px 2px rgba(0,0,0,.1)
			overflow auto
			.menuhead
				background-color rgba(26,187,160,0.1)
				height 35px
				padding 5px 10px
				line-height 25px
				text-align left
				box-sizing border-box
			.second
				width 100%
				height  cacl(100% - 35px)
				.menutag
					border-bottom 1px solid #e1e5ea
					height 40px
					padding 5px 10px
					line-height 30px
					text-align left
					box-sizing border-box
					color  #909399
					cursor auto
					overflow hidden
					text-overflow ellipsis
				.thrid
					width 100%
					.menulink
						border-bottom 1px solid #e1e5ea
						height 40px
						padding 5px 10px
						line-height 30px
						text-align left
						box-sizing border-box
						color #606266
						cursor pointer
						padding-left 30px
						overflow hidden
						text-overflow ellipsis
						.right
							display inline-block
							float right
							padding-top 10px
		.main
			position absolute
			z-index 0
			top 5px
			left 230px
			right 0px
			bottom 0px
			padding-left 10px
			box-sizing border-box
			.yl-config-page
				height 100%
				width 100%
				.yl-config-body
					height 100%
					width 100%
				.yl-config-loading
					height 100%
					width 100%
					background-color #fff
					.loading
						height 100px
						width 300px
						text-align center
						color #4388C9
						font-size 14px
						margin  0 auto
						padding-top 200px
            
</style>