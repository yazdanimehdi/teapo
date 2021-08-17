import {
    GET_DATA_WRITING, GO_TO_NEXT_WRITING,
    SAVE_ANSWER_WRITING, GO_TO_PREVIOUS_WRITING,
    WRITING_TIME_ENDED, GO_TO_WRITING_QUESTION, UPDATE_STATE_WRITING,
    SET_WRITING_ANSWERS

} from '../actions/writing'

import {
    NEXT_SECTION,
    PREVIOUS_SECTION,
    UPDATE_COMPONENT,
    SET_WRITING_READING_TIME,
    SET_NEW_TIME
} from "../actions/mainTPO";
import {TIME_STOP, UPDATE_REMAINED_WRITING_TIME} from "../actions/time";

let knex = require('../../db/knex')

const state = {
    taskNumber: 0,
    stateNumber: -1,
    writing: [],
    answers: {},
};
const getters = {
    writingLength: state => state.writing.length,
    writingQuestionNumber: state => state.taskNumber + 1,
    writingQuestion: state => state.writing[state.taskNumber]["writing_question"],
    writingReading: state => state.writing[state.taskNumber]["writing_reading"],
    writingImageSource: state => state.writing[state.taskNumber]['writing_image'],
    writingListeningSource: state => state.writing[state.taskNumber]['writing_listening'],
    writingId: state => state.writing[state.taskNumber].id,
};
const actions = {
    [SET_WRITING_ANSWERS]: ({commit}, payload) => {
        for (let i = 0; i < payload.length; i++) {
            commit('updateWritingAnswers', [payload[i]['question_id'], payload[i]['answer']])
        }
    },
    [GET_DATA_WRITING]: ({commit}, payload) => {
        commit('resetAllWriting');
        let tpo = knex.select("*").from('tpo_testwriting').where({test_id: payload});
        return tpo.then(async function (writings) {
            let writingList = [...writings]
            writingList = writingList.sort(function (a, b) {
                return a.part - b.part
            })
            for (let m = 0; m < writingList.length; m++) {
                let result = knex.select("*").from('tpo_writing').where({id: writingList[m]['writing_id']});
                await result.then(function (rows) {
                    commit('updateWritingData', rows[0])
                });
            }
        })
    },
    [UPDATE_STATE_WRITING]: ({state, dispatch}) => {
        if (state.writing[state.taskNumber].type === 'Integrated') {
            if (state.stateNumber === -1) {
                dispatch(TIME_STOP, true);
                dispatch(UPDATE_COMPONENT, 'IntegratedWritingDirection')
            }
            if (state.stateNumber === 0) {
                dispatch(SET_WRITING_READING_TIME, state.taskNumber)
                dispatch(TIME_STOP, false)
                dispatch(UPDATE_COMPONENT, 'WritingReading')
            }
            if (state.stateNumber === 1) {
                dispatch(TIME_STOP, true)
                dispatch(UPDATE_COMPONENT, 'WritingPlayer')
            }
            if (state.stateNumber === 2) {
                dispatch(TIME_STOP, false)
                dispatch(UPDATE_COMPONENT, 'WritingIntegrated')
            }
        }
        if (state.writing[state.taskNumber].type === 'Independent') {
            if (state.stateNumber === -1) {
                dispatch(TIME_STOP, true)
                dispatch(UPDATE_COMPONENT, 'IndependentWritingDirection')
            }
            if (state.stateNumber === 0) {
                dispatch(TIME_STOP, false)
                dispatch(UPDATE_COMPONENT, 'WritingIndependent')
            }
        }
    },

    [WRITING_TIME_ENDED]: ({dispatch}) => {
        dispatch(TIME_STOP, true)
        dispatch(UPDATE_COMPONENT, 'TimeEndedWriting')
    },
    [GO_TO_PREVIOUS_WRITING]: ({state, commit, dispatch}) => {

        if (state.taskNumber === -1) {
            commit('updateTaskNumber', 0);
        } else {
            if (state.stateNumber - 1 < -1) {
                if (state.taskNumber - 1 < 0) {
                    dispatch(UPDATE_REMAINED_WRITING_TIME, state.taskNumber);
                    dispatch(PREVIOUS_SECTION)
                } else {
                    commit('updateTaskNumber', state.taskNumber - 1);
                    commit('updateStateNumber', state.writing[state.taskNumber].sections - 2);
                    dispatch(UPDATE_STATE_WRITING);
                }
            } else {
                commit('updateStateNumber', state.stateNumber - 1);
                dispatch(UPDATE_STATE_WRITING);
            }
        }

    },
    [GO_TO_NEXT_WRITING]: ({state, commit, dispatch}) => {

        if (state.taskNumber === -1) {
            commit('updateTaskNumber', 0);
        } else {
            if (state.stateNumber + 2 >= state.writing[state.taskNumber].sections) {
                if (state.taskNumber + 1 >= state.writing.length) {
                    dispatch(UPDATE_REMAINED_WRITING_TIME, state.taskNumber);
                    dispatch(NEXT_SECTION)
                } else {
                    commit('updateTaskNumber', state.taskNumber + 1);
                    commit('updateStateNumber', -1);
                    dispatch(SET_NEW_TIME, state.taskNumber)
                    dispatch(UPDATE_STATE_WRITING);
                }
            } else {
                commit('updateStateNumber', state.stateNumber + 1);
                dispatch(UPDATE_STATE_WRITING);
            }
        }
    },
    [GO_TO_WRITING_QUESTION]: ({commit, dispatch}, payload) => {
        commit('updateTaskNumber', payload);
        commit('updateStateNumber', -1);
        dispatch(UPDATE_STATE_WRITING);

    },
    [SAVE_ANSWER_WRITING]: ({commit, rootState}, payload) => {
        commit('updateWritingAnswers', payload)

        knex.select('*').from('tpousers_userwritinganswers').where({
            'question_id': payload[0],
            'user_test_id': rootState.mainTPO.userTestId
        }).then((rows) => {
            if (rows.length > 0) {
                knex('tpousers_userwritinganswers').where({
                    user_test_id: rootState.mainTPO.userTestId,
                    question_id: payload[0]
                }).update({
                    answer: payload[1]
                }).then(() => {
                })
            } else {
                knex('tpousers_userwritinganswers').insert({
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
    resetAllWriting(state) {
        state.taskNumber = 0
        state.stateNumber = -1
        state.writing = []
        state.answers = {}
    },
    updateWritingData(state, payload) {
        state.writing.push(payload);
    },
    updateStateNumber(state, payload) {
        state.stateNumber = payload
    },
    updateTaskNumber(state, payload) {
        state.taskNumber = payload
    },
    updateWritingAnswers(state, payload) {
        state.answers[payload[0]] = payload[1]
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}