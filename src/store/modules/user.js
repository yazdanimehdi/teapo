import {USER_REQUEST, USER_ERROR, USER_SUCCESS, GET_USER_DATA} from "../actions/user";
import {AUTH_LOGOUT} from "../actions/auth";
import axios from 'axios'

let knex = require('../../db/knex')
const state = {userId: 0, firstName: null, lastName: null, email: null, phone: null};

const getters = {
    getProfile: state => state.profile,
    getId: state => state.userId,
};

const actions = {
    [GET_USER_DATA]: ({commit}) => {
        let userId = localStorage.getItem('user-id');
        knex('institutions_users').select('*').where({'id': userId}).then(function (rows) {
            if(rows.length !== 0) {
                commit(USER_SUCCESS, rows[0])
            }
        })

    },

    [USER_REQUEST]: ({commit, dispatch}) => {
        commit(USER_REQUEST);
         return new Promise((resolve, reject) => {
            axios.get('api/v1/profile/').then((resp) => {
                console.log(resp.data)
                commit(USER_SUCCESS, resp.data);
                localStorage.setItem('user-id', resp.data['id']);
                knex('institutions_users').select('*').where({'id': resp.data['id']}).then(function (rows) {
                    if (rows.length===0) {
                        knex('institutions_users').insert({
                            id: resp.data['id'],
                            first_name: resp.data['first_name'],
                            last_name: resp.data['last_name'],
                            phone: resp.data['phone'],
                            email: resp.data['email']
                        }).then(() => {})
                    }
                })

                resolve(resp)
            }).catch((err) => {
                 commit(USER_ERROR);
                // if resp is unauthorized, logout, to
                dispatch(AUTH_LOGOUT);
                reject(err)
            })
        })
    },
};

const mutations = {
    [USER_REQUEST]: state => {
        state.status = "loading";
    },
    [USER_SUCCESS]: (state, resp) => {
        state.status = "success";
        state.userId = resp['id']
        state.firstName = resp['first_name']
        state.lastName = resp['last_name']
        state.phone = resp['phone']
        state.email = resp['email']
    },
    [USER_ERROR]: state => {
        state.status = "error";
    },
    [AUTH_LOGOUT]: state => {
        state.userId = null;
        state.firstName = null;
        state.lastName = null;
        state.phone = null;
        state.email = null;
    }
};

export default {
    state,
    getters,
    actions,
    mutations
};