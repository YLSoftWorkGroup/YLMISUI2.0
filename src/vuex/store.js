import Vue from 'vue'
import Vuex from 'vuex'
//导入模块
import com from './modules/com'
import sel from './modules/sel'
import item from './modules/item'
import global from './modules/global'
import routerInfo from './modules/routerInfo'
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        com,
        sel,
        item,
        global,
        routerInfo,
    }
})