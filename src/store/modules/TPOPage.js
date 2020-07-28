import {GET_ONLINE_TPO_LIST, GET_LOCAL_TPO_LIST} from "@/store/actions/TPOPage";
import axios from 'axios'

const state = {
    onlineTPOList: [],
    localTPOList: [],
};
const getters = {
    onlineTPOList: state => state.onlineTPOList,
    localTPOListId: state => state.localTPOList.map((val) => {
        return val.id
    }),
    localTPOList: state => state.localTPOList,
    getTPOById: (state) => (id) => {
        return state.localTPOList.find(TPO => TPO.id === id)
    }
};
const actions = {
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
                    let readingScoreSum = 0;
                    let readingCount = 0;
                    let listeningScoreSum = 0;
                    let listeningCount = 0;
                    let speakingScoreSum = 0;
                    let speakingCount = 0;
                    let writingScoreSum = 0;
                    let writingCount = 0;
                    for (let j = 0; j < userTests.length; j++) {
                        knex.select("*").from('tpousers_testuserreading').where({
                            test_user_id: userTests[j]['id'],
                        }).then((reading) => {
                            readingCount += reading.length;
                            if (reading.length !== 0) {
                                readingCompleted = true
                                readingScoreSum += reading['score']
                            }
                        })
                        knex.select("*").from('tpousers_testuserlistening').where({
                            test_user_id: userTests[j]['id'],
                        }).then((listening) => {
                            listeningCount += listening.length;
                            if (listening.length !== 0) {
                                listeningCompleted = true
                                listeningScoreSum += listening['score']
                            }
                        })
                        knex.select("*").from('tpousers_testuserspeaking').where({
                            test_user_id: userTests[j]['id'],
                        }).then((speaking) => {
                            speakingCount += speaking.length;
                            if (speaking.length !== 0) {
                                speakingCompleted = true
                                speakingScoreSum += speaking['score']
                            }
                        })
                        knex.select("*").from('tpousers_testuserwriting').where({
                            test_user_id: userTests[j]['id'],
                        }).then((writing) => {
                            writingCount += writing.length
                            if (writing.length !== 0) {
                                writingCompleted = true
                                writingScoreSum += writing['score']
                            }
                        })
                    }
                    if (readingCompleted === true) {
                        readingScore = readingScoreSum / readingCount
                    }
                    if (listeningCompleted === true) {
                        listeningScore = listeningScoreSum / listeningCount
                    }
                    if (speakingCompleted === true) {
                        speakingScore = speakingScoreSum / speakingCount
                    }
                    if (writingCompleted === true) {
                        writingScore = writingScoreSum / writingCount
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
        state.localTPOList.push(tpoObject)
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};
