import {
    GET_DATA_LISTENING,
    GO_TO_NEXT_LISTENING,
    GO_TO_PREVIOUS_LISTENING,
    SAVE_ANSWER_LISTENING,
    GO_TO_LISTENING_QUESTION,
    QUOTE_PLAYED, UPDATE_STATE_LISTENING,
} from '../actions/listening'

import {
    UPDATE_COMPONENT,
    PREVIOUS_SECTION,
    NEXT_SECTION,
    SET_NEW_TIME
} from "../actions/mainTPO";

import {TIME_STOP, UPDATE_REMAINED_LISTENING_TIME} from "@/store/actions/time";

const state = {
    listening_player_component: 'Player',
    listening_quote_player_component: 'QuotePlayer',
    listening_question_component: 'ListeningQuestions',
    listening: [[], []],
    listeningAnswers: {},
    sectionNumber: -1,
    taskNumber: 0,
    questionNumber: -1,
    quotePlayed: false,

}

const getters = {
    taskType: state => state.listening[state.sectionNumber][state.taskNumber].type,
    taskTypeNumber: state => {
        let typeNumber = 0;
        for (let i = 0; i <= state.taskNumber; i++) {
            if (state.listening[state.sectionNumber][i].type === state.listening[state.sectionNumber][state.taskNumber].type) {
                typeNumber++;
            }
        }
        return typeNumber;
    },
    listeningQuestionNumber: state => {
        let qNumber = 0;
        for (let i = 0; i < state.taskNumber; i++) {
            qNumber = qNumber + state.listening[state.sectionNumber][i].questions.length
        }
        return qNumber + state.questionNumber + 1
    },
    listeningImageSource: state => state.listening[state.sectionNumber][state.taskNumber]['listening_image'],
    listeningSource: state => state.listening[state.sectionNumber][state.taskNumber].listening,
    conversationCount: state => {
        let typeNumber = 0;
        for (let i = 0; i < state.listening[0].length; i++) {
            if (state.listening[0][i].type === 'Conversation') {
                typeNumber = typeNumber + 1;
            }
        }
        return typeNumber;
    },
    lectureCount: state => {
        let typeNumber = 0;
        for (let i = 0; i < state.listening[0].length; i++) {
            if (state.listening[0][i].type === 'Lecture') {
                typeNumber = typeNumber + 1;
            }
        }
        return typeNumber;
    },
    sectionCount: state => state.listening.length,
    listeningTitle: state => state.listening[state.sectionNumber][state.taskNumber].title,
    listeningTranscript: state => state.listening[state.sectionNumber][state.taskNumber].transcript,
    listeningQuestionLength: state => {
        let qLength = 0
        for (let i = 0; i < state.listening[state.sectionNumber].length; i++) {
            qLength = qLength + state.listening[state.sectionNumber][i].questions.length
        }
        return qLength
    },
    listeningQuestion: state => state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber].question,
    listeningQuestionAudioFile: state => state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber]['listening_question_audio_file'],
    listeningQuestionAnswers: state => state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber].answers,
    listeningQuestionMulti: state => state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber]['right_answer'].length > 1,
    listeningQuestionAnswerCount: state => state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber]['right_answer'].trim().split(/\s+/).length,
    listeningQuestionId: state => state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber].id,
    listeningQuestionAnswer: state => state.listeningAnswers[state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber].id],
    quoteAudioFile: state => state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber]['quote_audio_file'],
    ListeningQuestionCorrectAnswer: state => {
        let correctAnswer = '';
        if (state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber]['right_answer'].trim().split(/\s+/).indexOf('1') !== -1) {
            correctAnswer = correctAnswer + 'A'
        }
        if (state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber]['right_answer'].trim().split(/\s+/).indexOf('2') !== -1) {
            correctAnswer = correctAnswer + 'B'
        }
        if (state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber]['right_answer'].trim().split(/\s+/).indexOf('3') !== -1) {
            correctAnswer = correctAnswer + 'C'
        }
        if (state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber]['right_answer'].trim().split(/\s+/).indexOf('4') !== -1) {
            correctAnswer = correctAnswer + 'D'
        }
        if (state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber]['right_answer'].trim().split(/\s+/).indexOf('5') !== -1) {
            correctAnswer = correctAnswer + 'E'
        }
        if (state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber]['right_answer'].trim().split(/\s+/).indexOf('6') !== -1) {
            correctAnswer = correctAnswer + 'F'
        }
        return correctAnswer
    },

}

const actions = {
    [GET_DATA_LISTENING]: ({commit}, payload) => {
        var knex = require('knex')({
            client: 'sqlite3',
            connection: {
                filename: './db.sqlite3'
            },
            useNullAsDefault: true
        });
        let tpo = knex.select("*").from('tpo_testlistening').where({test_id: payload});
        tpo.then(function (listening) {
            for (let m = 0; m < listening.length; m++) {
                let result = knex.select("*").from('tpo_listening').where({id: listening[m]['listening_id']});
                result.then(function (rows) {
                    let i;
                    for (i = 0; i < rows.length; i++) {
                        let listening_obj = Object.assign({}, rows[i]);
                        let questions = knex.select("*").from('tpo_listeningquestions').where({'listening_id': rows[i]['id']});
                        let questions_all = [];
                        questions.then(function (questioninst) {
                            let j;
                            for (j = 0; j < questioninst.length; j++) {
                                let question_obj = Object.assign({}, questioninst[j]);
                                let qs = knex.select("*").from("tpo_listeninganswers").where({'question_id': questioninst[j]['id']});
                                qs.then(function (instance) {

                                    question_obj['answers'] = instance;
                                    questions_all.push(question_obj)

                                });
                            }
                            listening_obj['questions'] = questions_all;
                        });
                        commit('updateListeningData', [listening_obj, listening[m]['part'], listening[m]['phase']])
                    }
                });
            }
            })
    },
    [UPDATE_STATE_LISTENING]: ({state, commit, dispatch}) => {
        if (state.questionNumber === -1) {
            dispatch(UPDATE_COMPONENT, state.listening_player_component)
        } else {
            if (state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber].quote === 0) {
                dispatch(UPDATE_COMPONENT, state.listening_question_component)
            }
            if (state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber].quote === 1) {
                if (state.quotePlayed === false) {
                    dispatch(UPDATE_COMPONENT, state.listening_quote_player_component)
                } else {
                    dispatch(UPDATE_COMPONENT, state.listening_question_component);
                    commit('updateQuotePlayed', false);
                }

            }
        }
    },
    [GO_TO_NEXT_LISTENING]: ({state, commit, dispatch}) => {
        if (state.sectionNumber === -1) {
            dispatch(TIME_STOP, true)
            commit('updateListeningSectionNumber', 0);
            dispatch(UPDATE_STATE_LISTENING);
        } else {
            if (state.questionNumber + 1 >= state.listening[state.sectionNumber][state.taskNumber].questions.length) {
                if (state.taskNumber + 1 >= state.listening[state.sectionNumber].length) {
                    if (state.sectionNumber + 1 >= state.listening.length) {
                        dispatch(TIME_STOP);
                        dispatch(UPDATE_REMAINED_LISTENING_TIME, state.sectionNumber)
                        dispatch(NEXT_SECTION)
                    } else {
                        dispatch(TIME_STOP);
                        dispatch(UPDATE_REMAINED_LISTENING_TIME, state.sectionNumber);
                        commit('updateListeningSectionNumber', state.sectionNumber + 1)
                        dispatch(SET_NEW_TIME, state.sectionNumber)
                        commit('updateListeningTaskNumber', 0);
                        commit('updateListeningQuestionNumber', -1);
                        dispatch(UPDATE_STATE_LISTENING);
                    }
                } else {
                    commit('updateListeningTaskNumber', state.taskNumber + 1);
                    commit('updateListeningQuestionNumber', -1);
                    dispatch(UPDATE_STATE_LISTENING);
                }
            } else {
                commit('updateListeningQuestionNumber', state.questionNumber + 1);
                dispatch(UPDATE_STATE_LISTENING);
            }
        }

    },

    [GO_TO_PREVIOUS_LISTENING]: ({state, commit, dispatch}) => {
        if (state.questionNumber - 1 < -1) {
            if (state.taskNumber - 1 < 0) {
                dispatch(UPDATE_REMAINED_LISTENING_TIME, state.sectionNumber);
                dispatch(PREVIOUS_SECTION)
            } else {
                dispatch(UPDATE_REMAINED_LISTENING_TIME, state.sectionNumber);
                commit('updateListeningTaskNumber', state.taskNumber - 1);
                commit('updateListeningQuestionNumber', -1);
                dispatch(UPDATE_STATE_LISTENING);
            }
        } else {
            commit('updateListeningQuestionNumber', state.questionNumber - 1);
            dispatch(UPDATE_STATE_LISTENING);
        }

    },

    [GO_TO_LISTENING_QUESTION]: ({commit, dispatch}, payload) => {
        commit('updateListeningSectionNumber', payload[0]);
        commit('updateListeningTaskNumber', payload[1]);
        commit('updateListeningQuestionNumber', payload[2]);
        dispatch(UPDATE_STATE_LISTENING);
    },

    [SAVE_ANSWER_LISTENING]: ({commit, rootState}, payload) => {
        commit('updateListeningAnswers', payload);
        let knex = require('knex')({
            client: 'sqlite3',
            connection: {
                filename: './db.sqlite3'
            },
            useNullAsDefault: true
        });
        knex.select('*').from('tpousers_userlisteninganswers').where({
            'question_id': payload[0],
            'user_test_id': rootState.mainTPO.userTestId
        }).then((rows) => {
            if (rows.length > 0) {
                knex('tpousers_userlisteninganswers').where({
                    user_test_id: rootState.mainTPO.userTestId,
                    question_id: payload[0]
                }).update({
                    answer: payload[1]
                }).then(() => {
                })
            } else {
                knex('tpousers_userlisteninganswers').insert({
                    'answer': payload[1],
                    'question_id': payload[0],
                    'user_test_id': rootState.mainTPO.userTestId
                }).then(() => {
                })
            }
        })
    },

    [QUOTE_PLAYED]: ({commit, dispatch}) => {
        commit('updateQuotePlayed', true)
        dispatch(UPDATE_STATE_LISTENING);
    }
}

const mutations = {
    updateListeningData(state, payload) {
        if (payload[1] === 1) {
            payload[0]['phase'] = payload[2]
            state.listening[0].push(payload[0]);
            state.listening[0] = state.listening[0].sort(function (a, b) {
                return a['phase'] - b['phase']
            });
        } else if(payload[1] === 2){
            payload[0]['phase'] = payload[2]
            state.listening[1].push(payload[0]);
            state.listening[1] = state.listening[1].sort(function (a, b) {
                return a['phase'] - b['phase']
            });
        }

    },

    updateListeningTaskNumber(state, payload) {
        state.taskNumber = payload;
    },

    updateListeningQuestionNumber(state, payload) {
        state.questionNumber = payload;
    },
    updateListeningSectionNumber(state, payload) {
        state.sectionNumber = payload;
    },
    updateQuotePlayed(state, payload) {
        state.quotePlayed = payload
    },
    updateListeningAnswers(state, payload) {
        state.listeningAnswers[payload[0]] = payload[1]
    }
}


export default {
    state,
    getters,
    actions,
    mutations
};