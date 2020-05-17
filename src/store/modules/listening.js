import {
    GET_DATA_LISTENING,
    GO_TO_NEXT_LISTENING,
    GO_TO_PREVIOUS_LISTENING,
    SAVE_ANSWER_LISTENING,
    GO_TO_LISTENING_QUESTION,
    QUOTE_PLAYED
} from '../actions/listening'

import {UPDATE_COMPONENT} from "../actions/mainTPO";

import {TIME_STOP} from "@/store/actions/time";

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
    listeningMode: 'reviewMode',
    listeningTimes: [600, 600]

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
    listeningQuestionNumber : state => {
        let qNumber = 0;
      for(let i = 0; i < state.taskNumber; i++){
          qNumber = qNumber + state.listening[state.sectionNumber][i].questions.length
      }
      return qNumber + state.questionNumber + 1
    },
    listeningImageSource: state => {
        if (state.listening[state.sectionNumber][state.taskNumber]['listening_image'][0] === 'b' && state.listening[state.sectionNumber][state.taskNumber]['listening_image'][1] === '\'') {
            return state.listening[state.sectionNumber][state.taskNumber]['listening_image'].slice(2, -1)
        } else {
            return state.listening[state.sectionNumber][state.taskNumber]['listening_image']
        }
    },
    listeningSource: state => {
        if (state.listening[state.sectionNumber][state.taskNumber].listening[0] === 'b' && state.listening[state.sectionNumber][state.taskNumber].listening[1] === '\'') {
            return state.listening[state.sectionNumber][state.taskNumber].listening.slice(2, -1)
        } else {
            return state.listening[state.sectionNumber][state.taskNumber].listening
        }
    },
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
        for(let i = 0; i < state.listening[state.sectionNumber].length; i++){
            qLength = qLength + state.listening[state.sectionNumber][i].questions.length
        }
        return qLength
    },
    listeningQuestion: state => state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber].question,
    listeningQuestionAudioFile: state => {
        if (state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber]['listening_question_audio_file'][0] === 'b'
            && state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber]['listening_question_audio_file'][1] === '\'') {
            return state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber]['listening_question_audio_file'].slice(2, -1)
        } else {
            return state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber]['listening_question_audio_file']
        }
    },
    listeningQuestionAnswers: state => state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber].answers,
    listeningQuestionMulti: state => state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber]['right_answer'].length > 1,
    listeningQuestionId : state => state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber].id,
    listeningQuestionAnswer: state => state.listeningAnswers[state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber].id],
    quoteAudioFile: state => {
        if (state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber]['quote_audio_file'][0] === 'b'
            && state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber]['quote_audio_file'][1] === '\'') {
            return state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber]['quote_audio_file'].slice(2, -1)
        } else {
            return state.listening[state.sectionNumber][state.taskNumber].questions[state.questionNumber]['quote_audio_file']
        }
    },
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
        let result = knex.select("*").from('tpo_listening').where({related: payload});
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
                commit('updateListeningData', listening_obj)
            }
        });
    },

    [GO_TO_NEXT_LISTENING]: ({state, commit, dispatch}) => {
        let updateListeningState = function () {
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
        }
        if (state.sectionNumber === -1) {
            dispatch(TIME_STOP, true)
            commit('updateListeningSectionNumber', 0);
            updateListeningState();
        } else {
            if (state.questionNumber + 1 >= state.listening[state.sectionNumber][state.taskNumber].questions.length) {
                if (state.taskNumber + 1 >= state.listening[state.sectionNumber].length) {
                    if (state.sectionNumber + 1 >= state.listening.length) {
                        console.log('next section')
                    } else {
                        commit('updateListeningSectionNumber', state.sectionNumber + 1)
                        commit('updateListeningTaskNumber', 0);
                        commit('updateListeningQuestionNumber', -1);
                        updateListeningState();
                    }
                } else {
                    commit('updateListeningTaskNumber', state.taskNumber + 1);
                    commit('updateListeningQuestionNumber', -1);
                    updateListeningState();
                }
            } else {
                commit('updateListeningQuestionNumber', state.questionNumber + 1);
                updateListeningState()
            }
        }

    },

    [GO_TO_PREVIOUS_LISTENING]: ({state, commit, dispatch}) => {
        let updateListeningState = function () {
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
        }
        if (state.questionNumber - 1 < -1) {
            if (state.taskNumber - 1 < -1) {
                // go to previous section of the test
            } else {
                commit('updateListeningTaskNumber', state.taskNumber - 1);
                commit('updateListeningQuestionNumber', -1);
                updateListeningState();
            }
        } else {
            commit('updateListeningQuestionNumber', state.questionNumber - 1);
            updateListeningState();
        }

    },

    [GO_TO_LISTENING_QUESTION]: ({state, commit, dispatch}, payload) => {
        let updateListeningState = function () {
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
        }
        commit('updateListeningSectionNumber', payload[0]);
        commit('updateListeningTaskNumber', payload[1]);
        commit('updateListeningQuestionNumber', payload[2]);
        updateListeningState();
    },
    [SAVE_ANSWER_LISTENING]: ({commit}, payload) => {
        commit('updateListeningAnswers', payload);
    },

    [QUOTE_PLAYED]: ({state, commit, dispatch}) => {
        let updateListeningState = function () {
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
        }
        commit('updateQuotePlayed', true)
        updateListeningState();
    }
}

const mutations = {
    updateListeningData(state, payload) {
        if (state.listening[0].length < 3) {
            state.listening[0].push(payload);
            state.listening[0] = state.listening[0].sort(function (a, b) {
                return a['phase'] - b['phase']
            });
        } else {
            state.listening[1].push(payload);
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