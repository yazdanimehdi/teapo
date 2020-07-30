import {
    COMPUTE_TIME,
    TIME_STOP,
    UPDATE_TIME,
    UPDATE_REMAINED_LISTENING_TIME,
    UPDATE_REMAINED_READING_TIME,
    UPDATE_REMAINED_WRITING_TIME
} from '../actions/time'
import {
    UPDATE_REMAINING_TIME_LISTENING,
    UPDATE_REMAINING_TIME_READING,
    UPDATE_REMAINING_TIME_WRITING
} from "@/store/actions/mainTPO";

const state = {
    totalUnchangedTime: 600,
    totalTime: 600,
    timeStop: true,
    hours: 0,
    minutes: 0,
    seconds: 0,
};
const getters = {
    formattedHours: state => state.hours.toString().length >= 2 ? state.hours.toString() : new Array(2 - state.hours.toString().length + 1).join('0') + state.hours.toString(),
    formattedMinutes: state => state.minutes.toString().length >= 2 ? state.minutes.toString() : new Array(2 - state.minutes.toString().length + 1).join('0') + state.minutes.toString(),
    formattedSeconds: state => state.seconds.toString().length >= 2 ? state.seconds.toString() : new Array(2 - state.seconds.toString().length + 1).join('0') + state.seconds.toString(),
    initialHours: state => parseInt((state.totalUnchangedTime / 60) / 60),
    initialMinute: state => parseInt(state.totalUnchangedTime / 60) % 60,
    initialSeconds: state => state.totalUnchangedTime % 60
};
const actions = {
    [COMPUTE_TIME]: ({state, commit}) => {
        if (state.timeStop === false) {
            commit('computeTime')
        }
    },
    [TIME_STOP]: ({commit}, payload) => {
        commit('stopTime', payload)
    },
    [UPDATE_TIME]: ({commit}, payload) => {
        commit('updateTime', payload);
        commit('updateTimeModules');
    },
    [UPDATE_REMAINED_READING_TIME]: ({state, dispatch}) => {
        dispatch(UPDATE_REMAINING_TIME_READING, state.totalTime)
    },
    [UPDATE_REMAINED_LISTENING_TIME]: ({state, dispatch}, payload) => {
        dispatch(UPDATE_REMAINING_TIME_LISTENING, {'sectionNumber': payload, 'time': state.totalTime})
    },
    [UPDATE_REMAINED_WRITING_TIME]: ({state, dispatch}, payload) => {
        dispatch(UPDATE_REMAINING_TIME_WRITING, {'sectionNumber': payload, 'time': state.totalTime})
    }
};

const mutations = {
    updateTimeModules(state){
        state.minutes = parseInt(state.totalTime / 60);
        state.hours = parseInt(state.minutes / 60);
        state.minutes = state.minutes % 60;
        state.seconds = state.totalTime % 60;
    },
    computeTime(state) {
        state.totalTime = state.totalTime - 1;
        if (state.totalTime <= 0) {
            console.log('Time Ended')

        }
        state.minutes = parseInt(state.totalTime / 60);
        state.hours = parseInt(state.minutes / 60);
        state.minutes = state.minutes % 60;
        state.seconds = state.totalTime % 60;
    },
    stopTime(state, payload) {
        state.timeStop = payload;
    },
    updateTime(state, payload) {
        state.totalTime = payload;
        state.totalUnchangedTime = payload;
        console.log(state.totalTime)
    }

};

export default {
    state,
    getters,
    actions,
    mutations
};