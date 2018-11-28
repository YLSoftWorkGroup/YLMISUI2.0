
<template>
<div class="tab">
    <tabPanelScroll  ref="tabPanelScroll" class="tabPanelScroll">
        <router-link
            v-for="tag in getOpenRouterList"
            ref="tag"
            :class="isActive(tag)?'tabPanel-item-active':''"
            :to="{ path: tag.url}"
            :key="tag.url"
            class="tabPanelScroll-item"
            @contextmenu.prevent.native="openMenu(tag,$event)"
            >
            {{tag.name}}
            <span 
                class="el-icon-close" 
                @click.prevent.stop="closeSelectedTag(tag)" 
            />
        </router-link>
    </tabPanelScroll>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu" v-clickoutside="_hiddenBlock">
      <li @click="closeOthersTags">{{$t('system.mainPage.tab.closeOthers')}}</li>
      <li @click="closeAllTags">{{$t('system.mainPage.tab.closeAll')}}</li>
    </ul>  
</div>
</template>

<script type="text/babel">
import tabPanelScroll from './tabPanelScroll'
import { mapGetters, mapActions} from 'vuex';
export default {
    name:"yl-tab",
    components:{
        tabPanelScroll
    },
    data(){
        return {
            visible:false,
            selectedTag:{},
            top: 0,
            left: 0,
        }
    },
    props:{
    },
    computed:{
         ...mapGetters(['getCurrentRouter','getOpenRouterList']),
    },
    methods:{
        ...mapActions(['setCurrentRouter','setOpenRouterList']),
        _hiddenBlock(){
            this.visible=false;
        },
        closeOthersTags(){
            //关闭其它
           let currentMenuItem=JSON.parse(localStorage.getItem('currentRouter'));
                if(currentMenuItem){
                    this.setOpenRouterList([currentMenuItem]);
                }
           this.visible=false;
        },
        closeAllTags(){
            //关闭所有
            this.goUrl('/home')
            let route=this.$route;
            let menuObj=[{
                url:route.path,
                name:route.name,
            }]
            this.setOpenRouterList(menuObj);
            this.visible=false;
        },
        openMenu(tag, e) {
                const menuMinWidth = 105
                const offsetLeft = this.$el.getBoundingClientRect().left 
                const offsetWidth = this.$el.offsetWidth 
                const maxLeft = offsetWidth - menuMinWidth 
                const left = e.clientX - offsetLeft + 15 
                if (left > maxLeft) {
                    this.left = maxLeft
                } else {
                    this.left = left
                }
                this.top = 15
                this.visible = true
                this.selectedTag = tag
        },
        closeSelectedTag(tag){

            this.getOpenRouterList.map((i,index)=>{
                if(i.url===tag.url){
                    this.getOpenRouterList.splice(index, 1); 
                    if(tag.url===this.$route.path){
                        if(this.getOpenRouterList.length>0){
                             this.goUrl(this.getOpenRouterList[index-1].url)
                        }else{
                            this.goUrl('/home')
                            let route=this.$route;
                            let menuObj=[{
                                url:route.path,
                                name:route.name,
                            }]
                            this.setOpenRouterList(menuObj);
                        }
                       
                    }
                   
                }
            });
        },
        _initVM(){
                let route=this.$route;
                let currentMenuItem=JSON.parse(localStorage.getItem('currentRouter'));
                if(currentMenuItem){
                    this.setOpenRouterList([currentMenuItem]);
                }else{
                     let menuObj=[{
                        url:route.path,
                        name:route.name,
                    }]
                    this.setOpenRouterList(menuObj);
                }
        },
        isActive(route) {
            return route.url === this.$route.path
        },
    },
    mounted(){
        this._initVM();
    },
	watch:{
        $route:function(n,o){
            if(this.getOpenRouterList.length===0&&n.path==='/home'){
                this.setOpenRouterList([{url:n.path,name:n.name}]);
            }
            this.getOpenRouterList.filter((i,index)=>{
                if(i.url===n.path){
                    localStorage.setItem("currentRouter",JSON.stringify(i));
                }
            });
           
        }
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
.tab
    height 100%
    width 100%
    position relative
    .tabPanelScroll-item
        display: inline-block
        position: relative
        cursor: pointer
        height: 22px
        line-height: 22px
        border: 1px solid #d8dce5
        color: #495060
        background: #fff
        padding: 0 5px
        font-size: 12px
        margin-right: 5px
        border-radius:4px
        &:first-of-type 
            margin-left: 0px
        &:last-of-type 
            margin-right: 15px;
            &::before 
                content: ''
                background: #fff
                display: inline-block
                width: 8px
                height: 8px
                border-radius: 50%
                position: relative
                margin-right: 2px
    .contextmenu 
            margin: 0
            background: #fff
            z-index: 100
            position: absolute
            list-style-type: none
            padding: 5px 0
            font-size: 12px
            font-weight: 400
            color: #333
            border-radius:4px
            box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3)
            li 
                margin: 0
                padding: 7px 16px
                cursor: pointer
                &:hover 
                    background: #eee
            
            

</style>


