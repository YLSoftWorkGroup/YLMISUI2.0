<template>
<div class="main main-background">
	<div class="header">
		<yl-header></yl-header>	
	</div>
	<div class="content">
		<yl-menu class="left"></yl-menu>	
		<yl-page class="right"></yl-page>	
	</div>
	<div class="footer">
		<yl-footer></yl-footer>	
	</div>

	<el-dialog  title="解锁模块" :visible.sync="moduleAccessFlag" width="30%"  top="10%" 
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
</div>
</template>

<script type="text/babel">
import util from '@/common/js/util'
import header from './header'
import menu from './menu'
import page from './page'
import footer from './footer'
export default {
	name:"Main",
	components:{
		'yl-header':header,
		'yl-menu':menu,
		'yl-page':page,
		'yl-footer':footer,
	},
	data(){
		return {
			moduleAccessFlag:false,
			accessFlag:'',

		}
	},
	props:{

	},
	computed:{

	},
	
	methods:{
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
		_initVM(){
			this.checkModule(this.$route.name);
		},
		
	},
	mounted(){
		this._initVM();
	},
	watch:{
		$route:function(n,o){
			this.checkModule(n.name);
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.main	
	overflow:auto
	height:100%
	width:100%
	display:flex
	flex-direction:column
	.header 
		height 55px
	.content
		flex 1
		display:flex
		flex-direction:row
		.left
			height 100%
		.right
			overflow auto
	.footer 
		height 25px

	
</style>


