import * as types from '../types'

 /* 
选材框的选中值
SEL_SELECTROWS
 */
const state = {
    sel_selectrows:[],
    sel_type:{},
    sel_isvisible:false,
    sel_baseinfoconf:{},
    sel_apiconf:{},
    sel_fliterconf:{},
    sel_functionconf:{},
    sel_tableinfoconf:{}
}
const actions = {
    setSelectRows({ commit }, status) {
        commit(types.SEL_SELECTROWS, status)
    },
    setType({ commit }, status) {
        commit(types.SEL_TYPE, status)
    },
    setIsVisible({ commit }, status) {
        commit(types.SEL_ISVISIBLE, status)
    },
    setBaseinfoConf({ commit }, status) {
        commit(types.SEL_BASEINFOCONF, status)
    },
    setApiConf({ commit }, status) {
        commit(types.SEL_APICONF, status)
    },
    setFliterConf({ commit }, status) {
        commit(types.SEL_FLITERCONF, status)
    },
    setTableinfoConf({ commit }, status) {
        commit(types.SEL_TABLEINFOCONF, status)
    },
    setFunctionConf({ commit }, status) {
        commit(types.SEL_FUNCTIONCONF, status)
    }
}

const getters = {
    getSelectRows: status =>status.sel_selectrows,
    getType: status =>status.sel_type,
    getIsVisible: status =>status.sel_isvisible,
    getBaseinfoConf: status => status.sel_baseinfoconf,
    getApiConf: status =>status.sel_apiconf,
    getFliterConf: status =>status.sel_fliterconf,
    getTableinfoConf: status =>status.sel_tableinfoconf,
    getFunctionConf: status =>status.sel_functionconf,
}

const mutations = {
    [types.SEL_SELECTROWS](state, status) {
        state.sel_selectrows = status
    },
    [types.SEL_TYPE](state, status) {
        state.sel_type = status
    },
    [types.SEL_ISVISIBLE](state, status) {
        state.sel_isvisible = status
    },
    [types.SEL_BASEINFOCONF](state, status) {
        state.sel_baseinfoconf = status
    },
    [types.SEL_APICONF](state, status) {
        state.sel_apiconf = status
    },
    [types.SEL_FLITERCONF](state, status) {
        state.sel_fliterconf = status
    },
    [types.SEL_TABLEINFOCONF](state, status) {
        state.sel_tableinfoconf = status
    },
     [types.SEL_FUNCTIONCONF](state, status) {
        state.sel_functionconf = status
    },
}

export default {
    state,
    actions,
    getters,
    mutations
}