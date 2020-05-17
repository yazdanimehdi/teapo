<template>
    <v-app>
        <div>
            <v-container style="padding: 0" class="toolbar" fluid>
                <v-row style="padding-right: 20px; padding-top: 29px; padding-bottom: 12px">
                    <v-img src="../../assets/back.png" @click="closeReview" contain max-height="60px"
                           min-height="40px" position="right"></v-img>
                </v-row>
            </v-container>
            <div style="overflow-y: scroll; max-height: 850px;">
                <table class="tg" style="table-layout: fixed; width: 100%">
                    <colgroup>
                        <template v-if="mode === 'reviewMode'">
                            <col style="width: 80%">
                            <col style="width: 10%">
                            <col style="width: 10%">
                        </template>
                        <template v-else>
                            <col style="width: 90%">
                            <col style="width: 10%">
                        </template>
                    </colgroup>
                    <tr>
                        <th class="tg-veie">Questions</th>
                        <th class="tg-oe15">Correct Answer</th>
                        <th class="tg-oe15" v-if="mode === 'reviewMode'">Your Answer</th>
                    </tr>
                    <template v-for="(readingi, index) in reading">
                        <tr v-for="(question, qindex) in readingi.questions" :key="question.id">
                            <template v-if="seenQuestionsReading[[index, qindex]] === true">
                                <td class="tg-hvao" @click="gotoQuestion([index, qindex])"
                                    :id="[index, qindex].toString()"
                                    style="color: blue">{{question.question}}
                                </td>
                                <td class="tg-hvao" style="text-align: center;" v-if="mode === 'reviewMode'">
            <span v-for="code in reading[index].questions[qindex].right_answer" :key="code">
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
                                <td class="tg-hvao" style="text-align: center">
              <span v-for="code in readingAnswers[question.id]" :key="code">
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
                    </template>
                </table>

            </div>
        </div>
    </v-app>
</template>

<script>
    import {mapState} from 'vuex'
    import {
        GO_TO_READING_QUESTION,
        TOGGLE_REVIEW,
    } from "@/store/actions/reading";


    export default {
        name: "ReviewReading",
        computed: {
            ...mapState({
                reading: state => state.reading.reading,
                readingAnswers: state => state.reading.readingAnswers,
                seenQuestionsReading: state => state.reading.seenQuestionsReading,
                mode: state => state.reading.mode
            })
        },
        methods: {
            gotoQuestion(indices) {
                this.$store.dispatch(TOGGLE_REVIEW);
                this.$store.dispatch(GO_TO_READING_QUESTION, indices);
            },
            closeReview: function () {
                this.$store.dispatch(TOGGLE_REVIEW);
            }
        },
        data() {
            return {
                answers: [],
                ended: false,
                state: 0,
            }
        },
        mounted() {
            function eqSet(as, bs) {
                if (as.size !== bs.size) return false;
                for (var a of as) if (!bs.has(a)) return false;
                return true;
            }

            if (this.mode === 'reviewMode') {
                let i;
                for (i = 0; i < this.reading.length; i++) {
                    let j;
                    for (j = 0; j < this.reading[i].questions.length; j++) {
                        let a = [i, j];
                        let idToFind = a.toString();
                        if (this.reading[i].questions[j].right_answer === this.readingAnswers[this.reading[i].questions[j].id]) {
                            document.getElementById(idToFind).style.background = 'rgba(0,255,0,0.4)';
                        } else {
                            if (document.getElementById(idToFind) != null) {
                                if (this.reading[i].questions[j].right_answer.trim().split(/\s+/).length > 1) {
                                    let cloneAnswer = [...this.readingAnswers[this.reading[i].questions[j].id]];
                                    let setA = new Set(cloneAnswer);
                                    let setB = new Set(this.reading[i].questions[j].right_answer.trim().split(/\s+/));
                                    if (eqSet(setA, setB)) {
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
        }
    }
</script>

<style scoped>
    .toolbar {
        height: 130px;
        width: 100%;
        padding-top: 20px;
        background: linear-gradient(to right, rgb(61, 83, 135), rgb(113, 53, 60));
        -webkit-user-select: none;
        -webkit-app-region: drag;
    }

    .btn {
        height: 80px;
        width: auto;
        position: relative;
        bottom: 20px;
    }

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
