import Vue from 'vue'
import Element from 'element-ui'
import util from '@/common/js/util'

const name=localStorage.getItem('themeValue')
    if(name){
        util.changeTheme(name);
    }else{
        util.changeTheme('theme-default');
    }
//import '../theme/element-variables.scss' //编译样式


Vue.use(Element)
