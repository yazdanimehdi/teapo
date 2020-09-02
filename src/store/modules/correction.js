import {
    GET_CORRECTION_CAPABLE_TESTS,
    GET_CORRECTION_CONTENT,
    ORDER_CORRECTION,
    GET_PRICES
} from '@/store/actions/correction';
import axios from 'axios';
let knex = require('@/db/knex')

const state = {
    tests: [],
    currentTestId: 0,
    speakingAnswers: {},
    writingAnswers: {},
    speakingIds: {},
    writingIds: {},
    excludeWritingList: [],
    excludeSpeakingList: [],
    speakingPrice: 0,
    writingPrice: 0,
};
const getters = {
    correctionSpeakingAnswers: state => state.speakingAnswers,
    correctionWritingAnswers: state => state.writingAnswers,
    correctionTests: state => state.tests,
    writingIds: state => state.writingIds,
    speakingIds: state => state.speakingIds,
    speakingPrice: state => state.speakingPrice,
    writingPrice: state => state.writingPrice,

};
const actions = {
    [GET_CORRECTION_CAPABLE_TESTS]: ({commit, rootGetters}) => {
        commit('resetCorrectionTestList')

        return new Promise((resolve, reject) => {
            let promises = [];
            promises = [...promises, knex.select('*').from('tpousers_userspeakinganswers').then((rows) => {
                for (let i = 0; i < rows.length; i++) {
                    knex.select('*').from('tpousers_testuser').where({
                        id: rows[i]['user_test_id'],
                        is_done: true
                    }).then((userTest) => {
                        if (userTest.length !== 0) {
                            if(state.excludeSpeakingList.indexOf(userTest[0]['id']) === -1) {
                                commit('updateCapableTests', [userTest[0]['id'], userTest[0]['date_time'], rootGetters.getTPOById(userTest[0]['test_id'])])
                            }

                        }
                    })
                }
            })]
            promises = [...promises, knex.select('*').from('tpousers_userwritinganswers').then((rows) => {
                for (let i = 0; i < rows.length; i++) {
                    knex.select('*').from('tpousers_testuser').where({
                        id: rows[i]['user_test_id'],
                        is_done: true
                    }).then((userTest) => {
                        if (userTest.length !== 0) {
                            if(state.excludeWritingList.indexOf(userTest[0]['id']) === -1) {
                                commit('updateCapableTests', [userTest[0]['id'], userTest[0]['date_time'], rootGetters.getTPOById(userTest[0]['test_id'])])
                            }

                        }
                    })
                }
            })]
            Promise.all(promises).then(() => {
                resolve()
            }).catch(() => {
                reject()
            })
        })
    },
    [GET_CORRECTION_CONTENT]: ({commit}, payload) => {
        let promises = []
        promises = [...promises, knex.select('*').from('tpo_testspeaking').where({test_id: payload[0]}).then((rows) => {
            for (let i = 0; i < rows.length; i++) {
                commit('updateSpeakingIds', rows[i])
            }
        })]
        promises = [...promises, knex.select('*').from('tpo_testwriting').where({test_id: payload[0]}).then((rows) => {
            for (let i = 0; i < rows.length; i++) {
                commit('updateWritingIds', rows[i])
            }
        })]
        promises = [...promises, knex.select('*').from('tpousers_userspeakinganswers').where({user_test_id: payload[1]}).then((rows) => {
            commit('updateCorrectionSpeakingAnswers', rows)
        })]
        promises = [...promises, knex.select('*').from('tpousers_userwritinganswers').where({user_test_id: payload[1]}).then((rows) => {
            commit('updateCorrectionWritingAnswers', rows)
        })]
        return Promise.all(promises)
    },
    [ORDER_CORRECTION]: ({state, commit}, payload) => {
        return new Promise((resolve, reject) => {
            let promises = []
            promises = [...promises, knex.select('*').from('tpo_testspeaking').where({test_id: payload[0]}).then((rows) => {
                for (let i = 0; i < rows.length; i++) {
                    commit('updateSpeakingIds', rows[i])
                }
            })]
            promises = [...promises, knex.select('*').from('tpo_testwriting').where({test_id: payload[0]}).then((rows) => {
                for (let i = 0; i < rows.length; i++) {
                    commit('updateWritingIds', rows[i])
                }
            })]
            promises = [...promises, knex.select('*').from('tpousers_userspeakinganswers').where({user_test_id: payload[1]}).then((rows) => {
                commit('updateCorrectionSpeakingAnswers', rows)
            })]
            promises = [...promises, knex.select('*').from('tpousers_userwritinganswers').where({user_test_id: payload[1]}).then((rows) => {
                commit('updateCorrectionWritingAnswers', rows)
            })]
            Promise.all(promises).then(() => {
                let dataList = [[], [], payload[0], payload[1]]
                if (payload[3] === true) {
                    dataList[1] = state.writingAnswers
                }
                if (payload[2] === true) {
                    console.log(state.speakingAnswers)
                    dataList[0] = state.speakingAnswers
                }
                axios.post('http://127.0.0.1:8000/api/v1/order_correction/', dataList).then((resp) => {
                    resolve(resp)
                }).catch((err) => {
                    reject(err)
                })
            })
        })

    },
    [GET_PRICES]: ({commit}) => {
        return axios.get('http://127.0.0.1:8000/api/v1/prices/').then((resp) => {
                commit('updatePrices', [resp.data['speaking_price'], resp.data['writing_price']])
                commit('updateExcludeWritingList', resp.data['writing_list'])
                commit('updateExcludeSpeakingList', resp.data['speaking_list'])
            }).catch(() => {
            })
    }
};
const mutations = {
    updateSpeakingIds(state, payload) {
        state.speakingIds[payload['speaking_id']] = payload['part']
    },
    updateWritingIds(state, payload) {
        state.writingIds[payload['writing_id']] = payload['part']
    },
    resetCorrectionTestList(state) {
        state.tests = []
    },
    updateCapableTests(state, payload) {
        payload[2]['userTestId'] = payload[0]
        payload[2]['time'] = payload[1]
        if (state.tests.indexOf(payload[2]) === -1) {
            state.tests.push(payload[2])
        }
    },
    updateCorrectionSpeakingAnswers(state, payload) {
        state.speakingAnswers = payload
    },
    updateCorrectionWritingAnswers(state, payload) {
        state.writingAnswers = payload
    },
    updateExcludeWritingList(state, payload) {
        state.excludeWritingList = payload
    },
    updateExcludeSpeakingList(state, payload) {
        state.excludeSpeakingList = payload
    },
    updatePrices(state, payload){
        state.speakingPrice = payload[0]
        state.writingPrice = payload[1]
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
