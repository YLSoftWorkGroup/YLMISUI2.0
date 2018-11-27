
<template>
<div class="header header-background">
    <div class="left">
			<div class="logowrapper">
					<img class="logo" src="img/logo.png"  />
				</div>
				<div class="title header-left-text-color"> {{TitleName}}</div>
	</div>
    <div class="right ">
        <ul>
            <li @click="_loginCenter" class="main-text-color"><i class="icon-users icon"></i><span>{{$t('system.mainPage.header.userCenter')}}</span></li>
            <li @click="_reportCenter" class="main-text-color" v-if="hasReportCenter"><i class="icon-stats-dots icon"></i><span>{{$t('system.mainPage.header.reportCenter')}}</span></li>
            <el-popover
				placement="top-start"
				trigger="click">
                        <userConf></userConf>
                <li class="userImg" slot="reference">
                   <img :src="userImgUrl" width="40px" alt="">
                </li>
			</el-popover>
        </ul>
    </div> 
</div>
</template>

<script type="text/babel">
import util from '@/common/js/util';
import userConf from './userConf';
export default {
    name:"yl-header",
    components:{
       userConf
    },
    data(){
        return {
            TitleName:window.getClientObj().sysConf.titleName,
            hasReportCenter:false
        }
    },
    computed:{
			userInfo:{
				get(){
					 return this.getUserInfo();
				}
            },
            userImgUrl:{
                get(){
                    if(this.getUserInfo().user.gender=='男'){
                        return './img/boy.png';
                    }else{
                        return './img/gril.png';
                    }
                }
            }
    },
    methods:{
         
         _loginCenter(){
			  this.$router.replace('/Index');
		  },
		  _reportCenter(){
			  const url='http://'+location.host+'/#/ReportCenter/home';
			  window.open(url);  
          },
          _initVM(){
              this.hasReportCenter=util.getCookieValue('hasReportCenter');
          } 
    },
    mounted(){
        this._initVM();
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.header
    height 100%
    width 100%
    display flex
    flex-direction row
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
					text-align:center
					padding-top:5px
					.icon 
						font-size:16px
						line-height:25px
					span 
						display: block
						height: 15px
						padding-top:5px
						font-size:12px
				li:hover
					cursor:pointer
</style>
