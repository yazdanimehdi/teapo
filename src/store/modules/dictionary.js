import {
    LOAD_DICTIONARY,
    LOAD_THESAURUS,
    LOAD_WORD_FAMILY,
    LOAD_ETYMOLOGY,
    LOAD_OTHER_EXAMPLES,
    RESET_ALL_DICT_ITEMS
} from "../actions/dictionary";

let knex = require('../../db/dictionary')

const state = {
    word: '',
    wildCardSuggestion: [],
    wordDefinition: [],
    wordFamily: [],
    wordThesaurus: [],
    wordOtherExamples: [],
    wordExamples: [],
    wordEtymology: [],
    wordCollocations: [],
    isLoaded: false,
};

const actions = {
    [LOAD_THESAURUS]: ({commit}, payload) => {
        let wordThesaurus = knex.select("*").from('longman_thesaurus').where({'definition_id': payload})
        wordThesaurus.then(function (rows) {
            for (let i = 0; i < rows.length; i++) {
                let thesaurusDict = {};
                let examples = knex.select("*").from('longman_thesaurusexample').where({'thesaurus_id': rows[i]['id']});
                examples.then(function (example) {
                    thesaurusDict['examples'] = example
                })
                thesaurusDict['thesaurus'] = rows[i]
                commit('updateWordThesaurus', thesaurusDict)
            }
        })

    },
    [LOAD_OTHER_EXAMPLES]: ({commit}, payload) => {
        let wordOtherExamples = knex.select("*").from('longman_otherexamples').where({'definition_id': payload})
        wordOtherExamples.then(function (rows) {
            commit('updateWordOtherExamples', rows);
        })

    },
    [LOAD_ETYMOLOGY]: ({commit}, payload) => {
        let wordEtymology = knex.select("*").from('longman_etymology').where({'definition_id': payload})
        wordEtymology.then(function (rows) {
            commit('updateWordEtymology', rows);
        })

    },
    [LOAD_WORD_FAMILY]: ({commit}, payload) => {
        let wordFamily = knex.select("*").from('longman_wordfamily').where({'definition_id': payload})
        wordFamily.then(function (rows) {
            commit('updateWordFamily', rows);
        })

    },
    [LOAD_DICTIONARY]: ({commit, dispatch}, payload) => {
        dispatch(RESET_ALL_DICT_ITEMS)
        let result = knex.select("*").from('longman_words').where({'word': payload});
        result.then(
            function (row) {
                if (row.length === 0) {

                    for (let i = 0; i < payload.length / 2; i++) {

                        let wildcard = knex.select("*").from('longman_words').where('word', 'like', `${payload.slice(0, payload.length - i)}%`)
                        wildcard.then(function (wildcards) {
                            commit('updateWildCardList', wildcards)

                        })
                    }

                }
                if (row.length === 1) {
                    commit('updateWord', payload)
                    let wordDefinition = knex.select("*").from('longman_definitions').where({'word_id': row[0]['id']})
                    wordDefinition.then(function (defs) {
                        for (let i = 0; i < defs.length; i++) {
                            let defDict = {};
                            defDict['def'] = defs[i];
                            dispatch(LOAD_THESAURUS, defs[i]['id']);
                            dispatch(LOAD_ETYMOLOGY, defs[i]['id']);
                            dispatch(LOAD_WORD_FAMILY, defs[i]['id']);
                            dispatch(LOAD_OTHER_EXAMPLES, defs[i]['id']);
                            let wordMeaning = knex.select("*").from('longman_meaning').where({'definition_fk_id': defs[i]['id']})
                            wordMeaning.then(function (mean) {
                                commit('updateWordDefinition', [mean, defs[i]])
                                for (let j = 0; j < mean.length; j++) {
                                    let examples = knex.select("*").from('longman_examples').where({'definition_id': mean[j]['id']})
                                    examples.then(function (example) {
                                        commit('updateWordExamples', example);
                                    })
                                }
                            })
                        }
                    })
                }
            })
    },
    [RESET_ALL_DICT_ITEMS]: ({commit}) => {
        commit('resetAll');
    }
};

const mutations = {
    resetAll(state) {
        state.word = '';
        state.wildCardSuggestion = [];
        state.wordDefinition = [];
        state.wordFamily = [];
        state.wordThesaurus = [];
        state.wordOtherExamples = [];
        state.wordExamples = [];
        state.wordEtymology = [];
        state.wordCollocations = [];
        state.isLoaded = false;
    },
    updateWildCardList(state, payload) {
        for (let i = 0; i < payload.length; i++) {
            if (state.wildCardSuggestion.indexOf(payload[i]['word']) === -1) {
                state.wildCardSuggestion.push(payload[i]['word']);
            }
        }

    },
    updateWordDefinition(state, payload) {
        state.wordDefinition.push({'meanings': payload[0], 'def': payload[1]});
    },
    updateWordThesaurus(state, payload) {
        state.wordThesaurus.push(payload);
    },
    updateWordFamily(state, payload) {
        state.wordFamily = payload;
    },
    updateWordOtherExamples(state, payload) {
        state.wordOtherExamples = payload;
    },
    updateWordEtymology(state, payload) {
        state.wordEtymology = payload;
    },
    updateWord(state, payload) {
        state.word = payload
    },
    updateWordExamples(state, payload) {
        state.wordExamples.push(payload);
    }
};

export default {
    state,
    actions,
    mutations
};