import {
    GET_DATA_READING,
    GO_TO_NEXT_READING,
    GO_TO_PREVIOUS_READING,
    SAVE_ANSWER_READING,
    TOGGLE_REVIEW,
    GO_TO_READING_QUESTION
} from '../actions/reading'

import {UPDATE_COMPONENT} from "../actions/mainTPO";

import {TIME_STOP} from "@/store/actions/time";

const state = {
    readingAnswers: {},
    mode: 'reviewMode',
    reading_passage_component: 'ReadingPassage',
    reading_insertion_component: 'ReadingInsertion',
    reading_normal_question_component: 'ReadingNormalQuestion',
    reading_summary_component: 'ReadingSummary',
    showReview: false,
    seenQuestionsReading: {},
    readingAllQuestionsNumber: 0,
    taskNumber: -1,
    questionNumber: -1,
    reading: [],
    readingTest: 'tpo1',
    readingTime: 3600,
};
const getters = {
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
        if (state.reading[state.taskNumber].questions[state.questionNumber].id in state.readingAnswers) {
            return state.readingAnswers[state.reading[state.taskNumber].questions[state.questionNumber].id];
        } else {
            return []
        }
    },
    readingQuestionId: state => state.reading[state.taskNumber].questions[state.questionNumber].id,
    insertionSentence: state => state.reading[state.taskNumber].questions[state.questionNumber]['insertion_sentence']


};
const actions = {
    [GET_DATA_READING]: ({commit}, payload) => {
        let knex = require('knex')({
            client: 'sqlite3',
            connection: {
                filename: './db.sqlite3'
            },
            useNullAsDefault: true
        });
        let result = knex.select("*").from('tpo_reading').where({related: payload});
        result.then(function (rows) {
            let i;
            for (i = 0; i < rows.length; i++) {
                let reading_obj = Object.assign({}, rows[i]);
                let questions = knex.select("*").from('tpo_readingquestions').where({'reading_id': rows[i]['id']});
                let questions_all = [];
                questions.then(function (questioninst) {
                    commit('updateQuestionAll', questioninst.length);
                    let j;
                    questioninst.sort(function (a, b) {
                        return a.number - b.number
                    });
                    for (j = 0; j < questioninst.length; j++) {
                        let question_obj = {};
                        question_obj = Object.assign({}, questioninst[j]);
                        let qs = knex.select("*").from("tpo_readinganswers").where({'question_id': questioninst[j]['id']});
                        qs.then(function (instance) {
                            question_obj['answers'] = instance;
                            questions_all.push(question_obj)
                        });

                        reading_obj['questions'] = questions_all;
                    }
                });
                commit('updateReadingData', reading_obj);
            }
        });

    },

    [GO_TO_NEXT_READING]: ({state, commit, dispatch}) => {
        if (state.taskNumber === -1) {
            commit('updateTaskNumber', 0);
            dispatch(TIME_STOP, false)
            if (state.questionNumber === -1) {
                dispatch(UPDATE_COMPONENT, state.reading_passage_component)
            } else {
                if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Fact') {
                    dispatch(UPDATE_COMPONENT, state.reading_normal_question_component);
                }
                if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Summary') {
                    dispatch(UPDATE_COMPONENT, state.reading_summary_component)
                }
                if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Insertion') {
                    dispatch(UPDATE_COMPONENT, state.reading_insertion_component)
                }
            }
        } else {
            if (state.questionNumber + 1 >= state.reading[state.taskNumber].questions.length) {
                if (state.taskNumber + 1 >= state.reading.length) {
                    if (state.currentSection + 1 >= state.section.length) {
                        commit('testFinished')
                    } else {
                        commit('updateCurrentSection', state.currentSection + 1);
                        commit('updateTaskNumber', -1);
                        commit('updateQuestionNumber', -1);
                        if (state.sections[state.currentSection] === 'Listening') {
                            commit('updateStateListening');
                        }
                        if (state.sections[state.currentSection] === 'Speaking') {
                            commit('updateStateSpeaking');
                        }
                        if (state.sections[state.currentSection] === 'Writing') {
                            commit('updateStateWriting');
                        }

                    }
                } else {

                    commit('updateTaskNumber', state.taskNumber + 1);
                    commit('updateQuestionNumber', -1);

                    dispatch(TIME_STOP, false)
                    if (state.questionNumber === -1) {
                        dispatch(UPDATE_COMPONENT, state.reading_passage_component)
                    } else {
                        if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Fact') {
                            dispatch(UPDATE_COMPONENT, state.reading_normal_question_component);
                        }
                        if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Summary') {
                            dispatch(UPDATE_COMPONENT, state.reading_summary_component)
                        }
                        if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Insertion') {
                            dispatch(UPDATE_COMPONENT, state.reading_insertion_component)
                        }
                    }
                }
            } else {
                commit('updateQuestionNumber', state.questionNumber + 1);
                dispatch(TIME_STOP, false)
                if (state.questionNumber === -1) {
                    dispatch(UPDATE_COMPONENT, state.reading_passage_component)
                } else {
                    if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Fact') {
                        dispatch(UPDATE_COMPONENT, state.reading_normal_question_component);
                    }
                    if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Summary') {
                        dispatch(UPDATE_COMPONENT, state.reading_summary_component)
                    }
                    if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Insertion') {
                        dispatch(UPDATE_COMPONENT, state.reading_insertion_component)
                    }
                }
            }
        }
    },
    [GO_TO_PREVIOUS_READING]: ({state, commit, dispatch}) => {
        if (state.questionNumber - 1 < -1) {
            if (state.taskNumber - 1 >= 0) {
                commit('updateTaskNumber', state.taskNumber - 1);
                commit('updateQuestionNumber', state.reading[state.taskNumber].questions.length - 1);
                if (state.taskNumber === -1) {
                    dispatch(UPDATE_COMPONENT, 'ReadingDirection');
                } else {
                    commit('toggleTime', false);
                    if (state.questionNumber === -1) {
                        dispatch(UPDATE_COMPONENT, state.reading_passage_component)
                    } else {
                        if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Fact') {
                            dispatch(UPDATE_COMPONENT, state.reading_normal_question_component);
                        }
                        if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Summary') {
                            dispatch(UPDATE_COMPONENT, state.reading_summary_component)
                        }
                        if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Insertion') {
                            dispatch(UPDATE_COMPONENT, state.reading_insertion_component)
                        }
                    }
                }
            }
        } else {
            commit('updateQuestionNumber', state.questionNumber - 1);
            if (state.taskNumber === -1) {
                dispatch(UPDATE_COMPONENT, 'ReadingDirection');
            } else {
                commit('toggleTime', false);
                if (state.questionNumber === -1) {
                    dispatch(UPDATE_COMPONENT, state.reading_passage_component)
                } else {
                    if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Fact') {
                        dispatch(UPDATE_COMPONENT, state.reading_normal_question_component);
                    }
                    if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Summary') {
                        dispatch(UPDATE_COMPONENT, state.reading_summary_component)
                    }
                    if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Insertion') {
                        dispatch(UPDATE_COMPONENT, state.reading_insertion_component)
                    }
                }
            }
        }
    },

    [SAVE_ANSWER_READING]: ({commit}, payload) => {
        commit('updateReadingAnswers', payload);
    },

    [TOGGLE_REVIEW]: ({state, commit, dispatch}) => {
        commit('updateReviewShow');
        if (state.showReview === true) {
            dispatch(UPDATE_COMPONENT, 'ReviewReading');
        } else {
            if (state.taskNumber === -1) {
                dispatch(UPDATE_COMPONENT, 'ReadingDirection');
            } else {
                if (state.questionNumber === -1) {
                    commit('toggleTime', false);
                    dispatch(UPDATE_COMPONENT, state.reading_passage_component)
                } else {
                    if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Fact') {
                        dispatch(UPDATE_COMPONENT, state.reading_normal_question_component)
                    }
                    if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Summary') {
                        dispatch(UPDATE_COMPONENT, state.reading_summary_component)
                    }
                    if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Insertion') {
                        dispatch(UPDATE_COMPONENT, state.reading_insertion_component)
                    }
                }
            }
        }
    },
    [GO_TO_READING_QUESTION]: ({state, commit, dispatch}, payload) => {
        commit('updateTaskNumber', payload[0]);
        commit('updateQuestionNumber', payload[1]);
        if (state.taskNumber === -1) {
            dispatch(UPDATE_COMPONENT, 'ReadingDirection');
        } else {
            commit('toggleTime', false);
            if (state.questionNumber === -1) {
                dispatch(UPDATE_COMPONENT, state.reading_passage_component)
            } else {
                if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Fact') {
                    dispatch(UPDATE_COMPONENT, state.reading_normal_question_component);
                }
                if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Summary') {
                    dispatch(UPDATE_COMPONENT, state.reading_summary_component)
                }
                if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Insertion') {
                    dispatch(UPDATE_COMPONENT, state.reading_insertion_component)
                }
            }
        }
    }

};

const mutations = {
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
    toggleTime(state, payload) {
        state.timeStop = payload;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};