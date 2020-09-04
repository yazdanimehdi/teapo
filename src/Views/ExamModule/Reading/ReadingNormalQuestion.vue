<template>
  <v-app>
    <div style="position: fixed" data-app>
      <link rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
            integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
            crossorigin="anonymous">
      <div>

        <v-container fluid class="toolbar" style="padding: 0">
          <v-row justify="space-between" align="start"
                 style="padding: 0; padding-top: 29px; padding-bottom: 12px">
            <v-col sm="6" lg="6" cols="6" md="6" style="padding: 0; padding-left: 20px">
              <v-container fluid>
                <v-row justify="start" align="start">
                  <v-col style="padding: 0">
                    <v-btn to="/review" dark rounded small style="margin-right: 10px"
                           v-if="readingMode === 'reviewMode'">Back
                    </v-btn>
                    <v-btn @click="endDialog = true" dark rounded small style="margin-right: 10px" v-else>End</v-btn>
                    <v-btn style="background-color: lime; margin-right: 10px"
                           v-if="readingMode ==='practiceMode' || readingMode === 'reviewMode'"
                           rounded
                           @click="dialogCorrect = true" x-small>
                      Correct Answer
                    </v-btn>
                    <v-btn rounded @click="openDictionary"
                           x-small
                           v-if="readingMode ==='practiceMode' || readingMode === 'reviewMode'">
                      Dictionary
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-col>
            <v-col sm="6" lg="4" cols="6" md="4" style="padding: 0;padding-right: 30px; ">
              <v-container fluid style="padding: 0">
                <v-row justify="end" align="start" style="padding: 0">
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
                <v-col sm="8" lg="10" md="9" style="padding: 0">
                  <div class="qanounce">
                    Question {{ questionCount + questionNumber + 1 }} of
                    {{ readingAllQuestionsNumber }}
                  </div>
                </v-col>
                <v-col sm="4" lg="2" md="3" style="padding: 0; max-width: 250px">
                  <template v-if="time_component.enable">
                    <img src="../../../assets/hidetime.png" class="clock" @click="toggleTimeShow">
                  </template>
                  <template v-else>
                    <img src="../../../assets/showtime.png" class="clock" @click="toggleTimeShow">
                  </template>
                  <span class='time' v-if="this.time_component.enable">{{ formattedHours }} : {{ formattedMinutes }} : {{ formattedSeconds }}</span>
                </v-col>
              </v-row>
            </v-container>
          </v-row>
        </v-container>
      </div>
      <div style="margin: 0.5%">
        <v-container fluid>
          <v-row>
            <v-col cols="12" sm="6" lg="6">
              <div style="width: 100%; height: 100%; border: black thin solid; margin-right: 1px">
                <v-card class="my_class" flat height="73vh" style="overflow-y: hidden">
                  <br>
                  <div id="question"><span>{{ readingQuestion }}</span>
                  </div>
                  <br>
                  <span v-for="ans in questionAnswers"
                        :key="ans['id']">
                                              <label class="container_checkbox"
                                                     v-if="readingMulti === true">{{ ans.answer }}
                                            <input type="checkbox" v-bind:value="ans.code" name="answer"
                                                   v-model="answer">
                                            <span class="checkmark_checkbox"></span>
                                          </label>
                                              <label class="container_radio" v-else>{{ ans.answer }}
                                            <input type="radio" v-bind:value="ans.code" name="answer" v-model="answer">
                                            <span class="checkmark_radio"></span>
                                          </label>
                                    </span>
                  <br>
                  <span>Paragraph {{ questionRelatedParagraph }} is marked with an arrow [<i
                      class="fas fa-arrow-right"></i>]</span>
                </v-card>
              </div>
            </v-col>
            <v-col cols="12" lg="6" sm="6">
              <div style="width: 100%; height: 100%; border: black thin solid; margin-left: 1px">
                <div style="background-color: #1A01CC; height: 20px; text-align: right; color: white">
                  <span v-if="scrolled < 0.6">Beginning</span><span
                    v-if="0.6 < scrolled & scrolled < 0.9">More Available</span><span
                    v-if="scrolled >= 0.9">End</span></div>
                <v-card class="my_class1" flat height="73vh" v-on:scroll.native="onScroll"
                        :style="{'font-size': 6 + 24*size/100 + 'px'}">
                  <br>
                  <h2 style="text-align: center;">
                    {{ questionReadingTitle }}</h2>
                  <br>
                  <div id="passage"></div>

                </v-card>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>
      <v-dialog
          v-model="dialogDict"
          max-width="500px"
      >
        <v-card>
          <v-card-subtitle style="padding:10px 0 0 10px">
            <v-btn
                color="primary"
                icon
                @click="closeDialogDict"
            >
              <v-icon>{{ icons.mdiClose }}</v-icon>
            </v-btn>
          </v-card-subtitle>
          <v-card-text>
            <DictionaryComponent :width="400" flat v-if="selected !== ''"/>
            <v-container fluid v-else>
              <v-row align="center" justify="center">
                <v-col cols="11" md="11" sm="11" lg="11" xl="11" style="padding: 0">
                  <v-text-field
                      v-model="wordSearch"
                      label="Word"
                      required
                      color="#1C0153"
                      style="font-weight: bold; font-size: 20px"
                      @keypress="searchDictionaryEnter($event)"
                  ></v-text-field>
                </v-col>
                <v-col cols="1" md="1" sm="1" lg="1" xl="1">
                  <v-btn @click="searchDictionary" icon>
                    <v-icon x-large>{{ icons.mdiCardSearch }}</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <DictionaryComponent :width="400" v-if="!minimized" :flat="false"/>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog
          v-model="dialogCorrect"
          max-width="500px"
      >
        <v-card>
          <v-card-title>
            The Correct Answer Is: <span style="color: green">{{ readingQuestionCorrectAnswer }}</span>
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
import {mapGetters, mapState} from 'vuex'
import {
  GO_TO_PREVIOUS_READING,
  GO_TO_NEXT_READING,
  TOGGLE_REVIEW,
  SAVE_ANSWER_READING
} from "@/store/actions/reading";
import DictionaryComponent from "@/components/Subcomponents/DictionaryComponent";
import {LOAD_DICTIONARY} from "@/store/actions/dictionary";
import {
  mdiBookAlphabet,
  mdiPlusCircle,
  mdiChevronRight,
  mdiChevronLeft,
  mdiChevronUp,
  mdiChevronDown,
  mdiBookSearch,
  mdiCardSearch,
  mdiClose
} from '@mdi/js'
import {SAVE_TPO} from "@/store/actions/mainTPO";

export default {
  name: "ReadingNormalQuestion",
  components: {
    DictionaryComponent
  },
  data() {
    return {
      endDialog: false,
      size: 50,
      scrolled: 0,
      time_component: {
        enable: true,
      },
      answer: [],
      dialogDict: false,
      dialogCorrect: false,
      multi: false,
      review: {
        enable: false
      },
      questionCount: 0,
      selected: '',
      wordSearch: '',
      minimized: true,
      icons: {
        mdiBookAlphabet,
        mdiPlusCircle,
        mdiChevronRight,
        mdiChevronLeft,
        mdiChevronUp,
        mdiChevronDown,
        mdiBookSearch,
        mdiCardSearch,
        mdiClose
      },
    };
  },

  computed: {
    ...mapGetters([
      'formattedHours',
      'formattedMinutes',
      'formattedSeconds',
      'readingMode',
      'questionReadingTitle',
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
    ]),
    ...mapState({
      taskNumber: state => state.reading.taskNumber,
      readingMode: state => state.mainTPO.mode,
      reading: state => state.reading.reading,
      readingTest: state => state.reading.readingTest,
      questionNumber: state => state.reading.questionNumber,
      readingAnswers: state => state.reading.readingAnswers,
      readingAllQuestionsNumber: state => state.reading.readingAllQuestionsNumber,
    }),
  },
  updated() {
    let selectedText = '';

    // window.getSelection
    if (window.getSelection) {
      selectedText = window.getSelection();
    }
    // document.getSelection
    else if (document.getSelection) {
      selectedText = document.getSelection();
    }
    // document.selection
    else if (document.selection) {
      selectedText = document.selection.createRange().text;
    }
    this.selected = selectedText.toString();

  },
  mounted() {

    let k;
    for (k = 0; k < this.taskNumber; k++) {
      this.questionCount = this.questionCount + this.reading[k].questions.length
    }
    document.getElementById('passage').innerHTML = this.questionRelatedPassage;
    if (this.questionRelatedPassage) {
      let elmnt = $(`#passage #${this.questionRelatedParagraph}`)[0];
      elmnt.scrollIntoView();
    }
    let self = this;
    $(".my_class1").scroll(function () {
      self.scrolled = ($(this).scrollTop() + $(this).outerHeight()) / $(this)[0].scrollHeight;
    });
    this.answer = this.readingQuestionAnswer;
  },
  watch: {
    questionNumber: function () {
      document.getElementById('passage').innerHTML = this.questionRelatedPassage;
      if (this.questionRelatedParagraph) {
        var elmnt = $(`#passage #${this.questionRelatedParagraph}`)[0];
        elmnt.scrollIntoView();
      }
      this.answer = this.readingQuestionAnswer;
    }
  },
  methods: {
    endTPO() {
      this.$store.dispatch(SAVE_TPO);
    },
    closeDialogDict() {
      this.dialogDict = false;
      this.minimized = true;
      this.wordSearch = '';
    },
    searchDictionaryEnter(ev) {
      if (ev.charCode === 13) {
        this.minimized = false;
        this.$store.dispatch(LOAD_DICTIONARY, this.wordSearch)
      }
    },
    searchDictionary() {
      this.minimized = false;
      this.$store.dispatch(LOAD_DICTIONARY, this.wordSearch)
    },
    openDictionary() {
      this.dialogDict = true;
      this.$store.dispatch(LOAD_DICTIONARY, this.selected)
    },
    toggleTimeShow() {
      this.time_component.enable = !this.time_component.enable;
    },
    goToBack() {
      this.$store.dispatch(SAVE_ANSWER_READING, [this.readingQuestionId, this.answer]);
      this.$store.dispatch(GO_TO_PREVIOUS_READING);
    },
    goToNext: function () {
      this.$store.dispatch(SAVE_ANSWER_READING, [this.readingQuestionId, this.answer]);
      this.$store.dispatch(GO_TO_NEXT_READING);
    },
    onScroll() {
      var self = this;
      $(".my_class1").scroll(function () {
        self.scrolled = ($(this).scrollTop() + $(this).outerHeight()) / $(this)[0].scrollHeight;
        if (self.scrolled >= 0.95) {
          self.scrolledToBottom = true;
        }


      });
    },
    toggleReviewShow() {
      this.$store.dispatch(SAVE_ANSWER_READING, [this.readingQuestionId, this.answer]);
      this.$store.dispatch(TOGGLE_REVIEW);
    },
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


.my_class {
  margin: 1%;
  margin-left: 3%;
  background-color: transparent;
  overflow-y: scroll;

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

/*#question{*/
/*    font-size: 16px;*/
/*}*/
.toolbar {
  height: 130px;
  padding-top: 20px;
  background: linear-gradient(to right, rgb(61, 83, 135), rgb(113, 53, 60));
  -webkit-user-select: none;
  -webkit-app-region: drag;
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
</style>
