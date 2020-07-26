import {CHANGE_TAB, SET_CONNECTION} from "@/store/actions/dashboard";

const state = {
    tabNumber: 0,
    connected: navigator.onLine,
}
const getters = {
    connected: state => state.connected,
}
const actions = {
    [CHANGE_TAB]: ({commit}, payload) => {
        commit('updateTab', payload)
    },
    [SET_CONNECTION]: ({commit}, payload) => {
        commit('SET_CONNECTED', payload)
    }
}
const mutations = {
    updateTab(state, payload){
        state.tabNumber = payload;
    },
    SET_CONNECTED(state, payload) {
        state.connected = payload
    },
}

export default {
    state,
    getters,
    actions,
    mutations
}