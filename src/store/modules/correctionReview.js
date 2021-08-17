import {
    GET_CORRECTION_REVIEW_DATA, SEND_CORRECTOR_REVIEW,
    SET_CORRECTION_REVIEW_PARAMETERS
} from "../actions/correctionReview";
import axios from 'axios';

const state = {
    correctionId: 0,
    correctionType: 'writing',
    reviewModel: {}
};
const getters = {
    reviewModel: state => state.reviewModel,
    correctionType: state => state.correctionType
};
const actions = {
    [SET_CORRECTION_REVIEW_PARAMETERS]:({commit}, payload) => {
        commit('updateCorrectionReviewParameters', payload)
    },
    [GET_CORRECTION_REVIEW_DATA]: ({state, commit}) => {
        return new Promise((resolve, reject) => {
            axios.get(`api/v1/correction_review`, {
                params: {
                    id: state.correctionId,
                    type: state.correctionType,
                }
            }).then((resp) => {
                commit('updateReviewModel', resp.data)
                resolve()
            }).catch((err) => {
                reject(err)
            })
        })
    },
    // eslint-disable-next-line no-unused-vars
    [SEND_CORRECTOR_REVIEW]: ({_}, payload) =>{
        console.log(payload)
        return axios.post('api/v1/corrector_rating', payload)
    }
};
const mutations = {
    updateCorrectionReviewParameters(state, payload) {
      state.correctionId = payload['id']
      state.correctionType = payload['type']
    },
    updateReviewModel(state, payload) {
        state.reviewModel = payload
    }
};

export default {
    state,
    getters,
    actions,
    mutations
}