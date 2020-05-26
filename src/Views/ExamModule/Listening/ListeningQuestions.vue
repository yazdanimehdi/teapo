<template>
    <v-app :key="questionNumber">
        <v-container fluid class="toolbar" style="padding: 0">
            <v-row justify="space-between" align="start"
                   style="padding: 0; padding-top: 15px; padding-bottom: 12px">
                <v-col sm="6" lg="6" cols="6" md="6" style="padding: 0; padding-left: 20px">
                    <v-container fluid>
                        <v-row justify="start" align="start">
                            <v-col style="padding: 0">
                                <v-btn dark rounded small style="margin-right: 10px;">Home</v-btn>
                                <v-btn style="background-color: lime; margin-right: 10px"
                                       v-if="listeningMode ==='practiceMode' || listeningMode === 'reviewMode'"
                                       rounded
                                       @click="dialogCorrect = true" x-small>
                                    Correct Answer
                                </v-btn>
                            </v-col>

                            <v-col cols="4" md="4" lg="4" sm="4" v-if="volume.enabled" style="padding: 0">
                                <label>
                                    <input type="range" v-model="volume_slide">
                                </label>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-col>
                <v-col sm="6" lg="4" cols="6" md="4" style="padding: 0;padding-right: 30px; ">
                    <v-container fluid style="padding: 0">
                        <v-row justify="end" align="start" style="padding: 0">

                            <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                <v-img src="../../../assets/vol.png" contain max-height="60px"
                                       min-height="40px" @click="show_vol"></v-img>
                            </v-col>
                            <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                <v-img src="../../../assets/helpd.png" contain max-height="60px"
                                       min-height="40px"></v-img>

                            </v-col>

                            <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0"
                                   v-if="listeningMode === 'practiceMode' || listeningMode === 'reviewMode'">
                                <v-img src="../../../assets/back.png" contain max-height="60px" @click="goToBack"
                                       min-height="40px"></v-img>

                            </v-col>

                            <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                <v-img src="../../../assets/okd.png" contain max-height="60px"
                                       min-height="40px" v-if="ok.enabled === false"></v-img>
                                <v-img src="../../../assets/ok.png" contain max-height="60px"
                                       min-height="40px" v-else @click="goToNext"></v-img>
                            </v-col>

                            <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                <v-img src="../../../assets/nextd.png" contain max-height="60px"
                                       min-height="40px" v-if="ok.enabled === true || ok.audio_ended === false"></v-img>
                                <v-img src="../../../assets/next.png" contain max-height="60px"
                                       min-height="40px" v-else @click="toggleOk"></v-img>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-col>
            </v-row>
            <v-row justify="center" align="start">
                <v-container fluid style="margin: 0; padding:0">
                    <v-row justify="end" align="start">
                        <v-col sm="8" lg="10" md="9" style="padding: 0">
                            <div class="qanounce">
                                Question {{listeningQuestionNumber}} of {{listeningQuestionLength}}
                            </div>
                        </v-col>
                        <v-col sm="4" lg="2" md="3" style="padding: 0; max-width: 250px">
                            <template v-if="time_component.enable">
                                <img src="../../../assets/hidetime.png" class="clock" @click="toggleTimeShow">
                            </template>
                            <template v-else>
                                <img src="../../../assets/showtime.png" class="clock" @click="toggleTimeShow">
                            </template>
                            <span class='time' v-if="this.time_component.enable">{{formattedHours}} : {{formattedMinutes}} : {{formattedSeconds}}</span>
                        </v-col>
                    </v-row>
                </v-container>
            </v-row>
        </v-container>

        <v-container fluid>
            <v-row>
                <audio id="listening_question" autoplay v-on:ended="audioEnded">
                    <source :src="'data:audio/mp3;base64,' + listeningQuestionAudioFile"
                            type="audio/mpeg">
                </audio>
            </v-row>
            <v-row class="question">
                <div style="margin-bottom: 30px"><span>{{listeningQuestion}}</span>
                </div>
                <div v-if="listeningQuestionMulti === true"
                     style="background-color: rgb(196, 199, 215); font-family: Verdana; width: 100%; height: 40px; text-align: center; margin-bottom: 5px">
                    <span>Click on {{listeningQuestionAnswerCount}} answers</span></div>
                <v-container>
                    <v-row v-for="ans in listeningQuestionAnswers" :key="ans.id" v-show="answers.enabled">
                        <label class="container_checkbox" v-if="listeningQuestionMulti === true">{{ans.answer}}
                            <input type="checkbox" v-bind:value="ans.code" name="answer" v-model="answer">
                            <span class="checkmark_checkbox"></span>
                        </label>
                        <label class="container_radio" v-else>{{ans.answer}}
                            <input type="radio" v-bind:value="ans.code" name="answer" v-model="answer">
                            <span class="checkmark_radio"></span>
                        </label>
                    </v-row>
                </v-container>
            </v-row>
        </v-container>
        <v-dialog
                v-model="dialogCorrect"
                max-width="500px"
        >
            <v-card>
                <v-card-title>
                    The Correct Answer Is: <span style="color: green">{{ListeningQuestionCorrectAnswer}}</span>
                </v-card-title>
                <v-card-actions>
                    <div class="flex-grow-1"></div>
                    <v-btn
                            color="primary"
                            text
                            @click="dialogCorrect = false"
                    >
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app>
</template>

<script>
    import {mapState, mapGetters} from 'vuex'
    import {TIME_STOP} from '@/store/actions/time'
    import {SAVE_ANSWER_LISTENING, GO_TO_NEXT_LISTENING, GO_TO_PREVIOUS_LISTENING} from '@/store/actions/listening'

    export default {
        name: "ListeningQuestions",
        data: function () {
            return {
                audio: {
                    percentage: 0
                },
                answers: {
                    enabled: false
                },
                volume: {
                    enabled: false
                },
                time_component: {
                    enable: true,
                },
                ok: {
                    enabled: false,
                    audio_ended: false,
                },
                volume_slide: 50,
                answer: [],
                dialogCorrect: false,
            }
        },
        watch: {
            volume_slide: function (val) {
                document.getElementById("listening_question").volume = parseInt(val) / 100.0;
            },
            questionNumber: function () {
                this.answer = this.listeningQuestionAnswer;
                this.ok.enabled = false;
                this.ok.audio_ended = false;
                this.answers.enabled = false;
            }

        },
        computed: {
            ...mapGetters(['listeningQuestionLength',
                'formattedHours',
                'formattedMinutes',
                'formattedSeconds',
                'listeningQuestion',
                'listeningQuestionAudioFile',
                'listeningQuestionAnswers',
                'listeningQuestionMulti',
                'listeningQuestionId',
                'listeningQuestionAnswer',
                'listeningQuestionNumber',
                'ListeningQuestionCorrectAnswer',
                'listeningQuestionAnswerCount']),
            ...mapState({
                questionNumber: state => state.listening.questionNumber,
                listeningMode: state => state.mainTPO.mode,
            })
        },
        methods: {
            audioEnded() {
                this.ok.audio_ended = true;
                this.$store.dispatch(TIME_STOP, false);
                this.answers.enabled = true;
            },
            show_vol() {
                this.volume.enabled = !this.volume.enabled;
            },
            toggleTimeShow() {
                this.time_component.enable = !this.time_component.enable;
            },
            toggleOk() {
                this.ok.enabled = true
            },
            goToNext: function () {
                this.$store.dispatch(TIME_STOP, true);
                this.$store.dispatch(SAVE_ANSWER_LISTENING, [this.listeningQuestionId, this.answer]);
                this.$store.dispatch(GO_TO_NEXT_LISTENING);
            },
            goToBack() {
                this.$store.dispatch(GO_TO_PREVIOUS_LISTENING);
            }

        },

    }
</script>

<style scoped>
    .container_radio {
        display: block;
        position: relative;
        padding-left: 35px;
        margin-bottom: 12px;
        cursor: pointer;
        font-size: 16px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .container_radio input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    .checkmark_radio {
        position: absolute;
        top: 0;
        left: 0;
        height: 14px;
        width: 22px;
        border-radius: 11px / 7px;
        border: black solid thin;
        background-color: white;
    }


    /* When the checkbox is checked, add a blue background */
    .container_radio input:checked ~ .checkmark_radio {
        background-color: black;
    }

    /* Show the checkmark when checked */
    .container_radio input:checked ~ .checkmark_radio:after {
        display: none;
    }

    .container_checkbox {
        display: block;
        position: relative;
        padding-left: 35px;
        margin-bottom: 12px;
        cursor: pointer;
        font-size: 16px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    .container_checkbox input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }

    .checkmark_checkbox {
        position: absolute;
        top: 0;
        left: 0;
        height: 15px;
        width: 15px;
        border: black solid thin;
        background-color: white;
    }


    /* When the checkbox is checked, add a blue background */
    .container_checkbox input:checked ~ .checkmark_checkbox {
        background-color: black;
    }


    /* Show the checkmark when checked */
    .container_checkbox input:checked ~ .checkmark_checkbox:after {
        display: none;
    }


    .toolbar {
        height: 115px;
        background: linear-gradient(to right, #4148a2, #822a42);

    }

    .qanounce {
        position: relative;
        bottom: 1ex;
        font-size: 18px;
        color: white;
        font-weight: bold;
        text-align: center;
    }

    .clock {
        height: 30px;
        width: auto;
        position: relative;
        bottom: 6px;
        right: 30px;
    }

    .btn {
        height: 80px;
        width: auto;

    }

    .time {
        font-size: 20px;
        position: relative;
        bottom: 1ex;
        color: white;
        right: 20px;
    }

    .question {
        font-family: Verdana;
        font-size: 16px;
        font-weight: normal;
        position: absolute;
        top: 40%;
        left: 40%;
        transform: translate(-40%, -40%);
        font-size: 18px;
    }

    label {
        padding-left: 1em;
    }
</style>
