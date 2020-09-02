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
    SET_WRITING_READING_TIME,
    CORRECT_EXAM,
    END_TPO,
    CHANGE_TPO_MODE,
    SET_REVIEW_TIMES
} from "../actions/mainTPO";
import {GET_DATA_READING, UPDATE_STATE_READING} from "@/store/actions/reading";
import {GET_DATA_LISTENING, UPDATE_STATE_LISTENING} from "@/store/actions/listening";
import {GET_DATA_SPEAKING, UPDATE_STATE_SPEAKING} from "@/store/actions/speaking";
import {GET_DATA_WRITING, UPDATE_STATE_WRITING} from "@/store/actions/writing";
import {UPDATE_TIME} from "@/store/actions/time";
import router from '@/router'
import {SET_REVIEW_USER_TEST_ID} from "@/store/actions/reviewExam";

let knex = require('@/db/knex')

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
    [SET_REVIEW_TIMES]: ({commit, rootState}) => {
        let times = []
        for(let i = 0; i < rootState.speaking.speaking.length; i ++){
           times.push({'number': i + 1, 'preparation_time': 0, 'answering_time': 0, 'reading_time': 0})
        }
        commit('updateSpeakingTime', times)
    },
    [CHANGE_TPO_MODE]: ({commit}, payload) => {
      commit('updateMode', payload)
    },
    [END_TPO]: ({state, dispatch}) => {
        dispatch(SET_REVIEW_USER_TEST_ID, state.userTestId)
        dispatch(CORRECT_EXAM);
        router.push('/review');
    },
    [SET_WRITING_READING_TIME]: ({state, dispatch}, payload) => {
        if(state.mode !== 'reviewMode') {
            dispatch(UPDATE_TIME, state.writingTimes[payload]['reading_time'])
        }
    },
    [UPDATE_COMPONENT]: ({commit}, payload) => {
        commit('updateComponent', payload)
    },
    [UPDATE_INITIAL_STATE]: ({state, commit, dispatch}) => {
        if (state.examArray[state.examSectionNumber] === 'Reading') {
            if (state.seenArray.indexOf('Reading') === -1) {
                commit('updateComponent', 'ReadingDirection')
            } else {
                dispatch(UPDATE_STATE_READING)
            }

        }
        if (state.examArray[state.examSectionNumber] === 'Listening') {
            if (state.seenArray.indexOf('Listening') === -1) {
                commit('updateComponent', 'ListeningDirection')
            } else {
                dispatch(UPDATE_STATE_LISTENING)
            }

        }
        if (state.examArray[state.examSectionNumber] === 'Speaking') {
            if (state.seenArray.indexOf('Speaking') === -1) {
                commit('updateComponent', 'SpeakingDirections')
            } else {
                dispatch(UPDATE_STATE_SPEAKING)
            }

        }
        if (state.examArray[state.examSectionNumber] === 'Writing') {
            if (state.seenArray.indexOf('Writing') === -1) {
                commit('updateComponent', 'WritingDirection')
            } else {
                dispatch(UPDATE_STATE_WRITING)
            }
        }
    },
    [CORRECT_EXAM]: ({state, rootState}) => {
        function eqSet(as, bs) {
            if (as.size !== bs.size) return false;
            for (var a of as) if (!bs.has(a)) return false;
            return true;
        }
        if(state.examArray.indexOf('Reading') !== -1) {
            let correctReadingAnswers = 0;
            let readingQuestionsCount = 0;
            for (let i = 0; i < rootState.reading.reading.length; i++) {
                for (let j = 0; j < rootState.reading.reading[i].questions.length; j++) {
                    if (rootState.reading.reading[i].questions[j]['question_type'] === 'Summary') {
                        readingQuestionsCount += 2;
                    } else {
                        readingQuestionsCount += 1;
                    }
                    if(rootState.reading.readingAnswers[rootState.reading.reading[i].questions[j].id] !== undefined) {
                        if (rootState.reading.reading[i].questions[j].right_answer === rootState.reading.readingAnswers[rootState.reading.reading[i].questions[j].id]) {
                            correctReadingAnswers++;
                        } else {
                            if (rootState.reading.reading[i].questions[j].right_answer.trim().split(/\s+/).length > 1) {
                                let cloneAnswer = [...rootState.reading.readingAnswers[rootState.reading.reading[i].questions[j].id]];
                                let setA = new Set(cloneAnswer);
                                let setB = new Set(rootState.reading.reading[i].questions[j].right_answer.trim().split(/\s+/));
                                if (eqSet(setA, setB)) {
                                    if (rootState.reading.reading[i].questions[j]['question_type'] === 'Summary') {
                                        correctReadingAnswers += 2;
                                    } else {
                                        correctReadingAnswers += 1;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            let readingScore = Math.ceil((correctReadingAnswers / readingQuestionsCount) * 30);
            knex('tpousers_testuser').where({id: state.userTestId}).update({
                reading_score: readingScore
            }).then(() => {})
        }

        if(state.examArray.indexOf('Listening') !== -1) {
            let correctListeningAnswers = 0;
            let listeningQuestionsCount = 0;
            for (let i = 0; i < rootState.listening.listening.length; i++) {
                for (let j = 0; j < rootState.listening.listening[i].length; j++) {
                    for (let k = 0; k < rootState.listening.listening[i][j].questions.length; k++) {
                        listeningQuestionsCount += rootState.listening.listening[i][j].questions.length;
                        if (rootState.listening.listeningAnswers[rootState.listening.listening[i][j].questions[k].id] !== undefined) {
                            if (rootState.listening.listening[i][j].questions[k].right_answer === rootState.listening.listeningAnswers[rootState.listening.listening[i][j].questions[k].id]) {
                                correctListeningAnswers++;
                            } else {
                                if (rootState.reading.reading[i][j].questions[k].right_answer.trim().split(/\s+/).length > 1) {
                                    let cloneAnswer = [...rootState.listening.listeningAnswers[rootState.listening.listening[i][j].questions[k].id]];
                                    let setA = new Set(cloneAnswer);
                                    let setB = new Set(rootState.listening.listening[i][j].questions[k].right_answer.trim().split(/\s+/));
                                    if (eqSet(setA, setB)) {
                                        correctListeningAnswers++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            let listeningScore = Math.ceil((correctListeningAnswers / listeningQuestionsCount) * 30);
            knex('tpousers_testuser').where({id: state.userTestId}).update({
                listening_score: listeningScore
            }).then(() => {})
        }

    },

    [START_TPO]: ({state, commit, dispatch}, payload) => {

        let userId = localStorage.getItem('user-id')
        knex('tpousers_testuser').insert({
            test_id: payload['TPO'],
            user_id: userId,
            date_time: Date.now(),
            is_done: false,
            is_paid: true,
        }).then((id) => {
            commit('updateUserTestId', id[0])
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
                        for (let i = 0; i < rows.length; i++) {
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
                        for (let i = 0; i < rows.length; i++) {
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
                        for (let i = 0; i < rows.length; i++) {
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
        } else {
            knex('tpousers_testuser').where({id: state.userTestId}).update({is_done: true}).then(() => {
                dispatch(END_TPO);
            })
        }
    },
    [PREVIOUS_SECTION]: ({state, commit, dispatch}) => {
        if (state.examSectionNumber - 1 >= 0) {
            commit('updateExamSectionNumber', state.examSectionNumber - 1)
            if (state.examArray[state.examSectionNumber] === 'Reading') {
                dispatch(SET_NEW_TIME, 0)
            }
            if (state.examArray[state.examSectionNumber] === 'Listening') {
                dispatch(SET_NEW_TIME, state.listeningTimes.length)
            }
            if (state.examArray[state.examSectionNumber] === 'Writing') {
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
        state.userTestId = payload;
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
        if ('sectionNumber' in payload) {
            state.listeningTimes[payload['sectionNumber']] = payload['time']
        } else {
            state.listeningTimes = payload
        }
    },
    updateSpeakingTime(state, payload) {
        state.speakingTimes = payload;
    },
    updateWritingTime(state, payload) {
        if ('sectionNumber' in payload) {
            state.writingTimes[payload['sectionNumber']]['time'] = payload['time']
        } else {
            state.writingTimes = payload
        }
    },
    updateSeenArray(state, payload) {
        if (state.seenArray.indexOf(payload) === -1) {
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