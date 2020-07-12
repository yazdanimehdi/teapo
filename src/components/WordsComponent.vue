<template>
        <div :style="{'width': `${width}px`, 'font-family':'kalam'}">
            <v-container fluid style="overflow-y: scroll">
                <v-row>
                    <v-col cols="12" sm="12" lg="12" md="12" xl="12">
                        <v-card style="background-image: linear-gradient(#00bfa5, #4dd0e1); border-radius: 15px"
                                :style="{'height': minimized? '160px': '700px'}">
                            <v-card-subtitle>
                                <div>
                                    <v-icon>{{icons.mdiBookSearch}}</v-icon>
                                    <span style="margin-left: 8px; font-size: 18px; font-weight: bold">Dictionary</span>

                                    <v-btn icon @click="minimized = !minimized">
                                        <v-icon v-if="!minimized">{{icons.mdiChevronUp}}</v-icon>
                                        <v-icon v-else>{{icons.mdiChevronDown}}</v-icon>
                                    </v-btn>
                                </div>


                            </v-card-subtitle>
                            <v-card-text>
                                <v-container fluid>
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
                                                <v-icon x-large>{{icons.mdiCardSearch}}</v-icon>
                                            </v-btn>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <DictionaryComponent :width="width -60" v-if="!minimized" :flat="false"/>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" sm="5" md="5" lg="5" xl="5">
                        <v-card @click="studyDialog = true"
                                :style="{'background-image': (learningStateCount === 0 && reviewingStateCount === 0 && difficultStateCount === 0) ? 'linear-gradient(gray, black)' :'linear-gradient(#A0B271, #B6F51F)' }"
                                style="height: 300px; border-radius: 15px">
                            <v-img src="../assets/study.png" class="black--text" contain
                                   height="300px">
                                <v-card-subtitle>
                                    <div>
                                        <v-icon>{{icons.mdiBookAlphabet}}</v-icon>
                                        <span style="margin-left: 8px; font-size: 18px; font-weight: bold">Study Now</span>
                                    </div>
                                </v-card-subtitle>
                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                                                <div style="font-weight: bolder; font-size: 50px; text-align: center; color: rgb(103, 170, 135)">
                                                    {{learningStateCount}}
                                                </div>
                                            </v-col>
                                            <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                                                <div style="font-weight: bold; font-size: 20px; text-align: center">
                                                    Words
                                                </div>
                                                <div style="font-size: 20px; text-align: center">To Learn</div>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                                                <div style="font-weight: bolder; font-size: 50px; text-align: center; color: blue">
                                                    {{reviewingStateCount}}
                                                </div>
                                            </v-col>
                                            <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                                                <div style="font-weight: bold; font-size: 20px; text-align: center">
                                                    Words
                                                </div>
                                                <div style="font-size: 20px; text-align: center">To Review</div>
                                            </v-col>
                                        </v-row>
                                        <v-row>
                                            <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                                                <div style="font-weight: bolder; font-size: 50px; text-align: center; color: yellow">
                                                    {{difficultStateCount}}
                                                </div>
                                            </v-col>
                                            <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                                                <div style="font-weight: bold; font-size: 20px; text-align: center">
                                                    Difficult
                                                </div>
                                                <div style="font-size: 20px; text-align: center">Words</div>
                                            </v-col>
                                        </v-row>

                                    </v-container>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>

                                </v-card-actions>
                            </v-img>

                        </v-card>
                    </v-col>

                    <v-col cols="12" sm="7" md="7" lg="7" xl="7">
                        <v-card style="background-image: linear-gradient(#79EC37, #7BCF4B); height: 300px; border-radius: 15px">
                            <v-card-subtitle>
                                <div>
                                    <v-icon>{{icons.mdiPlusCircle}}</v-icon>
                                    <span style="margin-left: 8px; font-size: 18px; font-weight: bold">Add New Word</span>
                                </div>

                            </v-card-subtitle>
                            <v-card-text>
                                <v-container fluid>
                                    <v-row>
                                        <v-text-field
                                                v-model="word"
                                                label="Word"
                                                required
                                                color="#1C0153"
                                                style="font-size: 18px; font-weight: bold"
                                        ></v-text-field>
                                    </v-row>
                                    <v-row>
                                        <v-text-field
                                                v-model="definition"
                                                label="Definition"
                                                required
                                                color="#1C0153"
                                                style="font-size: 18px; font-weight: bold"
                                        ></v-text-field>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn icon @click="addWord">
                                    <v-icon x-large>
                                        {{icons.mdiPlusCircle}}
                                    </v-icon>
                                </v-btn>
                            </v-card-actions>

                        </v-card>
                    </v-col>
                </v-row>
                <v-container fluid>
                    <v-data-iterator
                            :items="studyWordsItems"
                            :items-per-page.sync="itemsPerPage"
                            :page="page"
                            :search="search"
                            :sort-by="sortBy.toLowerCase()"
                            :sort-desc="sortDesc"
                            hide-default-footer
                            v-if="loaded"
                    >
                        <template v-slot:header>
                            <v-toolbar
                                    dark
                                    color="#BFABE8"
                                    class="mb-1"
                            >
                                <v-text-field
                                        v-model="search"
                                        clearable
                                        flat
                                        solo-inverted
                                        hide-details
                                        prepend-inner-icon="search"
                                        label="Search"
                                ></v-text-field>
                                <template v-if="$vuetify.breakpoint.mdAndUp">
                                    <v-spacer></v-spacer>
                                    <v-btn-toggle
                                            v-model="sortDesc"
                                            mandatory
                                    >
                                        <v-btn
                                                large
                                                depressed
                                                color="#54398B"
                                                :value="false"
                                        >
                                            <v-icon>{{icons.mdiChevronUp}}</v-icon>
                                        </v-btn>
                                        <v-btn
                                                large
                                                depressed
                                                color="#54398B"
                                                :value="true"
                                        >
                                            <v-icon>{{icons.mdiChevronDown}}</v-icon>
                                        </v-btn>
                                    </v-btn-toggle>
                                </template>
                            </v-toolbar>
                        </template>

                        <template v-slot:default="props">
                            <v-row style="background-color: #BFABE8; padding: 0; margin: 0">
                                <v-col
                                        v-for="item in props.items"
                                        :key="item.name"
                                        cols="12"
                                        sm="6"
                                        md="4"
                                        lg="3"
                                >
                                    <v-card :color="item['label'] === 'Learning' ? 'green'
                                 : item['label'] === 'Reviewing' ? 'blue' :
                                  item['label'] === 'Difficult'? 'yellow' : 'white'"
                                            @click="openAllDialog(item)">
                                        <v-card-title class="subheading font-weight-bold">{{ item.name }}</v-card-title>

                                        <v-divider></v-divider>

                                        <v-list dense>
                                            <v-list-item
                                                    v-for="(key, index) in filteredKeys"
                                                    :key="index"
                                            >
                                                <v-list-item-content :class="{ 'blue--text': sortBy === key }">{{ key
                                                    }}:
                                                </v-list-item-content>
                                                <v-list-item-content class="align-end"
                                                                     :class="{ 'blue--text': sortBy === key }">{{
                                                    item[key.toLowerCase()] }}
                                                </v-list-item-content>
                                            </v-list-item>
                                        </v-list>
                                    </v-card>
                                </v-col>
                            </v-row>
                        </template>

                        <template v-slot:footer>
                            <v-row class="mt-2" align="center" justify="center">

                                <v-spacer></v-spacer>

                                <span
                                        class="mr-4
            grey--text"
                                >
            Page {{ page }} of {{ numberOfPages }}
          </span>
                                <v-btn
                                        fab
                                        dark
                                        color="#BFABE8"
                                        class="mr-1"
                                        @click="formerPage"
                                >
                                    <v-icon>{{icons.mdiChevronLeft}}</v-icon>
                                </v-btn>
                                <v-btn
                                        fab
                                        dark
                                        color="#BFABE8"
                                        class="ml-1"
                                        @click="nextPage"
                                >
                                    <v-icon>{{icons.mdiChevronRight}}</v-icon>
                                </v-btn>
                            </v-row>
                        </template>
                    </v-data-iterator>
                </v-container>
                <v-row>

                </v-row>

            </v-container>

            <v-dialog
                    v-model="dialog"
                    max-width="600"
            >
                <v-card style="font-family: kalam">
                    <v-card-title style="font-weight: bold; font-size: 30px">
                        {{dialogWord}}
                    </v-card-title>
                    <v-card-subtitle style="font-weight: bold; font-size: 22px; padding-top: 20px">
                        {{dialogDefinition}}
                    </v-card-subtitle>
                    <v-card-text style="font-size: 22px; padding-top: 18px">
                        <div v-for="(example, index) in dialogExamples" :key="index">
                            <span style="color: red; font-weight: bold">{{index + 1}}</span> {{example['example']}}
                        </div>
                    </v-card-text>
                </v-card>
            </v-dialog>

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
            <div class="text-center">
                <v-snackbar
                        v-model="snackbar3"
                        :timeout="2000"
                        color="error"
                >
                    Please Enter Word and Definition
                    <v-btn
                            color="#1C0153"
                            text
                            @click="snackbar2 = false"
                    >
                        Close
                    </v-btn>
                </v-snackbar>
            </div>
            <v-dialog v-model="studyDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
                <StartStudyOverlay @close="studyDialog = false" :height="height"/>
            </v-dialog>
        </div>
</template>

<script>
    import {
        mdiBookAlphabet,
        mdiPlusCircle,
        mdiChevronRight,
        mdiChevronLeft,
        mdiChevronUp,
        mdiChevronDown,
        mdiBookSearch,
        mdiCardSearch
    } from '@mdi/js'
    import {LOAD_DICTIONARY} from "@/store/actions/dictionary";
    import DictionaryComponent from "@/components/DictionaryComponent";
    import {mapGetters, mapState} from 'vuex'
    import {ADD_NEW_WORD, GET_STUDY_WORDS} from "@/store/actions/studyWords";
    import StartStudyOverlay from "@/components/StartStudyOverlay";

    export default {
        name: "WordsComponent",
        props: {
            width: {
                required: true,
                type: Number
            },
            height: {
                required: true,
                type: Number
            },
        },
        components: {
            StartStudyOverlay,
            DictionaryComponent
        },
        data() {
            return {
                icons: {
                    mdiBookAlphabet,
                    mdiPlusCircle,
                    mdiChevronRight,
                    mdiChevronLeft,
                    mdiChevronUp,
                    mdiChevronDown,
                    mdiBookSearch,
                    mdiCardSearch
                },
                studyDialog: false,
                snackbar3: false,
                snackbar1: false,
                snackbar2: false,
                dialog: false,
                dialogWord: '',
                dialogExamples: [],
                dialogDefinition: '',
                word: '',
                minimized: true,
                wordSearch: '',
                definition: '',
                itemsPerPageArray: [4, 8, 12],
                search: '',
                filter: {},
                sortDesc: false,
                page: 1,
                itemsPerPage: 8,
                sortBy: 'name',
                keys: [
                    'Name',
                ],
            }
        },
        created(){
            this.$store.dispatch(GET_STUDY_WORDS);
        },
        computed: {
            cardColor(index) {
                switch (this.words[index]['label']) {
                    case 'Learning':
                        return 'green';
                    case 'Reviewing':
                        return 'blue';
                    case 'Difficult':
                        return 'yellow';
                    case 'Master':
                        return 'white'
                }
                return 'black'
            },
            numberOfPages() {
                return Math.ceil(this.studyWordsItems.length / this.itemsPerPage)
            },
            filteredKeys() {
                return this.keys.filter(key => key !== `Name`)
            },
            ...mapGetters(['studyWordsItems', 'learningStateCount', 'reviewingStateCount', 'difficultStateCount']),
            ...mapState({
                loaded: state => state.studyWords.loaded,
                words: state => state.studyWords.words,
            })
        },
        methods: {
            addWord() {
                let self = this;
                if (typeof (String.prototype.trim) === "undefined") {
                    String.prototype.trim = function () {
                        return String(this).replace(/^\s+|\s+$/g, '');
                    };
                }
                if (this.word.trim() !== '' && this.definition.trim() !== '') {
                    this.$store.dispatch(ADD_NEW_WORD, {
                        'word': this.word,
                        'definition': this.definition,
                        'examples': []
                    }).then(
                        function (id) {
                            if (id !== false) {
                                self.snackbar1 = true;
                            } else {
                                self.snackbar2 = true;
                            }
                        }
                    )

                } else {
                    self.snackbar3 = true
                }
            },
            openAllDialog(word) {
                this.dialog = true;
                this.dialogWord = word['word']
                this.dialogDefinition = word['definition']
                this.dialogExamples = word['examples']
            },
            nextPage() {
                if (this.page + 1 <= this.numberOfPages) this.page += 1
            },
            formerPage() {
                if (this.page - 1 >= 1) this.page -= 1
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
            }

        },
    }
</script>

<style scoped>
</style>