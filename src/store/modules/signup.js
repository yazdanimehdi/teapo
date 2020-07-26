import axios from 'axios'
import {
    SIGNUP_REQUEST,
    SIGNUP_SUCCESS,
    SIGNUP_ERROR
} from "../actions/signup";
import {AUTH_SUCCESS} from "../actions/auth";
import {USER_REQUEST} from "../actions/user";

const state = {
    signupStatus: 'false',
};

const actions = {
    [SIGNUP_REQUEST]: ({commit, dispatch}, payload) => {
         return new Promise((resolve, reject) => {
             axios.post('http://127.0.0.1:8000/api/v1/signup/', payload).then((resp) => {
                 commit(SIGNUP_SUCCESS);
                 const token = resp.data['token'];
                 axios.defaults.headers.common['Authorization'] = `Token ${token}`;
                 localStorage.setItem('user-token', token);
                 commit(AUTH_SUCCESS, token);
                 dispatch(USER_REQUEST);
                 resolve(resp)

             }).catch((err) => {
                 console.log(err);
                 commit(SIGNUP_ERROR);
                 reject(err)
             })
         })
    }
};

const mutations = {
    [SIGNUP_SUCCESS]: (state) => {
        state.signupStatus = 'true';
    },
    [SIGNUP_ERROR]: (state) =>{
         state.signupStatus = 'false';
    }
};

export default {
    state,
    actions,
    mutations
}