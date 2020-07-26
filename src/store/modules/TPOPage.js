import {GET_ONLINE_TPO_LIST, GET_LOCAL_TPO_LIST} from "@/store/actions/TPOPage";
import axios from 'axios'

const state = {
    onlineTPOList: [],
    localTPOList: [],
};
const getters = {
    onlineTPOList: state => state.onlineTPOList,
    localTPOListId: state => state.localTPOList.map((val) => {return val.id}),
    localTPOList: state => state.localTPOList
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
        var knex = require('knex')({
            client: 'sqlite3',
            connection: {
                filename: './db.sqlite3'
            },
            useNullAsDefault: true
        });
        let result = knex.select("*").from('tpo_test').where({mode: 'T'}).orWhere({mode: 'P'});
        result.then((row) => {
            for(let i=0; i < row.length; i++){
                commit('updateLocalTPOList', row[i])
            }
        })
    }
};
const mutations = {
    resetLocalTPOList(state){
        state.localTPOList = []
    },
    updateOnlineTPOList(state, payload){
       state.onlineTPOList = payload
    },
    updateLocalTPOList(state, payload){
        let tpoObject = {}
        tpoObject['mode'] = payload['mode']
        tpoObject['title'] = payload['title']
        tpoObject['code'] = payload['code']
        tpoObject['id'] = payload['id']
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
