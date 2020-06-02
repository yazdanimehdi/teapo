import {ADD_NEW_WORD, GET_STUDY_WORDS, START_STUDY_LEARNING} from "@/store/actions/studyWords";

const state = {
    words: [],
    examples: [],
    learningList: [],
    learningExampleList: [],
    loaded: false,
};

const getters = {
    studyWordsItems: state => {
        let items = [];
        for (let i = 0; i < state.words.length; i++) {
            items.push({'name': state.words[i]['word'], 'definition': state.words[i]['definition']})
        }
        return items
    },
    learningStateCount: state => {
        let items = 0;
        for (let i = 0; i < state.words.length; i++) {
            if (state.words[i]['label'] === 'Learning') {
                items += 1
            }
        }
        return items
    },

    reviewingStateCount: state => {
        let items = 0;
        for (let i = 0; i < state.words.length; i++) {
            if (state.words[i]['label'] === 'Reviewing') {
                items += 1
            }
        }
        return items
    },

    difficultStateCount: state => {
        let items = 0;
        for (let i = 0; i < state.words.length; i++) {
            if (state.words[i]['label'] === 'Difficult') {
                items += 1
            }
        }
        return items
    }

};

const actions = {
    [START_STUDY_LEARNING]: ({state, commit, dispatch}) => {
        commit('resetStudyAll')
        dispatch(GET_STUDY_WORDS).then(function () {
            for (let i = 0; i < state.words.length; i++) {
                if (state.words[i]['label'] === 'Learning') {
                    commit('updateLearningList', state.words[i]);
                    commit('updateLearningExampleList', state.examples[i])
                }
            }
        })

    },
    [GET_STUDY_WORDS]: ({commit}) => {
        let knex = require('knex')({
            client: 'sqlite3',
            connection: {
                filename: './db.sqlite3'
            },
            useNullAsDefault: true
        });
        let studyWords = knex.select('*').from('tpo_studywords')
        return studyWords.then(async function (row) {
            commit('updateWords', row)
            for (let i = 0; i < row.length; i++) {
                let examples = knex.select('*').from('tpo_studywordsexample').where({'tpo_sudywords_id': row[i]['id']})
                await examples.then(function (example) {
                    commit('updateExamples', example)
                })
            }
        }).then(
            commit('updateLoaded', true)
        )
    },
    // eslint-disable-next-line no-unused-vars
    [ADD_NEW_WORD]: ({state, dispatch}, payload) => {
        let knex = require('knex')({
            client: 'sqlite3',
            connection: {
                filename: './db.sqlite3'
            },
            useNullAsDefault: true
        });
        let studyWordSearch = knex.select('*').from('tpo_studywords').where({
            'word': payload['word'],
            'definition': payload['definition']
        })
        return studyWordSearch.then(function (row) {
            if (row.length === 0) {
                let studyWord = knex('tpo_studywords').insert({
                    word: payload['word'],
                    definition: payload['definition'],
                    seen: 0,
                    correct_times: 0,
                    uncorrect_times: 0,
                    label: 'Learning',
                    learning_progress: 0,
                    state: 0,
                })
                studyWord.then(function (id) {
                    dispatch(GET_STUDY_WORDS);
                    for (let i = 0; i < payload['examples'].length; i++) {
                        knex('tpo_studywordsexample').insert({
                            'tpo_sudywords_id': id[0],
                            'example': payload['examples'][i]['example']
                        }).then(function (id) {
                            dispatch(GET_STUDY_WORDS);
                            return id
                        })
                    }
                })
            } else {
                return false
            }
        })

    }
};

const mutations = {
    updateWords(state, payload) {
        state.words = payload;
    },
    updateExamples(state, payload) {
        state.examples.push(payload);
    },
    updateLoaded(state, payload) {
        state.loaded = payload;
    },
    updateLearningList(state, payload) {
        state.learningList.push(payload);
    },
    resetStudyAll(state) {
        state.words = [];
        state.examples = [];
        state.learningList = [];
        state.loaded = false;
    },
    updateLearningExampleList(state, payload) {
        state.learningExampleList.push(payload)
    }
};


export default {
    state,
    getters,
    actions,
    mutations
}