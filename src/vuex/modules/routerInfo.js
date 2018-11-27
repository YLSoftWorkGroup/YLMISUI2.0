import * as types from '../types'

 /* 
路由状态值
 */
const state = {
    current_Router:{},
    open_Router_List:[]
}

const actions = {
    setCurrentRouter({ commit }, status) {
        commit(types.CURRENT_ROUTER, status)
    },
    setOpenRouterList({ commit }, status) {
        commit(types.OPEN_ROUTER_LIST, status)
    }
}

const getters = {
    getCurrentRouter: status =>status.current_Router,
    getOpenRouterList: status =>status.open_Router_List,
}

const mutations = {
    [types.CURRENT_ROUTER](state, status) {
        state.current_Router = status
    },
    [types.OPEN_ROUTER_LIST](state, status) {
        state.open_Router_List = status
    },
}

export default {
    state,
    actions,
    getters,
    mutations
}