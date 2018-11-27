import Vue from 'vue'
import Element from 'element-ui'
import util from '@/common/js/util'
import i18n from '@/lang'

const name=localStorage.getItem('themeValue');

    if(name){
        util.changeTheme(name);
    }else{
        util.changeTheme('default');
    }
//import '../theme/element-variables.scss' //编译样式
Vue.use(Element, {
    i18n: (key, value) => i18n.t(key, value)
  })