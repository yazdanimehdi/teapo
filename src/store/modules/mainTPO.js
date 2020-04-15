import {UPDATE_COMPONENT} from "../actions/mainTPO";

const state = {
    currentComponent: 'ReadingPassage',
};

const actions = {
    [UPDATE_COMPONENT]: ({commit}, payload) => {
        commit('updateComponent', payload)
    }
};

const mutations = {
    updateComponent(state, payload) {
      state.currentComponent = payload;
    }
};

export default {
    state,
    actions,
    mutations
}