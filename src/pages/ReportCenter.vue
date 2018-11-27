
<template>
<div class="panel">
    <div class="header">
        <div class="left">
			    <div class="logowrapper">
					<img class="logo" src="/img/logo.png"  />
				</div>
				<div class="title">{{systemTitleName}}</div>
				<div class="org" @click="_orgSel" v-clickoutside="_hiddenBlock">
					<p class="orgtitle">
						<i class="icon-office"></i>
						{{OrgName}} 
						<i class="icon-chevron-down"></i>
					</p>
					<div class="orgPanel" v-show="OrgShow">
						<el-tree style="height:100%" ref="tree"
							:data="OrgData" 
							:props="defaultProps"
							:load="loadNode"
							:render-content="renderContent"
							lazy
							:node-key="defaultProps.id" 
							:default-expanded-keys="defaultExpandedKeys"
							:expand-on-click-node="false"
							@node-click.self="nodeclick">
						</el-tree>
					</div>
				</div>
				
		</div>
		<div class="right">
			<ul>
				<li @click="_loginCenter"><i class="icon-users icon"></i><span>用户中心</span></li>
			    <li @click="_loginout"><i class="icon-switch2  icon"></i><span>注销登录</span></li>
			</ul>
			
		</div> 
    </div>
	<div class="nav">
			
			<div class="item" @click="_gohome" :class="{'menuActive':menuIndex=='-1' }">
				<div  class="icon">
					<i class="icon-home"></i>
				</div>
				<div class="text">首页</div>
			</div>
			<div class="item" v-if="menuList.length==0">
				加载中...
			</div>
			<div class="item"  :class="{'menuActive':index===menuIndex }"
				v-for="(i,index) in menuList" 
				:key="index"
				@click="_renderMenu(i,index)"
			>
				<div  class="icon">
					<i :class="i.icon"></i>
				</div>
				<div class="text">{{i.name}}</div>
			</div>
			
	</div>
    <div class="body">
				<!-- 菜单栏区域 -->
				<div class="menu" v-if="menuShow"  :class="{'menuClose':!expendMenu}" >
					<div class="warper">
						<div class="menuhead">
							<i class="icon-grid icon "></i>
							<span class="text">{{secondMenuItem.name}}</span>
							
						</div>
						<ul class="second">
							<!-- 包含三级 -->
							<li v-for="(i,index) in secondMenuItem.items" :key="index" >
								<div class="menutag " >
									<i :class="i.icon" class="icon"></i>
									<span class="text">{{i.name}}</span>
								</div>
								<ul class="thrid" > 
									<li class="menulink" v-for="(ii,indexl) in i.items" :key="indexl"
										@click="_goPage(ii,index+'|'+indexl)"  :class="{'itemActive':(index+'|'+indexl)===itemIndex }"
										>
										<i :class="ii.icon" class="icon"></i>
										<span class="text">{{ii.name}}</span>
										<i class="icon-chevron-right icon right"></i>
									</li>
								</ul>
							</li>
  
						</ul>
					</div>
					<div class="expendBtn" @click="_expendMenu" :class="{'closeBtn':!expendMenu}" >
				 	</div>
				</div>
			     
				<!-- 内容填充区域 -->
				<div class="main" :class="{'mainEx':!(expendMenu&menuShow)}" >
						<transition name="fade" >
								<router-view></router-view>
						</transition>
				</div>
    </div>
</div>
</template>

<script type="text/babel">
import util from '@/common/js/util.js';
import fetch from '@/api/fetch.js';
import treeMixn from '@/mixns/tree.js';
import { requestGetUserMenu } from '@/api/login';
import {requestGetOrganizeTreeListByParent} from '@/api/organize'
export default {
	mixins: [treeMixn],
    data(){
        return{
				systemTitleName:window.getClientObj().sysConf.titleName,
				OrgShow:false,
				OrgName:'',
				OrgId:'',
				OrgData:[],
				menuList:[],
				secondMenuItem:{},
				menuLoading:false,
				defaultProps:{
					children:'children',
					label: 'text',
              		id: 'id'
				},
				defaultExpandedKeys:[],
				menuShow:false,
				menuIndex:-1,
				itemIndex:'0|0',
				expendMenu:true,
				
            }   
    },
    computed:{
    },
    methods:{
        //注销登录
		  _loginout(){
		        this.$confirm('确认退出系统吗?', '提示', {
		          type: 'warning'
		        }).then(() => {
                        //清空 localstorage、cookie
                        util.resetLogin();
                        if(!getClientObj().loginType){
                             this.$router.replace('/login');
                        }else{
                           window.location =getClientObj().singleLogin.url+'/cas/logout?service='+ getClientObj().singleLogin.url+'/cas/login?service='+getClientObj().sysConf.url+'/api/Cas';
                        }
		        }).catch(() => {
		        });
		  },
		  _loginCenter(){
			  this.$router.replace('/Index');
		  },
		  _orgSel(){
			  this.OrgShow=!this.OrgShow;
		  },
		   _hiddenBlock(){
			  this.OrgShow=false;
		  },
		  nodeclick(node){
				util.setCookie('reportOrg',JSON.stringify(node),1);
				this.OrgName=node.text;
				this.OrgShow=false;
				//跳转
				this.$router.replace({path: '/redirect' + this.$route.fullPath})
		  },
		  loadNode(node, resolve){
            if(node.level === 0) {
				let OrgInfo=this.getUserInfo(true).user;
				 this.OrgData=[{
					id:OrgInfo.manageOrgId,
					text:OrgInfo.manageOrgName,
					code:OrgInfo.orgCode,
					funcCode:OrgInfo.orgCategory,
				}]
				this.defaultExpandedKeys=[OrgInfo.manageOrgId];
				let reportOrg=util.getCookieValue('reportOrg');
				if(reportOrg!==''){
						this.OrgName=JSON.parse(reportOrg).text;
				}else{
						this.OrgName=OrgInfo.manageOrgName;
						util.setCookie('reportOrg',JSON.stringify(this.OrgData[0]),1);
				}
				resolve(this.OrgData);
            }else
            {
				requestGetOrganizeTreeListByParent(node.data.id).then(data=>{
						if(data.success){
							resolve(data.result);
						}
						else {
							this.$message.error('获取数据失败！');
						}
				})
            }
		  },
		   //获取菜单列表
		  _getMenu(){
			  let params={};
			  this.menuLoading=true;
			  params.appCode='YLMREPV8.0';
			  var _this=this;
			  requestGetUserMenu(params).then(
					data => {
							if(data.success){
								this.menuList=data.result.userMenu.items;
							} 
							this.menuLoading=false;
						}).catch(function (error) {
							_this.menuLoading=false;
						});
		  },
		  _expendMenu(){
			  this.expendMenu=!this.expendMenu;
		  },
		 
		  _renderMenu(i,index){
			  this.menuIndex=index;
			  if(i.url!=''){
				  //直接跳转至页面
				  util.removeLocalStorage('secMenu');
				  this.menuShow=false;
				  this.$router.push({ path:i.url});
			  }else{
				  //显示左侧菜单栏并显示第一个模块
				  this.itemIndex='0|0';
				  if(i.items[0].items[0].url!=''){
						this.secondMenuItem=i;
						util.setLocalStorage('secMenu',JSON.stringify(i));
						this.$router.push({ path:i.items[0].items[0].url});
						this.menuShow=true;

				  }else{
					   this.$message.warning('该模块路由地址为空！');
				  }
			  }
		  },
		  _gohome(){
			   this.menuIndex=-1;
			   util.removeLocalStorage('secMenu');
				this.menuShow=false;
			   this.$router.push({ path:'/ReportCenter/home'});
			   
		  },
		  _goPage(i,index){
			  this.itemIndex=index;
			  this.$router.push({ path:i.url});
		  },
		  getSystemConf(){
			  //获取系统LocalREALOrgID
			  fetch({
				  url:"/api/services/app/session/GetOrgIdByGq?orgId="+this.getLocalOrgId(),
				  method:'post',
				  data:{}
				  }).then((data)=>{
				  if(data.success){
					  util.setCookie('localRealOrgId',data.result,1);
				  }
			  }).catch((err)=>{})
		  },
		  init(){
			  //判断路由地址
			  if(this.$route.fullPath==='/ReportCenter/home'||this.$route.fullPath==='/ReportCenter/orderView'){
				 util.removeLocalStorage('secMenu');
				 this.menuShow=false;
			  }else{
				   let menulist=util.getLocalStorage('secMenu');
					if(menulist!==''){
						this.secondMenuItem=menulist;
						this.menuShow=true;
					}
			  }
			  document.title='数据报表中心';
			  this._getMenu();
			  this.getSystemConf();
		  },
	},
	components:{
	},
    mounted(){
		this.init();
	},
	beforeRouteEnter(to, from, next){
		next();
	},
	watch:{
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.panel
	width 100%
	height 100%
	display flex
	background-color #e1e5ea
	flex-direction column
	.header
		height 55px
		width 100%
		display flex
		flex-direction row
		background-color #1f2d3d
		.left
			width 70%
			display flex
			flex-direction row
			padding-top 5px
			padding-left 20px
			display flex
			flex-direction row
			position relative
			.logo
				height 45px
				width 55px
			.title
				font-size 20px
				font-family SimSun
				color #fdf5f5
				font-weight 500
				height 45px
				line-height  45px
				padding-left 10px
			.org
				min-width 40%
				max-width 60%
				color #E6A23C
				height 45px
				line-height  45px
				padding-left 15px
				font-size 14px
				cursor pointer
				position relative
				.orgtitle
					overflow hidden
					white-space nowrap
					text-overflow ellipsis
				.orgPanel
					position absolute
					height 350px
					width 450px
					background-color #fff
					z-index 11000
					left 0
					top 60px
					border  1px solid rgb(191, 203, 217)
					color #1F2D3D
					overflow auto
					box-sizing  border-box   
		.right
			flex 1
			padding-right 10px
			ul	
				list-style:none
				display inline-block
				height  55px
				width 100%
				text-align right
				li 
					width:60px
					height:52px
					display: inline-block
					color: #B2B2B2
					text-align:center
					padding-top:5px
					.icon 
						font-size:22px
						line-height:25px
					span 
						display: block
						height: 15px
						padding-top:5px
						font-size:12px
				li:hover
					cursor pointer
					color #b6d06c
					background-color #475669
	.nav
		height 55px
		width 100%
		display flex
		flex-direction row
		background-color #fff
		box-shadow 0px 4px 2px rgba(0,0,0,.1)
		align-items center
		justify-content center
		.item
			width 80px
			text-align center
			color #707070
			cursor pointer
			.icon
				font-size 20px
			.text
				font-size 12px
				padding-top 3px
			&:hover
				color #3c99d5
			
	.body
		flex 1
		width 100%
		height 100%
		box-sizing border-box
		.menu
			position absolute
			z-index 0
			top 120px
			left 10px
			bottom 10px
			width 220px
			display flex
			.expendBtn
				background url(/img/closeMenu.png) no-repeat center
				width 10px
				cursor pointer
			.closeBtn
				background url(/img/expendMenu.png) no-repeat center
			.warper
				flex 1
				background-color #fff
				font-size 14px
				box-sizing border-box
				box-shadow 3px 3px 2px rgba(0,0,0,.1)
				overflow auto 
				.menuhead
					background-color rgba(5,90,158,0.1)
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
							&:hover
								color #3c99d5
								border-left 3px solid  #3c99d5
								background-color rgba(5,90,158,0.1)
		.menuClose
			left -210px
		.main
			position absolute
			z-index 0
			top 120px
			left 230px
			right 10px
			bottom 10px
			box-sizing border-box
			box-shadow 3px 3px 2px rgba(0,0,0,.1)
		.mainEx
			left 10px

	.menuActive
		color #3c99d5 !important
	.itemActive
		color #3c99d5 !important
		border-left 3px solid  #3c99d5 !important
		background-color rgba(5,90,158,0.1) !important

			

    





			



            
                    
</style>