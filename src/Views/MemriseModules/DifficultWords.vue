<template>
    <v-app>
        <DifficultWordsAppBar :number="difficultWordsSession.length" :percent="(doneState/denominator)*100" :pause="pause" @play="pause = false" @pause="pause = true" style="position: fixed"/>
        <v-container style="margin-top: 80px; width: 700px; font-family: kalam; overflow-y:scroll; height: 100%" v-if="pause">
            <v-row justify="center" align="center">
                <v-col sm="6" md="6" lg="6" xl="6" style="text-align: center">
                    <v-btn icon height="200" width="200" @click="pause = false"><v-icon size="200">{{icons.mdiPlay}}</v-icon></v-btn>
                </v-col>
            </v-row>
            <v-row justify="center" align="center">
                <v-col sm="6" md="6" lg="6" xl="6" style="text-align: center">
                    <v-btn height="40" width="200" style="color: white" color="rgb(117, 117, 117)" to="/"><v-icon size="35">{{icons.mdiStop}}</v-icon> save and exit</v-btn>
                </v-col>
            </v-row>
        </v-container>
        <v-container style="margin-top: 80px; width: 700px; font-family: kalam; overflow-y:scroll; height: 100%" v-else>
            <v-row justify="center" align="center" v-if="difficultWordsSession.length !== 0">
                <v-col>
                    <v-card flat light height="500px">
                        <v-card-text>
                            <v-container v-if="difficultWordsSession[index]['state'] === -1">
                                <v-row>
                                    <v-col sm="8" md="8" lg="8" xl="8" style="border-bottom: gray thin solid">
                                        <div style="font-weight: bold; font-size: 30px; margin-top: 30px">
                                            {{difficultWordsSession[index]['word']}}
                                        </div>
                                    </v-col>

                                    <v-col sm="2" md="2" lg="2" xl="2" style="border-bottom: gray thin solid">
                                        <v-container fluid>
                                            <v-row>
                                                <v-col style="padding: 0">
                                                    <v-progress-linear :value="(difficultWordsSession[index]['state']/6)*100"
                                                                       height="15"
                                                                       striped
                                                                       rounded
                                                                       color="#5A4389"
                                                    ></v-progress-linear>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-col>
                                    <v-col sm="2" md="2" lg="2" xl="2" style="padding-bottom: 0">
                                        <v-hover
                                                v-slot:default="{ hover }"
                                        >
                                            <v-btn
                                                    :color="hover? 'rgb(246, 193, 67)' : 'rgb(197, 193, 193)'"
                                                    height="120" width="90" :elevation="hover? 8: 2"
                                                    @click="goToNext"
                                            >
                                                <v-container>
                                                    <v-row>
                                                        <v-col>
                                                            <v-icon x-large>
                                                                {{icons.mdiChevronRight}}
                                                            </v-icon>
                                                        </v-col>

                                                    </v-row>
                                                    <v-row>
                                                        <v-col style="font-weight: bold">
                                                            Next
                                                        </v-col>

                                                    </v-row>
                                                </v-container>

                                            </v-btn>
                                        </v-hover>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <div style="font-size: 36px; line-height: 40px">
                                            {{difficultWordsSession[index]['definition']}}
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col>
                                        <div style="font-size: 28px; margin-bottom: 10px; line-height: 30px"
                                             v-for="(example, index) in exampleList[index]" :key="index"><span
                                                style="color: red">{{index + 1}}</span> {{example['example']}}
                                        </div>
                                    </v-col>
                                </v-row>

                            </v-container>

                            <v-container v-if="difficultWordsSession[index]['state'] === 0">
                                <v-row>
                                    <v-col sm="8" md="8" lg="8" xl="8" style="border-bottom: gray thin solid">
                                        <div style="font-weight: bold; font-size: 22px; margin-top: 30px">
                                            {{difficultWordsSession[index]['definition']}}
                                        </div>
                                    </v-col>

                                    <v-col sm="2" md="2" lg="2" xl="2" style="padding-bottom: 0">
                                        <v-container fluid>
                                            <v-row>
                                                <v-col style="padding: 0">
                                                    <v-progress-linear :value="(difficultWordsSession[index]['state']/6)*100"
                                                                       height="15"
                                                                       striped
                                                                       rounded
                                                                       color="#5A4389"
                                                    ></v-progress-linear>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-col>
                                    <v-col sm="2" md="2" lg="2" xl="2" style="padding-bottom: 0">
                                        <v-hover
                                                v-slot:default="{ hover }"
                                        >
                                            <v-btn
                                                    :color="hover? 'rgb(246, 193, 67)' : 'rgb(197, 193, 193)'"
                                                    height="120" width="90" :elevation="hover? 8: 2"
                                                    @click="goToNextStateFive"
                                            >
                                                <v-container>
                                                    <v-row>
                                                        <v-col>
                                                            <v-icon x-large>
                                                                {{icons.mdiChevronRight}}
                                                            </v-icon>
                                                        </v-col>

                                                    </v-row>
                                                    <v-row>
                                                        <v-col style="font-weight: bold">
                                                            Next
                                                        </v-col>

                                                    </v-row>
                                                </v-container>

                                            </v-btn>
                                        </v-hover>
                                    </v-col>
                                </v-row>
                                <v-row style="width: 500px" align="center" justify="center">
                                    <v-col>
                                        <v-text-field filled flat v-model="textAnswer" outlined rounded
                                                      :placeholder="difficultWordsSession[index]['word']"
                                                      :success="selected ? answerCorrect : false"
                                                      :error="selected ? !answerCorrect : false"
                                                      style="font-size: 22px; font-weight: bold">

                                        </v-text-field>
                                    </v-col>
                                </v-row>

                            </v-container>

                            <v-container
                                    v-if="difficultWordsSession[index]['state'] === 1 || difficultWordsSession[index]['state'] === 3">
                                <v-row>
                                    <v-col sm="8" md="8" lg="8" xl="8" style="border-bottom: gray thin solid">
                                        <div style="font-weight: bold; font-size: 30px; margin-top: 30px">
                                            {{difficultWordsSession[index]['word']}}
                                        </div>
                                    </v-col>

                                    <v-col sm="2" md="2" lg="2" xl="2" style="border-bottom: gray thin solid">
                                        <v-container fluid>
                                            <v-row>
                                                <v-col style="padding: 0">
                                                    <v-progress-linear :value="(difficultWordsSession[index]['state']/6)*100"
                                                                       height="15"
                                                                       striped
                                                                       rounded
                                                                       color="#5A4389"
                                                    ></v-progress-linear>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col v-for="(def, ind) in answerChoices" :key="ind" cols="6" sm="6" md="6" lg="6"
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

                            <v-container
                                    v-if="difficultWordsSession[index]['state'] === 2 || difficultWordsSession[index]['state'] === 4">
                                <v-row>
                                    <v-col sm="8" md="8" lg="8" xl="8" style="border-bottom: gray thin solid">
                                        <div style="font-weight: bold; font-size: 22px; margin-top: 30px; line-height: 30px">
                                            {{difficultWordsSession[index]['definition']}}
                                        </div>
                                    </v-col>

                                    <v-col sm="2" md="2" lg="2" xl="2" style="border-bottom: gray thin solid">
                                        <v-container fluid>
                                            <v-row>
                                                <v-col style="padding: 0">
                                                    <v-progress-linear :value="(difficultWordsSession[index]['state']/6)*100"
                                                                       height="15"
                                                                       striped
                                                                       rounded
                                                                       color="#5A4389"
                                                    ></v-progress-linear>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col v-for="(def, ind) in answerChoices" :key="ind" cols="6" sm="6" md="6" lg="6"
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


                            <v-container v-if="difficultWordsSession[index]['state'] === 5">
                                <v-row>
                                    <v-col sm="8" md="8" lg="8" xl="8" style="border-bottom: gray thin solid">
                                        <div style="font-weight: bold; font-size: 24px; margin-top: 30px; line-height: 30px">
                                            {{difficultWordsSession[index]['definition']}}
                                        </div>
                                    </v-col>

                                    <v-col sm="2" md="2" lg="2" xl="2" style="border-bottom: gray thin solid">
                                        <v-container fluid>
                                            <v-row>
                                                <v-col style="padding: 0">
                                                    <v-progress-linear :value="(difficultWordsSession[index]['state']/6)*100"
                                                                       height="15"
                                                                       striped
                                                                       rounded
                                                                       color="#5A4389"
                                                    ></v-progress-linear>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-col>
                                    <v-col sm="2" md="2" lg="2" xl="2" style="padding-bottom: 0">
                                        <v-hover
                                                v-slot:default="{ hover }"
                                        >
                                            <v-btn
                                                    :color="hover? 'rgb(246, 193, 67)' : 'rgb(197, 193, 193)'"
                                                    height="120" width="90" :elevation="hover? 8: 2"
                                                    @click="goToNextStateFive"
                                            >
                                                <v-container>
                                                    <v-row>
                                                        <v-col>
                                                            <v-icon x-large>
                                                                {{icons.mdiChevronRight}}
                                                            </v-icon>
                                                        </v-col>

                                                    </v-row>
                                                    <v-row>
                                                        <v-col style="font-weight: bold">
                                                            Next
                                                        </v-col>

                                                    </v-row>
                                                </v-container>

                                            </v-btn>
                                        </v-hover>
                                    </v-col>
                                </v-row>
                                <v-row style="width: 500px" align="center" justify="center">
                                    <v-col>
                                        <v-text-field filled flat v-model="textAnswer" outlined rounded
                                                      :success="selected ? answerCorrect : false"
                                                      :error="selected ? !answerCorrect : false"
                                                      style="font-size: 22px; font-weight: bold">

                                        </v-text-field>
                                    </v-col>
                                </v-row>

                            </v-container>

                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <v-row v-else justify="center" align="center" style="text-align: center">
                <v-col>
                    <v-progress-circular color="#1C0153" size="100" indeterminate width="10"/>
                </v-col>
            </v-row>

        </v-container>
    </v-app>
</template>

<script>
    import DifficultWordsAppBar from "@/components/MemriseComponents/DifficultWordsAppBar";
    import {mapState} from 'vuex'
    import {mdiChevronRight, mdiPlay, mdiStop} from '@mdi/js'
    import {GO_TO_NEXT_DIFFICULT_WORD} from "@/store/actions/studyWords";

    export default {
        name: "DifficultWords",
        components: {DifficultWordsAppBar},
        data() {
            return {
                index: 0,
                icons: {
                    mdiStop,
                    mdiPlay,
                    mdiChevronRight
                },
                pause: false,
                selected: false,
                clickedIndex: 0,
                answerCorrect: false,
                textAnswer: '',
                done: false,
                doneState: 0,

            }
        },
        computed: {
            ...mapState({
                words: state => state.studyWords.words,
                difficultWordsSession: state => state.studyWords.difficultWordsSession,
                exampleList: state => state.studyWords.difficultExampleList,
                randomWords: state => state.studyWords.randomWords,
                randomDefs: state => state.studyWords.randomDefs,
                denominator: state => state.studyWords.denominator,
            }),
            answerChoices() {
                let answerChoices = []
                let correctAnswer = 0

                if (this.difficultWordsSession[this.index]['state'] === 1) {
                    if (this.words.length >= 4) {
                        correctAnswer = this.getRandomInt(0, 4);
                        for (let i = 0; i < 4; i++) {
                            if (i === correctAnswer) {
                                answerChoices.push({
                                    'def': this.difficultWordsSession[this.index]['definition'],
                                    'answer': true
                                })
                            } else {
                                let a = this.getRandomInt(0, this.words.length)
                                let answerChoicesDef = []
                                for (let j = 0; j < answerChoices.length; j++) {
                                    answerChoicesDef.push(answerChoices[j]['def'])
                                }
                                while (this.words[a]['word'] === this.difficultWordsSession[this.index]['word'] || answerChoicesDef.indexOf(this.words[a]['definition']) !== -1) {
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
                                    'def': this.difficultWordsSession[this.index]['definition'],
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

                if (this.difficultWordsSession[this.index]['state'] === 2) {
                    if (this.words.length >= 4) {
                        correctAnswer = this.getRandomInt(0, 4);
                        for (let i = 0; i < 4; i++) {
                            if (i === correctAnswer) {
                                answerChoices.push({
                                    'def': this.difficultWordsSession[this.index]['word'],
                                    'answer': true
                                })
                            } else {
                                let a = this.getRandomInt(0, this.words.length)
                                let answerChoicesDef = []
                                for (let j = 0; j < answerChoices.length; j++) {
                                    answerChoicesDef.push(answerChoices[j]['def'])
                                }

                                while (this.words[a]['word'] === this.difficultWordsSession[this.index]['word'] || answerChoicesDef.indexOf(this.words[a]['word']) !== -1) {
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
                                    'def': this.difficultWordsSession[this.index]['word'],
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

                if (this.difficultWordsSession[this.index]['state'] === 3) {
                    if (this.words.length >= 8) {
                        correctAnswer = this.getRandomInt(0, 8);
                        for (let i = 0; i < 8; i++) {
                            if (i === correctAnswer) {
                                answerChoices.push({
                                    'def': this.difficultWordsSession[this.index]['definition'],
                                    'answer': true
                                })
                            } else {
                                let a = this.getRandomInt(0, this.words.length)
                                let answerChoicesDef = []
                                for (let j = 0; j < answerChoices.length; j++) {
                                    answerChoicesDef.push(answerChoices[j]['def'])
                                }
                                while (this.words[a]['word'] === this.difficultWordsSession[this.index]['word'] || answerChoicesDef.indexOf(this.words[a]['definition']) !== -1) {
                                    a = this.getRandomInt(0, this.words.length)
                                }
                                answerChoices.push({'def': this.words[a]['definition'], 'answer': false})
                            }
                        }
                    } else {
                        correctAnswer = this.getRandomInt(0, 8);
                        for (let i = 0; i < 8; i++) {
                            if (i === correctAnswer) {
                                answerChoices.push({
                                    'def': this.difficultWordsSession[this.index]['definition'],
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

                if (this.difficultWordsSession[this.index]['state'] === 4) {
                    if (this.words.length >= 4) {
                        correctAnswer = this.getRandomInt(0, 8);
                        for (let i = 0; i < 8; i++) {
                            if (i === correctAnswer) {
                                answerChoices.push({
                                    'def': this.difficultWordsSession[this.index]['word'],
                                    'answer': true
                                })
                            } else {
                                let a = this.getRandomInt(0, this.words.length)
                                let answerChoicesDef = [];
                                for (let j = 0; j < answerChoices.length; j++) {
                                    answerChoicesDef.push(answerChoices[j]['def'])
                                }
                                while (this.words[a]['word'] === this.difficultWordsSession[this.index]['word'] || answerChoicesDef.indexOf(this.words[a]['word']) !== -1) {
                                    a = this.getRandomInt(0, this.words.length)
                                }
                                answerChoices.push({'def': this.words[a]['word'], 'answer': false})
                            }
                        }
                    } else {
                        correctAnswer = this.getRandomInt(0, 8);
                        for (let i = 0; i < 8; i++) {
                            if (i === correctAnswer) {
                                answerChoices.push({
                                    'def': this.difficultWordsSession[this.index]['word'],
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
        methods: {
            goToNextStateFive() {
                let self = this;
                if (typeof (String.prototype.trim) === "undefined") {
                    String.prototype.trim = function () {
                        return String(this).replace(/^\s+|\s+$/g, '');
                    };
                }
                if (this.textAnswer.trim().toLowerCase() === this.difficultWordsSession[this.index]['word'].trim().toLowerCase()) {
                    this.selected = true;
                    this.answerCorrect = true;
                    setTimeout(function () {
                        self.goToNext(true)
                    }, 1000)

                } else {
                    this.selected = true;
                    this.answerCorrect = false;
                    setTimeout(function () {
                        self.goToNext(false)
                    }, 1000)
                }
            },
            getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min)) + min;
            }
            ,
            goToNext(answer) {
                this.textAnswer = '';
                this.selected = false;
                this.answerCorrect = false;
                this.doneState += 1;
                this.$store.dispatch(GO_TO_NEXT_DIFFICULT_WORD, {
                    'word': this.difficultWordsSession[this.index],
                    'correct': answer
                })
                if (this.difficultWordsSession.length !== 0) {
                    if (this.index + 1 >= this.difficultWordsSession.length) {
                        this.index = 0
                    } else {
                        this.index += 1
                    }
                } else {
                    this.$router.push('/');
                }
            }
            ,
            selectChoice(answer, index) {
                this.selected = true;
                this.clickedIndex = index;
                let self = this;
                setTimeout(function () {
                    self.goToNext(answer);
                }, 1000)
            }
        }
    }
</script>

<style scoped>
    .hover-before {
        background-color: rgb(197, 193, 193);
    }

    .hover-after {
        background-color: black;
    }

</style>