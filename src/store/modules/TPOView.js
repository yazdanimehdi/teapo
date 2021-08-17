import {SET_TPO_PARAMETERS, GET_TPO_HISTORY} from "../actions/TPOView";

let knex = require('../../db/knex')
const state = {
    testId: 0,
    tpoHistory: [],
    testTitle: '',
};

const getters = {
    TPOHistory: state => state.tpoHistory,
    TPOViewTestId: state => state.testId,
    TPOViewTestTitle: state => state.testTitle
};

const actions = {
    [SET_TPO_PARAMETERS]: ({commit}, payload) => {
        commit('updateTPOParameters', payload)
    },
    [GET_TPO_HISTORY]: ({commit}) => {
        commit('resetTPOView')
        let userId = localStorage.getItem('user-id')
        return knex('tpousers_testuser').where(
            {
                test_id: state.testId,
                is_done: true,
                user_id: userId
            }).then((rows) => {
            commit('updateTPOHistory', rows)
        })

    }
};

const mutations = {
    'resetTPOView': (state) => {
        state.tpoHistory = []
    },
    'updateTPOParameters': (state, payload) => {
        state.testId = payload[0]
        state.testTitle = payload[1]
    },
    'updateTPOHistory': (state, payload) => {
        for (let i = 0; i < payload.length; i++) {
            let data = {}
            data['date'] = `${new Date(payload[i]['date_time']).getFullYear()}/${new Date(payload[i]['date_time']).getMonth()}/${new Date(payload[i]['date_time']).getDate()}`
            data['reading'] = payload[i]['reading_score'] === null ? '-' : payload[i]['reading_score']
            data['listening'] = payload[i]['listening_score'] === null ? '-' : payload[i]['listening_score']
            data['speaking'] = payload[i]['speaking_score'] === null ? '-' : payload[i]['speaking_score']
            data['writing'] = payload[i]['writing_score'] === null ? '-' : payload[i]['writing_score']
            data['id'] = payload[i]['id']
            if (payload[i]['reading_score'] !== null && payload[i]['listening_score'] !== null && payload[i]['speaking_score'] !== null && payload[i]['writing_score'] !== null) {
                data['total'] = payload[i]['reading_score'] + payload[i]['listening_score'] + payload[i]['speaking_score'] + payload[i]['writing_score']
            } else {
                data['total'] = '-'
            }
            state.tpoHistory.push(data)
        }
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};