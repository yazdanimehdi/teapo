<template>
    <v-app>
        <div>
            <div v-show="!review.enable">
                <div v-show="!reading_show">
                    <v-container fluid class="toolbar" style="padding: 0">
                        <v-row justify="space-between" align="start"
                               style="padding: 0; padding-top: 29px; padding-bottom: 12px">
                            <v-col sm="6" lg="6" cols="6" md="6" style="padding: 0; padding-left: 20px">
                                <v-container fluid>
                                    <v-row justify="start" align="start">
                                        <v-col style="padding: 0">
                                          <v-btn to="/review" dark rounded small style="margin-right: 10px" v-if="readingMode === 'reviewMode'">Back</v-btn>
                                          <v-btn @click="endDialog = true" dark rounded small style="margin-right: 10px" v-else>End</v-btn>
                                            <v-btn style="background-color: lime; margin-right: 10px" rounded
                                                   @click="dialogCorrect = true"
                                                   v-if="readingMode ==='practiceMode' || readingMode === 'reviewMode'"
                                                   x-small>
                                                Correct Answer
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-col>
                            <v-col sm="6" lg="4" cols="6" md="4" style="padding: 0;padding-right: 30px; ">
                                <v-container fluid style="padding: 0">
                                    <v-row justify="end" align="start" style="padding: 0">
                                        <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                            <button class="view_text" @click="toggleReading"
                                            >
                                                View Text
                                            </button>
                                        </v-col>
                                        <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                          <v-img src="../../../assets/reviewd.png" contain
                                                 max-height="60px" min-height="40px" v-if="readingMode === 'reviewMode'"></v-img>
                                          <v-img src="../../../assets/review.png" @click="toggleReviewShow" contain
                                                 max-height="60px" min-height="40px" v-else></v-img>
                                        </v-col>

                                        <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                            <v-img src="../../../assets/vold.png" contain max-height="60px"
                                                   min-height="40px"></v-img>
                                        </v-col>
                                        <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                            <v-img src="../../../assets/helpd.png" contain max-height="60px"
                                                   min-height="40px"></v-img>

                                        </v-col>
                                      <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                        <v-img src="../../../assets/backd.png" v-if="readingMode === 'reviewMode'" contain
                                               max-height="60px" min-height="40px"></v-img>
                                        <v-img src="../../../assets/back.png" @click="goToBack" contain
                                               max-height="60px" min-height="40px" v-else></v-img>
                                      </v-col>
                                      <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                        <v-img src="../../../assets/nextd.png" v-if="readingMode === 'reviewMode'" contain
                                               max-height="60px" min-height="40px"></v-img>
                                        <v-img src="../../../assets/next.png" @click="goToNext" contain
                                               max-height="60px" min-height="40px" v-else></v-img>
                                      </v-col>
                                    </v-row>
                                </v-container>
                            </v-col>
                        </v-row>
                        <v-row justify="center" align="start">
                            <v-container fluid style="margin: 0; padding:0">
                                <v-row justify="end" align="start">
                                    <v-col sm="8" lg="9" md="9" style="padding: 0">
                                        <div class="qanounce">
                                            Question {{this.questionCount + this.questionNumber + 1}} of
                                            {{readingAllQuestionsNumber}}
                                        </div>
                                    </v-col>
                                    <v-col sm="4" lg="3" md="3" style="padding: 0; max-width: 250px">
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
                    <div>
                        <v-layout align-center justify-center column fill-height>
                            <div class="direction">
                                <br>
                                <span>{{this.reading[this.taskNumber].questions[this.questionNumber].question}}</span>
                            </div>
                            <div STYLE="text-align: center; margin-left: 3%">
                                <div id="drophere" class="ui-droppable">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                            <br>
                            <div style="width: 100%; margin-left: 5%; font-family: Verdana; font-size: 14px; font-weight: bold">
                                Answer Choices
                            </div>
                            <br>
                            <div style="width: 90%;">
                                <div class="col-sm-12 col-md-10 ui-droppable" id="answers">
                                    <ul class="gallery ui-helper-reset">
                                        <div class="row deck1">
                                            <div class="card1 col-sm-12 col-md-6">
                            <span data="1">
                                <div class="b1 ui-draggable ui-draggable-handle" data="1">{{this.reading[this.taskNumber].questions[this.questionNumber].answers[0].answer}}</div>
                            </span>
                                            </div>
                                            <div class="card1 col-sm-12 col-md-6">
                            <span data="2">
                                <div class="b1 ui-draggable ui-draggable-handle" data="2">{{this.reading[this.taskNumber].questions[this.questionNumber].answers[1].answer}}</div>
                            </span>
                                            </div>
                                        </div>
                                        <div class="row deck1">
                                            <div class="card1 col-sm-12 col-md-6">
                            <span data="3">
                                <div class="b1 ui-draggable ui-draggable-handle" data="3">{{this.reading[this.taskNumber].questions[this.questionNumber].answers[2].answer}}</div>
                            </span>
                                            </div>
                                            <div class="card1 col-sm-12 col-md-6">
                            <span data="4">
                                <div class="b1 ui-draggable ui-draggable-handle" data="4">{{this.reading[this.taskNumber].questions[this.questionNumber].answers[3].answer}}</div>
                            </span>
                                            </div>
                                        </div>
                                        <div class="row deck1">
                                            <div class="card1 col-sm-12 col-md-6">
                            <span data="5">
                                <div class="b1 ui-draggable ui-draggable-handle" data="5">{{this.reading[this.taskNumber].questions[this.questionNumber].answers[4].answer}}</div>
                            </span>
                                            </div>
                                            <div class="card1 col-sm-12 col-md-6">
                            <span data="6">
                                <div class="b1 ui-draggable ui-draggable-handle" data="6">{{this.reading[this.taskNumber].questions[this.questionNumber].answers[5].answer}}</div>
                            </span>
                                            </div>
                                        </div>
                                        <div class="row deck1"></div>
                                    </ul>
                                </div>
                            </div>
                        </v-layout>
                    </div>
                </div>
                <div>
                    <div v-show="reading_show">
                        <v-container style="padding: 0" class="toolbar" fluid>
                            <v-row style="padding-right: 20px; padding-top: 29px; padding-bottom: 12px">
                                <button class="view_text" @click="toggleReading"
                                >
                                    View Question
                                    <v-icon></v-icon>
                                </button>
                            </v-row>
                        </v-container>
                        <v-container fluid>
                            <v-row>
                                <v-col cols="12" sm="6" lg="6">
                                    <div style="width: 100%; height: 100%; border-right: black thin solid; margin-right: 1px">
                                        <v-card class="my_class" flat height="65vh"
                                                :style="{'font-size': 6 + 24*size/100 + 'px'}">
                                        </v-card>
                                    </div>
                                </v-col>
                                <v-col cols="12" sm="6" lg="6">
                                    <div style="width: 100%; height: 100%; margin-left: 1px">
                                        <v-card class="my_class1" flat height="65vh">
                                            <br>
                                            <h2 style="text-align: center;">{{readingTitle}}</h2>
                                            <br>
                                            <div v-html="passage"></div>

                                        </v-card>
                                    </div>
                                </v-col>
                            </v-row>

                        </v-container>
                    </div>
                </div>
            </div>
            <v-dialog
                    v-model="dialogCorrect"
                    max-width="500px"
            >
                <v-card>
                    <v-card-title>
                        The Correct Answer Is: <span style="color: green">{{readingQuestionCorrectAnswer}}</span>
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
    import $ from 'jquery'
    import 'jquery-ui/ui/widgets/draggable'
    import 'jquery-ui/ui/widgets/droppable'
    import {mapGetters, mapState} from 'vuex'
    import {
        GO_TO_PREVIOUS_READING,
        GO_TO_NEXT_READING,
        TOGGLE_REVIEW,
        SAVE_ANSWER_READING
    } from "@/store/actions/reading";
    import {SAVE_TPO} from "@/store/actions/mainTPO";

    export default {
        name: "ReadingSummary",
        components: {},
        data() {
            return {
                endDialog: false,
                size: 50,
                zoom: {
                    enabled: false
                },
                time_component: {
                    enable: true,
                },
                answer: [],
                multi: false,
                reading_show: false,
                review: {
                    enable: false
                },
                questionCount: 0,
                dialogCorrect: false,
            };
        },
        computed: {
            ...mapGetters([
                'formattedHours',
                'formattedMinutes',
                'formattedSeconds',
                'questionReadingTitle',
                'readingTitle',
                'passage',
                'readingLength',
                'currentReading',
                'readingTaskNumber',
                'questionRelatedParagraph',
                'readingQuestionCorrectAnswer',
                'questionAnswers',
                'readingQuestion',
                'readingMulti',
                'questionRelatedPassage',
                'readingQuestionId',
                'readingQuestionAnswer',
                'insertionSentence'
            ]),
            ...mapState({
                reading: state => state.reading.reading,
                readingTest: state => state.reading.readingTest,
                questionNumber: state => state.reading.questionNumber,
                taskNumber: state => state.reading.taskNumber,
                readingAnswers: state => state.reading.readingAnswers,
                readingAllQuestionsNumber: state => state.reading.readingAllQuestionsNumber,
                readingMode: state => state.mainTPO.mode
            }),
        },
        methods: {
          endTPO() {
            this.$store.dispatch(SAVE_TPO);
          },
            goToBack() {
                this.answer = [];
                let q;
                let answerDiv = $("#drophere span ul div");
                for (q = 0; q < answerDiv.length; q++) {
                    this.answer.push(answerDiv[q].attributes[1].nodeValue)
                }
                this.$store.dispatch(SAVE_ANSWER_READING, [this.readingQuestionId, this.answer]);
                this.$store.dispatch(GO_TO_PREVIOUS_READING);
            },

            toggleReading() {
                this.reading_show = !this.reading_show;
            },
            toggleTimeShow() {
                this.time_component.enable = !this.time_component.enable;
            },
            goToNext: function () {
                this.answer = [];
                let q;
                let answerDiv = $("#drophere span ul div");
                for (q = 0; q < answerDiv.length; q++) {
                    this.answer.push(answerDiv[q].attributes[1].nodeValue)
                }
                this.$store.dispatch(SAVE_ANSWER_READING, [this.readingQuestionId, this.answer]);
                this.$store.dispatch(GO_TO_NEXT_READING);
            },
            toggleReviewShow() {
                this.answer = [];
                let q;
                let answerDiv = $("#drophere span ul div");
                for (q = 0; q < answerDiv.length; q++) {
                    this.answer.push(answerDiv[q].attributes[1].nodeValue)
                }
                this.$store.dispatch(SAVE_ANSWER_READING, [this.readingQuestionId, this.answer]);
                this.$store.dispatch(TOGGLE_REVIEW);
            },


        },
        updated() {
            var now_i = 0, $chooseList = $("#answers"), $dropBasket = $("#drophere");
            $(function () {
                $(".b1", $chooseList).draggable({
                    revert: "invalid",//when not dropped,the item will revert back to its initial position
                    containment: "document", helper: "clone", cursor: "move"
                });
                $dropBasket.droppable({
                    accept: "#answers .b1",
                    classes: {"ui-droppable-active": "ui-state-highlight"},
                    drop: function (event, ui) {
                        addChoose(ui.draggable);
                    }
                }).dblclick(function (event) {
                    var $target = $(event.target);
                    if ($target.is('.b1')) removeChoose($target);
                });
                $chooseList.droppable({
                    accept: "#drophere .b1",
                    classes: {"ui-droppable-active": "custom-state-active"},
                    drop: function (event, ui) {
                        removeChoose(ui.draggable);
                    },
                    create: function () {
                        answer_after_initialize();
                    }
                });
            });

            function addChoose($item) {
                if (now_i < $dropBasket.find('span').length) {
                    //$item.fadeOut(function() {
                    var $trash1 = $dropBasket.find('span').eq(now_i);
                    for (var i = 0; i < 3; i++) {
                        if (!$dropBasket.find('span').eq(i).find('ul .b1').length) {
                            $trash1 = $dropBasket.find('span').eq(i);
                            break;
                        }
                    }
                    now_i++;
                    //ua1[now_i] = $item.attr('data'); save_drop_answer(ua1);
                    $item.hide();
                    $item.hide(function () {
                        var $list = $("ul", $trash1).length ?
                            $("ul", $trash1) :
                            $("<ul class='gallery ui-helper-reset'></ul>").appendTo($trash1);
                        $item.appendTo($list).show();
                    });
                }
            }

            function removeChoose($item) {
                now_i--;
                var data = $item.attr('data');
                $item.fadeOut(function () {
                    $item
                        .appendTo($chooseList.find('span[data=' + data + ']'))
                        .show();
                });
            }

            var in_rep_mode = false;
            var saved_anw = [];

            function answer_after_initialize() {
                $.each(saved_anw, function (k, v) {
                    addChoose($chooseList.find('.b1[data=' + v + ']'));
                });
                if (in_rep_mode) {
                    $(".b1", $chooseList).draggable('disable');
                    $(".b1", $dropBasket).draggable('disable');
                    $chooseList.droppable('disable');
                    $dropBasket.droppable('disable');
                    //$dropBasket.off('dblclick');
                    $dropBasket.unbind('dblclick');
                    //$dropBasket.dblclick('disable');
                }
            }
        },

        mounted() {
            this.answer = []
            let k;
            for (k = 0; k < this.taskNumber; k++) {
                this.questionCount = this.questionCount + this.reading[k].questions.length
            }
            if (this.reading[this.taskNumber].questions[this.questionNumber].id in this.readingAnswers) {
                this.answer = this.readingAnswers[this.reading[this.taskNumber].questions[this.questionNumber].id];
            }
            let now_i = 0, $dropBasket = $("#drophere");
            let l;
            for (l in this.answer) {
                let el = $('span').find(`[data="${this.answer[l]}"]`).children();
                addChoose(el);

            }

            function addChoose($item) {
                if (now_i < $dropBasket.find('span').length) {
                    //$item.fadeOut(function() {
                    let $trash1 = $dropBasket.find('span').eq(now_i);
                    for (let i = 0; i < 3; i++) {
                        if (!$dropBasket.find('span').eq(i).find('ul .b1').length) {
                            $trash1 = $dropBasket.find('span').eq(i);
                            break;
                        }
                    }
                    now_i++;
                    //ua1[now_i] = $item.attr('data'); save_drop_answer(ua1);
                    $item.hide();
                    $item.hide(function () {
                        let $list = $("ul", $trash1).length ?
                            $("ul", $trash1) :
                            $("<ul class='gallery ui-helper-reset'></ul>").appendTo($trash1);
                        $item.appendTo($list).show();
                    });
                }
            }
        },
    }
</script>

<style scoped>
    .my_class {
        margin: 1%;
        margin-left: 3%;
        background-color: transparent;

    }

    .my_class1 {
        background-color: transparent;
        overflow-y: scroll;
        margin: 1%;
    }

    div {
        font-family: Verdana;
        font-weight: normal;
    }

    .label {
        padding-left: 1em;
    }

    /deep/ mark {
        background-color: #c8c8c8;
    }

    .direction {
        margin: 3%;
        font-family: Verdana;
        font-size: 14px;
        font-weight: bold;
    }

    #drophere {
        padding: 0;
        overflow: hidden;
        margin: 0 auto;
        max-width: 98%;
        font-size: 1.1em;
        padding: 8px;
        border: 1px solid #c0c0c0;
        border-radius: 4px;
        width: 770px;
    }

    #drophere span {
        border: 1px solid #e0e0e0;
        border-width: 1px 0;
    }

    #drophere span {
        display: block;
        min-height: 70px;
    }

    #drophere span:first-child {
        border-top: 0;
    }

    #drophere span {
        border: 1px solid #e0e0e0;
        border-width: 1px 0;
    }

    #drophere span {
        display: block;
        min-height: 70px;
    }

    #answers {
        border: 1px solid #f0f0f0;
        padding: 4px;
        display: table;
        margin: 0 auto;
    }

    .ui-helper-reset {
        margin: 0;
        padding: 0;
        border: 0;
        outline: 0;
        line-height: 1.3;
        text-decoration: none;
        font-size: 100%;
        list-style: none;
    }

    #answers .deck1 {
        margin: 0px;
    }

    .row {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        margin-right: -15px;
        margin-left: -15px;
    }

    #answers .card1 {
        display: table;
        padding: 4px;
    }

    #answers span {
        display: block;
        padding: 2px;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        min-height: 76px;
    }

    *, *::before, *::after {
        box-sizing: border-box;
    }

    #answers .b1 {
        padding: 4px 1%;
        margin: 0;
        display: block;
        min-height: 70px;
        border-radius: 2px;
        background-color: white;
    }

    .ui-draggable-handle {
        -ms-touch-action: none;
        touch-action: none;
    }

    .col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col, .col-auto, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm, .col-sm-auto, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md, .col-md-auto, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg, .col-lg-auto, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl, .col-xl-auto {
        position: relative;
        width: 100%;
        min-height: 1px;
        padding-right: 15px;
        padding-left: 15px;
    }

    ul {
        display: block;
        list-style-type: disc;
        margin-block-start: 1em;
        margin-block-end: 1em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        padding-inline-start: 40px;
    }

    .ui-helper-reset {
        margin: 0;
        padding: 0;
        border: 0;
        outline: 0;
        line-height: 1.3;
        text-decoration: none;
        font-size: 100%;
        list-style: none;
    }

    .col-md-10 {
        -ms-flex: 0 0 83.333333%;
        flex: 0 0 83.333333%;
        max-width: 83.333333%;
    }

    ol, ul, dl {
        margin-top: 0;
        margin-bottom: 1rem;
    }

    .col-md-6 {
        -ms-flex: 0 0 50%;
        flex: 0 0 50%;
        max-width: 50%;
    }

    #drophere span:last-child {
        border-bottom: 0;
    }

    .toolbar {
        height: 130px;
        padding-top: 20px;
        background: linear-gradient(to right, rgb(61, 83, 135), rgb(113, 53, 60));

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

    .question {
        font-size: 20px;
        font-family: Verdana;
    }

    .view_text {
        align-items: flex-start;
        background-attachment: scroll;
        background-clip: border-box;
        background-color: rgba(0, 0, 0, 0);
        background-image: none;
        background-origin: padding-box;
        background-position-x: 0%;
        background-position-y: 0%;
        background-size: auto;
        border-bottom-color: rgba(0, 0, 0, 0.2);
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-image-outset: 0px;
        border-image-repeat: stretch;
        border-image-slice: 100%;
        border-image-source: none;
        border-image-width: 1;
        border-left-color: rgba(0, 0, 0, 0.2);
        border-left-style: solid;
        border-left-width: 1px;
        border-right-color: rgba(0, 0, 0, 0.2);
        border-right-style: solid;
        border-right-width: 1px;
        border-top-color: rgba(0, 0, 0, 0.2);
        border-top-style: solid;
        border-top-width: 1px;
        box-shadow: rgba(255, 255, 255, 0.45) -1px 1px 2px 0px inset, rgba(0, 0, 0, 0.4) -1px -2px 2px 0px inset;
        box-sizing: border-box;
        color: rgb(255, 255, 255);
        cursor: default;
        direction: ltr;
        display: inline-block;
        font-family: "Open Sans", sans-serif;
        font-size: 10px;
        font-stretch: 50%;
        font-style: normal;
        font-variant-caps: normal;
        font-variant-east-asian: normal;
        font-variant-ligatures: normal;
        font-variant-numeric: normal;
        font-weight: 500;
        height: 35px;
        letter-spacing: normal;
        line-height: 10px;
        margin-bottom: 0px;
        margin-left: 4px;
        margin-right: 4px;
        margin-top: 0px;
        outline-color: rgb(255, 255, 255);
        outline-style: none;
        outline-width: 0px;
        overflow-x: visible;
        overflow-y: visible;
        padding-bottom: 6px;
        padding-left: 10px;
        padding-right: 10px;
        padding-top: 6px;
        text-align: center;
        text-indent: 0px;
        text-rendering: auto;
        text-shadow: none;
        text-size-adjust: 100%;
        text-transform: none;
        width: 60px;
        word-spacing: 0px;
        writing-mode: horizontal-tb;
        -webkit-appearance: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-border-image: none;

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

    .time {
        font-size: 20px;
        position: relative;
        bottom: 1ex;
        color: white;
        right: 20px;
    }

    label {
        padding-left: 1em;
    }

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

</style>
