import {
    GET_CORRECTION_CAPABLE_TESTS,
    GET_CORRECTION_CONTENT,
    ORDER_CORRECTION,
    GET_PRICES
} from '../actions/correction';
import axios from 'axios';
import {DOWNLOAD_TPO} from "../actions/download";
import {GET_LOCAL_TPO_LIST} from "../actions/TPOPage";

let knex = require('../../db/knex')

const state = {
    tests: [],
    currentTestId: 0,
    speakingAnswers: {},
    writingAnswers: {},
    speakingIds: {},
    writingIds: {},
    excludeWritingList: [],
    excludeSpeakingList: [],
    inProgressCorrectionSpeakingList: [],
    inProgressCorrectionWritingList: [],
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
    orderedWriting: state => state.inProgressCorrectionWritingList,
    orderedSpeaking: state => state.inProgressCorrectionSpeakingList,

};
const actions = {
    [GET_CORRECTION_CAPABLE_TESTS]: ({commit, rootGetters}) => {
        commit('resetCorrectionTestList')

        return new Promise((resolve, reject) => {
            let promises = [];
            promises = [...promises, knex.select('*').from('tpousers_userspeakinganswers').then(async (rows) => {
                for (let i = 0; i < rows.length; i++) {
                    await knex.select('*').from('tpousers_testuser').where({
                        id: rows[i]['user_test_id'],
                        is_done: true
                    }).then((userTest) => {
                        if (userTest.length !== 0) {
                            if (state.excludeSpeakingList.indexOf(userTest[0]['id']) === -1) {
                                commit('updateCapableTests', [userTest[0]['id'], userTest[0]['date_time'], rootGetters.getTPOById(userTest[0]['test_id'])])
                            }

                        }
                    })
                }
            })]
            promises = [...promises, knex.select('*').from('tpousers_userwritinganswers').then(async (rows) => {
                for (let i = 0; i < rows.length; i++) {
                    await knex.select('*').from('tpousers_testuser').where({
                        id: rows[i]['user_test_id'],
                        is_done: true
                    }).then((userTest) => {
                        if (userTest.length !== 0) {
                            if (state.excludeWritingList.indexOf(userTest[0]['id']) === -1) {
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
                    dataList[0] = state.speakingAnswers
                }
                axios.post('api/v1/order_correction/', dataList).then((resp) => {
                    resolve(resp)
                }).catch((err) => {
                    reject(err)
                })
            })
        })

    },
    [GET_PRICES]: ({commit, rootGetters, dispatch}) => {
        let userId = localStorage.getItem('user-id')
        return new Promise((resolve, reject) => {
            axios.get('api/v1/prices/').then(async (resp) => {
                commit('updatePrices', [resp.data['speaking_price'], resp.data['writing_price']])

                for (let i = 0; i < resp.data['speaking_list'].length; i++) {
                    await commit('updateExcludeSpeakingList', resp.data['speaking_list'][i])
                    if (rootGetters.getTPOById(resp.data['speaking_list'][i].test_id) === undefined) {
                        await dispatch(DOWNLOAD_TPO, resp.data['speaking_list'][i].test_id).then(() => {
                        })
                    }
                    await knex.select('*').from('tpousers_testuser').where({'id': resp.data['speaking_list'][i]['local_user_test_id']}).then(async (row) => {
                        if (row.length === 0) {
                            await knex('tpousers_testuser').insert({
                                id: resp.data['speaking_list'][i]['local_user_test_id'],
                                test_id: resp.data['speaking_list'][i]['test_id'],
                                user_id: userId,
                                is_paid: true,
                                is_done: true,
                                date_time: resp.data['speaking_list'][i]['date'],
                            }).then(async () => {
                                for (let j = 0; j < resp.data['speaking_list'][i]['speaking_answers'].length; j++) {
                                    await knex('tpousers_userspeakinganswers').insert({
                                        answer: resp.data['speaking_list'][i]['speaking_answers'][j]['answer'],
                                        question_id: resp.data['speaking_list'][i]['speaking_answers'][j]['question'],
                                        user_test_id: resp.data['speaking_list'][i]['local_user_test_id']
                                    }).then(() => {
                                    })
                                }
                            })
                        } else {
                            await knex('tpousers_userspeakinganswers').where({'user_test_id': resp.data['speaking_list'][i]['local_user_test_id']}).then(async (rows) => {
                                if (rows.length === 0) {
                                    for (let j = 0; j < resp.data['speaking_list'][i]['speaking_answers'].length; j++) {
                                        await knex('tpousers_userspeakinganswers').insert({
                                            answer: resp.data['speaking_list'][i]['speaking_answers'][j]['answer'],
                                            question_id: resp.data['speaking_list'][i]['speaking_list'][j]['question'],
                                            user_test_id: resp.data['speaking_list'][i]['local_user_test_id']
                                        }).then(() => {
                                        })
                                    }

                                }
                            })
                        }

                    })
                }
                for (let i = 0; i < resp.data['writing_list'].length; i++) {
                    await commit('updateExcludeWritingList', resp.data['writing_list'][i])
                    if (rootGetters.getTPOById(resp.data['writing_list'][i].test_id) === undefined) {
                        await dispatch(DOWNLOAD_TPO, resp.data['writing_list'][i].test_id).then(() => {
                        })
                    }
                    await knex.select('*').from('tpousers_testuser').where({'id': resp.data['writing_list'][i]['local_user_test_id']}).then(async (row) => {
                        if (row.length === 0) {
                            await knex('tpousers_testuser').insert({
                                id: resp.data['writing_list'][i]['local_user_test_id'],
                                test_id: resp.data['writing_list'][i]['test_id'],
                                user_id: userId,
                                is_paid: true,
                                is_done: true,
                                date_time: resp.data['writing_list'][i]['date'],
                            }).then(() => {
                            })
                            for (let j = 0; j < resp.data['writing_list'][i]['writing_answers'].length; j++) {
                                await knex('tpousers_userwritinganswers').insert({
                                    answer: resp.data['writing_list'][i]['writing_answers'][j]['answer'],
                                    question_id: resp.data['writing_list'][i]['writing_answers'][j]['question'],
                                    user_test_id: resp.data['writing_list'][i]['local_user_test_id']
                                }).then(() => {
                                })
                            }
                        } else {
                            await knex('tpousers_userwritinganswers').where({'user_test_id': resp.data['writing_list'][i]['local_user_test_id']}).then(async (rows) => {
                                if (rows.length === 0) {
                                    for (let j = 0; j < resp.data['writing_list'][i]['writing_answers'].length; j++) {
                                        await knex('tpousers_userwritinganswers').insert({
                                            answer: resp.data['writing_list'][i]['writing_answers'][j]['answer'],
                                            question_id: resp.data['writing_list'][i]['writing_answers'][j]['question'],
                                            user_test_id: resp.data['writing_list'][i]['local_user_test_id']
                                        }).then(() => {
                                        })
                                    }

                                }
                            })

                        }
                    })
                }
                let writings = []
                let speakings = []
                await dispatch(GET_LOCAL_TPO_LIST).then(async () => {
                    for (let i = 0; i < resp.data['writing_list'].length; i++) {
                        let writingObject = {}
                        writingObject['id'] = resp.data['writing_list'][i]['id']
                        writingObject['userTestId'] = resp.data['writing_list'][i]['local_user_test_id']
                        writingObject['assigned_corrector'] = resp.data['writing_list'][i]['assigned_corrector']
                        writingObject['score'] = resp.data['writing_list'][i]['score']
                        writingObject['comment'] = resp.data['writing_list'][i]['comment']
                        writingObject['related_file'] = resp.data['writing_list'][i]['related_file']
                        writingObject['state'] = resp.data['writing_list'][i]['state']

                        await knex.select('*').from('tpousers_testuser').where({'id': resp.data['writing_list'][i]['local_user_test_id']}).then((row) => {
                            if (row.length !== 0) {
                                writingObject['test'] = rootGetters.getTPOById(row[0]['test_id'])
                            }
                        }).then(() => {

                        })
                        await writings.push(writingObject)
                    }
                    for (let i = 0; i < resp.data['speaking_list'].length; i++) {
                        let speakingObject = {}
                        speakingObject['id'] = resp.data['speaking_list'][i]['id']
                        speakingObject['userTestId'] = resp.data['speaking_list'][i]['local_user_test_id']
                        speakingObject['assigned_corrector'] = resp.data['speaking_list'][i]['assigned_corrector']
                        speakingObject['score'] = resp.data['speaking_list'][i]['score']
                        speakingObject['comment'] = resp.data['speaking_list'][i]['comment']
                        speakingObject['related_file'] = resp.data['speaking_list'][i]['related_file']
                        speakingObject['state'] = resp.data['speaking_list'][i]['state']

                        await knex.select('*').from('tpousers_testuser').where({'id': resp.data['speaking_list'][i]['local_user_test_id']}).then((row) => {
                            if (row.length !== 0) {
                                speakingObject['test'] = rootGetters.getTPOById(row[0]['test_id'])
                            }
                        })
                        await speakings.push(speakingObject)
                    }
                })
                return [writings, speakings]
            }).then((payload) => {
                commit('updateCorrectionList', payload)
            }).then(() => {
                resolve()
            }).catch(() => {
                reject()
            })
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
        state.excludeWritingList.push(payload['local_user_test_id'])
    },
    updateExcludeSpeakingList(state, payload) {
        state.excludeSpeakingList.push(payload['local_user_test_id'])
    },
    updateCorrectionList(state, payload) {
        state.inProgressCorrectionSpeakingList = payload[1]
        state.inProgressCorrectionWritingList = payload[0]
    },
    updatePrices(state, payload) {
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
