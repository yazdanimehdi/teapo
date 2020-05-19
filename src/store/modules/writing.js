import {
    GET_DATA_WRITING, GO_TO_NEXT_WRITING,
    SAVE_ANSWER_WRITING, GO_TO_PREVIOUS_WRITING,
    WRITING_TIME_ENDED, GO_TO_WRITING_QUESTION

} from '../actions/writing'

import {UPDATE_COMPONENT} from "../actions/mainTPO";
import {TIME_STOP} from "@/store/actions/time";

const state = {
    taskNumber: 0,
    stateNumber: -1,
    writing: {},
    writingMode: "practiceMode",
    answers: {},
};
const getters = {
    writingLength: state => state.writing.length,
    writingQuestionNumber: state => state.taskNumber + 1,
    writingQuestion: state => state.writing[state.taskNumber]["writing_question"],
    writingReading: state => state.writing[state.taskNumber]["writing_reading"],
    writingImageSource: state => {
        if (state.writing[state.taskNumber]['writing_image'][0] === 'b' && state.writing[state.taskNumber]['writing_image'][1] === '\'') {
            return state.writing[state.taskNumber]['writing_image'].slice(2, -1)
        } else {
            return state.writing[state.taskNumber]['writing_image']
        }
    },
    writingListeningSource: state => {
        if (state.writing[state.taskNumber]['writing_listening'][0] === 'b' && state.writing[state.taskNumber]['writing_listening'][1] === '\'') {
            return state.writing[state.taskNumber]['writing_listening'].slice(2, -1)
        } else {
            return state.writing[state.taskNumber]['writing_listening']
        }
    },
    writingId: state => state.writing[state.taskNumber].id,
};
const actions = {
    [GET_DATA_WRITING]: ({commit}, payload) => {
        let knex = require('knex')({
            client: 'sqlite3',
            connection: {
                filename: './db.sqlite3'
            },
            useNullAsDefault: true
        });
        let result = knex.select("*").from('tpo_writing').where({related: payload});
        result.then(function (rows) {
            commit('updateWritingData', rows)
        });
    },
    [WRITING_TIME_ENDED]: ({dispatch}) => {
        dispatch(TIME_STOP, true)
        dispatch(UPDATE_COMPONENT, 'TimeEndedWriting')
    },
    [GO_TO_PREVIOUS_WRITING]: ({state, commit, dispatch}) => {
        function updateWritingState() {
            if (state.writing[state.taskNumber].type === 'Integrated') {
                if (state.stateNumber === -1) {
                    dispatch(TIME_STOP, true);
                    dispatch(UPDATE_COMPONENT, 'IntegratedWritingDirection')
                }
                if (state.stateNumber === 0) {
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
        }

        if (state.taskNumber === -1) {
            commit('updateTaskNumber', 0);
        } else {
            if (state.stateNumber - 1 < -1) {
                if (state.taskNumber - 1 < 0) {
                    console.log('previous section')
                } else {
                    commit('updateTaskNumber', state.taskNumber - 1);
                    commit('updateStateNumber', state.writing[state.taskNumber].sections - 2);
                    updateWritingState();
                }
            } else {
                commit('updateStateNumber', state.stateNumber - 1);
                updateWritingState();
            }
        }

    },
    [GO_TO_NEXT_WRITING]: ({state, commit, dispatch}) => {
        function updateWritingState() {
            if (state.writing[state.taskNumber].type === 'Integrated') {
                if (state.stateNumber === -1) {
                    dispatch(TIME_STOP, true);
                    dispatch(UPDATE_COMPONENT, 'IntegratedWritingDirection')
                }
                if (state.stateNumber === 0) {
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
                    dispatch(UPDATE_COMPONENT, 'IntegratedWritingDirection')
                }
                if (state.stateNumber === 0) {
                    dispatch(TIME_STOP, false)
                    dispatch(UPDATE_COMPONENT, 'WritingIndependent')
                }
            }
        }

        if (state.taskNumber === -1) {
            commit('updateTaskNumber', 0);
        } else {
            if (state.stateNumber + 2 >= state.writing[state.taskNumber].sections) {
                if (state.taskNumber + 1 >= state.writing.length) {
                    console.log('next section')
                } else {
                    commit('updateTaskNumber', state.taskNumber + 1);
                    commit('updateStateNumber', -1);
                    updateWritingState();
                }
            } else {
                commit('updateStateNumber', state.stateNumber + 1);
                updateWritingState();
            }
        }
    },
    [GO_TO_WRITING_QUESTION]: ({commit, dispatch}, payload) => {
        function updateWritingState() {
            if (state.writing[state.taskNumber].type === 'Integrated') {
                if (state.stateNumber === -1) {
                    dispatch(TIME_STOP, true);
                    dispatch(UPDATE_COMPONENT, 'IntegratedWritingDirection')
                }
                if (state.stateNumber === 0) {
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
                    dispatch(UPDATE_COMPONENT, 'IntegratedWritingDirection')
                }
                if (state.stateNumber === 0) {
                    dispatch(TIME_STOP, false)
                    dispatch(UPDATE_COMPONENT, 'WritingIndependent')
                }
            }
        }

        commit('updateTaskNumber', payload[0]);
        commit('updateStateNumber', payload[1]);
        updateWritingState();

    },
    [SAVE_ANSWER_WRITING]: ({commit}, payload) => {
        commit('updateWritingAnswers', payload)
    }

};
const mutations = {
    updateWritingData(state, payload) {
        state.writing = payload
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