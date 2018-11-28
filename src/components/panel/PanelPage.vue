<template>
	<div class="portlet"
	 v-loading="treeLoading"
	 element-loading-text="加载中..."
	 ref="portlet"  
	 :class="{'fullscreen':fullScreen}" 
	 :style="{ 'width': widthNum, 'height': heightNum }"
	
	 > 
			<div class="portlet-title"
				:class="{'portlet-title-zone':isZone}" 
				:style="{'background':_getBgColor(theme)}"
				v-if="!hiddenTitle"
			 >
				<div class="tool">
					<el-tooltip class="item" effect="dark" content="更多" placement="top">
						<a  v-if="linkUrl" @click="_linkUrl"><i class="icon-link"></i></a>
					</el-tooltip>
					<el-tooltip class="item" effect="dark" content="帮助" placement="top">
						<a class="help" v-if="helpIsShow" @click="showDoc"><i class="icon-info"  ></i></a>
					</el-tooltip>
					<el-tooltip class="item" effect="dark" content="刷新" placement="top">
						<a class="reload" v-if="reloadIsShow" @click="_reload"><i class="icon-spinner11"></i></a>
					</el-tooltip>
					<el-tooltip class="item" effect="dark" content="全屏" placement="top">
						<a class="fullscreen" v-if="fullScreenIsShow" @click="_openByFullScreen"><i :class="fullScreenIcon"></i></a>
					</el-tooltip>
				</div>
				
				<div class="titleName">
						<a class="back" v-if="BackIsShow" @click="_goBack"><i class="icon-undo2" ></i>返回</a>
						<span><i :class="icon" ></i>{{titleName}}</span>
				</div>
			</div>  
			<div class="portlet-body"
				:style="{ 'background-color':_getBgColor(theme)}"
			 >
				<slot name="content">
				</slot>
			</div>
			<div  v-if="document" :class="{'document':document} " > 
				<div class="close" @click="_close"><i class="el-icon-close"></i></div>
				<div class="content w-e-text" v-html="helpContent"  ></div>
			</div>
	</div>
</template>
<script type="text/babel">
export default {
	data(){
		return {
			fullScreen:false,
			fullScreenIcon:'icon-enlarge',
			isvisable:true,
			document:false,
			menuCode:'',
			helpContent:'<p style="color:#20A0FF">加载中，请稍后...</p>'
		}
	},
	computed:{
	},
	props:{
		linkUrl:{
			required: false,
            type: String,
            default:''
		},
		hiddenTitle:{
			required: false,
            type: Boolean,
            default:false
		},
		reloadIsShow:{
			required: false,
            type: Boolean,
            default:false
		},
		fullScreenIsShow:{
			required: false,
            type: Boolean,
            default:false
			},
		helpIsShow:{
			required: false,
            type: Boolean,
            default:true
			},
		BackIsShow:{
			required: false,
            type: Boolean,
            default:false
		},
		titleName:{
			required: false,
            type: String,
            default:''
			},
		heightNum:{
			required: false,
            type: String,
            default:'100%'
			},
		widthNum:{
			required: false,
            type: String,
			default:'auto'
			},
		icon:{
			required: false,
            type: String,
			default:'fa fa-angle-right'
			},
		treeLoading:{
			required: false,
            type: Boolean,
			default:false
		},
		isZone:{
			required: false,
            type: Boolean,
			default:false
		},
		theme:{
			required: false,
            type: String,
			default:''
			},
	},
	methods:{
		_close(){
			this.document=false;
		},
		_openByFullScreen() {
			this.fullScreen=!this.fullScreen;
			if(this.fullScreen)
			{
				this.fullScreenIcon='icon-shrink';
			}
			else{
				this.fullScreenIcon='icon-enlarge';
			}
		},
		_goBack(){
			this.$router.go(-1);
		},
		_reload(){
			 this.$emit('reload');
		},
		_linkUrl(){
			if(this.linkUrl!=''){
				  this.$router.push({ path:this.linkUrl});
			}
		},
		_getBgColor(str){
			if(this.theme==="primary"){return "#fff";}
			else if(this.theme==="info"){return "#e1e5ea";}
			else if(this.theme==="success"){return "#F1F6F7";}
			else if(this.theme==="warning"){return "#F8FFDB";}
			else if(this.theme==="danger"){return "#FFFAF4";}
			else{return this.theme;}
		},
	 async showDoc(){
				//获取模块标识
				this.document=!this.document;
				if(this.document){
						if(this.$route.params.tableName==undefined){
							this.menuCode=this.$route.path.split('/').pop();
						}else{
							this.menuCode=this.$route.params.tableName;
						}
						 let inputArrs=[ 
								{dataField:"ExtendColumn1",op:"EQ",dataValue:this.menuCode},
							];
						 let params={queryConditionItem:inputArrs,sorting:''}
						let  result= await  this.asyncFunc({
                                                    url:'api/services/app/informationPublish/getMainObjectForEdit',
                                                    method:'post',
                                                    data:params
												},'获取帮助信息');
						if(result.order!=null){
								this.helpContent=result.order.content;
						}else{
							this.helpContent='<p style="color:#20A0FF">该模块文档暂未编辑！</p>';
						}
				 }
		}
	},
	mounted() {
	},
	watch:{
	}

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
	.portlet
		background: #fff
		display:flex
		flex-direction:column
		border-radius:4px
		box-shadow 0px 4px 2px rgba(0,0,0,0.1)
		.portlet-title
			height:26px
			min-height:26px
			padding-left:10px
			background: url(/image/tab_title_bg.png)
			.titleName
				padding-left:8px
				color:#716c6c
				font-size:12px
				line-height:26px
				i
					padding-right:4px
				.back
					margin-right:10px
					color:#3C99D5
					&:hover
						color:#6CC3FB
			.tool
				height:26px
				line-height:26px
				padding-right:10px
				float:right
				a
					color:#b7b7b7
					font-size:12px
					padding-right:3px
					&:hover
						color:#716c6c
		.portlet-title-zone
			height:26px
			min-height:26px
			background: url(/image/tab_title_bg.png)
			box-sizing:border-box
			border:1px  #e1e5ea solid
			border-bottom:none
			.titleName
				font-size:12px
				line-height:26px
			.tool
				height:24px
				line-height:24px
				a
					font-size:12px
					padding-right:3px
					&:hover
						color:#716c6c
		.portlet-body
			flex:1
			width:100%
			box-sizing:border-box;
			border:1px  #e1e5ea solid;
			overflow:auto;
			&>div
				height:100%
		.document
			position:absolute
			dispaly:block
			right:0px
			top:0px
			bottom:0px
			width:100%
			z-index:10000
			border 1px #fff solid
			background:#fff
			opacity: 0.9
			overflow auto
			.close
				position:absolute
				dispaly:block
				right:0px
				top:10px
				height 35px
				width  35px
				margin-right 10px
				color #99A9BF
				font-size 25px
				&:hover
					color #475669
		&.fullscreen
			z-index:10000
			position:fixed
			top:0
			left:0
			bottom:0
			right:0
			width:100% !important
			height:100% !important
			margin:0px
</style>
