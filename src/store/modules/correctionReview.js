import {
    GET_CORRECTION_REVIEW_DATA,
    SET_CORRECTION_REVIEW_PARAMETERS
} from "@/store/actions/correctionReview";
import axios from 'axios';

const state = {
    correctionId: 0,
    correctionType: 'writing',
    reviewModel: {}
};
const getters = {
    reviewModel: state => state.reviewModel
};
const actions = {
    [SET_CORRECTION_REVIEW_PARAMETERS]:({commit}, payload) => {
        commit('updateCorrectionReviewParameters', payload)
    },
    [GET_CORRECTION_REVIEW_DATA]: ({state, commit}) => {
        return new Promise((resolve, reject) => {
            axios.get(`http://127.0.0.1:8000/api/v1/correction_review`, {
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