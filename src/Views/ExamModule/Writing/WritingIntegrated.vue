<template>
    <v-app style="position: fixed">
        <v-container fluid class="toolbar" style="padding: 0">
            <v-row justify="space-between" align="start"
                   style="padding: 0; padding-top: 10px; padding-bottom: 12px">
                <v-col sm="6" lg="6" cols="6" md="6" style="padding: 0; padding-left: 20px">
                    <v-container fluid>
                        <v-row justify="start" align="start">
                            <v-col style="padding: 0">
                              <v-btn to="/review" dark rounded small style="margin-right: 10px"
                                     v-if="writingMode === 'reviewMode'">Back
                              </v-btn>
                              <v-btn @click="endDialog = true" dark rounded small style="margin-right: 10px;" v-else>End</v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-col>
                <v-col sm="6" lg="4" cols="6" md="4" style="padding: 0;padding-right: 30px; ">
                    <v-container fluid style="padding: 0">
                        <v-row justify="end" align="start" style="padding: 0">

                            <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                <v-img src="../../../assets/vold.png" contain max-height="60px"
                                       min-height="40px"></v-img>
                            </v-col>
                            <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                <v-img src="../../../assets/helpd.png" contain max-height="60px"
                                       min-height="40px"></v-img>

                            </v-col>
                            <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0"
                                   v-if="writingMode ==='practiceMode'">
                                <v-img src="../../../assets/back.png" @click="goToBack" contain
                                       max-height="60px" min-height="40px"></v-img>
                            </v-col>
                            <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                              <v-img src="../../../assets/nextd.png" v-if="writingMode ==='reviewMode'" contain
                                     max-height="60px" min-height="40px"></v-img>
                                <v-img src="../../../assets/next.png" @click="dialog = true" v-else contain
                                       max-height="60px" min-height="40px"></v-img>
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
                                Question {{writingQuestionNumber}} of
                                {{writingLength}}
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
            <v-row style="width: 100%; margin: 0; padding: 5px">
                <div class="directions" style="width: 100%">
                    <div style="width: 100%">Directions: You have 20 minutes to plan and write your response. Your
                        response will be judged on the basis of quality of your writing and on how well your response
                        presents the points in the lecture and their relationship to the reading passage. Typically, an
                        effective response will be 150 to 225 words.
                    </div>
                </div>
            </v-row>
            <v-row style="width: 100%; padding: 5px; margin: 0;">
                <div class="question" style="width: 100%">
                    Question: {{writingQuestion}}
                </div>
            </v-row>
            <v-row>
                <v-col>
                    <div class="right" :style="{'height': `${this.windowSize.height - 360}px`}">
                        <div style="padding: 15px;">{{writingReading}}</div>
                    </div>
                </v-col>
                <v-col>
                    <v-container fluid class="writing" style="padding: 0; margin: 0">
                        <v-row class="control_buttons" style="margin: 0; padding: 0">
                            <v-container fluid>
                                <v-row align="start" justify="start">
                                    <v-col cols="7" sm="7" lg="7" md="7" style="padding: 0; margin: 0">
                                        <v-row align="start" justify="start" style="padding: 0; margin: 0">
                                            <v-col cols="2" sm="2" lg="2" md="2"
                                                   style="padding: 0; margin: 0; margin-bottom: 10px;">
                                                <img class="btn_writing" src="../../../assets/paste.png"
                                                     @click="triggerPaste">
                                            </v-col>
                                            <v-col cols="2" sm="2" lg="2" md="2" style="padding: 0; margin: 0;">
                                                <img class="btn_writing" src="../../../assets/cut.png" @click="triggerCut">
                                            </v-col>
                                            <v-col cols="2" sm="2" lg="2" md="2" style="padding: 0; margin: 0;">
                                                <img class="btn_writing" src="../../../assets/undo.png"
                                                     @click="triggerUndo">
                                            </v-col>
                                            <v-col cols="2" sm="2" lg="2" md="2" style="padding: 0; margin: 0;">
                                                <img class="btn_writing" src="../../../assets/redo.png"
                                                     @click="triggerRedo">
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="5" sm="5" lg="5" md="5"
                                           style="margin: 0; padding: 0">
                                        <v-row justify="start" align="start">
                                            <v-col cols="10" sm="10" lg="10" md="10" style="padding: 0; margin: 0;">
                                                <div v-if="wordCount" style="padding: 0; margin: 0;"><img class="btn_writing"
                                                                           src="../../../assets/hide_word_count.png"
                                                                           @click="triggerWordCount"></div>
                                                <div v-else style="padding: 0; margin: 0;"><img class="btn_writing"
                                                                 src="../../../assets/show_word_count.png"
                                                                 @click="triggerWordCount"></div>
                                            </v-col>
                                            <v-col cols="2" sm="2" lg="2" md="2"
                                                   style="padding: 0; margin: 0;padding-top: 5px; padding-right: 20px">
                                                <div v-show="wordCount.show">{{wordCount.count}}</div>
                                            </v-col>
                                        </v-row>
                                    </v-col>

                                </v-row>
                                <div>
                                </div>
                            </v-container>
                        </v-row>
                        <v-row justify="center" align="start">
                            <textarea id="input" class="input" v-model="wordString" :disabled="writingMode === 'reviewMode'"
                                      :style="{'height': `${this.windowSize.height - 415}px`}"></textarea>
                        </v-row>
                    </v-container>
                </v-col>
            </v-row>
        </v-container>
        <div class="text-xs-center">
            <v-dialog
                    v-model="dialog"
                    width="500">
                <v-card>
                    <v-card-title
                            class="headline grey lighten-2"
                            primary-title
                    >
                        Warning
                    </v-card-title>

                    <v-card-text>
                        You still have time left for your writing do you want to exit to next section?
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-btn
                                color="success"
                                text
                                @click="dialog = false"
                        >
                            Continue Writing
                        </v-btn>
                        <v-spacer></v-spacer>

                        <v-btn
                                color="error"
                                text
                                @click="goToNext"
                        >
                            Exit
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
      <v-dialog max-width="500" v-model="endDialog">
        <v-card>
          <v-card-title>
            Do You Want To End This Session?
          </v-card-title>
          <v-card-subtitle>
            You can continue this session later.
          </v-card-subtitle>
          <v-card-actions>
            <v-btn @click="endTPO" color="red" style="color: white">Save & End</v-btn>
            <v-btn @click="endDialog = false" color="green" style="color: white">Continue</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app>

</template>

<script>
    import {mapState, mapGetters} from 'vuex'
    import $ from 'jquery'
    import {
        GO_TO_NEXT_WRITING,
        GO_TO_PREVIOUS_WRITING,
        SAVE_ANSWER_WRITING,
        WRITING_TIME_ENDED
    } from "@/store/actions/writing";
    import {SAVE_TPO} from "@/store/actions/mainTPO";

    export default {
        name: "WritingIntegrated",
        data() {
            return {
              endDialog: false,
                wordString: '',
                wordCount: {
                    count: 0,
                    show: true,
                },
                time_component: {
                    enable: true,
                },
                dialog: false,
                saveState: [],
                saveI: 0,
                windowSize: {
                    width: 0,
                    height: 0
                },
            }
        },
        created() {
            window.addEventListener('resize', this.handleResize);
            this.handleResize();
        },
        destroyed() {
            window.removeEventListener('resize', this.handleResize);
        },
        mounted(){
            if(this.writingAnswer[this.writingId] === undefined){
                this.wordString = "";
            }
            else {
                this.wordString = this.writingAnswer[this.writingId]
            }
        },
        computed: {
            ...mapGetters(['writingQuestionNumber', 'writingLength', 'writingQuestion', 'writingReading', 'formattedHours', 'formattedMinutes', 'formattedSeconds', 'writingId']),
            ...mapState({
              writingMode: state => state.mainTPO.mode,
                totalTime: state => state.time.totalTime,
                writingAnswer: state => state.writing.answers,
            })
        },
        watch: {
            totalTime: function (newVal) {
                if(newVal === 0){
                    this.$store.dispatch(SAVE_ANSWER_WRITING, [this.writingId, this.wordString]);
                    this.$store.dispatch(WRITING_TIME_ENDED);
                }
            },
            wordString: function (str) {
                this.wordCount.count = str.trim().split(/\s+/).length;
                if (str[str.length - 1] === ' ') {
                    if (this.saveState.indexOf(str) === -1) {
                        this.saveState.push(str);
                        this.saveI = this.saveState.length - 1;
                    }
                }
            }
        },
        methods: {
          endTPO() {
            this.$store.dispatch(SAVE_TPO);
          },
            handleResize() {
                this.windowSize.width = window.innerWidth;
                this.windowSize.height = window.innerHeight;
            },

            toggleTimeShow() {
                this.time_component.enable = !this.time_component.enable;
            },
            goToNext: function () {
              this.$store.dispatch(SAVE_ANSWER_WRITING, [this.writingId, this.wordString]);
              this.$store.dispatch(GO_TO_NEXT_WRITING);
            },
            goToBack() {
              this.$store.dispatch(SAVE_ANSWER_WRITING, [this.writingId, this.wordString]);
              this.$store.dispatch(GO_TO_PREVIOUS_WRITING);
            },
            triggerUndo() {
                $('.input').focus()
                if (this.saveI > 0) {
                    this.saveI--;
                    this.wordString = this.saveState[this.saveI];
                    $(".input").val(this.saveState[this.saveI]);
                }
            },
            triggerRedo() {
                $('.input').focus()
                if (this.saveI < this.saveState.length - 1) {
                    this.saveI++;
                    this.wordString = this.saveState[this.saveI];
                    $(".input").val(this.saveState[this.saveI]);
                }
            },
          triggerWordCount() {
            this.wordCount.show = !this.wordCount.show
            $('.input').focus()
          },
            triggerPaste: async function paste() {
                const text = await navigator.clipboard.readText();
                let cursorPosition = $('.input').prop("selectionStart");
                let textArea = document.getElementById('input')
                let all = textArea.value;
                let edited = all.substring(0, cursorPosition) + text + all.substring(cursorPosition, all.length);
                textArea.focus();
                this.wordString = edited;
                textArea.value = edited;
            },
            triggerCut() {
                document.execCommand('cut');
                $('.input').focus()
            },
        },
    }
</script>

<style scoped>
    ::-webkit-scrollbar {
        width: 18px;
    }

    ::-webkit-scrollbar-track {
        background: rgb(239, 238, 241);
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    }

    ::-webkit-scrollbar-thumb {
        background-color: rgb(203, 213, 236);
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    }

    ::-webkit-scrollbar-button {
        background-color: #bbbbbb;
        display: block;
        height: 20px;
        width: 30px;
    }

    ::-webkit-scrollbar-button:start:decrement,
    ::-webkit-scrollbar-button:end:increment {
        display: block;
    }

    /* Turn off the down area up on top, and up area on bottom */
    ::-webkit-scrollbar-button:vertical:start:increment,
    ::-webkit-scrollbar-button:vertical:end:decrement {
        display: none;
    }

    .question {
        height: 100px;
        font-family: Verdana;
        font-weight: 500;
        font-size: 16px;
        border: solid thin black;
    }


    .time {
        font-size: 20px;
        position: relative;
        bottom: 1ex;
        color: white;
        right: 20px;
    }

    .qanounce {
        position: relative;
        bottom: 1ex;
        font-size: 18px;
        color: white;
        font-weight: bold;
        text-align: center;
    }

    .btn_writing {
        height: 30px;
        width: auto;
        margin: 4px;
    }

    .control_buttons {
        text-align: right;
        background-color: rgb(196, 199, 215);
        width: 100%;
        border-bottom: black thin solid;
        height: 55px;
    }

    .writing {
        border: black solid thin;
        font-family: Verdana;
        font-weight: normal;
        font-size: 16px;
        width: 100%;
    }

    .right {
        border: black solid thin;
        overflow-y: scroll;
        width: 100%;
        font-family: Verdana;
        font-weight: normal;
        font-size: 16px;
    }

    .directions {
        border: black solid thin;
        height: 100px;
        font-family: Verdana;
        font-weight: 500;
        font-size: 16px;
        background-color: rgb(196, 199, 215);
        width: 100vw;
    }

    .input {
        resize: none;
        margin: 12px;
        margin-top: 0;
        margin-bottom: 0;
        padding-top: 2px;
        padding: 15px;
        width: 100%;
        overflow: scroll;
    }

    .input:focus {
        margin-left: 1%;
        outline: none;
        border-color: transparent;

    }

    .toolbar {
        height: 110px;
        background: linear-gradient(to right, #4148a2, #822a42);

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

</style>
