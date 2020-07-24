<template>
    <v-app>
        <speed-review-app-bar :hearts="hearts" :number="correct"/>
        <v-container fluid v-if="!start" style="margin-top: 200px; width: 100px">
            <v-row align="center" justify="center">
                <v-col v-if="startBackCount !== 0">
                    <div class="dot"><span>{{startBackCount}}</span></div>
                </v-col>
                <v-col v-if="startBackCount === 0">
                    <div class="start">Start</div>
                </v-col>
            </v-row>
        </v-container>
        <v-container v-else style="margin-top: 80px; width: 700px; font-family: kalam; overflow-y:scroll; height: 100%">
            <v-row justify="center" align="center" v-if="learningSession.length !== 0">
                <div class="fill" :style="{'height': `${timeElapsed}%`}"></div>
                <v-col>
                    <v-card light height="100%">
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col sm="8" md="8" lg="8" xl="8" style="border-bottom: gray thin solid;">
                                        <div style="font-weight: bold; font-size: 70px; margin-top: 30px; margin-bottom: 40px">
                                            <span v-if="rand === 1">{{learningSession[index]['word']}}</span>
                                            <span v-else style="font-weight: bold; font-size: 24px; margin-top: 30px; line-height: 30px">{{learningSession[index]['definition']}}</span>
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col v-for="(def, ind) in answerChoices" :key="ind" cols="6" sm="6" md="6"
                                           lg="6"
                                           xl="6">
                                        <v-card style="height: 100%" @click="selectChoice(def['answer'], ind)"
                                                :color="clickedIndex === ind ? selected ? def['answer'] ? 'success' : 'error' : 'white': 'white'">
                                            <v-card-text style="font-size: 22px; line-height: 30px">
                                                {{def['def']}}
                                            </v-card-text>
                                        </v-card>
                                    </v-col>
                                </v-row>

                            </v-container>
                        </v-card-text>
                    </v-card>

                </v-col>
            </v-row>
        </v-container>
        <v-overlay :value="done" opacity="0.8">
            <v-container>
                <v-row>
                    <v-col style="text-align: center">
                        <v-icon color="rgb(233, 141, 140)" size="250">{{icons.mdiHeartBroken}}</v-icon>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <h2 style="font-weight: bold; text-align: center; font-family: kalam; font-size: 60px">
                            Uh oh!
                        </h2>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <h2 style="text-align: center; font-family: kalam; font-size: 30px">
                            You ran out of hearts!
                        </h2>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-btn block x-large rounded light color="rgb(68, 68, 68)" outlined
                               style="color: white; font-weight: bold; font-family: kalam"
                               @click="$router.push('/')">Continue
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-overlay>
    </v-app>
</template>

<script>
    import SpeedReviewAppBar from "@/components/MemriseComponents/SpeedReviewAppBar";
    import {mdiAlien, mdiChevronRight, mdiHeartBroken} from "@mdi/js";
    import {mapState} from "vuex";
    import {GO_TO_NEXT_SPEED_REVIEW} from '@/store/actions/studyWords'

    export default {
        name: "SpeedReview",
        components: {SpeedReviewAppBar},
        data() {
            return {
                index: 0,
                icons: {
                    mdiAlien,
                    mdiChevronRight,
                    mdiHeartBroken

                },
                selected: false,
                clickedIndex: 0,
                answerCorrect: false,
                textAnswer: '',
                done: false,
                doneState: 0,
                timeElapsed: 0,
                rand: 1,
                totalTime: 20,
                start: false,
                startBackCount: 3,
                interval: 0,
                hearts: 3,
                correct: 0,
            }
        },
        mounted() {
            let self = this;
            let startTimer = setInterval(function () {
                if (self.startBackCount > 0) {
                    self.startBackCount -= 1
                } else {
                    self.start = true
                }
            }, 1000)
            setTimeout(function () {
                clearInterval(startTimer);
                this.interval = setInterval(function () {
                    if (self.totalTime > 0) {
                        self.totalTime -= 0.01;
                        self.timeElapsed = ((20 - self.totalTime) / 20) * 100
                    } else {
                        self.removeHeart()
                        if (self.index + 1 >= self.learningSession.length) {
                            self.done = true
                        }
                        else {
                            self.index += 1
                        }

                    }
                }, 1)
            }, 4000)
        },
        computed: {
            ...mapState({
                words: state => state.studyWords.words,
                learningSession: state => state.studyWords.SpeedReviewSession,
                randomWords: state => state.studyWords.randomWords,
                randomDefs: state => state.studyWords.randomDefs,
            }),
            answerChoices() {
                let answerChoices = []
                let correctAnswer = 0
                if (this.rand === 1) {
                    if (this.words.length >= 4) {
                        correctAnswer = this.getRandomInt(0, 4);
                        for (let i = 0; i < 4; i++) {
                            if (i === correctAnswer) {
                                answerChoices.push({
                                    'def': this.learningSession[this.index]['definition'],
                                    'answer': true
                                })
                            } else {
                                let a = this.getRandomInt(0, this.words.length)
                                let answerChoicesDef = []
                                for (let j = 0; j < answerChoices.length; j++) {
                                    answerChoicesDef.push(answerChoices[j]['def'])
                                }
                                while (this.words[a]['word'] === this.learningSession[this.index]['word'] || answerChoicesDef.indexOf(this.words[a]['definition']) !== -1) {
                                    a = this.getRandomInt(0, this.words.length)
                                }
                                answerChoices.push({'def': this.words[a]['definition'], 'answer': false})
                            }
                        }
                    } else {
                        correctAnswer = this.getRandomInt(0, 4);
                        for (let i = 0; i < 4; i++) {
                            if (i === correctAnswer) {
                                answerChoices.push({
                                    'def': this.learningSession[this.index]['definition'],
                                    'answer': true
                                })
                            } else {
                                let a = this.getRandomInt(0, this.randomDefs.length)
                                answerChoices.push({'def': this.randomDefs[a], 'answer': false})
                            }
                        }
                    }
                    return answerChoices
                }

                if (this.rand === 2) {
                    if (this.words.length >= 4) {
                        correctAnswer = this.getRandomInt(0, 4);
                        for (let i = 0; i < 4; i++) {
                            if (i === correctAnswer) {
                                answerChoices.push({
                                    'def': this.learningSession[this.index]['word'],
                                    'answer': true
                                })
                            } else {
                                let a = this.getRandomInt(0, this.words.length)
                                let answerChoicesDef = []
                                for (let j = 0; j < answerChoices.length; j++) {
                                    answerChoicesDef.push(answerChoices[j]['def'])
                                }

                                while (this.words[a]['word'] === this.learningSession[this.index]['word'] || answerChoicesDef.indexOf(this.words[a]['word']) !== -1) {
                                    a = this.getRandomInt(0, this.words.length)
                                }

                                answerChoices.push({'def': this.words[a]['word'], 'answer': false})
                            }
                        }
                    } else {
                        correctAnswer = this.getRandomInt(0, 4);
                        for (let i = 0; i < 4; i++) {
                            if (i === correctAnswer) {
                                answerChoices.push({
                                    'def': this.learningSession[this.index]['word'],
                                    'answer': true
                                })
                            } else {
                                let a = this.getRandomInt(0, this.randomWords.length)
                                answerChoices.push({'def': this.randomWords[a], 'answer': false})
                            }
                        }
                    }
                    return answerChoices
                }
                return 0
            }
        },
        beforeDestroy() {
            clearInterval(this.interval)
        },
        methods: {

            goToNext(answer) {
                this.rand = this.getRandomInt(1, 3)
                if(answer){
                    this.correct += 1;
                }
                this.$store.dispatch(GO_TO_NEXT_SPEED_REVIEW, {
                    'word': this.learningSession[this.index],
                    'correct': answer
                })
                if (this.index + 1 >= this.learningSession.length) {
                    clearInterval(this.interval)
                    this.done = true
                } else {
                    this.selected = false;
                    this.answerCorrect = false;
                    if (answer === true) {
                        if (this.totalTime + 6 >= 20) {
                            this.totalTime = 20
                        } else {
                            this.totalTime += 6;
                        }
                    } else {
                        this.removeHeart()
                    }
                    this.index += 1;
                }
            },
            getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min)) + min;
            },
            selectChoice(answer, index) {
                this.selected = true;
                this.clickedIndex = index;
                let self = this;
                setTimeout(function () {
                    self.goToNext(answer);
                }, 200)
            },
            removeHeart() {
                if (this.hearts - 1 >= 0) {
                    this.hearts -= 1;
                    this.totalTime = 20;
                } else {
                    clearInterval(this.interval)
                    this.done = true
                }

            }
        }
    }
</script>

<style scoped>
    .fill {
        text-align: center;
        color: white;
        background-color: rgba(255, 0, 0, 0.6);
        position: absolute;
        bottom: 0;
        width: 100%;
        border-radius: 10px;

    }

    .dot {
        text-align: center;
        font-family: kalam;
        color: white;
        font-size: 80px;
        height: 100px;
        background-color: rgb(228, 81, 61);
        width: 100px;
        border-radius: 50%;
        display: inline-block;
        font-weight: bold;
        margin: 0 auto;
    }

    .start {
        text-align: center;
        font-family: kalam;
        font-weight: bold;
        font-size: 60px;
        color: rgb(228, 81, 61);
        width: 100px;
    }
</style>