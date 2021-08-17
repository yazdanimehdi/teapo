import {
    GET_DATA_SPEAKING,
    GO_TO_NEXT_SPEAKING,
    GO_TO_PREVIOUS_SPEAKING, GO_TO_SPEAKING_QUESTION, SAVE_ANSWER_SPEAKING, UPDATE_STATE_SPEAKING,SET_SPEAKING_ANSWERS

} from '../actions/speaking'

import {NEXT_SECTION, PREVIOUS_SECTION, UPDATE_COMPONENT} from "../actions/mainTPO";
import {TIME_STOP} from "../actions/time";


const SpeakingDirections = 'SpeakingDirections';
const DirectionSpeaking = 'DirectionSpeaking';
const Recorder = 'Recorder';
const SpeakingReading = 'SpeakingReading';
const SpeakingPlayer = 'SpeakingPlayer';

let knex = require('../../db/knex')

const state = {
    speaking: [],
    taskNumber: -1,
    stateNumber: -1,
    answers: {}
};

const getters = {
    speakingLength: state => state.speaking.length,
    speakingGuidAudiFile: state => state.speaking[state.taskNumber]['speaking_question_guide_audio_file'],
    speakingImageSource: state => state.speaking[state.taskNumber]['speaking_image'],
    speakingListeningSource: state => state.speaking[state.taskNumber]['speaking_audio_file'],
    speakingBeforeReadAudio: state => state.speaking[state.taskNumber]['speaking_question_before_read_audio'],
    speakingReadingTitle: state => state.speaking[state.taskNumber]['speaking_reading_title'],
    speakingReading: state => state.speaking[state.taskNumber]['speaking_reading'],
    speakingQuestion: state => state.speaking[state.taskNumber]['speaking_question'],
    speakingQuestionAudioFile: state => state.speaking[state.taskNumber]['speaking_question_audio_file'],
    speakingAnswer: state => {
        if (state.speaking[state.taskNumber].id in state.answers) {
            return state.answers[state.speaking[state.taskNumber].id]
        } else {
            return ''
        }
    },
    speakingId: state => state.speaking[state.taskNumber].id,
    speakingTaskNumber: state => state.taskNumber,

};

const actions = {
    [SET_SPEAKING_ANSWERS]: ({commit}, payload) => {
      for(let i = 0; i < payload.length; i++){
          commit('saveSpeakingAnswers', [payload[i]['question_id'], payload[i]['answer']])
      }
    },
    [GET_DATA_SPEAKING]: ({commit}, payload) => {
            commit('resetAllSpeaking');
            let tpo = knex.select("*").from('tpo_testspeaking').where({test_id: payload});
            return tpo.then(async function (speakings) {
                let speakingList = [...speakings];
                speakingList = speakingList.sort(function (a, b){
                    return a.part - b.part
                })
                for (let m = 0; m < speakingList.length; m++) {
                    let result = knex.select("*").from('tpo_speaking').where({id: speakingList[m]['speaking_id']});
                    await result.then(function (rows) {
                        commit('updateSpeakingData', rows[0])
                    });
                }
            })

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

    [SAVE_ANSWER_SPEAKING]: ({commit, rootState}, payload) => {
        commit('saveSpeakingAnswers', payload)

        knex.select('*').from('tpousers_userspeakinganswers').where({
            'question_id': payload[0],
            'user_test_id': rootState.mainTPO.userTestId
        }).then((rows) => {
            if (rows.length > 0) {
                knex('tpousers_userspeakinganswers').where({
                    user_test_id: rootState.mainTPO.userTestId,
                    question_id: payload[0]
                }).update({
                    answer: payload[1]
                }).then(() => {
                })
            } else {
                knex('tpousers_userspeakinganswers').insert({
                    'answer': payload[1],
                    'question_id': payload[0],
                    'user_test_id': rootState.mainTPO.userTestId
                }).then(() => {
                })
            }
        })
    }

};

const mutations = {
    resetAllSpeaking(state){
        state.speaking = []
        state.taskNumber = -1
        state.stateNumber = -1
        state.answers = {}
    },
    saveSpeakingAnswers(state, payload){
      state.answers[payload[0]] = payload[1]
    },
    updateSpeakingData(state, payload) {
        state.speaking.push(payload);
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


