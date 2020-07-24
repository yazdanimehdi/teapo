<template>
    <v-card :flat="flat" v-if="wildCards.length !== 0" :width="width" height="300px"
            style="overflow-y: scroll; border-radius: 15px">
        <v-card-title>Suggestions</v-card-title>
        <v-card-text>
            <v-container fluid>
                <v-row v-for="(word, index) in wildCards" :key="index">
                    <v-btn text @click="goToWord(word)">{{word}}</v-btn>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
    <v-card :flat="flat" v-else-if="wordDefinition.length === 0" :width="width" height="100px"
            style="overflow-y: scroll; border-radius: 15px">
        <v-card-title>Word Not Found</v-card-title>
    </v-card>
    <v-card :flat="flat" v-else :width="width" height="500px" style="overflow-y: scroll; border-radius: 15px">
        <v-card-text style="overflow-y: scroll">
            <v-container fluid>
                <v-row v-if="wordFamily.length !== 0">
                    <span style="padding: 5px; background-color: rgb(237, 214, 71); color: white; border-radius: 10px">Word family</span>
                    <span v-for="word in wordFamily" :key="word['id']" style="font-size: 18px; padding: 5px"><span
                            style="color: green; font-weight: bold">({{word['position']}})</span><span>{{word['word']}}</span></span>
                </v-row>
                <v-row v-for="(def, index_def) in wordDefinition" :key="index_def">
                    <v-col>
                        <div style="font-size: 18px">
                            <span style="font-weight: bold; font-size: 30px">{{word}}</span><span
                                style="color: red; font-weight: bold" v-if="wordDefinition.length > 1">{{def['def']['homnum']}}</span>
                            <span style="padding-left: 15px"
                                  v-if="def['def']['pron'] !== ''">\{{def['def']['pron']}}\</span>
                            <span style="padding-left: 15px">{{def['def']['frequency']}}</span>
                            <span style="padding-left: 15px; color: green">{{def['def']['position']}}</span>
                            <span style="padding-left: 15px; color: green">{{def['def']['gram']}}</span>
                        </div>

                        <div v-for="(meaning, index_mean) in def['meanings']" :key="index_mean" style="padding: 10px">
                            {{meaning['sensenum']}} <span
                                style="border-radius: 10px; background-color: orange; color: white; padding: 4px; margin-left: 10px"
                                v-if="meaning['signpost'] !== ''">{{meaning['signpost']}}</span>
                            <span v-else><v-icon>{{icons.mdiArrowRight}}</v-icon></span>
                            <v-btn icon @click="addToStudy(word, meaning['meaning'], wordExamples[index_mean])">
                                <v-icon>{{icons.mdiPlusBox}}</v-icon>
                            </v-btn>
                            <div style="padding: 10px">{{meaning['meaning']}}</div>
                            <div v-for="(example, index) in wordExamples[index_mean]" :key="index">
                                <span style="color: red">{{index+1}}</span>{{example['example']}}
                            </div>

                        </div>

                    </v-col>
                </v-row>

            </v-container>
            <div class="text-center">
                <v-snackbar
                        v-model="snackbar1"
                        :timeout="2000"
                        color="success"
                >
                    The word added to your study collection
                    <v-btn
                            color="#1C0153"
                            text
                            @click="snackbar1 = false"
                    >
                        Close
                    </v-btn>
                </v-snackbar>
            </div>

            <div class="text-center">
                <v-snackbar
                        v-model="snackbar2"
                        :timeout="2000"
                        color="warning"
                >
                    The word exists in your study collection
                    <v-btn
                            color="#1C0153"
                            text
                            @click="snackbar2 = false"
                    >
                        Close
                    </v-btn>
                </v-snackbar>
            </div>
        </v-card-text>
    </v-card>
</template>

<script>
    import {mapState} from 'vuex'
    import {mdiArrowRight, mdiPlusBox} from '@mdi/js'
    import {LOAD_DICTIONARY} from "@/store/actions/dictionary";
    import {ADD_NEW_WORD} from "@/store/actions/studyWords";

    export default {
        name: "DictionaryComponent",
        props: {
            width: {
                required: true,
                type: Number
            },
            flat: {
                required: true,
                type: Boolean
            }
        },
        data() {
            return {
                snackbar1: false,
                snackbar2: false,
                icons: {
                    mdiArrowRight,
                    mdiPlusBox
                }
            }
        },
        computed: {
            ...mapState({
                wildCards: state => state.dictionary.wildCardSuggestion,
                word: state => state.dictionary.word,
                wordDefinition: state => state.dictionary.wordDefinition,
                wordExamples: state => state.dictionary.wordExamples,
                wordFamily: state => state.dictionary.wordFamily,
                wordThesaurus: state => state.dictionary.wordThesaurus,
                wordOtherExamples: state => state.dictionary.wordOtherExamples,
                wordEtymology: state => state.dictionary.wordEtymology,
                wordCollocations: state => state.dictionary.wordCollocations,
                wordList: state => state.studyWords.words
            })
        },
        methods: {
            addToStudy(word, meaning, examples) {
                let self = this;
                let flag = false;
                for(let i = 0; i < this.wordList.length; i++){
                    if(this.wordList[i]['word'] === word && this.wordList[i]['definition'] === meaning){
                        flag = true
                    }
                }
                if(flag === false){
                    this.$store.dispatch(ADD_NEW_WORD, {
                        'word': word,
                        'definition': meaning,
                        'examples': examples
                    }).then(
                        function (id) {
                            if (id !== false) {
                                self.snackbar1 = true;
                            } else {
                                self.snackbar2 = true;
                            }
                        }
                    )
                }
                else {
                    self.snackbar2 = true;
                }
            },
            goToWord(word) {
                this.$store.dispatch(LOAD_DICTIONARY, word);
            }
        }
    }
</script>

<style scoped>
</style>