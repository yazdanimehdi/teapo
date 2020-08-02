import {GET_ONLINE_TPO_LIST, GET_LOCAL_TPO_LIST, GO_TO_TPO_PAGE} from "@/store/actions/TPOPage";
import axios from 'axios'

const state = {
    onlineTPOList: [],
    localTPOList: [],
    tpoId: 0,
    mode: 'practice',
};
const getters = {
    onlineTPOList: (state) => {
        let myList = []
        let localIds = state.localTPOList.map((val) => {
            return val.id
        })
        for(let i = 0; i < state.onlineTPOList.length; i++){
            if(localIds.indexOf(state.onlineTPOList[i]['id']) === -1){
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
    [GO_TO_TPO_PAGE]: ({commit}, payload) => {
        commit('updateGoToTPO', payload);
    },
    [GET_ONLINE_TPO_LIST]: ({commit}) => {
        return new Promise((resolve, reject) => {
            axios.get('http://127.0.0.1:8000/api/v1/tpo_list/').then((resp) => {
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
        var knex = require('knex')({
            client: 'sqlite3',
            connection: {
                filename: './db.sqlite3'
            },
            useNullAsDefault: true
        });
        let result = knex.select("*").from('tpo_test').where({mode: 'T'}).orWhere({mode: 'P'});
        return new Promise((resolve) => {
            result.then((row) => {
                for (let i = 0; i < row.length; i++) {
                    let readingCompleted = false;
                    let listeningCompleted = false;
                    let speakingCompleted = false;
                    let writingCompleted = false;
                    let readingScore = 0;
                    let listeningScore = 0;
                    let speakingScore = 0;
                    let writingScore = 0;
                    knex.select("*").from('tpousers_testuser').where({
                        user_id: userId,
                        test_id: row[i]['id'],
                        is_done: true
                    }).then((userTests) => {
                        for (let j = 0; j < userTests.length; j++) {
                            if (userTests[j]['is_done'] === true) {
                                knex.select("*").from('tpousers_testuserreading').where({
                                    test_user_id: userTests[j]['id'],
                                }).then((reading) => {
                                    if (reading.length !== 0) {
                                        readingCompleted = true
                                    }
                                })
                                knex.select("*").from('tpousers_testuserlistening').where({
                                    test_user_id: userTests[j]['id'],
                                }).then((listening) => {
                                    if (listening.length !== 0) {
                                        listeningCompleted = true
                                    }
                                })
                                knex.select("*").from('tpousers_testuserspeaking').where({
                                    test_user_id: userTests[j]['id'],
                                }).then((speaking) => {
                                    if (speaking.length !== 0) {
                                        speakingCompleted = true
                                    }
                                })
                                knex.select("*").from('tpousers_testuserwriting').where({
                                    test_user_id: userTests[j]['id'],
                                }).then((writing) => {
                                    if (writing.length !== 0) {
                                        writingCompleted = true
                                    }
                                })
                            }
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

                    })
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
                }
                return resolve(row)
            })
        })
    }
};
const mutations = {
    updateGoToTPO(state, payload) {
        state.tpoId = payload[0]
        state.mode = payload[1]
    },
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
        state.localTPOList.push(tpoObject)
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
