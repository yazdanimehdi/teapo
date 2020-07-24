import {
    GET_DATA_SPEAKING,
    GO_TO_NEXT_SPEAKING,
    GO_TO_PREVIOUS_SPEAKING, GO_TO_SPEAKING_QUESTION, SAVE_ANSWER_SPEAKING, UPDATE_STATE_SPEAKING,

} from '../actions/speaking'

import {NEXT_SECTION, PREVIOUS_SECTION, UPDATE_COMPONENT} from "@/store/actions/mainTPO";
import {TIME_STOP} from "@/store/actions/time";


const SpeakingDirections = 'SpeakingDirections';
const DirectionSpeaking = 'DirectionSpeaking';
const Recorder = 'Recorder';
const SpeakingReading = 'SpeakingReading';
const SpeakingPlayer = 'SpeakingPlayer';

const state = {
    speaking: [],
    taskNumber: -1,
    stateNumber: -1,
    answers: {}
};

const getters = {
    speakingLength: state => state.speaking.length,
    speakingGuidAudiFile: state => {
        if (state.speaking[state.taskNumber]['speaking_question_guide_audio_file'][0] === 'b' && state.speaking[state.taskNumber]['speaking_question_guide_audio_file'][1] === '\'') {
            return state.speaking[state.taskNumber]['speaking_question_guide_audio_file'].slice(2, -1)
        } else {
            return state.speaking[state.taskNumber]['speaking_question_guide_audio_file']
        }
    },
    speakingImageSource: state => {
        if (state.speaking[state.taskNumber]['speaking_image'][0] === 'b' && state.speaking[state.taskNumber]['speaking_image'][1] === '\'') {
            return state.speaking[state.taskNumber]['speaking_image'].slice(2, -1)
        } else {
            return state.speaking[state.taskNumber]['speaking_image']
        }
    },
    speakingListeningSource: state => {
        if (state.speaking[state.taskNumber]['speaking_audio_file'][0] === 'b' && state.speaking[state.taskNumber]['speaking_audio_file'][1] === '\'') {
            return state.speaking[state.taskNumber]['speaking_audio_file'].slice(2, -1)
        } else {
            return state.speaking[state.taskNumber]['speaking_audio_file']
        }
    },
    speakingBeforeReadAudio: state => {
        if (state.speaking[state.taskNumber]['speaking_question_before_read_audio'][0] === 'b' && state.speaking[state.taskNumber]['speaking_question_before_read_audio'][1] === '\'') {
            return state.speaking[state.taskNumber]['speaking_question_before_read_audio'].slice(2, -1)
        } else {
            return state.speaking[state.taskNumber]['speaking_question_before_read_audio']
        }
    },
    speakingReadingTitle: state => state.speaking[state.taskNumber]['speaking_reading_title'],
    speakingReading: state => state.speaking[state.taskNumber]['speaking_reading'],
    speakingReadingTime: state => state.speaking[state.taskNumber]['speaking_reading_time'],
    speakingQuestion: state => state.speaking[state.taskNumber]['speaking_question'],
    speakingQuestionAudioFile: state => {
        if (state.speaking[state.taskNumber]['speaking_question_audio_file'][0] === 'b' && state.speaking[state.taskNumber]['speaking_question_audio_file'][1] === '\'') {
            return state.speaking[state.taskNumber]['speaking_question_audio_file'].slice(2, -1)
        } else {
            return state.speaking[state.taskNumber]['speaking_question_audio_file']
        }
    },
    speakingQuestionPrepareTime: state => state.speaking[state.taskNumber]['speaking_prepare_time'],
    speakingTime: state => state.speaking[state.taskNumber]['speaking_time'],
    speakingAnswer: state => {
        if (state.speaking[state.taskNumber].id in state.answers) {
            return state.answers[state.speaking[state.taskNumber].id]
        } else {
            return ''
        }
    },
    speakingId: state => state.speaking[state.taskNumber].id

};

const actions = {
    [GET_DATA_SPEAKING]: ({commit}, payload) => {
        var knex = require('knex')({
            client: 'sqlite3',
            connection: {
                filename: './db.sqlite3'
            },
            useNullAsDefault: true
        });
        let result = knex.select("*").from('tpo_speaking').where({related: payload});
        result.then(function (rows) {
            commit('updateSpeakingData', rows)
        });
    },
    [UPDATE_STATE_SPEAKING]: ({state, dispatch}) => {
        if (state.taskNumber === -1) {
            dispatch(TIME_STOP, true)
            dispatch(UPDATE_COMPONENT, SpeakingDirections)
        } else {
            if (state.speaking[state.taskNumber].number === 1) {
                if (state.stateNumber === -1) {
                    dispatch(UPDATE_COMPONENT, DirectionSpeaking)
                }
                if (state.stateNumber === 0) {
                    dispatch(UPDATE_COMPONENT, Recorder)
                }
            }
            if (state.speaking[state.taskNumber].number === 2) {
                if (state.stateNumber === -1) {
                    dispatch(UPDATE_COMPONENT, DirectionSpeaking)
                }
                if (state.stateNumber === 0) {
                    dispatch(UPDATE_COMPONENT, Recorder);
                }
            }
            if (state.speaking[state.taskNumber].number === 3) {
                if (state.stateNumber === -1) {
                    dispatch(UPDATE_COMPONENT, DirectionSpeaking)
                }
                if (state.stateNumber === 0) {
                    dispatch(UPDATE_COMPONENT, SpeakingReading)
                }
                if (state.stateNumber === 1) {
                    dispatch(UPDATE_COMPONENT, SpeakingPlayer)
                }
                if (state.stateNumber === 2) {
                    dispatch(UPDATE_COMPONENT, Recorder)
                }

            }
            if (state.speaking[state.taskNumber].number === 4) {
                if (state.stateNumber === -1) {
                    dispatch(UPDATE_COMPONENT, DirectionSpeaking)
                }
                if (state.stateNumber === 0) {
                    dispatch(UPDATE_COMPONENT, SpeakingReading)
                }
                if (state.stateNumber === 1) {
                    dispatch(UPDATE_COMPONENT, SpeakingPlayer)
                }
                if (state.stateNumber === 2) {
                    dispatch(UPDATE_COMPONENT, Recorder)
                }

            }
            if (state.speaking[state.taskNumber].number === 5) {
                if (state.stateNumber === -1) {
                    dispatch(UPDATE_COMPONENT, DirectionSpeaking)
                }
                if (state.stateNumber === 0) {
                    dispatch(UPDATE_COMPONENT, SpeakingPlayer)
                }
                if (state.stateNumber === 1) {
                    dispatch(UPDATE_COMPONENT, Recorder)
                }

            }
            if (state.speaking[state.taskNumber].number === 6) {
                if (state.stateNumber === -1) {
                    dispatch(UPDATE_COMPONENT, DirectionSpeaking)
                }
                if (state.stateNumber === 0) {
                    dispatch(UPDATE_COMPONENT, SpeakingPlayer)
                }
                if (state.stateNumber === 1) {
                    dispatch(UPDATE_COMPONENT, Recorder)
                }
            }
        }
    },

    [GO_TO_NEXT_SPEAKING]: ({state, commit, dispatch}) => {
        if (state.taskNumber === -1) {
            commit('updateSpeakingTaskNumber', 0);
            dispatch(UPDATE_STATE_SPEAKING)
        } else {
            if (state.stateNumber + 2 >= state.speaking[state.taskNumber].sections) {
                if (state.taskNumber + 1 >= state.speaking.length) {
                    dispatch(NEXT_SECTION)

                } else {
                    commit('updateSpeakingTaskNumber', state.taskNumber + 1);
                    commit('updateSpeakingStateNumber', -1);
                    dispatch(UPDATE_STATE_SPEAKING)
                }
            } else {
                commit('updateSpeakingStateNumber', state.stateNumber + 1);
                dispatch(UPDATE_STATE_SPEAKING)
            }
        }

    },

    [GO_TO_PREVIOUS_SPEAKING]: ({state, commit, dispatch}) => {

        if (state.stateNumber - 1 < -1) {
            if (state.taskNumber - 1 < -1) {
                dispatch(PREVIOUS_SECTION)

            } else {
                commit('updateSpeakingTaskNumber', state.taskNumber - 1);
                commit('updateSpeakingStateNumber', -1);
                dispatch(UPDATE_STATE_SPEAKING)
            }
        } else {
            commit('updateSpeakingStateNumber', state.stateNumber - 1);
            dispatch(UPDATE_STATE_SPEAKING)
        }
    },
    [GO_TO_SPEAKING_QUESTION]: ({commit, dispatch}, payload) => {
        commit('updateSpeakingTaskNumber', payload);
        commit('updateSpeakingStateNumber', -1);
        dispatch(UPDATE_STATE_SPEAKING)
    },

    [SAVE_ANSWER_SPEAKING]: ({commit}, payload) => {
        commit('saveSpeakingAnswers', payload)
        let knex = require('knex')({
            client: 'sqlite3',
            connection: {
                filename: './db.sqlite3'
            },
            useNullAsDefault: true
        });
        knex('tpo_userspeakinganswers').insert({'answer': payload[1], 'question_id': payload[0], 'user_test_id': 1})

    }

};

const mutations = {
    saveSpeakingAnswers(state, payload){
      state.answers[payload[0]] = payload[1]
    },
    updateSpeakingData(state, payload) {
        state.speaking = payload
    },

    updateSpeakingTaskNumber(state, payload) {
        state.taskNumber = payload;
    },
    updateSpeakingStateNumber(state, payload) {
        state.stateNumber = payload
    },
}

export default {
    state,
    getters,
    actions,
    mutations
};


