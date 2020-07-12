import {
    ADD_NEW_WORD,
    GET_STUDY_WORDS,
    START_STUDY_LEARNING,
    GO_TO_NEXT_LEARNING_WORD,
    START_SPEED_REVIEW,
    GET_RANDOM_WORDS,
    GO_TO_NEXT_SPEED_REVIEW,
    START_REVIEW,
    GO_TO_NEXT_REVIEW
} from "@/store/actions/studyWords";

const state = {
    words: [],
    examples: [],
    learningList: [],
    learningSession: [],
    learningExampleList: [],
    reviewList: [],
    loaded: false,
    randomWords: [],
    randomDefs: [],
    denominator: 0,
    SpeedReviewSession: [],
    reviewSession: [],
};

const getters = {
    learntWordsCount: state => {
        let items = 0;
        for (let i = 0; i < state.words.length; i++) {
            if (state.words[i]['label'] !== 'Learning') {
                items += 1
            }
        }
        return items
    },
    studyWordsItems: state => {
        let items = [];
        for (let i = 0; i < state.words.length; i++) {
            items.push({
                'name': state.words[i]['word'],
                'definition': state.words[i]['definition'],
                'label': state.words[i]['label'],
                'examples': state.examples[i]
            })
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
    [START_REVIEW]: ({commit, dispatch}) => {
        if (state.words.length <= 8) {
            dispatch(GET_RANDOM_WORDS);
        }
        commit('updateReviewSession')
    },
    [GO_TO_NEXT_REVIEW]: ({state, dispatch}, payload) => {
        if (state.words.length <= 8) {
            dispatch(GET_RANDOM_WORDS);
        }
        let knex = require('knex')({
            client: 'sqlite3',
            connection: {
                filename: './db.sqlite3'
            },
            useNullAsDefault: true
        });
        if (payload['correct']) {
            knex('tpo_studywords').where({'id': payload['word']['id']}).update({
                'correct_times': payload['word']['correct_times'] + 1,
                'last_date': Date.now(),
                'label': 'Master'
            }).then(
                function () {
                    console.log('done')
                }
            )

        } else {
            knex('tpo_studywords').where({'id': payload['word']['id']}).update({
                'uncorrect_times': payload['word']['uncorrect_times'] + 1,
                'label': 'Difficult',
                'last_date': Date.now(),
                'state': 0,

            }).then(
                function () {
                    console.log('done')
                }
            )

        }

    },
    [GO_TO_NEXT_SPEED_REVIEW]: ({state, dispatch}, payload) => {
        if (state.words.length <= 8) {
            dispatch(GET_RANDOM_WORDS);
        }
        let knex = require('knex')({
            client: 'sqlite3',
            connection: {
                filename: './db.sqlite3'
            },
            useNullAsDefault: true
        });
        if (payload['correct']) {
            knex('tpo_studywords').where({'id': payload['word']['id']}).update({
                'correct_times': payload['word']['correct_times'] + 1,
                'last_date': Date.now()
            }).then(
                function () {
                    console.log('done')
                }
            )

        } else {
            knex('tpo_studywords').where({'id': payload['word']['id']}).update({
                'uncorrect_times': payload['word']['uncorrect_times'] + 1,
                'label': 'Difficult',
                'last_date': Date.now(),
                'state': 0,

            }).then(
                function () {
                    console.log('done')
                }
            )

        }
    },

    [GET_RANDOM_WORDS]: ({commit}) => {
        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min;
        }

        let dict = require('knex')({
            client: 'sqlite3',
            connection: {
                filename: 'longman.sqlite3'
            },
            useNullAsDefault: true
        });
        for (let i = 0; i < 8; i++) {
            let result = dict.select("word").from('longman_words').where({'id': getRandomInt(10642, 52740)});
            result.then(function (word) {
                commit('updateRandomWords', word[0]['word'])
            })
        }
        for (let i = 0; i < 8; i++) {
            let result = dict.select("meaning").from('longman_meaning').where({'id': getRandomInt(1, 101133)});
            result.then(function (definition) {
                commit('updateRandomDefs', definition[0]['meaning'])
            })
        }
    },
    [START_SPEED_REVIEW]: ({state, commit, dispatch}) => {
        dispatch(GET_RANDOM_WORDS);
        dispatch(GET_STUDY_WORDS).then(function () {
            if (state.words.length <= 30) {
                for (let i = 0; i < state.words.length; i++) {
                    commit('updateSpeedReviewSession', state.words[i]);
                }
            } else {
                let newRow = [...state.words];
                while (state.SpeedReviewSession.length <= 30) {
                    let rand = Math.floor(Math.random() * newRow.length);
                    commit('updateSpeedReviewSession', newRow[rand]);
                    newRow.splice(rand, 1)
                }
            }
        })
    },

    [GO_TO_NEXT_LEARNING_WORD]: ({commit, dispatch}, payload) => {
        let knex = require('knex')({
            client: 'sqlite3',
            connection: {
                filename: './db.sqlite3'
            },
            useNullAsDefault: true
        });
        dispatch(GET_RANDOM_WORDS);
        if (payload['word']['state'] === 0) {
            commit('updateStateWordsList', {'word': payload['word'], 'state': 1})
            knex('tpo_studywords').where({'id': payload['word']['id']}).update({'state': 1}).then(
                function () {
                    console.log('done')
                }
            )
        } else {
            if (payload['correct'] === true) {
                if (payload['correct'] === true && payload['word']['state'] <= 4) {
                    commit('updateStateWordsList', {'word': payload['word'], 'state': payload['word']['state'] + 1})
                    commit('updateCorrectWordsList', {
                        'word': payload['word'],
                        'correct_times': payload['word']['correct_times'] + 1
                    })
                    knex('tpo_studywords').where({'id': payload['word']['id']}).update(
                        {
                            'state': payload['word']['state'] + 1,
                            'correct_times': payload['word']['correct_times'] + 1,
                        }).then(function () {
                        console.log('done')
                    })
                } else {
                    console.log(payload['word']['state']);
                    commit('updateLabelWordsList', {'word': payload['word']})
                    knex('tpo_studywords').where({'id': payload['word']['id']}).update(
                        {
                            'label': 'Master',
                            'correct_times': payload['word']['correct_times'] + 1,
                            'last_date': Date.now()
                        }).then(function () {
                        console.log('done')
                    })
                }
            } else {
                commit('updateStateWordsList', {'word': payload['word'], 'state': 0})
                commit('updateUncorrectWordsList', {
                    'word': payload['word'],
                    'uncorrect_times': payload['word']['uncorrect_times'] + 1
                })
                knex('tpo_studywords').where({'id': payload['word']['id']}).update(
                    {
                        'state': 0,
                        'uncorrect_times': payload['word']['uncorrect_times'] + 1,
                    }).then(function () {
                    console.log('done')
                })
            }
        }

    },
    [START_STUDY_LEARNING]: ({state, commit, dispatch}) => {
        dispatch(GET_RANDOM_WORDS);
        dispatch(GET_STUDY_WORDS).then(function () {
            for (let i = 0; i < state.words.length; i++) {
                if (state.words[i]['label'] === 'Learning') {
                    commit('updateLearningList', state.words[i]);
                    commit('updateLearningExampleList', state.examples[i])
                }
            }
            commit('updateLearningSession')
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
                if (row[i]['label'] === 'Reviewing') {
                    commit('updateReviewList', row[i]);
                } else {
                    if (row[i]['correct_times'] + row[i]['uncorrect_times'] < 5) {
                        if ((Date.now() - row[i]['last_date']) * 1.15741e-8 > 2) {
                            commit('updateReviewList', row[i]);
                            knex('tpo_studywords').where({'id': row[i]['id']}).update(
                                {
                                    'label': 'Reviewing',
                                }).then(function () {
                                console.log('done')
                            })
                        }
                    } else {
                        if (row[i]['label'] === 'Master') {
                            if (row[i]['correct_times'] / (row[i]['correct_times'] + row[i]['uncorrect_times']) < 0.3) {
                                if ((Date.now() - row[i]['last_date']) * 1.15741e-8 > 1) {
                                    commit('updateReviewList', row[i]);
                                    knex('tpo_studywords').where({'id': row[i]['id']}).update(
                                        {
                                            'label': 'Reviewing',
                                        }).then(function () {
                                        console.log('done')
                                    })
                                }
                            }
                            if (0.3 <= row[i]['correct_times'] / (row[i]['correct_times'] + row[i]['uncorrect_times']) < 0.6) {
                                if ((Date.now() - row[i]['last_date']) * 1.15741e-8 > 3) {
                                    commit('updateReviewList', row);
                                    knex('tpo_studywords').where({'id': row[i]['id']}).update(
                                        {
                                            'label': 'Reviewing',
                                        }).then(function () {
                                        console.log('done')
                                    })
                                }
                            }

                            if (0.6 <= row[i]['correct_times'] / (row[i]['correct_times'] + row[i]['uncorrect_times']) < 0.9) {
                                if ((Date.now() - row[i]['last_date']) * 1.15741e-8 > 7) {
                                    commit('updateReviewList', row[i]);
                                    knex('tpo_studywords').where({'id': row[i]['id']}).update(
                                        {
                                            'label': 'Reviewing',
                                        }).then(function () {
                                        console.log('done')
                                    })
                                }
                            }
                            if (0.9 <= row[i]['correct_times'] / (row[i]['correct_times'] + row[i]['uncorrect_times']) <= 1) {
                                if ((Date.now() - row[i]['last_date']) * 1.15741e-8 > 14) {
                                    commit('updateReviewList', row[i]);
                                    knex('tpo_studywords').where({'id': row[i]['id']}).update(
                                        {
                                            'label': 'Reviewing',
                                        }).then(function () {
                                        console.log('done')
                                    })
                                }
                            }

                        }
                    }
                }
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
                    correct_times: 0,
                    uncorrect_times: 0,
                    label: 'Learning',
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
    },
    updateStateWordsList(state, payload) {
        for (let i = 0; i < state.learningSession.length; i++) {
            if (state.learningSession[i] === payload['word']) {
                state.learningSession[i]['state'] = payload['state']
            }
        }
    },
    updateLabelWordsList(state, payload) {
        for (let i = 0; i < state.learningSession.length; i++) {
            if (state.learningSession[i] === payload['word']) {
                state.learningSession.splice(i, 1);
            }
        }
    },
    updateCorrectWordsList(state, payload) {
        for (let i = 0; i < state.learningSession.length; i++) {
            if (state.learningSession[i] === payload['word']) {
                state.learningSession[i]['correct_times'] = payload['correct_times'];
            }
        }
    },
    updateUncorrectWordsList(state, payload) {
        for (let i = 0; i < state.learningSession.length; i++) {
            if (state.learningSession[i] === payload['word']) {
                state.learningSession[i]['uncorrect_times'] = payload['uncorrect_times'];
            }
        }
    },
    updateRandomWords(state, payload) {
        state.randomWords.push(payload)
    },
    updateRandomDefs(state, payload) {
        state.randomDefs.push(payload)
    },
    updateLearningSession(state) {
        state.learningSession = state.learningList.slice(0, 5);
        for (let i = 0; i < state.learningSession.length; i++) {
            state.denominator += (6 - state.learningSession[i]['state'])
        }
    },
    updateSpeedReviewSession(state, payload) {
        state.SpeedReviewSession.push(payload);
    },
    updateReviewList(state, payload) {
        state.reviewList.push(payload);
    },
    updateReviewSession(state) {
        state.reviewSession = state.reviewList.slice(0, 10);
        state.denominator += state.reviewSession.length
    },
};


export default {
    state,
    getters,
    actions,
    mutations
}