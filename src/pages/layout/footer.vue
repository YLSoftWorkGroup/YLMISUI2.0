
<template>
<div class="foot footer-background">
		<div class="systeminfo main-static-color">
			<span ><i class="icon-info2 icon"></i> {{appObj.appDescription}}</span>
			<span >({{globalConf.versionNum+'_'+globalConf.updateNum}}) </span>
		</div>
		<div class="userinfo">
			<span class="main-static-color"><i class="icon-user-tie icon"></i> {{userInfo.user.realName}}</span>
			<span class="main-static-color"><i class="icon-office icon"></i> {{userInfo.user.manageOrgName}}</span>
			<span class="main-static-color"><i class="icon-users icon"></i> {{userInfo.user.roleName}}</span>
			<span >  
					<i class="fa fa-circle icon" style="color:#409EFF" @click="_changeTheme('default')"></i>
					<i class="fa fa-circle icon" style="color:#1BD8A9" @click="_changeTheme('green')"></i>
					<i class="fa fa-circle icon" style="color:#BF532A" @click="_changeTheme('orange')"></i>
			</span>
			<span class="main-text-color">  
				<el-tooltip effect="dark" :hide-after="0"	:content="langTxt" placement="bottom-start" > 
					<i class="icon-earth icon"  @click="_changeLang"></i>
				</el-tooltip>
			</span>
			<span class="main-text-color">  
				<el-tooltip effect="dark" :hide-after="0"	content="客服建议" placement="bottom-start" > 
					<i class="icon-smile icon "></i>
				</el-tooltip>
			</span>
			<span class="main-text-color">  
				<el-tooltip effect="dark" :hide-after="0"	content="锁屏" placement="bottom-start" > 
					 <i class="icon-locked icon" @click="_lockScreen"></i> 
				</el-tooltip>
			</span>
			<span class="main-text-color">  
				<el-tooltip effect="dark" :hide-after="0"	content="修改密码" placement="bottom-start" > 
						<i class="icon-keyboard icon" @click="isChangePwa=true"></i>
				</el-tooltip>
			</span>
			<span class="main-text-color"> 
				<el-tooltip effect="dark" :hide-after="0"	content="全屏显示" placement="bottom-start" > 
						<i class="icon-enlarge icon" @click="_fullScreen"></i> 
				</el-tooltip>
			</span>
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
        <el-dialog ref="mainDialog" 
                title="修改密码" 
                :visible.sync="isChangePwa" width="30%" 
				:modal-append-to-body="false" 
                :close-on-click-modal="false"  >
				<el-form   label-width="100px" status-icon>
					<el-form-item label="原密码" >
						<el-input  
						v-model="pwaForm.oldpwa" 
						type="password" 
						autoComplete="off" 
						:placeholder="'请输入原密码'" 
						@blur="_checkOldPwa">
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

        
	</div>
</template>

<script type="text/babel">
import util from '@/common/js/util'
import screenfull from 'screenfull';
export default {
    name:"yl-footer",
    data(){
        return {
            appObj:{},
            isLock:false,
            isChangePwa:false,
            accessFlag:false,
            lockPassWord:'',
            pwaForm:{ 
                    oldpwa:'',
                    newpwa:'',
                    conformpwa:''
                    },
            lang:localStorage.getItem('language')||'zh',
			langTxt:localStorage.getItem('language')=='zh'?"切换为英文":"切换为中文"
        }
    },
    components:{
			screenfull
    },
    computed:{
        userInfo:{
            get(){
                return this.getUserInfo();
            }
        },
        globalConf:{
				get(){
					return util.getLocalStorage('SysGlobConf');
				}
			},
    },
    methods:{
        _initVM(){
              let value=util.getCookie('appCode');
              this.appObj=JSON.parse(value);
              this._initLock();
        },
        _fullScreen(){
				 if (!screenfull.enabled) {
						this.$message({
						message: '浏览器不支持全屏设置！',
						type: 'warning'
						})
						return false
					}
					screenfull.toggle()
							
            },
        _changeLang(){
					 if(this.lang=='zh'){
						 this.lang='en'
						 this.langTxt='切换为中文'
					 }else{
						 this.lang='zh'
						 this.langTxt='切换为英文'
					 }
					 this.$i18n.locale = this.lang;
					 localStorage.setItem('language', this.lang);
                        this.$message({
                            message: '切换语言成功(部分页面可能需要刷新浏览器)！',
                            type: 'success'
                        })
                     //跳转
				    this.$router.replace({path: '/redirect' + this.$route.fullPath})
        },
        _changeTheme(name){
				util.changeTheme(name);
				this.$message({
					message: '换肤成功！',
					type: 'success'
				})
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
            _initLock(){
			  if(util.getCookieValue('systemLock')=='on'){
				  this.isLock=true;
			  }
		  },
    },
    mounted(){
       this._initVM()
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.foot
    height:100%
    line-height:25px
    font-size:12px
    padding:0px 12px 
    .systeminfo
        float:left
    .userinfo
        float right
		span
			padding-right 5px
			.icon
				padding-right 2px
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
        margin-top:120px
        width:483px
        height:262px
        padding-top:80px
        background url(../../common/image/lock_bg.png) 
        background-repeat no-repeat
        .userimage
            margin:auto
            width:78px
            height:78px
            background  url(../../common/image/login_user.png) 
        .locktexet
            color:#fff
            font-size:16px
            text-align:center
            padding:8px
        .loginform
            text-align:center
            height:38px
            line-height:38px
</style>
