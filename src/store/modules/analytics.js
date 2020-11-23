import {FETCH_ANALYTICS} from "@/store/actions/analytics";
let knex = require('@/db/knex')

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
        commit('resetAllAnalytics');
        let userId = localStorage.getItem('user-id')
        return new Promise((resolve) => {
            knex.select("*").from('tpousers_testuser').where({
                user_id: userId,
            }).then((userTests) => {
                for (let j = 0; j < userTests.length; j++) {
                    if(rootGetters.getTPOById(userTests[j]['test_id']) !== undefined) {
                        if (userTests[j]['reading_score'] !== null) {
                            commit('updateReadingChartData', [userTests[j]['date_time'], rootGetters.getTPOById(userTests[j]['test_id']), userTests[j]['reading_score']])
                        }
                        if (userTests[j]['listening_score'] !== null) {
                            commit('updateListeningChartData', [userTests[j]['date_time'], rootGetters.getTPOById(userTests[j]['test_id']), userTests[j]['listening_score']])
                        }
                        if (userTests[j]['speaking_score'] !== null) {
                            commit('updateSpeakingChartData', [userTests[j]['date_time'], rootGetters.getTPOById(userTests[j]['test_id']), userTests[j]['speaking_score']])
                        }
                        if (userTests[j]['writing_score'] !== null) {
                            commit('updateWritingChartData', [userTests[j]['date_time'], rootGetters.getTPOById(userTests[j]['test_id']), userTests[j]['writing_score']])
                        }
                    }
                }
                resolve(userTests)

            })
        })
    }
};
const mutations = {
    updateReadingChartData(state, payload) {
        state.categoriesReading.push(payload[1]['code'])
        state.readingChartDates.push(`${new Date(payload[0]).getFullYear()} / ${new Date(payload[0]).getMonth()} / ${new Date(payload[0]).getDate()}`)
        state.readingChartData.push(payload[2])
    },
    updateListeningChartData(state, payload) {
        state.categoriesListening.push(payload[1]['code'])
        state.listeningChartDates.push(`${new Date(payload[0]).getFullYear()} / ${new Date(payload[0]).getMonth()} / ${new Date(payload[0]).getDate()}`)
        state.listeningChartData.push(payload[2])

    },
    updateSpeakingChartData(state, payload) {
        state.categoriesSpeaking.push(payload[1]['code'])
        state.speakingChartDates.push(`${new Date(payload[0]).getFullYear()} / ${new Date(payload[0]).getMonth()} / ${new Date(payload[0]).getDate()}`)
        state.speakingChartData.push(payload[2])

    },
    updateWritingChartData(state, payload) {
        state.categoriesWriting.push(payload[1]['code'])
        state.writingChartDates.push(`${new Date(payload[0]).getFullYear()} / ${new Date(payload[0]).getMonth()} / ${new Date(payload[0]).getDate()}`)
        state.writingChartData.push(payload[2])

    },
    resetAllAnalytics(state) {
        state.categoriesReading = [];
        state.readingChartData = [];
        state.readingChartDates = [];
        state.categoriesListening = [];
        state.listeningChartData = [];
        state.listeningChartDates = [];
        state.categoriesSpeaking = [];
        state.speakingChartData = [];
        state.speakingChartDates = [];
        state.categoriesWriting = [];
        state.writingChartData = [];
        state.writingChartDates = [];
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}