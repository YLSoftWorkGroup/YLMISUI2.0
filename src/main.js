import 'babel-polyfill'
import Vue from 'vue'
import './registerServiceWorker'
import './plugins/element.js'
import router from './router'
import store from './vuex/store'
import 'normalize.css/normalize.css'
import NProgress from 'nprogress'//页面顶部进度条
import 'nprogress/nprogress.css'  //进度条样式
import i18n from './lang' 
import App from './App.vue'
import './components'
//引入图标样式
import 'font-awesome/css/font-awesome.min.css'
import   '@/common/js/jsPropertyFunc'
//注册全局函数
import   '@/common/js/globalFun'
//注册全局指令
import  './directive'
//注册全局过滤器
import  './filters';
import util from '@/common/js/util';

//样式重置
import '@/common/stylus/index.styl'  //全局样式


router.beforeEach((to, from, next) => {
  NProgress.start();
   if(util.isAuth(to.path)){
    next();
   }
})

router.afterEach(() => {
   NProgress.done();
});

Vue.config.productionTip = false

new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
  }).$mount('#app')
