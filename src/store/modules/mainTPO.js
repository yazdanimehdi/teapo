import {
    UPDATE_COMPONENT,
    START_TPO,
    NEXT_SECTION,
    PREVIOUS_SECTION,
    UPDATE_INITIAL_STATE,
    SET_NEW_TIME,
    UPDATE_REMAINING_TIME_READING,
    UPDATE_REMAINING_TIME_LISTENING,
    UPDATE_REMAINING_TIME_WRITING,
    SET_WRITING_READING_TIME
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
    readingTime: 0,
    listeningTimes: [],
    writingTimes: [],
    speakingTimes: [],
    userTestId: 0,
};

const getters = {
    backAvailable: state => state.examSectionNumber !== 0,
    speakingTimes: state => state.speakingTimes,
    writingTimes: state => state.writingTimes
};
const actions = {
    [SET_WRITING_READING_TIME]: ({state, dispatch}, payload) => {
        dispatch(UPDATE_TIME, state.writingTimes[payload]['reading_time'])
    },
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
        let knex = require('knex')({
            client: 'sqlite3',
            connection: {
                filename: './db.sqlite3'
            },
            useNullAsDefault: true
        });
        let userId = localStorage.getItem('user-id')
        knex('tpousers_testuser').insert({
            test_id: payload['TPO'],
            user_id: userId,
            date_time: Date.now(),
            is_done: false,
            is_paid: true,
        }).then((id) => {
            commit('updateUserTestId', id[0]['id'])
            commit('updateExamArray', payload['examArray']);
            commit('updateMode', payload['mode'])
            for (let i = 0; i < state.examArray.length; i++) {
                if (state.examArray[i] === 'Reading') {
                    knex.select('*').from('tpo_test').where({id: payload['TPO']}).then((row) => {
                        commit('updateReadingTime', row[0]['reading_time'])
                        dispatch(SET_NEW_TIME, 0)
                        dispatch(GET_DATA_READING, payload['TPO'])

                    })
                }
                if (state.examArray[i] === 'Listening') {
                    let listeningTimes = []
                    knex.select('*').from('tpo_listeningtimes').where({test_id: payload['TPO']}).then((rows) => {
                        for(let i = 0; i < rows.length; i++){
                            listeningTimes.push(rows[i])
                        }
                        listeningTimes = listeningTimes.sort(function (a, b) {
                            return a['number'] - b['number']
                        });
                        listeningTimes = listeningTimes.map((inst) => inst['time'])
                        commit('updateListeningTime', listeningTimes);
                        dispatch(SET_NEW_TIME, 0)
                        dispatch(GET_DATA_LISTENING, payload['TPO'])

                    })

                }
                if (state.examArray[i] === 'Speaking') {
                    let speakingTimes = [];
                    knex.select('*').from('tpo_speakingtimes').where({test_id: payload['TPO']}).then((rows) => {
                        for(let i = 0; i < rows.length; i++){
                            speakingTimes.push(rows[i])
                        }
                        speakingTimes = speakingTimes.sort(function (a, b) {
                            return a['number'] - b['number']
                        });
                        commit('updateSpeakingTime', speakingTimes);
                        dispatch(GET_DATA_SPEAKING, payload['TPO'])
                    })
                }
                if (state.examArray[i] === 'Writing') {
                    let writingTimes = [];
                    knex.select('*').from('tpo_writingtimes').where({test_id: payload['TPO']}).then((rows) => {
                        for(let i = 0; i < rows.length; i++){
                            writingTimes.push(rows[i])
                        }
                        writingTimes = writingTimes.sort(function (a, b) {
                            return a['number'] - b['number']
                        });
                        commit('updateWritingTime', writingTimes);
                        dispatch(SET_NEW_TIME, 0)
                        dispatch(GET_DATA_WRITING, payload['TPO'])
                    })
                }
            }
            dispatch(UPDATE_INITIAL_STATE);
        })

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
            if(state.examArray[state.examSectionNumber] === 'Reading'){
                dispatch(SET_NEW_TIME, 0)
            }
            if(state.examArray[state.examSectionNumber] === 'Listening'){
                dispatch(SET_NEW_TIME, state.listeningTimes.length)
            }
            if(state.examArray[state.examSectionNumber] === 'Writing'){
                dispatch(SET_NEW_TIME, state.writingTimes.length)
            }
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
            dispatch(UPDATE_TIME, state.writingTimes[payload]['time'])
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
    updateUserTestId(state, payload) {
      this.userTestId = payload;
    },
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
        if ('sectionNumber' in payload){
            state.listeningTimes[payload['sectionNumber']] = payload['time']
        }
        else {
            state.listeningTimes = payload
        }
    },
    updateSpeakingTime(state, payload) {
        state.speakingTimes = payload;
    },
    updateWritingTime(state, payload) {
        if ('sectionNumber' in payload){
            state.writingTimes[payload['sectionNumber']]['time'] = payload['time']
        }
        else {
            state.writingTimes = payload
        }
    },
    updateSeenArray(state, payload) {
        if(state.seenArray.indexOf(payload) === -1){
            state.seenArray.push(payload);
        }
    },
    updateMode(state, payload) {
        state.mode = payload
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}