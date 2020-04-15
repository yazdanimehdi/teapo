import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        readingTest: 'tpo1',
        taskNumber:0,
        reading:{},
        listening:{},
        speaking:{},
        writing:{},
        readingAllQuestionsNumber: 0,
        totalTime: 10000,
        timeStop: false,
        hours: 0,
        minutes: 0,
        seconds: 0,
        questionNumber: 0,
        currentSection: 0,
        sections: ['Reading'],
        readingAnswers: {},
        readingTime: 10,
        mode: 'reviewMode',
        listening_player_component: 'Player',
        listening_quote_player_component: 'QuotePlayer',
        listening_question_component: 'ListeningQuestions',
        reading_passage_component: 'ReadingPassage',
        reading_insertion_component: 'ReadingInsertion',
        reading_normal_question_component: 'ReadingNormalQuestion',
        reading_summary_component: 'ReadingSummary',
        speaking_player_component: 'SpeakingPlayer',
        writing_player_component: 'WritingPlayer',
        currentComponent: 'ReadingPassage',
        showReview: false,
        seenQuestionsReading: {},

    },

    mutations: {
        updateReadingData(state, payload) {
            state.reading = payload
        },

        updateListeningData(state, payload) {
            state.listening = payload
        },
        updateSpeakingData(state, payload) {
            state.speaking = payload
        },
        updateWritingData(state, payload) {
            state.writing = payload
        },
        updateStateReading(state) {
            if (state.taskNumber === -1) {
                state.totalTime = state.readingTime;
                state.currentComponent = 'ReadingDirection';
            } else {
                state.timeStop = false;
                if (state.questionNumber === -1) {
                    state.currentComponent = state.reading_passage_component
                } else {
                    if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Fact') {
                        state.currentComponent = state.reading_normal_question_component
                    }
                    if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Summary') {
                        state.currentComponent = state.reading_summary_component
                    }
                    if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Insertion') {
                        state.currentComponent = state.reading_insertion_component
                    }
                }
            }
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
        computeTime(state) {
            state.totalTime = state.totalTime - 1;
            if (state.totalTime <= 0) {
                state.currentComponent = 'TimeEnded';

            }
            state.minutes = parseInt(state.totalTime / 60);
            state.hours = parseInt(state.minutes / 60);
            state.minutes = state.minutes % 60;
            state.seconds = state.totalTime % 60;
        },
        updateShowReview(state) {
            state.showReview = !state.showReview;
            if (state.showReview === true) {
                state.currentComponent = 'ReviewReading';
            } else {
                if (state.taskNumber === -1) {
                    state.currentComponent = 'ReadingDirection';
                } else {
                    if (state.questionNumber === -1) {
                        state.timeStop = false;
                        state.currentComponent = state.reading_passage_component
                    } else {
                        if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Fact') {
                            state.currentComponent = state.reading_normal_question_component
                        }
                        if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Summary') {
                            state.currentComponent = state.reading_summary_component
                        }
                        if (state.reading[state.taskNumber].questions[state.questionNumber].question_type === 'Insertion') {
                            state.currentComponent = state.reading_insertion_component
                        }
                    }
                }
            }
        },
    },
    actions:{

        getDataReading({ commit }, payload) {
            var knex = require('knex')({
                client: 'sqlite3',
                connection: {
                    filename: './db.sqlite3'
                },
                useNullAsDefault: true
            });
            let result = knex.select("*").from('tpo_reading').where({related: payload});
            let reading_all = [];
            result.then(function (rows) {
                var i;
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
                    reading_all.push(reading_obj);
                }
            });
            reading_all.sort(function (a, b) {
                return a['phase'] - b['phase']
            });
            commit('updateReadingData', reading_all);

        },

        getDataListening({ commit }, payload) {
            var knex = require('knex')({
                client: 'sqlite3',
                connection: {
                    filename: './db.sqlite3'
                },
                useNullAsDefault: true
            });
            let result = knex.select("*").from('tpo_listening').where({related: payload});
            let listening_all = [];
            result.then(function (rows) {
                var i;
                for (i = 0; i < rows.length; i++) {
                    let listening_obj = Object.assign({}, rows[i]);
                    let questions = knex.select("*").from('tpo_listeningquestions').where({'listening_id': rows[i]['id']});
                    let questions_all = [];
                    questions.then(function (questioninst) {
                        var j;
                        for (j = 0; j < questioninst.length; j++) {
                            var question_obj = Object.assign({}, questioninst[j]);
                            let qs = knex.select("*").from("tpo_listeninganswers").where({'question_id': questioninst[j]['id']});
                            qs.then(function (instance) {

                                question_obj['answers'] = instance;
                                questions_all.push(question_obj)

                            });
                        }
                    });
                    listening_obj['questions'] = questions_all;
                    listening_all.push(listening_obj);
                }
            });
            listening_all.sort(function (a, b) {
                return a['phase'] - b['phase']
            });
            commit('updateListeningData', listening_all)

        },

        getDataSpeaking({ commit }, payload) {
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
        getDataWriting({ commit }, payload) {
            var knex = require('knex')({
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

        goToNextReading(context) {
            // axios.post('http://127.0.0.1:5000/tpo/api/reading/submit_answer',
            //     [context.state.readingAnswers,
            //         context.state.user_test_id,
            //         context.state.totalTime,
            //         'Reading', context.state.task_number,
            //         context.state.question_number]);
            if (context.state.taskNumber === -1) {
                context.commit('updateTaskNumber', 0);
                context.commit('updateStateReading');
            } else {
                if (context.state.questionNumber + 1 >= context.state.reading[context.state.taskNumber].questions.length) {
                    if (context.state.taskNumber + 1 >= context.state.reading.length) {
                        if (context.state.currentSection + 1 >= context.state.section.length) {
                            context.commit('testFinished')
                        } else {
                            context.commit('updateCurrentSection', context.state.currentSection + 1);
                            context.commit('updateTaskNumber', -1);
                            context.commit('updateQuestionNumber', -1);
                            if (context.state.sections[context.state.currentSection] === 'Listening') {
                                context.commit('updateStateListening');
                            }
                            if (context.state.sections[context.state.currentSection]=== 'Speaking') {
                                context.commit('updateStateSpeaking');
                            }
                            if (context.state.sections[context.state.currentSection]=== 'Writing') {
                                context.commit('updateStateWriting');
                            }

                        }
                    } else {

                        context.commit('updateTaskNumber', context.state.taskNumber + 1);
                        context.commit('updateQuestionNumber', -1);
                        context.commit('updateStateReading');
                    }
                } else {
                    context.commit('updateQuestionNumber', context.state.questionNumber + 1);
                    context.commit('updateStateReading');
                }
            }

        },
        goToPreviousReading(context) {
            // axios.post('http://127.0.0.1:5000/tpo/api/reading/submit_answer',
            //     [context.state.readingAnswers,
            //         context.state.user_test_id,
            //         context.state.totalTime,
            //         'Reading', context.state.task_number,
            //         context.state.question_number]);
            if (context.state.questionNumber - 1 < -1) {
                if (context.state.taskNumber - 1 >= 0) {
                    context.commit('updateTaskNumber', context.state.taskNumber - 1);
                    context.commit('updateQuestionNumber', context.state.reading[context.state.taskNumber].questions.length - 1);
                    context.commit('updateStateReading');
                }
            } else {
                context.commit('updateQuestionNumber', context.state.questionNumber - 1);
                context.commit('updateStateReading');
            }

        },
        saveAnswersReading(context, payload) {
            context.commit('updateReadingAnswers', payload);
        },

        timeComputeAction(context) {
            if (context.state.timeStop === false) {
                context.commit('computeTime')
            }

        },
        toggleReview(context) {
            context.commit('updateShowReview')
        },
        goToReadingQuestion(context, payload) {
            context.commit('updateTaskNumber', payload[0]);
            context.commit('updateQuestionNumber', payload[1]);
            context.commit('updateStateReading');
        },


    }

});
