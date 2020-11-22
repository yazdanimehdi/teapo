import {
    GET_MOCK_EXAMS,
    GET_MOCK_RESULTS,
    ORDER_MOCK,
    GET_LOCAL_MOCK_LIST
} from "@/store/actions/mockExams";

import axios from 'axios'

let knex = require('@/db/knex')

const state = {
    mockList: [],
    mockResultList: [],
    localMockList: [],
};
const getters = {
    mockList: state => state.mockList,
    mockResultList: state => state.mockResultList,
    isMockAvailable: (state) => (id) => {
        return state.localMockList.includes(id)
    }

};
const actions = {
    [GET_MOCK_EXAMS]: ({commit}) => {
        return axios.get('api/v1/mock_list').then((resp) => {
            commit('updateMockExams', resp.data)
        })
    },
    [GET_MOCK_RESULTS]: ({commit}) => {
        return axios.get('api/v1/user_mock_list').then((resp) => {
            commit('updateMockResult', resp.data)
        })
    },
    // eslint-disable-next-line no-unused-vars
    [ORDER_MOCK]: ({_}, payload) => {
        return axios.post('api/v1/order_mock/', {'id': payload})
    },
    [GET_LOCAL_MOCK_LIST]: ({commit}) => {
        return knex.select("*").from('tpo_test').where({mode: 'M'}).then((rows) => {
            for(let i = 0; i < rows.length; i++){
                commit('updateLocalMockList', rows[i].id)
            }
        })
    }
};
const mutations = {
    'updateMockExams': (state, payload) => {
        state.mockList = payload;
    },
    'updateMockResult': (state, payload) => {
        state.mockResultList = payload;
    },
    'updateLocalMockList': (state, payload) => {
        state.localMockList.push(payload)
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}