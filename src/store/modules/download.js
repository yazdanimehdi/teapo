import {DOWNLOAD_TPO} from "../actions/download";
import axios from 'axios';
import {GET_LOCAL_TPO_LIST} from "../actions/TPOPage";

let knex = require('../../db/knex')

const state = {
    percentCompleted: [],
};
const getters = {
    percentCompleted: (state) => (tpoId) => {
        if (state.percentCompleted.find(obj => obj['tpoId'] === tpoId) !== undefined){
            return state.percentCompleted.find(obj => obj['tpoId'] === tpoId)['percent']
        }
        else {
            return 0
        }
    }
};
const actions = {
    [DOWNLOAD_TPO]: ({commit, dispatch}, payload) => {
        return new Promise((resolve, reject) => {
            axios.get(`api/v1/test`, {
                params: {
                    id: payload
                },
                onDownloadProgress: (progressEvent) => {
                    let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    // commit('updateFileSize', [progressEvent.lengthComputable, payload])
                    commit('updatePercentCompleted', [percentCompleted, payload])
                }
            }).then((resp) => {
                let data = resp.data;
                knex('tpo_test').insert(
                    {
                        id: data['id'],
                        reading_time: data['reading_time'],
                        title: data['title'],
                        code: data['code'],
                        mode: data['mode'],
                        start_time: data['start_time'],
                        end_time: data['end_time'],
                        deadline: data['deadline'],
                        class_assigned_id: data['class_assigned_id'],
                        institute_id: data['institute_id']
                    }).then(() => {
                    dispatch(GET_LOCAL_TPO_LIST)
                });
                for (let i = 0; i < data['reading'].length; i++) {
                    knex('tpo_reading').select('id').where({'id': data['reading'][i]['id']}).then((row) => {
                        if (row.length === 0) {
                            knex('tpo_reading').insert({
                                id: data['reading'][i]['id'],
                                title: data['reading'][i]['title'],
                                passage: data['reading'][i]['passage']
                            }).then(() => {
                                for (let j = 0; j < data['reading'][i]['questions'].length; j++) {
                                    knex('tpo_readingquestions').insert({
                                        id: data['reading'][i]['questions'][j]['id'],
                                        question: data['reading'][i]['questions'][j]['question'],
                                        insertion_sentence: data['reading'][i]['questions'][j]['insertion_sentence'],
                                        related_paragraph: data['reading'][i]['questions'][j]['related_paragraph'],
                                        related_passage: data['reading'][i]['questions'][j]['related_passage'],
                                        question_type: data['reading'][i]['questions'][j]['question_type'],
                                        right_answer: data['reading'][i]['questions'][j]['right_answer'],
                                        reading_id: data['reading'][i]['id'],
                                        number: data['reading'][i]['questions'][j]['number']
                                    }).then(() => {
                                        for (let k = 0; k < data['reading'][i]['questions'][j]['answers'].length; k++) {
                                            knex('tpo_readinganswers').insert({
                                                id: data['reading'][i]['questions'][j]['answers'][k]['id'],
                                                answer: data['reading'][i]['questions'][j]['answers'][k]['answer'],
                                                code: data['reading'][i]['questions'][j]['answers'][k]['code'],
                                                question_id: data['reading'][i]['questions'][j]['id']
                                            }).then(() => {
                                            })
                                        }
                                    }).catch((err) => {
                                        console.log(err)
                                    })
                                }
                            })
                        }
                        knex('tpo_testreading').insert({
                            part: i + 1,
                            reading_id: data['reading'][i]['id'],
                            test_id: data['id']
                        }).then(() => {
                        })
                    })
                }

                for (let i = 0; i < data['listening'].length; i++) {
                    knex('tpo_listening').select('id').where({'id': data['listening'][i]['listening']['id']}).then((row) => {
                        if (row.length === 0) {
                            knex('tpo_listening').insert({
                                id: data['listening'][i]['listening']['id'],
                                listening: data['listening'][i]['listening']['listening'],
                                listening_image: data['listening'][i]['listening']['listening_image'],
                                title: data['listening'][i]['listening']['title'],
                                type: data['listening'][i]['listening']['type'],
                                transcript: data['listening'][i]['listening']['transcript']
                            }).then(() => {
                                for (let j = 0; j < data['listening'][i]['listening']['questions'].length; j++) {
                                    knex('tpo_listeningquestions').insert({
                                        question: data['listening'][i]['listening']['questions'][j]['question'],
                                        number: data['listening'][i]['listening']['questions'][j]['number'],
                                        quote: data['listening'][i]['listening']['questions'][j]['quote'],
                                        listening_question_audio_file: data['listening'][i]['listening']['questions'][j]['listening_question_audio_file'],
                                        quote_audio_file: data['listening'][i]['listening']['questions'][j]['quote_audio_file'],
                                        listening_id: data['listening'][i]['listening']['id'],
                                        right_answer: data['listening'][i]['listening']['questions'][j]['right_answer'],
                                        id: data['listening'][i]['listening']['questions'][j]['id']
                                    }).then(() => {
                                        for (let k = 0; k < data['listening'][i]['listening']['questions'][j]['answers'].length; k++) {
                                            knex('tpo_listeninganswers').insert({
                                                id: data['listening'][i]['listening']['questions'][j]['answers'][k]['id'],
                                                answer: data['listening'][i]['listening']['questions'][j]['answers'][k]['answer'],
                                                code: data['listening'][i]['listening']['questions'][j]['answers'][k]['code'],
                                                question_id: data['listening'][i]['listening']['questions'][j]['id']
                                            }).then(() => {
                                            })
                                        }

                                    })
                                }
                            })
                        }
                        knex('tpo_testlistening').insert({
                            test_id: data['id'],
                            listening_id: data['listening'][i]['listening']['id'],
                            part: data['listening'][i]['part'],
                            phase: data['listening'][i]['phase']
                        }).then(() => {
                        })
                    })
                }

                for (let i = 0; i < data['speaking'].length; i++) {
                    knex('tpo_speaking').select('id').where({'id': data['speaking'][i]['speaking']['id']}).then((row) => {
                        if (row.length === 0) {
                            knex('tpo_speaking').insert({
                                id: data['speaking'][i]['speaking']['id'],
                                speaking_audio_file: data['speaking'][i]['speaking']['speaking_audio_file'],
                                speaking_reading_title: data['speaking'][i]['speaking']['speaking_reading_title'],
                                speaking_reading: data['speaking'][i]['speaking']['speaking_reading'],
                                speaking_image: data['speaking'][i]['speaking']['speaking_image'],
                                speaking_question: data['speaking'][i]['speaking']['speaking_question'],
                                speaking_question_audio_file: data['speaking'][i]['speaking']['speaking_question_audio_file'],
                                speaking_question_guide_audio_file: data['speaking'][i]['speaking']['speaking_question_guide_audio_file'],
                                speaking_question_before_read_audio: data['speaking'][i]['speaking']['speaking_question_before_read_audio'],
                                speaking_audio_file_transcript: data['speaking'][i]['speaking']['speaking_audio_file_transcript'],
                                number: data['speaking'][i]['speaking']['number'],
                                sections: data['speaking'][i]['speaking']['sections'],
                            }).then(() => {
                            })
                        }
                    })
                    knex('tpo_testspeaking').insert({
                        speaking_id: data['speaking'][i]['speaking']['id'],
                        test_id: data['id'],
                        part: data['speaking'][i]['part']
                    }).then(() => {
                    })
                }

                for (let i = 0; i < data['writing'].length; i++) {
                    knex('tpo_writing').select('id').where({'id': data['writing'][i]['writing']['id']}).then((row) => {
                        if (row.length === 0) {
                            knex('tpo_writing').insert({
                                id: data['writing'][i]['writing']['id'],
                                writing_listening: data['writing'][i]['writing']['writing_listening'],
                                writing_image: data['writing'][i]['writing']['writing_image'],
                                writing_reading: data['writing'][i]['writing']['writing_reading'],
                                writing_question: data['writing'][i]['writing']['writing_question'],
                                type: data['writing'][i]['writing']['type'],
                                writing_listening_transcript: data['writing'][i]['writing']['writing_listening_transcript'],
                                sections: data['writing'][i]['writing']['sections'],
                            }).then(() => {
                            })
                        }
                        knex('tpo_testwriting').insert({
                            test_id: data['id'],
                            writing_id: data['writing'][i]['writing']['id'],
                            part: data['writing'][i]['part'],
                        }).then(() => {
                        })
                    })
                }

                for (let i = 0; i < data['speaking_times'].length; i++) {
                    knex('tpo_speakingtimes').insert({
                        number: data['speaking_times'][i]['number'],
                        preparation_time: data['speaking_times'][i]['preparation_time'],
                        answering_time: data['speaking_times'][i]['answering_time'],
                        reading_time: data['speaking_times'][i]['reading_time'],
                        test_id: data['id'],
                    }).then(() => {
                    })
                }

                for (let i = 0; i < data['listening_times'].length; i++) {
                    knex('tpo_listeningtimes').insert({
                        number: data['listening_times'][i]['number'],
                        time: data['listening_times'][i]['time'],
                        test_id: data['id'],
                    }).then(() => {
                    })
                }

                for (let i = 0; i < data['writing_times'].length; i++) {
                    knex('tpo_writingtimes').insert({
                        number: data['writing_times'][i]['number'],
                        time: data['writing_times'][i]['time'],
                        reading_time: data['writing_times'][i]['reading_time'],
                        test_id: data['id'],
                    }).then(() => {
                    })
                }
            }).then(() => {
                resolve()
            }).catch((err) => {
                reject(err)
            })
        })
    }
};
const mutations = {
    // updateFileSize(state, payload) {
    //     state.totalSize[payload[1]] = payload[0];
    // },
    updatePercentCompleted(state, payload) {
        if (state.percentCompleted.find(obj => obj['tpoId'] === payload[1]) !== undefined) {
            state.percentCompleted.find(obj => obj['tpoId'] === payload[1])['percent'] = payload[0];
        }
        else {
            state.percentCompleted.push({'tpoId': payload[1], 'percent': payload[0]})
        }
    }
}
export default {
    state,
    getters,
    actions,
    mutations
}