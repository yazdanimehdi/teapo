import {
    GET_DATA_READING,
    GO_TO_NEXT_READING,
    GO_TO_PREVIOUS_READING,
    SAVE_ANSWER_READING,
    TOGGLE_REVIEW,
    GO_TO_READING_QUESTION,
    UPDATE_STATE_READING,
    SET_READING_ANSWERS
} from '../actions/reading'

import {NEXT_SECTION, PREVIOUS_SECTION, UPDATE_COMPONENT} from "../actions/mainTPO";

import {TIME_STOP, UPDATE_REMAINED_READING_TIME} from "@/store/actions/time";

let knex = require('@/db/knex')

const state = {
    reading_passage_component: 'ReadingPassage',
    reading_insertion_component: 'ReadingInsertion',
    reading_normal_question_component: 'ReadingNormalQuestion',
    reading_summary_component: 'ReadingSummary',
    showReview: false,
    readingAnswers: {},
    seenQuestionsReading: {},
    readingAllQuestionsNumber: 0,
    taskNumber: -1,
    questionNumber: -1,
    reading: [],
};
const getters = {
    readingQuestionsWithIndex: state => {
        let questions = []
        for (let i = 0; i < state.reading.length; i++) {
            for (let j = 0; j < state.reading[i]['questions'].length; j++) {
                questions.push([i, j, state.reading[i]['questions'][j]])
            }
        }
        return questions

    },
    readingTaskNumber: state => state.taskNumber,
    readingMode: state => state.mode,
    readingTitle: state => {
        if (state.reading[state.taskNumber]) {
            return state.reading[state.taskNumber]['title']
        } else {
            return ''
        }
    },
    passage: state => {
        if (state.reading[state.taskNumber]) {
            return state.reading[state.taskNumber].passage
        } else {
            return ''
        }
    },
    readingLength: state => state.reading.length,
    currentReading: state => state.taskNumber + 1,
    questionReadingTitle: state => {
        if (state.reading[state.taskNumber].questions[state.questionNumber]) {
            return state.reading[state.taskNumber].questions[state.questionNumber]['related_passage_title']
        } else {
            return ''
        }
    },
    questionRelatedParagraph: state => {
        if (state.reading[state.taskNumber].questions[state.questionNumber]['related_paragraph']) {
            return state.reading[state.taskNumber].questions[state.questionNumber]['related_paragraph']
        }
    },
    readingQuestionCorrectAnswer: state => {
        let correctAnswer = '';
        if (state.reading[state.taskNumber].questions[state.questionNumber]['right_answer'].trim().split(/\s+/).indexOf('1') !== -1) {
            correctAnswer = correctAnswer + 'A'
        }
        if (state.reading[state.taskNumber].questions[state.questionNumber]['right_answer'].trim().split(/\s+/).indexOf('2') !== -1) {
            correctAnswer = correctAnswer + 'B'
        }
        if (state.reading[state.taskNumber].questions[state.questionNumber]['right_answer'].trim().split(/\s+/).indexOf('3') !== -1) {
            correctAnswer = correctAnswer + 'C'
        }
        if (state.reading[state.taskNumber].questions[state.questionNumber]['right_answer'].trim().split(/\s+/).indexOf('4') !== -1) {
            correctAnswer = correctAnswer + 'D'
        }
        if (state.reading[state.taskNumber].questions[state.questionNumber]['right_answer'].trim().split(/\s+/).indexOf('5') !== -1) {
            correctAnswer = correctAnswer + 'E'
        }
        if (state.reading[state.taskNumber].questions[state.questionNumber]['right_answer'].trim().split(/\s+/).indexOf('6') !== -1) {
            correctAnswer = correctAnswer + 'F'
        }
        return correctAnswer
    },
    questionAnswers: state => state.reading[state.taskNumber].questions[state.questionNumber].answers,
    readingQuestion: state => state.reading[state.taskNumber].questions[state.questionNumber].question,
    readingMulti: state => {
        let str = state.reading[state.taskNumber].questions[state.questionNumber]['right_answer'];
        return str.trim().split(/\s+/).length > 1;
    },
    questionRelatedPassage: state => {
        if (state.reading[state.taskNumber].questions[state.questionNumber]) {
            return state.reading[state.taskNumber].questions[state.questionNumber]['related_passage']
        } else {
            return ''
        }
    },
    readingQuestionAnswer: state => {
        if (state.readingAnswers[state.reading[state.taskNumber].questions[state.questionNumber].id] !== undefined) {
            return state.readingAnswers[state.reading[state.taskNumber].questions[state.questionNumber].id];
        } else {
            return []
        }
    },
    readingQuestionId: state => state.reading[state.taskNumber].questions[state.questionNumber].id,
    insertionSentence: state => state.reading[state.taskNumber].questions[state.questionNumber]['insertion_sentence']


};
const actions = {
        [SET_READING_ANSWERS]: ({commit}, payload) => {
            return new Promise((resolve) => {
                for (let i = 0; i < payload.length; i++) {
                    commit('updateReadingAnswers', [payload[i]['question_id'], payload[i]['answer']])
                }
                resolve()
            })

        },
        [GET_DATA_READING]: ({commit}, payload) => {
            commit('resetAllReading');
            let tpo = knex.select("*").from('tpo_testreading').where({test_id: payload});
            return tpo.then(async function (readings) {
                let readingList = [...readings];
                readingList.sort(function (a, b) {
                    return a.part - b.part
                })
                for (let m = 0; m < readingList.length; m++) {
                    let result = knex.select("*").from('tpo_reading').where({id: readingList[m]['reading_id']});
                    await result.then(async (row) => {
                        let reading_obj = Object.assign({}, row[0]);
                        let questions = knex.select("*").from('tpo_readingquestions').where({'reading_id': row[0]['id']});
                        let questions_all = [];
                        await questions.then(async (questioninst) => {
                            commit('updateQuestionAll', questioninst.length);
                            let j;
                            questioninst.sort(function (a, b) {
                                return a.number - b.number
                            });
                            for (j = 0; j < questioninst.length; j++) {
                                let question_obj = {};
                                question_obj = Object.assign({}, questioninst[j]);
                                let qs = knex.select("*").from("tpo_readinganswers").where({'question_id': questioninst[j]['id']});
                                await qs.then(function (instance) {
                                    question_obj['answers'] = instance;
                                    questions_all.push(question_obj)
                                });
                                reading_obj['questions'] = questions_all;
                            }
                        });
                         commit('updateReadingData', reading_obj);
                    });
                }
            })

        },

        [UPDATE_STATE_READING]: ({state, dispatch}) => {
            if (state.taskNumber === -1) {
                dispatch(TIME_STOP, true)
                dispatch(UPDATE_COMPONENT, 'ReadingDirection');
            } else {
                dispatch(TIME_STOP, false);
                if (state.questionNumber === -1) {
                    dispatch(UPDATE_COMPONENT, state.reading_passage_component)
                } else {
                    if (state.reading[state.taskNumber].questions[state.questionNumber]['question_type'] === 'Fact') {
                        dispatch(UPDATE_COMPONENT, state.reading_normal_question_component);
                    }
                    if (state.reading[state.taskNumber].questions[state.questionNumber]['question_type'] === 'Summary') {
                        dispatch(UPDATE_COMPONENT, state.reading_summary_component)
                    }
                    if (state.reading[state.taskNumber].questions[state.questionNumber]['question_type'] === 'Insertion') {
                        dispatch(UPDATE_COMPONENT, state.reading_insertion_component)
                    }
                }
            }

        },

        [GO_TO_NEXT_READING]: ({state, commit, dispatch}) => {
            if (state.taskNumber === -1) {
                commit('updateTaskNumber', 0);
                dispatch(TIME_STOP, false);
                dispatch(UPDATE_STATE_READING);
            } else {
                if (state.questionNumber + 1 >= state.reading[state.taskNumber].questions.length) {
                    if (state.taskNumber + 1 >= state.reading.length) {
                        dispatch(TIME_STOP, true)
                        dispatch(UPDATE_REMAINED_READING_TIME)
                        dispatch(NEXT_SECTION)
                    } else {

                        commit('updateTaskNumber', state.taskNumber + 1);
                        commit('updateQuestionNumber', -1);

                        dispatch(TIME_STOP, false);
                        dispatch(UPDATE_STATE_READING);
                    }
                } else {
                    commit('updateQuestionNumber', state.questionNumber + 1);
                    dispatch(TIME_STOP, false);
                    dispatch(UPDATE_STATE_READING);
                }
            }
        },
        [GO_TO_PREVIOUS_READING]: ({state, commit, dispatch}) => {
            if (state.questionNumber - 1 < -1) {
                if (state.taskNumber - 1 >= 0) {
                    commit('updateTaskNumber', state.taskNumber - 1);
                    commit('updateQuestionNumber', state.reading[state.taskNumber].questions.length - 1);
                    dispatch(UPDATE_STATE_READING);
                } else {
                    dispatch(UPDATE_REMAINED_READING_TIME);
                    dispatch(PREVIOUS_SECTION)
                }
            } else {
                commit('updateQuestionNumber', state.questionNumber - 1);
                dispatch(UPDATE_STATE_READING);
            }
        },

        [SAVE_ANSWER_READING]: ({commit, rootState}, payload) => {
            let answer = ''
            if (payload[1] !== null) {
                if (payload[1].length > 1) {
                    for (let i = 0; i < payload[1].length; i++) {
                        answer += ' ' + payload[1][i]
                    }
                    answer = answer.trim()
                } else {
                    answer = payload[1]
                }
                commit('updateReadingAnswers', payload);

                knex.select('*').from('tpousers_userreadinganswers').where({
                    'question_id': payload[0],
                    'user_test_id': rootState.mainTPO.userTestId
                }).then((rows) => {
                    if (rows.length > 0) {
                        knex('tpousers_userreadinganswers').where({
                            user_test_id: rootState.mainTPO.userTestId,
                            question_id: payload[0]
                        }).update({
                            answer: answer
                        }).then(() => {
                        })
                    } else {
                        knex('tpousers_userreadinganswers').insert({
                            'answer': answer,
                            'question_id': payload[0],
                            'user_test_id': rootState.mainTPO.userTestId
                        }).then(() => {
                        })
                    }
                })
            }

        },

        [TOGGLE_REVIEW]: ({state, commit, dispatch}) => {
            commit('updateReviewShow');
            if (state.showReview === true) {
                dispatch(UPDATE_COMPONENT, 'ReviewReading');
            } else {
                dispatch(UPDATE_STATE_READING);
            }
        },
        [GO_TO_READING_QUESTION]: ({commit, dispatch}, payload) => {
            commit('updateTaskNumber', payload[0]);
            commit('updateQuestionNumber', payload[1]);
            dispatch(UPDATE_STATE_READING);
        },
    }
;

const mutations = {
    resetAllReading(state) {
        state.readingAnswers = {}
        state.seenQuestionsReading = {}
        state.readingAllQuestionsNumber = 0
        state.taskNumber = -1
        state.questionNumber = -1
        state.reading = []

    },
    updateReadingData(state, payload) {
        state.reading.push(payload);
        state.reading = state.reading.sort(function (a, b) {
            return a['phase'] - b['phase']
        });

    },
    updateTaskNumber(state, payload) {
        state.taskNumber = payload;
    },
    updateQuestionNumber(state, payload) {
        state.questionNumber = payload;
    },
    updateReadingAnswers(state, payload) {
        state.seenQuestionsReading[[state.taskNumber, state.questionNumber]] = true;
        state.readingAnswers[payload[0]] = payload[1]
    },
    updateQuestionAll(state, payload) {
        state.readingAllQuestionsNumber = state.readingAllQuestionsNumber + payload
    },
    updateReviewShow(state) {
        state.showReview = !state.showReview;
    },
};

export default {
    state,
    getters,
    actions,
    mutations
};