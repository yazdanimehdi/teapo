import {
    GET_ONLINE_TPO_LIST,
    GET_LOCAL_TPO_LIST,
    CHECK_EXISTING_USER_TEST,
} from "../actions/TPOPage";
import axios from 'axios'

let knex = require('../../db/knex')

const state = {
    onlineTPOList: [],
    localTPOList: [],
    tpoId: 0,
};
const getters = {
    onlineTPOList: (state) => {
        let myList = []
        let localIds = state.localTPOList.map((val) => {
            return val.id
        })
        for (let i = 0; i < state.onlineTPOList.length; i++) {
            if (localIds.indexOf(state.onlineTPOList[i]['id']) === -1) {
                myList.push(state.onlineTPOList[i])
            }
        }
        return myList;
    },
    localTPOListId: state => state.localTPOList.map((val) => {
        return val.id
    }),
    localTPOList: state => state.localTPOList,
    getTPOById: (state) => (id) => {
        return state.localTPOList.find(TPO => TPO.id === id)
    }
};
const actions = {
    // eslint-disable-next-line no-unused-vars
    [CHECK_EXISTING_USER_TEST]: ({_}, payload) => {
        return new Promise((resolve) => {
            let tpoId = payload[0]
            let examArray = payload[1]
            let mode = payload[2]
            let array_slot_1 = null
            let array_slot_2 = null
            let array_slot_3 = null
            let array_slot_4 = null
            if (examArray.length === 1) {
                array_slot_1 = examArray[0]
            }
            if (examArray.length === 2) {
                array_slot_1 = examArray[0]
                array_slot_2 = examArray[1]
            }
            if (examArray.length === 3) {
                array_slot_1 = examArray[0]
                array_slot_2 = examArray[1]
                array_slot_3 = examArray[2]
            }
            if (examArray.length === 4) {
                array_slot_1 = examArray[0]
                array_slot_2 = examArray[1]
                array_slot_3 = examArray[2]
                array_slot_4 = examArray[3]
            }
            let userId = localStorage.getItem('user-id')
            knex.select('*').from('tpousers_testuser').where({
                user_id: userId,
                test_id: tpoId,
                array_slot_1: array_slot_1,
                array_slot_2: array_slot_2,
                array_slot_3: array_slot_3,
                array_slot_4: array_slot_4,
                is_done: false,
                mode: mode
            }).then((row) => {
                if (row.length === 0) {
                    resolve({isAvailable: false})
                } else {
                    resolve({isAvailable: true, userTestId: row[0]['id']})
                }
            })
        })
    },
    [GET_ONLINE_TPO_LIST]: ({commit}) => {
        return new Promise((resolve, reject) => {
            axios.get('api/v1/tpo_list/').then((resp) => {
                commit('updateOnlineTPOList', resp.data)
                resolve(resp)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    [GET_LOCAL_TPO_LIST]: ({commit}) => {
        commit('resetLocalTPOList')
        let userId = localStorage.getItem('user-id')
        let result = knex.select("*").from('tpo_test').where({mode: 'T'}).orWhere({mode: 'P'});
        return new Promise((resolve) => {
            result.then(async (row) => {
                for (let i = 0; i < row.length; i++) {
                    let readingCompleted = false;
                    let listeningCompleted = false;
                    let speakingCompleted = false;
                    let writingCompleted = false;
                    let readingScore = 0;
                    let listeningScore = 0;
                    let speakingScore = 0;
                    let writingScore = 0;
                    await knex.select("*").from('tpousers_testuser').where({
                        user_id: userId,
                        test_id: row[i]['id'],
                    }).then(async (userTests) => {
                        for (let j = 0; j < userTests.length; j++) {
                            await knex.select("*").from('tpousers_userreadinganswers').where({
                                user_test_id: userTests[j]['id'],
                            }).then((reading) => {
                                if (reading.length !== 0) {
                                    readingCompleted = true
                                }
                            })
                            await knex.select("*").from('tpousers_userlisteninganswers').where({
                                user_test_id: userTests[j]['id'],
                            }).then((listening) => {
                                if (listening.length !== 0) {
                                    listeningCompleted = true
                                }
                            })
                            await knex.select("*").from('tpousers_userspeakinganswers').where({
                                user_test_id: userTests[j]['id'],
                            }).then((speaking) => {
                                if (speaking.length !== 0) {
                                    speakingCompleted = true
                                }
                            })
                            await knex.select("*").from('tpousers_userwritinganswers').where({
                                user_test_id: userTests[j]['id'],
                            }).then((writing) => {
                                if (writing.length !== 0) {
                                    writingCompleted = true
                                }
                            })
                            if (userTests[j]['reading_score'] > readingScore) {
                                readingScore = userTests[j]['reading_score']
                            }
                            if (userTests[j]['listening_score'] > listeningScore) {
                                listeningScore = userTests[j]['listening_score']
                            }
                            if (userTests[j]['speaking_score'] > speakingScore) {
                                speakingScore = userTests[j]['speaking_score']
                            }
                            if (userTests[j]['writing_score'] > writingScore) {
                                writingScore = userTests[j]['writing_score']
                            }
                        }

                    }).then(() => {
                        commit('updateLocalTPOList', {
                            'test': row[i],
                            'scores': {
                                'readingCompleted': readingCompleted,
                                'listeningCompleted': listeningCompleted,
                                'speakingCompleted': speakingCompleted,
                                'writingCompleted': writingCompleted,
                                'readingScore': readingScore,
                                'listeningScore': listeningScore,
                                'speakingScore': speakingScore,
                                'writingScore': writingScore,
                            }
                        })
                    })
                }
                resolve()
            })
        })
    }
};
const mutations = {
    resetLocalTPOList(state) {
        state.localTPOList = []
    },
    updateOnlineTPOList(state, payload) {
        state.onlineTPOList = payload
    },
    updateLocalTPOList(state, payload) {
        let tpoObject = {}
        tpoObject['mode'] = payload['test']['mode']
        tpoObject['title'] = payload['test']['title']
        tpoObject['code'] = payload['test']['code']
        tpoObject['id'] = payload['test']['id']
        tpoObject['readingCompleted'] = payload['scores']['readingCompleted']
        tpoObject['listeningCompleted'] = payload['scores']['listeningCompleted']
        tpoObject['speakingCompleted'] = payload['scores']['speakingCompleted']
        tpoObject['writingCompleted'] = payload['scores']['writingCompleted']
        tpoObject['readingScore'] = payload['scores']['readingScore']
        tpoObject['listeningScore'] = payload['scores']['listeningScore']
        tpoObject['speakingScore'] = payload['scores']['speakingScore']
        tpoObject['writingScore'] = payload['scores']['writingScore']
        tpoObject['paid'] = true

        let localIds = state.localTPOList.map((val) => {
            return val.id
        })

        if (localIds.indexOf(tpoObject['id']) === -1) {
            state.localTPOList.push(tpoObject)
        }
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
