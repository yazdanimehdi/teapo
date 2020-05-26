<template>
    <v-app :key="recordState">
        <v-container fluid class="toolbar" style="padding: 0">
            <v-row justify="space-between" align="start"
                   style="padding: 0; padding-top: 29px; padding-bottom: 12px">
                <v-col sm="6" lg="6" cols="6" md="6" style="padding: 0; padding-left: 20px">
                    <v-container fluid>
                        <v-row justify="start" align="start">
                            <v-col style="padding: 0">
                                <v-btn dark rounded small style="margin-right: 10px;">Home</v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-col>
                <v-col sm="6" lg="4" cols="6" md="4" style="padding: 0;padding-right: 30px; ">
                    <v-container fluid style="padding: 0">
                        <v-row justify="end" align="start" style="padding: 0">

                            <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0"
                                   v-if="speakingMode === 'reviewMode' || speakingMode === 'practiceMode'">
                                <v-img src="../../../assets/back.png" contain max-height="60px" min-height="40px"
                                       @click="goToBack"></v-img>
                            </v-col>

                            <v-col cols="6" md="6" lg="6" sm="6" v-if="volume.enabled">
                                <label>
                                    <input type="range" v-model="volume_slide">
                                </label>
                            </v-col>
                            <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                <v-img src="../../../assets/vol.png" contain max-height="60px"
                                       min-height="40px" @click="show_vol"></v-img>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-col>
            </v-row>
        </v-container>
        <v-container>
            <v-row align="center" justify="center" style=" margin-top: 120px; margin-left: 40px; margin-right: 40px">
                <div class="question"><span style="padding-left: 1em; text-align: left;">{{speakingQuestion}}</span>
                </div>
                <audio id="question_audio" :autoplay="speakingAnswer===''|| recordState !== 0" v-on:ended="startRecordingProcess">
                    <source :src="'data:audio/mp3;base64,' + speakingQuestionAudioFile">
                </audio>
            </v-row>
            <v-row>
                <div style="width: 100%; text-align: center; font-family: Verdana; font-size: 16px; border-top:thin solid black; margin-right: 40px; margin-left: 40px"
                     v-show="speakings.enable">
                    <br>
                    <img src="../../../assets/micd.png" style="height: 80px;" v-if="this.speakings.prepare_time > 0">
                    <img src="../../../assets/mic.png" style="height: 80px" v-else>
                    <div>Preparation Time: &nbsp; &nbsp; {{speakingQuestionPrepareTime}} Seconds</div>
                    <div>Response Time: &nbsp; &nbsp; {{speakingTime}} Seconds</div>
                    <br>
                </div>
            </v-row>
            <v-row align="center" justify="center" v-show="speakings.enable">
                <table class="tg" style="table-layout: fixed; width: 190px; position: relative;">
                    <colgroup>
                        <col style="width: 190px">
                    </colgroup>
                    <tr>
                        <th class="tg-b4wd" v-if="speakings.prepare_time > 0"><span
                                style="color:rgb(255, 255, 255); font-weight: bold">PREPARATION TIME</span></th>
                        <th class="tg-b4wd" v-else><span style="color:rgb(255, 255, 255); font-weight: bold">RESPONSE TIME</span>
                        </th>
                    </tr>
                    <tr>
                        <td class="tg-zemy" v-if="this.speakings.prepare_time > 0">
                            <span class='time'>{{ prepare.hours| formatTime}}:{{ prepare.minutes | formatTime}}:{{ prepare.seconds | formatTime}}</span>
                        <td class="tg-zemy" v-else>
                            <span class='time'>{{ response.hours| formatTime}}:{{ response.minutes | formatTime}}:{{ response.seconds | formatTime}}</span>
                        </td>
                    </tr>
                </table>
            </v-row>
            <v-row v-if="(speakingMode === 'reviewMode' || speakingMode === 'practiceMode') && speakingAnswer !== '' && recordState === 0" align="center" justify="center">
                <div>
                    <audio controls>
                        <source :src="speakingAnswer">
                    </audio>
                </div>

            </v-row>
            <v-row v-if="(speakingMode === 'reviewMode' || speakingMode === 'practiceMode') && speakingAnswer !== '' && recordState === 0" align="center" justify="center">
                <v-btn large @click="resetQuestion">Record Again</v-btn>
            </v-row>
        </v-container>

    </v-app>
</template>

<script>
    import {mapState, mapGetters} from 'vuex'
    import {GO_TO_NEXT_SPEAKING, GO_TO_PREVIOUS_SPEAKING, SAVE_ANSWER_SPEAKING} from "@/store/actions/speaking";

    export default {
        name: "Recorder",
        computed: {
            ...mapGetters(['speakingQuestion', 'speakingQuestionAudioFile', 'speakingQuestionPrepareTime', 'speakingTime', 'speakingAnswer', 'speakingId']),
            ...mapState({
                speakingMode: state => state.speaking.speakingMode,
            })
        },
        data() {
            return {
                volume_slide: 100,
                answer: [],
                recordState: 0,
                audio: {
                    percentage: 0
                },
                volume: {
                    enabled: false,
                    value: 0,
                },
                speakings: {
                    prepare_time: 0,
                    response_time: 0,
                    preparing: true,
                    prepare: 0,
                    speak: 0,
                    enable: false,
                },
                prepare: {
                    seconds: 0,
                    minutes: 0,
                    hours: 0,
                },
                response: {
                    seconds: 0,
                    minutes: 0,
                    hours: 0,
                }
            }
        },

        watch: {
            volume_slide: function (val) {
                document.getElementById("question_audio").volume = parseInt(val) / 100.0;
            }
        },
        methods: {
            goToBack() {
                this.$store.dispatch(GO_TO_PREVIOUS_SPEAKING);
            },
            startRecordingProcess() {
                let self = this;
                self.speakings.enable = true;
                self.speakings.prepare_time = this.speakingQuestionPrepareTime;
                self.speakings.response_time = this.speakingTime;
                self.speakings.prepare = this.speakingQuestionPrepareTime * 1000;
                self.speakings.speak = this.speakingTime * 1000;
                let interval = setInterval(function () {
                    if (self.speakings.prepare_time > 0) {
                        self.speakings.prepare_time--;
                        self.prepare.minutes = parseInt(self.speakings.prepare_time / 60);
                        self.prepare.hours = parseInt(self.prepare.minutes / 60);
                        self.prepare.minutes = self.prepare.minutes % 60;
                        self.prepare.seconds = self.speakings.prepare_time % 60;

                    } else {
                        if (self.speakings.response_time > 0) {
                            self.speakings.response_time--;
                            self.response.minutes = parseInt(self.speakings.response_time / 60);
                            self.response.hours = parseInt(self.response.minutes / 60);
                            self.response.minutes = self.response.minutes % 60;
                            self.response.seconds = self.speakings.response_time % 60;
                        }
                    }
                }, 1000);

                setTimeout(function () {
                    self.startRecording()
                    setTimeout(function () {
                        clearInterval(interval);
                    }, self.speakings.speak)
                }, self.speakings.prepare)
            },
            resetQuestion() {
                this.recordState = 1;
            },
            show_vol() {
                this.volume.enabled = !this.volume.enabled;
            },
            toggleTimeShow() {
                this.time.enable = !this.time.enable;
            },
            startRecording() {
                let self = this;

                function onRecordingReady(e) {
                    // e.data contains a blob representing the recording
                    var blob_data = e.data;
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(blob_data);
                    fileReader.onloadend = () => {
                        self.$store.dispatch(SAVE_ANSWER_SPEAKING, [self.speakingId, fileReader.result]);
                        self.$store.dispatch(GO_TO_NEXT_SPEAKING);
                    };
                }

                navigator.mediaDevices.getUserMedia({
                    audio: true
                })
                    .then(function (stream) {
                        let recorder = new MediaRecorder(stream);
                        recorder.start();
                        setTimeout(function () {
                            recorder.stop();
                            recorder.addEventListener('dataavailable', onRecordingReady);
                        }, self.speakings.speak);

                    });

            }
        },
    }
</script>

<style scoped>
    .btn {
        height: 80px;
        width: auto;

    }

    .time {
        font-weight: bold;
    }

    .question {
        font-family: Verdana;
        font-size: 20px;
        padding-bottom: 15px;
    }

    .tg {
        border-collapse: collapse;
        border-spacing: 0;
    }

    .tg td {
        font-family: Arial, sans-serif;
        font-size: 14px;
        padding: 10px 5px;
        border-style: solid;
        border-width: 1px;
        overflow: hidden;
        word-break: normal;
        border-color: black;
    }

    .tg th {
        font-family: Arial, sans-serif;
        font-size: 14px;
        font-weight: normal;
        padding: 10px 5px;
        border-style: solid;
        border-width: 1px;
        overflow: hidden;
        word-break: normal;
        border-color: black;
    }

    .tg .tg-b4wd {
        font-family: Verdana, Geneva, sans-serif !important;;
        background-color: #000000;
        color: #000000;
        text-align: center
    }

    .tg .tg-zemy {
        font-family: Verdana, Geneva, sans-serif !important;;
        text-align: center
    }

    .toolbar {
        height: 110px;
        background: linear-gradient(to right, #4148a2, #822a42);

    }
</style>
