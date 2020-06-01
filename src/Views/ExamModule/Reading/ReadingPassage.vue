<template>
    <v-app>
        <div>
            <v-container fluid class="toolbar" style="padding: 0">
                <v-row justify="space-between" align="start"
                       style="padding: 0; padding-top: 29px; padding-bottom: 12px">
                    <v-col sm="6" lg="6" cols="6" md="6" style="padding: 0; padding-left: 20px">
                        <v-container fluid>
                            <v-row justify="start" align="start">
                                <v-col style="padding: 0">
                                    <v-btn dark rounded small style="margin-right: 10px">Home</v-btn>
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
                                    <v-img src="../../../assets/reviewd.png" contain max-height="60px"
                                           min-height="40px"></v-img>
                                </v-col>

                                <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                    <v-img src="../../../assets/vold.png" contain max-height="60px"
                                           min-height="40px"></v-img>
                                </v-col>
                                <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                    <v-img src="../../../assets/helpd.png" contain max-height="60px"
                                           min-height="40px"></v-img>

                                </v-col>
                                <template v-if="readingTaskNumber === 0">
                                    <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                        <v-img src="../../../assets/backd.png" contain max-height="60px"
                                               min-height="40px"></v-img>
                                    </v-col>
                                </template>
                                <template v-else>
                                    <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                        <v-img src="../../../assets/back.png" @click="goToBack" contain max-height="60px"
                                               min-height="40px"></v-img>
                                    </v-col>
                                </template>

                                <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                    <v-img src="../../../assets/next.png" @click="goToNext" contain max-height="60px"
                                           min-height="40px"></v-img>
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
                                    Passage {{ currentReading }} of {{readingLength}}
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
            <div style="margin: 0.5%">
                <v-container fluid>
                    <v-row>
                        <v-col cols="12" sm="6" lg="6">
                            <div style="width: 100%; height: 100%; border: black thin solid; margin-right: 1px">
                                <v-card class="my_class" flat height="65vh"
                                        :style="{'font-size': 6 + 24*size/100 + 'px'}">
                                </v-card>
                            </div>
                        </v-col>
                        <v-col cols="12" sm="6" lg="6">
                            <div style="width: 100%; height: 100%; border: black thin solid; margin-left: 1px">
                                <div style="background-color: #1A01CC; height: 20px; text-align: right; color: white"><span
                                        v-if="scrolled < 0.6">Beginning</span><span
                                        v-if="0.6 < scrolled & scrolled < 0.9">More Available</span><span
                                        v-if="scrolled >= 0.9">End</span></div>
                                <v-card class="my_class1" flat height="65vh" v-on:scroll.native="onScroll">
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
            <div>
                <v-dialog
                        v-model="dialog"
                        width="500">
                    <v-card>
                        <v-card-title
                                class="headline"
                                primary-title
                        >
                            Warning
                        </v-card-title>

                        <v-card-text>
                            You should use the scroll bar to read the whole passage before you begin to answer the
                            question.
                            However, the passage will appear again with each question.
                        </v-card-text>

                        <v-divider></v-divider>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn
                                    color="primary"
                                    text
                                    @click="dialog = false"
                            >
                                Ok
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
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
                            <v-icon>{{icons.mdiClose}}</v-icon>
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
                                        <v-icon x-large>{{icons.mdiCardSearch}}</v-icon>
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
        </div>
    </v-app>
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
        mdiCardSearch,
        mdiClose
    } from '@mdi/js'
    import {mapGetters, mapState} from 'vuex'
    import $ from 'jquery'
    import {
        GO_TO_NEXT_READING,
        GO_TO_PREVIOUS_READING
    } from "@/store/actions/reading";
    import {LOAD_DICTIONARY} from "@/store/actions/dictionary";
    import DictionaryComponent from "@/components/DictionaryComponent";

    export default {
        name: "ReadingPassage",
        components:{
            DictionaryComponent
        },
        computed: {
            ...mapGetters(['formattedHours',
                'formattedMinutes',
                'formattedSeconds',
                'readingTitle',
                'passage',
                'readingLength',
                'currentReading',
                'readingTaskNumber']),
            ...mapState({
                readingMode: state => state.mainTPO.mode,
            })
        },
        data() {
            return {
                scrolledToBottom: false,
                minimized: true,
                scrolled: 0,
                size: 50,
                dialogDict: false,
                zoom: {
                    enabled: false
                },
                time_component: {
                    enable: true,
                },
                dialog: false,
                offsetTop: 0,
                selected: '',
                wordSearch: '',
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
            }
        },

        updated() {
            var selectedText = '';

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

        methods: {
            closeDialogDict(){
                this.dialogDict = false;
                this.minimized = true;
                this.wordSearch = '';
            },
            searchDictionaryEnter(ev){
                if (ev.charCode === 13) {
                    this.minimized = false;
                    this.$store.dispatch(LOAD_DICTIONARY, this.wordSearch)
                }
            },
            searchDictionary() {
                this.minimized = false;
                this.$store.dispatch(LOAD_DICTIONARY, this.wordSearch)
            },
            openDictionary(){
              this.dialogDict = true;
              this.$store.dispatch(LOAD_DICTIONARY, this.selected)
            },
            goToBack() {
                this.$store.dispatch(GO_TO_PREVIOUS_READING);
            },
            toggleTimeShow() {
                this.time_component.enable = !this.time_component.enable;
            },
            goToNext: function () {
                if (this.scrolledToBottom) {
                    this.$store.dispatch(GO_TO_NEXT_READING);
                } else {
                    this.dialog = true;
                }
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
        },

    }
</script>

<style scoped>
    .qanounce {
        position: relative;
        bottom: 1ex;
        font-size: 18px;
        color: white;
        font-weight: bold;
        text-align: center;
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

    .my_class {
        margin: 5%;
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

    .toolbar {
        height: 130px;
        background: linear-gradient(to right, rgb(61, 83, 135), rgb(113, 53, 60));
        -webkit-user-select: none;
        -webkit-app-region: drag;
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