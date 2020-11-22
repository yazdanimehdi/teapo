import {CHANGE_TAB, SET_CONNECTION, SET_TOEFL_TIME, GET_DASHBOARD_DATA} from "@/store/actions/dashboard";
let knex = require('@/db/knex')

const state = {
    tabNumber: 0,
    connected: navigator.onLine,
    dayToTOEFL: -1,
    listeningDone: 0,
    readingDone: 0,
    speakingDone: 0,
    writingDone: 0,
    totalListening: 0,
    totalReading: 0,
    totalSpeaking: 0,
    totalWriting: 0,
    practiceTest: {},

}
const getters = {
    connected: state => state.connected,
    dayToTOEFL: state => state.dayToTOEFL,
    progress: state => {
        let all = state.totalReading + state.totalListening + state.totalSpeaking + state.totalWriting
        let done = state.readingDone + state.listeningDone + state.speakingDone + state.writingDone
        return all !== 0 ? Math.ceil((done / all) * 100) : 0
    },
    practiceTest: state => state.practiceTest,
}
const actions = {
    [CHANGE_TAB]: ({commit}, payload) => {
        commit('updateTab', payload)
    },
    [SET_CONNECTION]: ({commit}, payload) => {
        commit('SET_CONNECTED', payload)
    },
    [SET_TOEFL_TIME]: ({rootGetters}, payload) => {

        return new Promise((resolve) => {
            knex('institutions_users').where({'id': rootGetters.getId}).update({toefl_time: payload}).then(() => {
                resolve()
            })
        })
    },
    [GET_DASHBOARD_DATA]: async ({commit, rootGetters}) => {
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min;
        }

        await knex('institutions_users').select('*').where({'id': rootGetters.getId}).then((row) => {
            if (row[0]['toefl_time'] === null) {
                commit('updateTOEFLTime', -1)
            } else {
                commit('updateTOEFLTime', Math.ceil((row[0]['toefl_time'] - Date.now()) * 1.15741e-8))
            }
        })
        let listeningDone = 0
        let readingDone = 0
        let speakingDone = 0
        let writingDone = 0

        let totalListening = 0
        let totalReading = 0
        let totalSpeaking = 0
        let totalWriting = 0

        let promises = []
        for (let i = 0; i < rootGetters.localTPOListId.length; i++) {

            promises = [...promises, knex('tpo_testlistening').select('*').where({test_id: rootGetters.localTPOListId[i]}).then((listenings) => {
                totalListening += listenings.length
            })]

            promises = [...promises, knex('tpo_testreading').select('*').where({test_id: rootGetters.localTPOListId[i]}).then((readings) => {
                totalReading += readings.length
            })]


            promises = [...promises, knex('tpo_testspeaking').select('*').where({test_id: rootGetters.localTPOListId[i]}).then((speakings) => {
                totalSpeaking += speakings.length
            })]

            promises = [...promises, knex('tpo_testwriting').select('*').where({test_id: rootGetters.localTPOListId[i]}).then((writings) => {
                totalWriting += writings.length
            })]

        }

        Promise.all(promises).then(async () => {
            await knex('tpousers_testuser').select('*').where({
                user_id: rootGetters.getId,
                is_done: true,
            }).then(async (rows) => {
                for (let i = 0; i < rows.length; i++) {
                    let test = rootGetters.getTPOById(rows[i]['test_id'])
                    if (test !== undefined) {
                        await knex('tpousers_userlisteninganswers').select('*').where({user_test_id: rows[i]['id']}).then(async (listeningAnswers) => {
                            if (listeningAnswers.length > 0) {
                                await knex('tpo_testlistening').select('*').where({test_id: test.id}).then((listenings) => {
                                    listeningDone += listenings.length
                                })
                            }
                        })
                        await knex('tpousers_userreadinganswers').select('*').where({user_test_id: rows[i]['id']}).then(async(readingAnswers) => {
                            if (readingAnswers.length > 0) {
                                await knex('tpo_testreading').select('*').where({test_id: test.id}).then((readings) => {
                                    readingDone += readings.length
                                })
                            }
                        })
                        await knex('tpousers_userspeakinganswers').select('*').where({user_test_id: rows[i]['id']}).then(async (speakingAnswers) => {
                            if (speakingAnswers.length > 0) {
                                await knex('tpo_testspeaking').select('*').where({test_id: test.id}).then((speakings) => {
                                    speakingDone += speakings.length
                                })
                            }
                        })
                        await knex('tpousers_userwritinganswers').select('*').where({user_test_id: rows[i]['id']}).then(async (writingAnswers) => {
                            if (writingAnswers.length > 0) {
                                await knex('tpo_testwriting').select('*').where({test_id: test.id}).then((writings) => {
                                    writingDone += writings.length
                                })
                            }
                        })
                    }

                }
                commit('updateDashboardProgress',
                    [listeningDone,
                        readingDone,
                        speakingDone,
                        writingDone,
                        totalListening,
                        totalReading,
                        totalSpeaking,
                        totalWriting])
                if (rootGetters.localTPOListId.length !== 0) {
                    commit('updatePracticeTest', rootGetters.getTPOById(rootGetters.localTPOListId[getRandomInt(0, rootGetters.localTPOListId.length)]))
                }
            })
        })
    }
}
const mutations = {
    updateTab(state, payload) {
        state.tabNumber = payload;
    },
    SET_CONNECTED(state, payload) {
        state.connected = payload
    },
    updateTOEFLTime(state, payload) {
        state.dayToTOEFL = payload
    },
    updateDashboardProgress(state, payload) {
        state.listeningDone = payload[0]
        state.readingDone = payload[1]
        state.speakingDone = payload[2]
        state.writingDone = payload[3]
        state.totalListening = payload[4]
        state.totalReading = payload[5]
        state.totalSpeaking = payload[6]
        state.totalWriting = payload[7]
    },
    updatePracticeTest(state, payload) {
        state.practiceTest = payload;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}