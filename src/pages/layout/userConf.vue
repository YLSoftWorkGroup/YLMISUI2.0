
<template>
<div class="userConf">
    <div class="item">
        <span><i class="fa fa-vcard-o"></i> {{$t('system.mainPage.userConf.userInfo')}} </span>
    </div>
    <div class="item">
        <span><i class="fa fa-cog"></i> {{$t('system.mainPage.userConf.userConf')}} </span>
    </div>
    <div class="item">
        <span> 
            <el-badge :value="12" class="item">
           <i class="fa fa-envelope-o"></i> {{$t('system.mainPage.userConf.notice')}} 
         </el-badge>
       </span>
    </div>
    <div class="item" @click="_loginout">
        <span><i class="icon-switch2"></i> {{$t('system.mainPage.userConf.loginOff')}} </span>
    </div>
</div>
</template>

<script type="text/babel">
import util from '@/common/js/util';
export default {
    name:"userConf",
    methods:{
        //注销登录
		  _loginout(){
		        this.$confirm(this.$t('system.mainPage.message.loginOff'), this.$t('system.message.tip.info'), {
		          type: 'warning'
		        }).then(() => {
                        util.resetLogin();
                        if(!getClientObj().loginType){
                             this.$router.replace('/login');
                        }else{
							 window.location =getClientObj().singleLogin.url+'/cas/logout?service='+ getClientObj().singleLogin.url+'/cas/login?service='+getClientObj().sysConf.url+'/api/Cas';
                        }
		        }).catch(() => {

		        });
		  },
    },
    computed:{

    },
    mounted(){

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.userConf
    width 140px
    height auto
    padding 5px
    .item
        font-size 12px
        height 30px
        line-height 30px
        cursor pointer
        padding 5px 0px
        &:hover
            background-color #EBEEF5
        i 
            padding-right 5px
</style>


