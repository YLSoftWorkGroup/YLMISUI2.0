<template>
     <div class="yl-config-page ">
         <div class="yl-config-loading" v-if="!isRender" >
             <div class="loading">
                  <img  src="img/loading2.gif" alt="">
                  <p>门户初始化中，请稍后...</p>
             </div>
         </div>
         <div class="yl-config-body" v-if="isRender">
            <yl-dynamicPage  
                :options="mConfigs">
            </yl-dynamicPage>
         </div>
    </div>
</template>

<script type="text/babel">
import fetch from '@/api/fetch';
import util from '@/common/js/util';
export default {
	data(){
		return {
			type:0,
			isRender:false,
			mConfigs:{},
			roleId:'',
		}
	},
	computed:{
		VersionNum:{
                    get(){
                        return util.getLocalStorage('SysGlobConf').versionNum;
                    }
				},
	},
	methods:{
			init(){
            	this.isRender=false;
				let moduleCode=this.$route.params.tableName;
				let inputArr=[
					{dataField:"RoleId", op:'EQ', dataValue:this.roleId},
					{dataField:"VersionNum", op:'EQ', dataValue:this.VersionNum},
					{dataField:"IsEnable", op:'EQ', dataValue:1},
					{dataField:"HomeType", op:'EQ', dataValue:0}
					],params={};
                params.queryConditionItem=inputArr;
                fetch({
                     url: '/api/services/app/homePageConf/GetHomePageConfByKey',
                     method: 'post',
                     data: params
                }).then((data)=>{
                      if(data.success){
						  if(data.result.order!=null){
							    let conf=JSON.parse(data.result.order.homePageConf,util.dealFunction)
							    if(data.result.order){
									if(conf.pageType===1){
										this.mConfigs=conf.pageConf;
										this.isRender=true;
									}else{
										if(conf.modulePage!=undefined){
											//页面跳转
											this.goUrl(conf.modulePage.routerUrl,1);
										}
									}
								}
							}else{
								//获取默认门户配置
								let Arr=[
									{dataField:"RoleId", op:'EQ', dataValue:this.guidOfNull()},
									{dataField:"IsEnable", op:'EQ', dataValue:1},
									{dataField:"HomeType", op:'EQ', dataValue:0},
									{dataField:"VersionNum", op:'EQ', dataValue:this.VersionNum}
									],Params={};
								Params.queryConditionItem=Arr;
								fetch({
									url: '/api/services/app/homePageConf/getMainObjectForEdit',
									method: 'post',
									data: Params
								}).then(Data=>{
									if(Data.result.order){
										   this.mConfigs=JSON.parse(Data.result.order.homePageConf,util.dealFunction).pageConf;
									}else{
										this.$router.push({ path:'/Page404'});
									}
									this.isRender=true;
								})
								 //this.$message.warning('该角色未配置门户');
							}
                      } 
                      else {
                          this.$message.error('失败！'+data.error.message);
                      }
                });
        },
	},
	beforeMount(){
		
	},
	mounted(){
		this.roleId=this.getUserInfo().user.roleId;
		this.init();
    },
	components:{
	},
	watch:{
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.yl-config-page{height:100%;width:100%}
.yl-config-body{height:100%;width:100%}
.yl-config-loading{height:100%;width:100%;background-color:#fff}
.loading{
			height:100px;
			width:300px;
			text-align:center;
			color:#4388C9;
			font-size:14px;
			margin: 0 auto;
			padding-top:200px;
        }
</style>
