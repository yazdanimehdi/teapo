import {
    GET_MOCK_EXAMS,
    GET_MOCK_RESULTS,
    ORDER_MOCK,
    GET_LOCAL_MOCK_LIST, END_MOCK_EXAM, SET_MOCK_IDS, GET_DONE_MOCKS
} from "@/store/actions/mockExams";

import axios from 'axios'

let knex = require('@/db/knex')

const state = {
    mockList: [],
    mockResultList: [],
    localMockList: [],
    doneMockId: 0,
    doneMockUserTestId: 0,
    doneMocksList: [],
    doneUnSentList: [],
    doneUserTestIds: {},
};
const getters = {
    mockList: state => state.mockList,
    mockResultList: state => state.mockResultList,
    isMockAvailable: (state) => (id) => {
        return state.localMockList.includes(id)
    },
    isMockDone: (state) => (id) => {
        return state.doneMocksList.includes(id)
    },
    isMockUnsent: (state) => (id) => {
        return state.doneUnSentList.includes(id)
    },
    doneUserTestIds: state => state.doneUserTestIds,
    unSentMocks: state => state.doneUnSentList,

};
const actions = {
    [GET_DONE_MOCKS]: ({commit}) => {
        return new Promise((resolve) => {
            let userId = localStorage.getItem('user-id')
            knex.select('*').from('tpousers_testuser').where({
                user_id: userId,
                mode: 'mockMode',
                is_done: true,
            }).then((rows) => {
                if(rows.length !== 0){
                    for (let i = 0; i < rows.length; i++){
                        if (rows[i]['sent'] === 1){
                            commit('updateDoneMocksList', rows[i])
                        }
                        else{
                            commit('updateDoneUnSentList', rows[i])
                        }
                    }

                    resolve()
                }
                else{
                    resolve()
                }
            })
        })
    },
    [SET_MOCK_IDS]: ({commit}, payload) => {
        commit('updateMockIds', payload)
    },

    [END_MOCK_EXAM]: ({state}) => {
        let promises = []

        promises = [...promises, knex.select('*').from('tpousers_userreadinganswers').where({
            user_test_id: state.doneMockUserTestId
        }).then(async (rows) => {
            let answers = {};
            for (let i = 0; i < rows.length; i++) {
                answers[rows[i]['question_id']] = rows[i]['answer']
            }
            await axios.post('api/v1/submit_reading_answers/', [answers, state.doneMockId])
        })]

        promises = [...promises, knex.select('*').from('tpousers_userlisteninganswers').where({
            user_test_id: state.doneMockUserTestId
        }).then(async (rows) => {
            let answers = {};
            for (let i = 0; i < rows.length; i++) {
                answers[rows[i]['question_id']] = rows[i]['answer']
            }
            await axios.post('api/v1/submit_listening_answers/', [answers, state.doneMockId])
        })]

        promises = [...promises, knex.select('*').from('tpousers_userspeakinganswers').where({
            user_test_id: state.doneMockUserTestId
        }).then(async (rows) => {
            let answers = {};
            for (let i = 0; i < rows.length; i++) {
                answers[rows[i]['question_id']] = rows[i]['answer']
            }
            await axios.post('api/v1/submit_speaking_answers/', [answers, state.doneMockId])
        })]

        promises = [...promises, knex.select('*').from('tpousers_userwritinganswers').where({
            user_test_id: state.doneMockUserTestId
        }).then(async (rows) => {
            let answers = {};
            for (let i = 0; i < rows.length; i++) {
                answers[rows[i]['question_id']] = rows[i]['answer']
            }
            await axios.post('api/v1/submit_writing_answers/', [answers, state.doneMockId]).then(() => {
            })
        })]
        return Promise.all(promises).then(async () => {
            await knex('*').from('tpousers_testuser').where({id: state.doneMockUserTestId}).then(async (rows)=>{
                if(rows.length === 1){
                    let readingScore = rows[0]['reading_score']
                    let listeningScore = rows[0]['listening_score']
                    await axios.post('api/v1/submit_mock_done/', {'id': state.doneMockId, 'reading': readingScore, 'listening': listeningScore}).then(async () =>{
                        await knex('tpousers_testuser').where({id: state.doneMockUserTestId}).update({'sent': true}).then(() => {})
                    })
                }
            })

        })

    },
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
            for (let i = 0; i < rows.length; i++) {
                commit('updateLocalMockList', rows[i].id)
            }
        })
    }
};
const mutations = {
    'updateDoneUnSentList': (state, payload) => {
        state.doneUnSentList.push(payload['test_id'])
        state.doneUserTestIds[payload['test_id']] = payload['id']
    },
    'updateMockExams': (state, payload) => {
        state.mockList = payload;
    },
    'updateMockResult': (state, payload) => {
        state.mockResultList = payload;
    },
    'updateLocalMockList': (state, payload) => {
        state.localMockList.push(payload)
    },
    'updateMockIds': (state, payload) => {
        state.doneMockId = payload[0]
        state.doneMockUserTestId = payload[1]
    },
    'updateDoneMocksList': (state, payload) => {
        state.doneMocksList.push(payload['test_id'])
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}