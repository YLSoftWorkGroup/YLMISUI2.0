<template>
<div class="main" ref="main" :style="{'width': bodyStyle.width, 'height': bodyStyle.height }">
	<div class="header" >
		<div class="left">
			<div class="logowrapper">
					<img class="logo" src="img/zgztlogo.png"  />
				</div>
				<div class="title">{{systemTitleName}}</div>
		</div>
		<div class="right">
			<ul>
				<li @click="_loginCenter"><i class="icon-users icon"></i><span>用户中心</span></li>
				<li @click="_reportCenter"  v-if="hasReportCenter"><i class="icon-stats-dots icon"></i><span>报表中心</span></li>
			    <li @click="_loginout"><i class="icon-switch2  icon"></i><span>注销登录</span></li>
			</ul>
			
		</div> 
	</div>
  	<div class="content" >
			<div class="left-wrapper" :class="{  'left-wrapper-close':isClose}"  >
			   <el-menu default-active="/home"  class="el-menu-vertical" v-loading="menuLoading" element-loading-text="菜单加载中..."   @open="_handleOpen" @close="_handleClose" unique-opened :router="true">
					<el-menu-item index="/home" class="single"><i class="menuicon icon-home" ></i>系统门户</el-menu-item>
						<el-submenu :index="findex+'f'" class="el-submenu-main"   v-for="(fristmenulist,findex) in menuList" :key="findex"> 
							<template slot="title" ><i  class="menuicon" :class="fristmenulist.icon"></i>{{fristmenulist.displayName}}</template>
									<el-submenu :index="sindex+'s'" class="el-submenu-item" v-for="(secondmenulist,sindex) in fristmenulist.items" :key="sindex">
										<template slot="title"><i class="menuicon" :class="secondmenulist.icon"></i>{{secondmenulist.displayName}}</template>
											<el-menu-item :index="thirdmenulist.url" v-for="(thirdmenulist,index) in secondmenulist.items" :key="index">{{thirdmenulist.displayName}}</el-menu-item>
									</el-submenu>
					  </el-submenu>
					   <!-- <el-menu-item index="/apitest" class="single"><i class="icon-home"></i>API测试界面</el-menu-item> -->
					 <!-- <el-menu-item index="/pages/comdemo" class="single"><i class="icon-home"></i>业务组件用例</el-menu-item>
					 
					  <el-menu-item index="/pages/test" class="single"><i class="icon-home"></i>测试界面</el-menu-item> -->
					   <!-- <el-menu-item index="/pages/jsobjturn" class="single"><i class="icon-home"></i>js转化json</el-menu-item> -->
					
				</el-menu>
			</div>
			<div class="main-wrapper" :class="{'main-wrapper-expend':isClose}">
				 <div class="shrinkage" @click="_showMenu"></div>
				  <div class="dynamicmodel">
						<transition name="fade" >
							<!-- <keep-alive :include="includedComponents"> -->
								<router-view></router-view>
							<!-- </keep-alive> -->
						</transition>
					</div>
			</div>
	</div>
	<div class="foot">
		<div class="systeminfo">
			<span ><i class="icon-info2 icon"></i> {{appObj.appDescription}}</span>
			<span >({{globalConf.versionNum+'_'+globalConf.updateNum}}) </span>
		</div>
		<div class="userinfo">
			<el-popover
				placement="top-start"
				title="用户信息"
				trigger="hover">
				<div>
					<span > | 当前用户： {{userInfo.user.realName}}</span>
				</div>
				<div>
					<span > | 当前角色： {{userInfo.user.roleName}}</span>
				</div>
				<div>
					<span > | 组织机构： {{userInfo.user.manageOrgName}}</span>
				</div>
				
				<span slot="reference"><i class="icon-user-tie icon"></i></span>
			</el-popover>
			<span > | 
					<i class="icon-color-mode" style="color:#409EFF" @click="_changeTheme('theme-default')"></i>
					<i class="icon-color-mode" style="color:#1BD8A9" @click="_changeTheme('green')"></i>
					<i class="icon-color-mode" style="color:#BF532A" @click="_changeTheme('orange')"></i>
				</span>
			<span > |
				<el-tooltip effect="dark" :hide-after="0"	content="语言切换" placement="bottom-start" > 
					<i class="icon-cogs icon"></i>
				</el-tooltip>
			</span>
			<span > |
				<el-tooltip effect="dark" :hide-after="0"	content="客服建议" placement="bottom-start" > 
					<i class="icon-smile icon"></i>
				</el-tooltip>
			</span>
			<span > |
				<el-tooltip effect="dark" :hide-after="0"	content="锁屏" placement="bottom-start" > 
					 <i class="icon-locked icon" @click="_lockScreen"></i> 
				</el-tooltip>
			</span>
			<span > |
				<el-tooltip effect="dark" :hide-after="0"	content="修改密码" placement="bottom-start" > 
						<i class="icon-keyboard icon" @click="isChangePwa=true"></i>
				</el-tooltip>
			</span>
			<span > |
				<el-tooltip effect="dark" :hide-after="0"	content="全屏显示" placement="bottom-start" > 
						<i class="icon-enlarge icon" @click="_fullScreen"></i> 
				</el-tooltip>
			</span>
		</div>
	</div>
	<div class="lock" v-if="isLock">
		<div class="lockmain">
			<div class="userimage">
			</div>
			<div class="locktexet" >
				{{userInfo.user.realName}}
			</div>
			<div class="loginform">
					<el-form  :inline="true" >
						<el-form-item style="margin-right:0px">
							<input style="display:none">
							<el-input  placeholder="请输入密码解锁"  style="width:180px" type="password" autoComplete="off"  v-model="lockPassWord" @keyup.enter.native="_resetLogin">
								<el-button slot="append"  @click="_resetLogin"><i class="icon-unlocked2"/></el-button>
							</el-input>
							</el-form-item>
					</el-form>
			</div>
		</div>
	</div>
	<el-dialog ref="mainDialog" title="转化角色" :visible.sync="roleFormVisible" size="tiny" top="15%" 
				:modal-append-to-body="false" :close-on-click-modal="false"  >
				<TurnRole  @close="_close"  v-if="roleFormVisible"></TurnRole>
	</el-dialog>

	<el-dialog ref="mainDialog" title="系统漫游" :visible.sync="goEveryWhereFormVisible" size="tiny" top="15%" 
				:modal-append-to-body="false" :close-on-click-modal="false"  >
				<GoEveryWhere  @close="_closeM"  v-if="goEveryWhereFormVisible"></GoEveryWhere>
	</el-dialog>

	<el-dialog ref="mainDialog" title="修改密码" :visible.sync="isChangePwa" size="tiny" top="15%" 
				:modal-append-to-body="false" :close-on-click-modal="false"  >
				<el-form   label-width="80px" >
					<el-form-item label="原密码" >
						<el-input  
						v-model="pwaForm.oldpwa" 
						type="password" 
						autoComplete="off" 
						:placeholder="'请输入原密码'" 
						@blur="_checkOldPwa"  >
						</el-input>
					 </el-form-item> 
					<el-form-item label="新密码" >
						<el-input  v-model="pwaForm.newpwa" type="password" autoComplete="off" :placeholder="'请输入新密码'"  >
						</el-input>
						</el-form-item> 
					<el-form-item label="新密码确认" >
						<el-input   v-model="pwaForm.conformpwa" type="password" autoComplete="off" :placeholder="'再次输入新密码'"  >
						</el-input>
					</el-form-item>  
					<el-form-item style="text-align:right;" >
						<el-button @click="_clearpwa">重置</el-button>
						<el-button type="primary" @click="_changePwa" >确定</el-button>
					</el-form-item>
				</el-form>
	</el-dialog>

   <el-dialog  title="解锁模块" :visible.sync="moduleAccessFlag" size="tiny" top="30%" 
				:modal-append-to-body="false" 
				:close-on-click-modal="false" 
				:show-close="false" 
				:close-on-press-escape="false">
					<el-form   label-width="80px" >
							<el-form-item label="解锁密码" >
								<el-input  v-model="accessFlag" type="password" autoComplete="off" :placeholder="'请输入解锁密码'" @keyup.enter.native="_onSubmit"  >
							    </el-input>
							</el-form-item>  
						<el-form-item style="text-align:right;" >
							<el-button @click="_complete">回到主页</el-button>
							<el-button type="primary" @click="_onSubmit" >确定</el-button>
						</el-form-item>
				</el-form>
	</el-dialog>

  	<el-dialog ref="selDialog" 
	  			:modal="true"
				:lock-scroll="true"
				:close-on-press-escape="false"
	  			v-if="selMaterialrender"
	  			:visible.sync="selMaterialVisible" 
	  			:title="getBaseinfoConf.dialogConf.title"
				:top="getBaseinfoConf.dialogConf.top" 
				:size="getBaseinfoConf.dialogConf.size"
				:modal-append-to-body="getBaseinfoConf.dialogConf.modalAppendToBody" 
				:close-on-click-modal="getBaseinfoConf.dialogConf.closeOnClickModal"
				@close="_selClose">
				<yl-selectcontainer v-if="selMaterialVisible&!getBaseinfoConf.dialogConf.isReport" @close="_selClose"></yl-selectcontainer>
				<yl-selectcontainerR v-if="selMaterialVisible&getBaseinfoConf.dialogConf.isReport" @close="_selClose"></yl-selectcontainerR>					
	</el-dialog>
	
 </div>

</template>

<script type="text/babel">
import { requestGetUserMenu,
		 requestGetCurrentLoginInformations,
		 requestGetMenuAppList, 
		} from '@/api/login';
import { mapGetters, mapActions} from 'vuex';
import fetch from '@/api/fetch';
import util from '@/common/js/util';
import screenfull from 'screenfull';
import themePicker from '@/components/themePicker/themePicker';
export default {
		data(){
			return{
					isClose:false,
					isLock:false,
					lockPassWord:'',
					menuList:{},
					bodyStyle:{},
					menuLoading:false,
					appObj:{},
					roleFormVisible:false,
					goEveryWhereFormVisible:false,
					selMaterialVisible:false,
					selMaterialrender:false,
					menuAppList:[],
					moduleAccessFlag:false,
					accessFlag:'',
					accessFlagText:'text',
					systemTitleName:window.getClientObj().sysConf.titleName,
					includedComponents:[],
					menudDisplay:true,
					isChangePwa:false,
					pwaForm:{ 
						oldpwa:'',
						newpwa:'',
						conformpwa:''
					},
					hasReportCenter:'',
					
			};
		},
		computed:{
			...mapGetters(['getIsVisible','getBaseinfoConf']),
			globalConf:{
				get(){
					return util.getLocalStorage('SysGlobConf');
				}
			},
			userInfo:{
				get(){
					return this.getUserInfo();
				}
			}
		},
		methods: {
			_changeTheme(name){
				util.changeTheme(name);
				this.$message({
					message: '换肤成功',
					type: 'success'
				})

			},
			_menuClick(){
				this.menudDisplay=!this.menudDisplay
			},
		    _handleOpen(key, keyPath) {
				//展开菜单
		    },
		    _handleClose(key, keyPath) {
				//关闭菜单
		    },
			//隐藏menu
			_showMenu(){
					this.isClose=!this.isClose;
			},
		   //锁屏
		 _lockScreen:function(){
					this.isLock=true;
					util.setCookie('systemLock','on',1);
			},
		  _resetLogin(){
			  	if(this.lockPassWord==''){
					  this.$message({ message: '请填写解锁密码！',type: 'warning'});
					  return;
				  }
				if(util.jsEncrypt(this.lockPassWord)===localStorage.getItem('access')){
						this.isLock=false;
						util.setCookie('systemLock','off',1);
				}else{
					this.$message({ message: '解锁密码输入有误！',type: 'warning'});
					  return;
				}
                
		  },
		  _initLock(){
			  if(util.getCookieValue('systemLock')=='on'){
				  this.isLock=true;
			  }
		  },
		  //注销登录
		  _loginout(){
		        this.$confirm('确认退出系统吗?', '提示', {
		          type: 'warning'
		        }).then(() => {
					//清空 localstorage、cookie
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
		  _reportCenter(){
			  const url='http://'+window.location.host+'/#/ReportCenter/home';
			  window.open(url);  
		  },
		  _complete(){
			   //关闭窗口
			   this.moduleAccessFlag=false;
			   this.$router.replace('/home');
		  },
		  _onSubmit(){
			  //提交确认密码
			  if(util.jsEncrypt(this.accessFlag)===this.accessWords()){
				  util.setCookie('AccessFlag',this.accessWords(),0.1)
				  this.moduleAccessFlag=false;
			  }else{
				  this.$message({ message: '解锁密码输入有误！',type: 'warning'});
				  this.accessFlag='';
				  return 
			  }
		  },
		  checkModule(name){
				let moduleArr=['模块配置','全局配置','APP配置','门户配置','数据选择框','模块审批配置','模块表对应信息','SQL语句配置','API授权管理',
				'模块自定义配置','SQL语句自定义配置','APP自定义配置','门户自定义配置','自定义数据选择框',
				];
				let currentModule=moduleArr.filter(i=>{
					return name===i
				})
				if(currentModule.length>0){
					//检测是否有缓存
					let pwd=util.getCookieValue('AccessFlag');
					if(pwd!=this.accessWords()){
						this.moduleAccessFlag=true;
					}
				}
		  },
		  //获取菜单列表
		  _getMenu(){
			  let params={};
			  let value=util.getCookie('appCode');
			  this.menuLoading=true;
			  this.appObj=JSON.parse(value);
			  document.title=this.appObj.appName;
			  params.appCode=this.appObj.appCode;
			  if(params.appCode==="YLMREPV8.0"){
				  this.$router.push({ path:'/ReportCenter/home'});
				  return false;
			  }
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
			_turnSystem(obj){
				util.setCookie('appCode',JSON.stringify(obj),1);
				this.$router.push({ path:'/home'});
				setTimeout(function() {
					window.location.reload();
				}, 100);
			},
			_close(){
				this.roleFormVisible=false;
			},
			_closeM(){
				this.goEveryWhereFormVisible=false;
			},
			_selClose(){
				this.setIsVisible(false);
			},
			_fullScreen(){
				 if (!screenfull.enabled) {
						this.$message({
						message: 'you browser can not work',
						type: 'warning'
						})
						return false
					}
					screenfull.toggle()
							
			},
			_checkOldPwa(){
				if(this.pwaForm.oldpwa!=''){
					if(util.jsEncrypt(this.pwaForm.oldpwa)!==localStorage.getItem('access')){
						this.$message.warning('旧密码输入有误！');
					}
				}
			},
			_clearpwa(){
				this.pwaForm={
						oldpwa:'',
						newpwa:'',
						conformpwa:''
					}
			},
			_changePwa(){	
				if(this.pwaForm.oldpwa==''){
					this.$message.warning('原始密码不能为空！');
					return false
				}
				if(this.pwaForm.newpwa==''){
					this.$message.warning('新密码不能为空！');
					return false
				}
				if(this.pwaForm.newpwa!=''){
					if(this.pwaForm.newpwa!==this.pwaForm.conformpwa){
						this.$message.warning('密码确认不一样！请重新输入！');
						return false
					}
				}
				//判断原始密码
				let op=util.jsEncrypt(this.pwaForm.oldpwa);
				if(localStorage.getItem('access')!==op){
						this.$message.warning('输入原始密码有误，请重新输入！');
						this.pwaForm.oldpwa=''
						return false
				}
				let params={};
				params.id=this.getUserInfo().user.id;
				fetch({
					url:'api/services/app/user/GetUserForEdit',
					method:'post',
					data:params
				}).then(data=>{
					let para=data.result;
					para.user.password=util.jsEncrypt(this.pwaForm.newpwa)
					fetch({
						url:'api/services/app/user/CreateOrUpdateUser',
						method:'post',
						data:para
						}).then(data1=>{
							if(data1.success){
								this.$notify({
										title: '成功',
										message: '修改密码成功！',
										type: 'success'
										});
								//写入LocalStorage
								localStorage.setItem('access',util.jsEncrypt(this.pwaForm.newpwa));	
								this.isChangePwa=false;	
								
							}else{
								this.$notify.error({
										title: '错误',
										message: '修改密码失败！',
										});
							}
							this._clearpwa();
					})
				})
			},
			 ...mapActions(['setIsVisible',]),
      },
	  components:{
			screenfull,
			themePicker
        },
	mounted() {
		this.hasReportCenter=util.getCookieValue('hasReportCenter');
		this._getMenu();
		this._initLock();
		this.checkModule(this.$route.name);
		
	},
	watch: {
		getIsVisible:function(val, oldVal){
          if(val){
            //处理
			this.selMaterialVisible=true;
			if(!this.selMaterialrender){this.selMaterialrender=true;}
          }else{
			  this.selMaterialVisible=false; 
		  }
		},
		$route:function(n,o){
			this.checkModule(n.name);
		}
	},
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.main
	background-color:#1F2D3D
	overflow:auto
	height:100%
	width:100%
	display:flex
	flex-direction:column
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
			.logo
				height 45px
			.title
				font-size:20px
				font-family:SimSun
				color:#fdf5f5
				font-weight 500
				height:45px
				line-height :45px
				padding-left:10px
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
					height:50px
					display: inline-block
					color: #B2B2B2
					text-align:center
					padding-top:5px
					.icon 
						font-size:18px
						line-height:25px
					span 
						display: block
						height: 15px
						padding-top:5px
						font-size:12px
				li:hover
					cursor:pointer
					color:#b6d06c
					background-color:#475669
	.content
		height:auto
		flex:1
		.left-wrapper
			position:absolute
			z-index:0
			top:55px
			left:0
			bottom:20px
			width:218px
			overflow:auto
			overflow-x: hidden;
			margin-left:8px
			background-color:#324057
			border:1px solid #41516a
			.el-menu-vertical
				height:100%
		.left-wrapper-close
			left:-220px
		.main-wrapper
			position:absolute
			z-index:0
			top:55px
			left:236px
			bottom:20px	
			right:12px
			background-color:#324057
			border:1px solid #41516a
			padding:8px
			.shrinkage
					position:absolute
					top:0px
					left:0px
					z-index:0
					width:6px
					height:100%
					cursor:pointer
					//background:url(image/point.png) no-repeat center
					//&:hover
					//	background: #41516a url(image/point.png) no-repeat center
			.dynamicmodel
				height:100%
				overflow:auto
				.fade-enter-active,.fade-leave-active
					transition: opacity 0s
				.fade-enter,.fade-leave-active
					opacity: 0
		.main-wrapper-expend
			left:16px
	.foot
		height:20px
		line-height:20px
		font-size:12px
		color:#ddd
		padding:0px 12px 0px 8px
		.systeminfo
			float:left
			.icon:hover
				color:#B2B2B2
		.userinfo
			float:right
			.icon:hover
				color: #b6d06c
				
	.lock
		position:fixed
		left:0
		right:0
		top:0
		bottom:0
		width:100%
		height:100%
		z-index:1000
		background:#111
		opacity: 0.8
		.lockmain
			margin:auto
			margin-top:150px
			width:483px
			height:262px
			padding-top:150px
			.userimage
				margin:auto
				width:78px
				height:78px
			.locktexet
				color:#fff
				font-size:16px
				text-align:center
				padding:8px
			.loginform
				text-align:center
				height:38px
				line-height:38px

.menuicon
	font-size 14px
	padding-right 5px
				
</style>
