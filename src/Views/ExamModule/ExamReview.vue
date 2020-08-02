<template>
  <v-app>
    <v-app-bar absolute
               color="#1C0153"
               dark
               :height="height*0.1"

               src="../../assets/icon_group.png"
               style="padding-top:8px;margin: 0;position: fixed; z-index: 10; font-family: Kalam">
      <div style="font-weight: bold; font-size: 20px">Exam Review</div>
      <v-spacer></v-spacer>
      <v-btn icon to="/">
        <v-icon>{{ icons.mdiChevronRight }}</v-icon>
      </v-btn>
    </v-app-bar>

    <div
        :style="{'margin-left':`${width*0.06}px`, 'margin-right': `${width*0.06}px`, 'margin-top': `${height*0.1 + 30}px`}">
      <div v-if="loading">
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
      <v-expansion-panels
          focusable
          tile
          hover
          v-else
          v-model="panel"
      >
        <v-expansion-panel>
          <v-expansion-panel-header style="font-family: kalam; font-size: 20px; font-weight: bold">
            <v-container fluid>
              <v-row>
                <v-col cols="6" sm="6" md="6" lg="6" xl="6" style="text-align: left; padding: 0; color: #1C0153">
                  Reading
                </v-col>
                <v-col cols="6" sm="6" md="6" lg="6" xl="6"
                       style="text-align: right; padding: 0 20px 0 0; color: limegreen">
                  Score: {{ readingReviewScore === null ? '-' : readingReviewScore }}/30
                </v-col>
              </v-row>
            </v-container>

            <template v-slot:actions>
              <v-icon color="#1C0153">{{ icons.mdiChevronDown }}</v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div style="overflow-y: scroll; max-height: 850px;">
              <table class="tg" style="table-layout: fixed; width: 100%">
                <colgroup>
                  <template>
                    <col style="width: 80%">
                    <col style="width: 10%">
                    <col style="width: 10%">
                  </template>
                </colgroup>
                <tr>
                  <th class="tg-veie">Questions</th>
                  <th class="tg-oe15">Correct Answer</th>
                  <th class="tg-oe15">Your Answer</th>
                </tr>
                <tr v-for="(question, qindex) in readingQuestionsWithIndex" :key="qindex">
                  <template>
                    <td class="tg-hvao" @click="gotoQuestionReading([question[0], question[1]])"
                        style="color: blue">reading:{{ question[0] + 1 }} - {{ question[2].question }}
                    </td>
                    <td class="tg-hvao" style="text-align: center;">
            <span v-for="(code, codeIndex) in question[2].right_answer" :key="codeIndex">
            <span v-if="code === '1'">
              A
            </span>
               <span v-if="code === '2'">
              B
            </span>
               <span v-if="code === '3'">
              C
            </span>
               <span v-if="code === '4'">
              D
            </span>
                <span v-if="code === '5'">
              E
            </span>
                <span v-if="code === '6'">
              F
            </span>

              </span>
                    </td>
                    <td class="tg-hvao" style="text-align: center" :id="[question[0], question[1]].toString()">
              <span v-for="(code, i) in readingAnswers[question[2].id]" :key="i">
              <span v-if="code === '1'">
                A
              </span>
                 <span v-if="code  === '2'">
                B
              </span>
                 <span v-if="code  === '3'">
                C
              </span>
                 <span v-if="code  === '4'">
                D
              </span>
                  <span v-if="code  === '5'">
                E
              </span>
                  <span v-if="code  === '6'">
                F
              </span>

                </span>
                    </td>
                  </template>
                </tr>
              </table>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header style="font-family: kalam; font-size: 20px; font-weight: bold">
            <v-container fluid>
              <v-row>
                <v-col cols="6" sm="6" md="6" lg="6" xl="6" style="text-align: left; padding: 0; color: #1C0153">
                  Listening
                </v-col>
                <v-col cols="6" sm="6" md="6" lg="6" xl="6"
                       style="text-align: right; padding: 0 20px 0 0; color: limegreen">
                  Score: {{ listeningReviewScore === null ? '-' : listeningReviewScore }}/25
                </v-col>
              </v-row>
            </v-container>

            <template v-slot:actions>
              <v-icon color="#1C0153">{{ icons.mdiChevronDown }}</v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div v-for="(listeningPart, part) in listening" :key="part" style="margin-top: 20px">
              part {{ part + 1 }} :
              <span v-for="(listening, index) in listeningPart" :key="index"
                    style="margin-left: 10px; margin-right: 10px">
                  <v-btn @click="gotoQuestionListening([part, index, -1])">{{ listening.type }}</v-btn>
                </span>
            </div>
            <div style="overflow-y: scroll; max-height: 850px;">
              <table class="tg" style="table-layout: fixed; width: 100%">
                <colgroup>
                  <template>
                    <col style="width: 80%">
                    <col style="width: 10%">
                    <col style="width: 10%">
                  </template>
                </colgroup>
                <tr>
                  <th class="tg-veie">Questions</th>
                  <th class="tg-oe15">Correct Answer</th>
                  <th class="tg-oe15">Your Answer</th>
                </tr>
                <tr v-for="(question, qindex) in listeningQuestions" :key="qindex">
                  <template>
                    <td class="tg-hvao" @click="gotoQuestionListening([question[0], question[1], question[2]])"
                        style="color: blue">part:{{ question[0] + 1 }}, listening:{{ question[1] + 1 }} -
                      {{ question[3].question }}
                    </td>
                    <td class="tg-hvao" style="text-align: center;">
            <span v-for="(code, codeIndex) in question[3].right_answer" :key="codeIndex">
            <span v-if="code === '1'">
              A
            </span>
               <span v-if="code === '2'">
              B
            </span>
               <span v-if="code === '3'">
              C
            </span>
               <span v-if="code === '4'">
              D
            </span>
                <span v-if="code === '5'">
              E
            </span>
                <span v-if="code === '6'">
              F
            </span>

              </span>
                    </td>
                    <td class="tg-hvao" style="text-align: center"
                        :id="[question[0], question[1], question[3]].toString()">
              <span v-for="(code, i) in listeningAnswers[question[3].id]" :key="i">
              <span v-if="code === '1'">
                A
              </span>
                 <span v-if="code  === '2'">
                B
              </span>
                 <span v-if="code  === '3'">
                C
              </span>
                 <span v-if="code  === '4'">
                D
              </span>
                  <span v-if="code  === '5'">
                E
              </span>
                  <span v-if="code  === '6'">
                F
              </span>

                </span>
                    </td>
                  </template>
                </tr>
              </table>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header style="font-family: kalam; font-size: 20px; font-weight: bold">
            <v-container fluid>
              <v-row justify="center" align="center">
                <v-col cols="6" sm="6" md="6" lg="6" xl="6" style="text-align: left; padding: 0; color: #1C0153">
                  Speaking
                </v-col>
                <v-col cols="4" sm="4" md="4" lg="4" xl="4"
                       style="padding: 0 20px 0 0; text-align: right">
                  <v-btn @click="buyDialog = true" color="#1C0153" style="color: white; font-weight: bold"
                         :disabled="Object.keys(speakingAnswers).length === 0 && speakingAnswers.constructor === Object">
                    Correct
                  </v-btn>
                </v-col>
                <v-col cols="2" sm="2" md="2" lg="2" xl="2"
                       style="text-align: right; padding: 0 20px 0 0; color: limegreen">
                  Score: {{ speakingReviewScore === null ? '-' : speakingReviewScore }}/25
                </v-col>
              </v-row>
            </v-container>

            <template v-slot:actions>
              <v-icon color="#1C0153">{{ icons.mdiChevronDown }}</v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>

            <div style="overflow-y: scroll; max-height: 850px;">
              <table class="tg" style="table-layout: fixed; width: 100%">
                <colgroup>
                  <template>
                    <col style="width: 60%">
                    <col style="width: 40%">
                  </template>
                </colgroup>
                <tr>
                  <th class="tg-veie">Questions</th>
                  <th class="tg-oe15">Your Answer</th>
                </tr>
                <tr v-for="(speakingInst, index) in speaking" :key="index">
                  <td class="tg-hvao" @click="gotoQuestionSpeaking(index)"
                      style="color: blue">Number:{{ speakingInst['number'] }} - {{ speakingInst['speaking_question'] }}
                  </td>
                  <td class="tg-hvao">
                    <audio :src="speakingAnswers[speakingInst['id']]" style="width: 250px" controls
                           v-if="speakingAnswers[speakingInst['id']] !== undefined"></audio>
                    <div v-else>
                      You did not answer this question
                    </div>
                  </td>
                </tr>
              </table>
            </div>

          </v-expansion-panel-content>
        </v-expansion-panel>

        <v-expansion-panel>
          <v-expansion-panel-header style="font-family: kalam; font-size: 20px; font-weight: bold">
            <v-container fluid>
              <v-row justify="center" align="center">
                <v-col cols="6" sm="6" md="6" lg="6" xl="6" style="text-align: left; padding: 0; color: #1C0153">
                  Writing
                </v-col>
                <v-col cols="4" sm="4" md="4" lg="4" xl="4"
                       style="padding: 0 20px 0 0; text-align: right">
                  <v-btn @click="buyDialog = true" color="#1C0153" style="color: white; font-weight: bold"
                         :disabled="Object.keys(speakingAnswers).length === 0 && speakingAnswers.constructor === Object">
                    Correct
                  </v-btn>
                </v-col>
                <v-col cols="2" sm="2" md="2" lg="2" xl="2"
                       style="text-align: right; padding: 0 20px 0 0; color: limegreen">
                  Score: {{ writingReviewScore === null ? '-' : writingReviewScore }}/25
                </v-col>

              </v-row>
            </v-container>

            <template v-slot:actions>
              <v-icon color="#1C0153">{{ icons.mdiChevronDown }}</v-icon>
            </template>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <div style="margin-top: 20px">
              <div v-for="(writingInst, index) in writing" :key="index" style="background-color: #c0c0c0">
                <div style="padding: 20px;  border-bottom: solid white thin; color: blue" @click="gotoQuestionWriting(index)">
                  {{ writingInst['writing_question'] }}
                </div>
                <div style="background-color: white; padding: 20px">
                  {{writingAnswers[writingInst['id']] === undefined ? 'You did not answer this question' : writingAnswers[writingInst['id']]}}
                </div>
              </div>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <v-dialog width="400" v-model="buyDialog">
      <v-card width="400" height="400"></v-card>
    </v-dialog>

  </v-app>
</template>

<script>
import {mdiChevronRight, mdiChevronDown} from '@mdi/js'
import {mapState, mapGetters} from "vuex";
import {GO_TO_READING_QUESTION} from "@/store/actions/reading";
import {GO_TO_EXAM_REVIEW, SET_REVIEW_USER_TEST_ID} from "@/store/actions/reviewExam";
import {CHANGE_TPO_MODE, SET_REVIEW_TIMES} from "@/store/actions/mainTPO";
import {TIME_STOP} from "@/store/actions/time";
import {GO_TO_LISTENING_QUESTION} from "@/store/actions/listening";
import {GO_TO_SPEAKING_QUESTION} from "@/store/actions/speaking";
import {GO_TO_WRITING_QUESTION} from "@/store/actions/writing";

export default {
  name: "ExamReview",
  data() {
    return {
      width: 0,
      height: 0,
      icons: {
        mdiChevronRight,
        mdiChevronDown
      },
      answers: [],
      ended: false,
      state: 0,
      loading: true,
      panel: [],
      buyDialog: false
    }
  },

  created() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    let self = this;
    let userTestId = this.$route.query['id'] ;
    this.$store.dispatch(SET_REVIEW_USER_TEST_ID, userTestId)
    this.$store.dispatch(CHANGE_TPO_MODE, 'reviewMode')
    this.$store.dispatch(TIME_STOP, true)
    this.$store.dispatch(GO_TO_EXAM_REVIEW).then(() => {
      self.loading = false;
      self.$store.dispatch(SET_REVIEW_TIMES)
    })
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  watch: {
    panel(newVal) {
      if (newVal === 0) {
        for (let i = 0; i < this.readingQuestionsWithIndex.length; i++) {
          let a = [this.readingQuestionsWithIndex[i][0], this.readingQuestionsWithIndex[i][1]];
          let idToFind = a.toString();
          if (this.readingQuestionsWithIndex[i][2].right_answer === this.readingAnswers[this.readingQuestionsWithIndex[i][2].id]) {
            document.getElementById(idToFind).style.background = 'rgba(0,255,0,0.4)';
          } else {
            if (document.getElementById(idToFind) != null) {
              if (this.readingQuestionsWithIndex[i][2].right_answer.trim().split(/\s+/).length > 1) {
                let cloneAnswer = [...this.readingAnswers[this.readingQuestionsWithIndex[i][2].id]];
                let setA = new Set(cloneAnswer);
                let setB = new Set(this.readingQuestionsWithIndex[i][2].right_answer.trim().split(/\s+/));
                if (this.eqSet(setA, setB)) {
                  document.getElementById(idToFind).style.background = 'rgba(0,255,0,0.4)';
                } else {
                  document.getElementById(idToFind).style.background = 'rgba(255,0,0,0.4)';
                }
              } else {
                document.getElementById(idToFind).style.background = 'rgba(255,0,0,0.4)';
              }

            }

          }
        }
      }
      if (newVal === 1) {
        for (let i = 0; i < this.listeningQuestions.length; i++) {
          let a = [this.listeningQuestions[i][0], this.listeningQuestions[i][1], this.listeningQuestions[i][2]];
          let idToFind = a.toString();
          if (this.listeningQuestions[i][3].right_answer === this.listeningAnswers[this.listeningQuestions[i][3].id]) {
            document.getElementById(idToFind).style.background = 'rgba(0,255,0,0.4)';
          } else {
            if (document.getElementById(idToFind) != null) {
              if (this.listeningQuestions[i][3].right_answer.trim().split(/\s+/).length > 1) {
                let cloneAnswer = [...this.listeningAnswers[this.listeningQuestions[i][3].id]];
                let setA = new Set(cloneAnswer);
                let setB = new Set(this.listeningQuestions[i][3].right_answer.trim().split(/\s+/));
                if (this.eqSet(setA, setB)) {
                  document.getElementById(idToFind).style.background = 'rgba(0,255,0,0.4)';
                } else {
                  document.getElementById(idToFind).style.background = 'rgba(255,0,0,0.4)';
                }
              } else {
                document.getElementById(idToFind).style.background = 'rgba(255,0,0,0.4)';
              }

            }

          }
        }
      }
    }
  },
  methods: {
    handleResize() {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    },
    gotoQuestionReading(indices) {
      this.$router.push('/tpo')
      this.$store.dispatch(GO_TO_READING_QUESTION, indices);
    },
    gotoQuestionListening(indices) {
      this.$router.push('/tpo')
      this.$store.dispatch(GO_TO_LISTENING_QUESTION, indices);
    },
    gotoQuestionSpeaking(index) {
      this.$router.push('/tpo')
      this.$store.dispatch(GO_TO_SPEAKING_QUESTION, index);
    },
    gotoQuestionWriting(index) {
      this.$router.push('/tpo')
      this.$store.dispatch(GO_TO_WRITING_QUESTION, index);
    },
    eqSet(as, bs) {
      if (as.size !== bs.size) return false;
      for (var a of as) if (!bs.has(a)) return false;
      return true;
    }
  },
  computed: {
    ...mapState({
      readingAnswers: state => state.reading.readingAnswers,
      listeningAnswers: state => state.listening.listeningAnswers,
      listening: state => state.listening.listening,
      speaking: state => state.speaking.speaking,
      speakingAnswers: state => state.speaking.answers,
      writing: state => state.writing.writing,
      writingAnswers: state => state.writing.answers,
    }),
    ...mapGetters(['readingReviewScore',
      'listeningReviewScore',
      'speakingReviewScore',
      'writingReviewScore',
      'readingQuestionsWithIndex',
      'listeningQuestions'])
  },
}
</script>

<style scoped>

.tg {
  border-collapse: collapse;
  border-spacing: 0
}

.tg td {
  font-family: Verdana, sans-serif;
  font-size: 14px;
  padding: 10px 5px;
  border-style: solid;
  border-width: 1px;
  overflow: hidden;
  word-break: normal;
  border-color: black;
}

.tg th {
  font-family: Verdana, sans-serif;
  font-size: 14px;
  font-weight: normal;
  padding: 10px 5px;
  border-style: solid;
  border-width: 1px;
  overflow: hidden;
  word-break: normal;
  border-color: black;
}

.tg .tg-veie {
  font-family: Verdana, Geneva, sans-serif !important;;
  background-color: #ffffff;
  border-color: #ffffff;
  text-align: left
}

.tg .tg-oe15 {
  ont-family: Verdana;
  background-color: #ffffff;
  border-color: #ffffff;
  text-align: center;
  vertical-align: top
}

.tg .tg-hvao {
  ont-family: Verdana;
  background-color: #c0c0c0;
  border-color: #ffffff;
  text-align: left;
  vertical-align: top;
  height: 40px
}

</style>