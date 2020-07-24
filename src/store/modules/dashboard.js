import {CHANGE_TAB} from "@/store/actions/dashboard";

const state = {
    tabNumber: 0,
}
const getters = {

}
const actions = {
    [CHANGE_TAB]: ({commit}, payload) => {
        commit('updateTab', payload)
    }
}
const mutations = {
    updateTab(state, payload){
        state.tabNumber = payload;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}