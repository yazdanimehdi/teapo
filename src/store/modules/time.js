import {COMPUTE_TIME} from '../actions/time'

const state = {
    totalTime: 10000,
    timeStop: false,
    hours: 0,
    minutes: 0,
    seconds: 0,
};
const getters = {
    formattedHours: state => state.hours.toString().length >= 2 ? state.hours.toString() : new Array(2 - state.hours.toString().length + 1).join('0') + state.hours.toString(),
    formattedMinutes: state => state.minutes.toString().length >= 2 ? state.minutes.toString() : new Array(2 - state.minutes.toString().length + 1).join('0') + state.minutes.toString(),
    formattedSeconds: state => state.seconds.toString().length >= 2 ? state.seconds.toString() : new Array(2 - state.seconds.toString().length + 1).join('0') + state.seconds.toString(),
};
const actions = {
    [COMPUTE_TIME]: ({state, commit}) => {
        if (state.timeStop === false) {
            commit('computeTime')
        }
    }
};

const mutations = {
    computeTime(state) {
        state.totalTime = state.totalTime - 1;
        if (state.totalTime <= 0) {
            state.currentComponent = 'TimeEnded';

        }
        state.minutes = parseInt(state.totalTime / 60);
        state.hours = parseInt(state.minutes / 60);
        state.minutes = state.minutes % 60;
        state.seconds = state.totalTime % 60;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};