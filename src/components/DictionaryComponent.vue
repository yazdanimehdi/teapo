<template>
    <v-card :flat="flat" v-if="wildCards.length !== 0" :width="width" height="500px" style="overflow-y: scroll; border-radius: 15px">
        <v-card-title>Suggestions</v-card-title>
        <v-card-text>
            <v-container fluid>
                <v-row v-for="(word, index) in wildCards" :key="index">
                    <v-btn text @click="goToWord(word)">{{word}}</v-btn>
                </v-row>
            </v-container>
        </v-card-text>
    </v-card>
    <v-card :flat="flat" v-else :width="width" height="500px" style="overflow-y: scroll; border-radius: 15px">
        <v-card-text style="overflow-y: scroll">
            <v-container fluid>
                <v-row v-if="wordFamily.length !== 0">
                    <span style="padding: 5px; background-color: rgb(237, 214, 71); color: white; border-radius: 10px">Word family</span>
                    <span v-for="word in wordFamily" :key="word['id']" style="font-size: 18px; padding: 5px"><span
                            style="color: green; font-weight: bold">({{word['position']}})</span><span>{{word['word']}}</span></span>
                </v-row>
                <v-row v-for="def in wordDefinition" :key="def['def']['id']">
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

                        <div v-for="meaning in def['meanings']" :key="meaning['mean']['id']" style="padding: 10px">
                            {{meaning['mean']['sensenum']}} <span
                                style="border-radius: 10px; background-color: orange; color: white; padding: 4px; margin-left: 10px"
                                v-if="meaning['mean']['signpost'] !== ''">{{meaning['mean']['signpost']}}</span>
                            <span v-else><v-icon>{{icons.mdiArrowRight}}</v-icon></span>
                            <v-btn icon>
                                <v-icon>{{icons.mdiPlusBox}}</v-icon>
                            </v-btn>
                            <div style="padding: 10px">{{meaning['mean']['meaning']}}</div>
                            <div v-for="(example, index) in meaning['examples']" :key="example['id']">
                                <span style="color: red">{{index+1}}</span>{{example['example']}}
                            </div>

                        </div>

                    </v-col>
                </v-row>

            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
    import {mapState} from 'vuex'
    import {mdiArrowRight, mdiPlusBox} from '@mdi/js'
    import {LOAD_DICTIONARY} from "@/store/actions/dictionary";

    export default {
        name: "DictionaryComponent",
        props: {
            width: {
                required: true,
                type: Number
            },
            flat:{
                required: true,
                type:Boolean
            }
        },
        data() {
            return {
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
                wordFamily: state => state.dictionary.wordFamily,
                wordThesaurus: state => state.dictionary.wordThesaurus,
                wordOtherExamples: state => state.dictionary.wordOtherExamples,
                wordEtymology: state => state.dictionary.wordEtymology,
                wordCollocations: state => state.dictionary.wordCollocations,
            })
        },
        methods:{
            goToWord(word){
                this.$store.dispatch(LOAD_DICTIONARY, word);
            }
        }
    }
</script>

<style scoped>
</style>