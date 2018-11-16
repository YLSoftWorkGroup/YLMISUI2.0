import * as types from '../types'

 /* 
选材框的选中值
SEL_SELECTROWS
 */

export const ITEM_TABLECONFIG='ITEM_TABLECONFIG'
export const ITEM_SELECTFILTER='ITEM_SELECTFILTER'
export const ITEM_FUNCONFIG='ITEM_FUNCONFIG'
export const ITEM_ISVISIBLE='ITEM_ISVISIBLE'
export const ITEM_BASEINFOCONF='ITEM_BASEINFOCONF'

const state = {
    item_tableConfig:{},
    item_selectFilter:{},
    item_funConfig:{},
    item_baseInfoConf:{},
    item_isvisible:false,
}

const actions = {
    setItem_tableConfig({ commit }, status) {
        commit(types.ITEM_TABLECONFIG, status)
    },
     setItem_selectFilter({ commit }, status) {
        commit(types.ITEM_SELECTFILTER, status)
    },
     setItem_funConfig({ commit }, status) {
        commit(types.ITEM_FUNCONFIG, status)
    },
     setItem_isvisible({ commit }, status) {
        commit(types.ITEM_ISVISIBLE, status)
    },
     setItem_baseInfoConf({ commit }, status) {
        commit(types.ITEM_BASEINFOCONF, status)
    }
}

const getters = {
        getItem_tableConfig: status =>status.item_tableConfig,
        getItem_selectFilter: status =>status.item_selectFilter,
        getItem_funConfig: status =>status.item_funConfig,
        getItem_isvisible: status =>status.item_isvisible,
        getItem_baseInfoConf: status =>status.item_baseInfoConf,
}

const mutations = {
    [types.ITEM_TABLECONFIG](state, status) {
        state.item_tableConfig = status
    },
    [types.ITEM_SELECTFILTER](state, status) {
        state.item_selectFilter = status
    },
    [types.ITEM_FUNCONFIG](state, status) {
        state.item_funConfig = status
    },
    [types.ITEM_ISVISIBLE](state, status) {
        state.item_isvisible = status
    },
    [types.ITEM_BASEINFOCONF](state, status) {
        state.item_baseInfoConf = status
    },
}

export default {
    state,
    actions,
    getters,
    mutations
}