import {GO_TO_EXAM_REVIEW, SET_REVIEW_USER_TEST_ID} from "@/store/actions/reviewExam";
import {GET_DATA_READING, SET_READING_ANSWERS} from "@/store/actions/reading";
import {GET_DATA_LISTENING, SET_LISTENING_ANSWERS} from "@/store/actions/listening";
import {GET_DATA_SPEAKING, SET_SPEAKING_ANSWERS} from "@/store/actions/speaking";
import {GET_DATA_WRITING, SET_WRITING_ANSWERS} from "@/store/actions/writing";

const state = {
    readingScore: 0,
    listeningScore: 0,
    speakingScore: 0,
    writingScore: 0,
    reviewUserTestId: 0,
    testId: 0
}
const getters = {
    readingReviewScore: state => state.readingScore,
    listeningReviewScore: state => state.listeningScore,
    speakingReviewScore: state => state.speakingScore,
    writingReviewScore: state => state.writingScore,
    reviewTestId: state => state.testId
}
const actions = {
    [SET_REVIEW_USER_TEST_ID]: ({commit}, payload) => {
        commit('updateReviewUserTestId', payload)
    },
    [GO_TO_EXAM_REVIEW]: ({state, commit, dispatch}) => {
        let knex = require('knex')({
            client: 'sqlite3',
            connection: {
                filename: './db.sqlite3'
            },
            useNullAsDefault: true
        });
        let promises = []
        promises = [...promises, knex.select('*').from('tpousers_testuser').where({id: state.reviewUserTestId}).then((row) => {
            dispatch(GET_DATA_READING, row[0]['test_id'])
            dispatch(GET_DATA_LISTENING, row[0]['test_id'])
            dispatch(GET_DATA_SPEAKING, row[0]['test_id'])
            dispatch(GET_DATA_WRITING, row[0]['test_id'])
            commit('updateReviewTestId', row[0]['test_id'])
            commit('updateReadingScore', row[0]['reading_score'])
            commit('updateListeningScore', row[0]['listening_score'])
            commit('updateSpeakingScore', row[0]['speaking_score'])
            commit('updateWritingScore', row[0]['writing_score'])
        })]

        promises = [...promises, knex.select('*').from('tpousers_userreadinganswers').where({
            user_test_id: state.reviewUserTestId
        }).then((rows) => {
            dispatch(SET_READING_ANSWERS, rows)
        })]

        promises = [...promises, knex.select('*').from('tpousers_userlisteninganswers').where({
            user_test_id: state.reviewUserTestId
        }).then((rows) => {
            dispatch(SET_LISTENING_ANSWERS, rows)
        })]

        promises = [...promises, knex.select('*').from('tpousers_userspeakinganswers').where({
            user_test_id: state.reviewUserTestId
        }).then((rows) => {
            dispatch(SET_SPEAKING_ANSWERS, rows)
        })]

        promises = [...promises, knex.select('*').from('tpousers_userwritinganswers').where({
            user_test_id: state.reviewUserTestId
        }).then((rows) => {
            dispatch(SET_WRITING_ANSWERS, rows)
        })]
        return Promise.all(promises)
    },
}
const mutations = {
    updateReviewUserTestId(state, payload){
      state.reviewUserTestId = payload
    },
    updateReadingScore(state, payload){
        state.readingScore = payload
    },
    updateListeningScore(state, payload){
        state.listeningScore = payload
    },
    updateSpeakingScore(state, payload){
        state.speakingScore = payload
    },
    updateWritingScore(state, payload){
        state.writingScore = payload
    },
    updateReviewTestId(state, payload){
        state.testId = payload
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}