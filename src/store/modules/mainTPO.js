import {
    UPDATE_COMPONENT,
    START_TPO,
    NEXT_SECTION,
    PREVIOUS_SECTION,
    UPDATE_INITIAL_STATE,
    SET_NEW_TIME,
    UPDATE_REMAINING_TIME_READING,
    UPDATE_REMAINING_TIME_LISTENING,
    UPDATE_REMAINING_TIME_WRITING
} from "../actions/mainTPO";
import {GET_DATA_READING, UPDATE_STATE_READING} from "@/store/actions/reading";
import {GET_DATA_LISTENING, UPDATE_STATE_LISTENING} from "@/store/actions/listening";
import {GET_DATA_SPEAKING, UPDATE_STATE_SPEAKING} from "@/store/actions/speaking";
import {GET_DATA_WRITING, UPDATE_STATE_WRITING} from "@/store/actions/writing";
import {UPDATE_TIME} from "@/store/actions/time";

const state = {
    mode: 'practiceMode',
    currentComponent: '',
    examArray: [],
    seenArray: [],
    examSectionNumber: 0,
    readingTime: 3600,
    listeningTimes: [600, 600],
    writingTimes: [1200, 1800],
};

const getters = {
    backAvailable: state => state.examSectionNumber !== 0
};
const actions = {
    [UPDATE_COMPONENT]: ({commit}, payload) => {
        commit('updateComponent', payload)
    },
    [UPDATE_INITIAL_STATE]: ({state, commit, dispatch}) => {
        if (state.examArray[state.examSectionNumber] === 'Reading') {
            if(state.seenArray.indexOf('Reading') === -1){
                commit('updateComponent', 'ReadingDirection')
            }
            else {
                dispatch(UPDATE_STATE_READING)
            }

        }
        if (state.examArray[state.examSectionNumber] === 'Listening') {
            if(state.seenArray.indexOf('Listening') === -1){
                commit('updateComponent', 'ListeningDirection')
            }
            else {
                dispatch(UPDATE_STATE_LISTENING)
            }

        }
        if (state.examArray[state.examSectionNumber] === 'Speaking') {
            if(state.seenArray.indexOf('Speaking') === -1){
                commit('updateComponent', 'SpeakingDirections')
            }
            else {
                dispatch(UPDATE_STATE_SPEAKING)
            }

        }
        if (state.examArray[state.examSectionNumber] === 'Writing') {
            if(state.seenArray.indexOf('Writing') === -1) {
                commit('updateComponent', 'WritingDirection')
            }
            else {
                dispatch(UPDATE_STATE_WRITING)
            }
        }
    },

    [START_TPO]: ({state, commit, dispatch}, payload) => {
        commit('updateExamArray', payload['examArray']);
        for (let i = 0; i < state.examArray.length; i++) {
            if (state.examArray[i] === 'Reading') {
                dispatch(GET_DATA_READING, payload['TPO'])
                dispatch(SET_NEW_TIME, 0)
            }
            if (state.examArray[i] === 'Listening') {
                dispatch(GET_DATA_LISTENING, payload['TPO'])
                dispatch(SET_NEW_TIME, 0)
            }
            if (state.examArray[i] === 'Speaking') {
                dispatch(GET_DATA_SPEAKING, payload['TPO'])
            }
            if (state.examArray[i] === 'Writing') {
                dispatch(GET_DATA_WRITING, payload['TPO'])
                dispatch(SET_NEW_TIME, 0)
            }
        }
        dispatch(UPDATE_INITIAL_STATE);

    },
    [NEXT_SECTION]: ({state, commit, dispatch}) => {
        commit('updateSeenArray', state.examArray[state.examSectionNumber]);
        if (state.examSectionNumber + 1 < state.examArray.length) {
            commit('updateExamSectionNumber', state.examSectionNumber + 1)
            dispatch(SET_NEW_TIME, 0)
            dispatch(UPDATE_INITIAL_STATE);
        }
    },
    [PREVIOUS_SECTION]: ({state, commit, dispatch}) => {
        if (state.examSectionNumber - 1 >= 0) {
            commit('updateExamSectionNumber', state.examSectionNumber - 1)
            dispatch(SET_NEW_TIME, 0)
            dispatch(UPDATE_INITIAL_STATE);
        }
    },
    [SET_NEW_TIME]: ({dispatch}, payload) => {
        if (state.examArray[state.examSectionNumber] === 'Reading') {
            dispatch(UPDATE_TIME, state.readingTime)
        }
        if (state.examArray[state.examSectionNumber] === 'Listening') {
            dispatch(UPDATE_TIME, state.listeningTimes[payload])
        }
        if (state.examArray[state.examSectionNumber] === 'Writing') {
            dispatch(UPDATE_TIME, state.writingTimes[payload])
        }
    },
    [UPDATE_REMAINING_TIME_READING]: ({commit}, payload) => {
        commit('updateReadingTime', payload);
    },
    [UPDATE_REMAINING_TIME_LISTENING]: ({commit}, payload) => {
        commit('updateListeningTime', payload);
    },
    [UPDATE_REMAINING_TIME_WRITING]: ({commit}, payload) => {
        commit('updateWritingTime', payload);
    }
};

const mutations = {
    updateComponent(state, payload) {
        state.currentComponent = payload;
    },
    updateExamArray(state, payload) {
        state.examArray = payload
    },
    updateExamSectionNumber(state, payload) {
        state.examSectionNumber = payload
    },
    updateReadingTime(state, payload) {
        state.readingTime = payload
    },
    updateListeningTime(state, payload) {
        state.listeningTimes[payload['sectionNumber']] = payload['time']
    },
    updateWritingTime(state, payload) {
        state.writingTimes[payload['sectionNumber']] = payload['time']
    },
    updateSeenArray(state, payload) {
        if(state.seenArray.indexOf(payload) === -1){
            state.seenArray.push(payload);
        }
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}