import {USER_REQUEST, USER_ERROR, USER_SUCCESS} from "../actions/user";
import {AUTH_LOGOUT} from "../actions/auth";
import axios from 'axios'

const state = {userId: 0, firstName: null, lastName: null, email: null, phone: null};

const getters = {
    getProfile: state => state.profile,
    getId: state => state.user_id,
};

const actions = {
    [USER_REQUEST]: ({commit, dispatch}) => {
        commit(USER_REQUEST);
         return new Promise((resolve, reject) => {
            axios.get('http://127.0.0.1:8000/api/v1/profile/').then((resp) => {
                commit(USER_SUCCESS, resp.data);
                localStorage.setItem('user-id', resp.data['id']);
                let knex = require('knex')({
                    client: 'sqlite3',
                    connection: {
                        filename: './db.sqlite3'
                    },
                    useNullAsDefault: true
                });
                knex('institutions_users').select('*').where({'id': resp.data['id']}).then(function (rows) {
                    if (rows.length===0) {
                        knex('institutions_users').insert({
                            id: resp.data['id'],
                            first_name: resp.data['first_name'],
                            last_name: resp.data['last_name'],
                            phone: resp.data['phone'],
                            email: resp.data['email']
                        })
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
        state.username = resp['username']
        state.userId = resp['id']
        state.firstName = resp['first_name']
        state.lastName = resp['lastName']
        state.phone = resp['phone']
        state.email = resp['email']
    },
    [USER_ERROR]: state => {
        state.status = "error";
    },
    [AUTH_LOGOUT]: state => {
        state.username = null;
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