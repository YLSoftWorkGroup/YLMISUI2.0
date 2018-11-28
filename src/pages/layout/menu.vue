
<template>
    <div class="left-warper  menu-border menu-background" 
    :class="{'left-width-collapse':isCollapse}"
    v-loading="menuLoading" 
    :element-loading-text="$t('system.mainPage.message.menuLoading')" 
    >
        <div class="menu-warper " >
            <el-menu  
                class="el-menu-vertical"
                default-active="/home"  
                @open="_handleOpen" 
                @close="_handleClose" 
                menu-trigger="click"
                unique-opened 
                :router="false"
                :collapse="isCollapse"
                :collapse-transition="false"
            >
                    <el-menu-item index="/home" @click="_goToURL()">
                        <i class="menuicon icon-home"></i>
                        <span slot="title">门 户</span>
                    </el-menu-item>
                    <el-submenu :index="findex+'f'" 
                        class="el-submenu-main"   
                        v-for="(fristmenulist,findex) in menuList" 
                        :key="findex"> 
                        <template slot="title" >
                            <i  class="menuicon" :class="fristmenulist.icon"></i>
                            <span slot="title">{{fristmenulist.displayName}}</span>
                        </template>
                        <el-menu-item :index="secondmenulist.url"  
                            v-for="(secondmenulist,sindex) in fristmenulist.items" 
                            :key="sindex"  @click="_goToURL(secondmenulist)" >{{secondmenulist.displayName}}
                        </el-menu-item>
                    </el-submenu>
            </el-menu>
        </div>
        <div class="menu-btn  main-text-color">

            <el-tooltip effect="dark" :hide-after="0"	:content="isCollapse?$t('system.mainPage.menu.expansion'):$t('system.mainPage.menu.folding')" placement="bottom-start" > 
					<i class="fa fa-chevron-circle-left"  
                        :class="{'fa-chevron-circle-right':isCollapse}" 
                    @click="_expendMenu"></i>
			</el-tooltip>
                
        </div>
    </div>
</template>

<script type="text/babel">
import util from '@/common/js/util'
import { requestGetUserMenu} from '@/api/login';
import { mapGetters, mapActions} from 'vuex';
export default {
    name:"yl-menu",
    data(){
        return {
            menuLoading:false,
            menuList:{},
            appObj:{},
            isCollapse:false
        }
    },
    props:{

    },
    computed:{
         ...mapGetters(['getCurrentRouter','getOpenRouterList']),
    },
    methods:{
        ...mapActions(['setCurrentRouter','setOpenRouterList']),
        _handleOpen(key, keyPath) {
				//展开菜单
		    },
        _handleClose(key, keyPath) {
            //关闭菜单
        },
        _expendMenu(){
            this.isCollapse=!this.isCollapse;
        },
        _goToURL(router){
          if(router){
               if(router.menuType!=='0'){
                   //外部链接
                    location.href=router.url;
               }else{
                   this.visitedViewsAdd(router);
                   this.goUrl(router.url);
               }
          }else{
              this.goUrl('/home');
          }
        },
        visitedViewsAdd(obj){
            let isAdd=true;
            let ArrList=this.getOpenRouterList;
            ArrList.map((i,index)=>{
                if(i.url===obj.url){
                    isAdd=false;
                }
            });
            if(isAdd){
                ArrList.push(obj);
                this.setOpenRouterList(ArrList)
            }
        },
        //获取菜单列表
		  _getMenu(){
              let _this=this;
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
    },
    mounted(){
        this._getMenu()
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.left-warper
    width 200px
    height 100%
    display flex
    flex-direction column
    .menu-btn
        height 35px
        line-height 35px
        padding-left 15px
        font-size 20px
    .menu-warper
        flex 1
        overflow auto 
        overflow-x: hidden
        .el-menu-vertical
            height 100%
.left-width-collapse
    width:55px !important

    

</style>
