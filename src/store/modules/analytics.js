import {FETCH_ANALYTICS} from "@/store/actions/analytics";

const state = {
    categoriesReading: [],
    readingChartData: [],
    readingChartDates: [],
    categoriesListening: [],
    listeningChartData: [],
    listeningChartDates: [],
    categoriesSpeaking: [],
    speakingChartData: [],
    speakingChartDates: [],
    categoriesWriting: [],
    writingChartData: [],
    writingChartDates: [],
};
const getters = {
    listeningDates: state => state.listeningChartDates,
    readingDates: state => state.readingChartDates,
    speakingDates: state => state.speakingChartDates,
    writingDates: state => state.writingChartDates,

    listeningChartData: state => state.listeningChartData,
    readingChartData: state => state.readingChartData,
    speakingChartData: state => state.speakingChartData,
    writingChartData: state => state.writingChartData,

    listeningCategory: state => state.categoriesListening,
    readingCategory: state => state.categoriesReading,
    speakingCategory: state => state.categoriesSpeaking,
    writingCategory: state => state.categoriesWriting,

    readingAverage: state => {
        let totalSum = 0;
        let lastFiveSum = 0;

        for (let i = 0; i < state.readingChartData.length; i++) {
            totalSum += state.readingChartData[i]
            if (i < 5) {
                lastFiveSum += state.readingChartData[state.readingChartData.length - i - 1]
            }
        }
        if (state.readingChartData.length > 0) {
            return [totalSum / state.readingChartData.length,
                lastFiveSum / (state.readingChartData.length > 5 ? 5 : state.readingChartData.length)]
        } else {
            return ['-', '-']
        }
    },

    listeningAverage: state => {
        let totalSum = 0;
        let lastFiveSum = 0;

        for (let i = 0; i < state.listeningChartData.length; i++) {
            totalSum += state.listeningChartData[i]
            if (i < 5) {
                lastFiveSum += state.listeningChartData[state.listeningChartData.length - i - 1]
            }
        }
        if (state.listeningChartData.length > 0) {
            return [totalSum / state.listeningChartData.length,
                lastFiveSum / (state.listeningChartData.length > 5 ? 5 : state.listeningChartData.length)]
        } else {
            return ['-', '-']
        }
    },

    speakingAverage: state => {
        let totalSum = 0;
        let lastFiveSum = 0;

        for (let i = 0; i < state.speakingChartData.length; i++) {
            totalSum += state.speakingChartData[i]
            if (i < 5) {
                lastFiveSum += state.speakingChartData[state.speakingChartData.length - i - 1]
            }
        }
        if (state.speakingChartData.length > 0) {
            return [totalSum / state.speakingChartData.length,
                lastFiveSum / (state.speakingChartData.length > 5 ? 5 : state.speakingChartData.length)]
        } else {
            return ['-', '-']
        }
    },

    writingAverage: state => {
        let totalSum = 0;
        let lastFiveSum = 0;

        for (let i = 0; i < state.writingChartData.length; i++) {
            totalSum += state.writingChartData[i]
            if (i < 5) {
                lastFiveSum += state.writingChartData[state.writingChartData.length - i - 1]
            }
        }
        if (state.writingChartData.length > 0) {
            return [totalSum / state.writingChartData.length,
                lastFiveSum / (state.writingChartData.length > 5 ? 5 : state.writingChartData.length)]
        } else {
            return ['-', '-']
        }
    }

};
const actions = {
    [FETCH_ANALYTICS]: ({commit, rootGetters}) => {
        let userId = localStorage.getItem('user-id')
        var knex = require('knex')({
            client: 'sqlite3',
            connection: {
                filename: './db.sqlite3'
            },
            useNullAsDefault: true
        });
        knex.select("*").from('tpousers_testuser').where({
            user_id: userId,
            is_done: true
        }).then((userTests) => {
            for (let j = 0; j < userTests.length; j++) {
                knex.select("*").from('tpousers_testuserreading').where({
                    test_user_id: userTests[j]['id'],
                }).then((reading) => {
                    if (reading.length !== 0) {
                        commit('updateReadingChartData', [userTests[j]['date_time'], rootGetters.getTPOById(userTests[j]['test_id']), reading['score']])
                    }
                })
                knex.select("*").from('tpousers_testuserlistening').where({
                    test_user_id: userTests[j]['id'],
                }).then((listening) => {
                    if (listening.length !== 0) {
                        commit('updateListeningChartData', [userTests[j]['date_time'], rootGetters.getTPOById(userTests[j]['test_id']), listening['score']])
                    }
                })
                knex.select("*").from('tpousers_testuserspeaking').where({
                    test_user_id: userTests[j]['id'],
                }).then((speaking) => {
                    if (speaking.length !== 0) {
                        commit('updateSpeakingChartData', [userTests[j]['date_time'], rootGetters.getTPOById(userTests[j]['test_id']), speaking['score']])
                    }
                })
                knex.select("*").from('tpousers_testuserwriting').where({
                    test_user_id: userTests[j]['id'],
                }).then((writing) => {
                    if (writing.length !== 0) {
                        commit('updateWritingChartData', [userTests[j]['date_time'], rootGetters.getTPOById(userTests[j]['test_id']), writing['score']])
                    }
                })
            }
        })
    }
};
const mutations = {
    updateReadingChartData(state, payload) {
        state.categoriesReading.push(payload[1]['code'])
        state.readingChartDates.push(new Date(payload[0]).getDate())
        state.readingChartData.push(payload[2])
    },
    updateListeningChartData(state, payload) {
        state.categoriesListening.push(payload[1]['code'])
        state.listeningChartDates.push(new Date(payload[0]).getDate())
        state.listeningChartData.push(payload[2])

    },
    updateSpeakingChartData(state, payload) {
        state.categoriesSpeaking.push(payload[1]['code'])
        state.speakingChartDates.push(new Date(payload[0]).getDate())
        state.speakingChartData.push(payload[2])

    },
    updateWritingChartData(state, payload) {
        state.categoriesWriting.push(payload[1]['code'])
        state.writingChartDates.push(new Date(payload[0]).getDate())
        state.writingChartData.push(payload[2])

    }
};

export default {
    state,
    getters,
    actions,
    mutations
}