<template>
    <div :style="{'width': `${width}px`, 'font-family':'kalam'}">
        <v-container fluid style="overflow-y: scroll">
            <v-row>
                <v-col cols="12" sm="8" md="8" lg="8" xl="8">
                    <v-card class="mx-auto"
                            style="background-image: linear-gradient(#DF55B1, #CEA0BF); height: 300px; border-radius: 15px"
                    >
                        <v-img src="../../assets/new_releases.png" class="white--text" contain
                               height="300px">
                            <v-card-subtitle>
                                <div>
                                    <v-icon>{{icons.mdiAlertDecagram}}</v-icon>
                                    <span style="margin-left: 8px; font-size: 18px; font-weight: bold">What's New</span>
                                </div>

                            </v-card-subtitle>

                        </v-img>
                    </v-card>

                </v-col>
                <v-col cols="12" sm="4" md="4" lg="4" xl="4">
                    <v-card style="background-image: linear-gradient(#5362C5, #676D9A); height: 300px; border-radius: 15px">
                        <v-img src="../../assets/inbox.png" class="white--text" contain
                               height="300px">
                            <v-card-subtitle>
                                <div>
                                    <v-icon>{{icons.mdiInboxArrowDown}}</v-icon>
                                    <span style="margin-left: 8px; font-size: 18px; font-weight: bold">Inbox</span>
                                </div>

                            </v-card-subtitle>
                        </v-img>
                    </v-card>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                    <v-card style="background-image: linear-gradient(#2EC9B9, #8FB9B3); height: 240px; border-radius: 15px">
                        <v-img src="../../assets/sand.png" class="black--text" contain
                               height="240px">
                            <v-card-subtitle>
                                <div>
                                    <v-icon>{{icons.mdiTimerSandEmpty}}</v-icon>
                                    <span style="margin-left: 8px; font-size: 18px; font-weight: bold">Time</span>
                                </div>
                            </v-card-subtitle>
                            <v-card-text>
                                <div style="font-weight: bolder; text-align: center; font-size: 50px; margin-bottom: 20px; margin-top: 20px">
                                    38
                                </div>
                                <div style="font-weight: bolder; text-align: center; font-size: 25px; margin-bottom: 20px;">
                                    Days left
                                </div>
                                <div style="text-align: center; font-size: 25px">
                                    Until your toefl
                                </div>
                            </v-card-text>
                        </v-img>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="6" xl="6">
                    <v-card style="background-image: linear-gradient(#E29578, #CCB9B2); height: 240px; border-radius: 15px">
                        <v-img src="../../assets/fast_forward.png" class="black--text" contain
                               height="240px">
                            <v-card-subtitle>
                                <div>
                                    <v-icon>{{icons.mdiFastForward}}</v-icon>
                                    <span style="margin-left: 8px; font-size: 18px; font-weight: bold">Progress</span>
                                </div>

                            </v-card-subtitle>
                            <v-card-text>
                                <v-container style="margin: 0">
                                    <v-row>
                                        <v-col cols="6" sm="6" md="6" lg="6" xl="6" style="margin: 0; padding: 0">
                                            <div style="text-align: left; font-size: 20px;">
                                                Reading: 42/63
                                            </div>
                                            <div style="text-align: left; font-size: 20px; margin-top: 20px">
                                                Listening: 42/63
                                            </div>
                                            <div style="text-align: left; font-size: 20px; margin-top: 20px">
                                                Speaking: 42/63
                                            </div>
                                            <div style="text-align: left; font-size: 20px; margin-top: 20px">
                                                Writing: 42/63
                                            </div>
                                        </v-col>
                                        <v-col cols="6" sm="6" md="6" lg="6" xl="6">
                                            <div style="text-align: center; font-size: 20px; font-weight: bold; margin-top: 10px">
                                                Total Progress
                                            </div>
                                            <div style="text-align: center; font-size: 30px; font-weight: bold; margin-top: 10px">
                                                58%
                                            </div>
                                        </v-col>
                                    </v-row>
                                </v-container>


                            </v-card-text>
                        </v-img>
                    </v-card>
                </v-col>
                <v-col cols="12" sm="3" md="3" lg="3" xl="3">
                    <v-card style="background-image: linear-gradient(#FF5D5D, #D29E9E);height: 240px;  border-radius: 15px">
                        <v-img src="../../assets/history.png" class="white--text" contain
                               height="240px">
                            <v-card-subtitle>
                                <div>
                                    <v-icon>{{icons.mdiHistory}}</v-icon>
                                    <span style="margin-left: 8px; font-size: 18px; font-weight: bold">History</span>
                                </div>

                            </v-card-subtitle>
                        </v-img>

                    </v-card>
                </v-col>
            </v-row>

            <v-row>
                <v-col cols="12" sm="7" md="7" lg="7" xl="7">
                    <v-card style="background-image: linear-gradient(#C9D8C3, #10DC2B); height: 200px; border-radius: 15px">
                        <v-img src="../../assets/course.png" class="white--text" contain
                               height="200px">
                            <v-card-subtitle>
                                <div>
                                    <v-icon>{{icons.mdiLeadPencil}}</v-icon>
                                    <span style="margin-left: 8px; font-size: 18px; font-weight: bold">Practice Now</span>
                                </div>

                            </v-card-subtitle>
                        </v-img>

                    </v-card>
                </v-col>
                <v-col cols="12" sm="5" md="5" lg="5" xl="5">
                    <v-card style="background-image: linear-gradient(#A0B271, #B6F51F); height: 200px; border-radius: 15px" @click="studyDialog = true">
                        <v-img src="../../assets/study.png" class="black--text" contain
                               height="200px">
                            <v-card-subtitle style="padding: 10px 10px 5px 10px">
                                <div>
                                    <v-icon>{{icons.mdiBookAlphabet}}</v-icon>
                                    <span style="margin-left: 8px; font-size: 18px; font-weight: bold">Study Now</span>
                                </div>

                            </v-card-subtitle>
                            <v-card-text>
                                <v-card-text>
                                    <v-container fluid style="padding: 0">
                                        <v-row style="padding: 0">
                                            <v-col cols="6" sm="6" md="6" lg="6" xl="6" style="padding: 0">
                                                <div style="font-weight: bolder; font-size: 50px; text-align: center; color: rgb(103, 170, 135)">
                                                    {{learningStateCount}}
                                                </div>
                                            </v-col>
                                            <v-col cols="6" sm="6" md="6" lg="6" xl="6" style="padding: 0">
                                                <div style="font-weight: bold; font-size: 15px; text-align: center">
                                                    Words
                                                </div>
                                                <div style="font-size: 15px; text-align: center">To Learn</div>
                                            </v-col>
                                        </v-row>
                                        <v-row style="padding: 0">
                                            <v-col cols="6" sm="6" md="6" lg="6" xl="6" style="padding: 0">
                                                <div style="font-weight: bolder; font-size: 50px; text-align: center; color: blue">
                                                    {{reviewingStateCount}}
                                                </div>
                                            </v-col>
                                            <v-col cols="6" sm="6" md="6" lg="6" xl="6" style="padding: 0">
                                                <div style="font-weight: bold; font-size: 15px; text-align: center">
                                                    Words
                                                </div>
                                                <div style="font-size: 15px; text-align: center">To Review</div>
                                            </v-col>
                                        </v-row>
                                        <v-row style="padding: 0">
                                            <v-col cols="6" sm="6" md="6" lg="6" xl="6" style="padding: 0">
                                                <div style="font-weight: bolder; font-size: 50px; text-align: center; color: yellow">
                                                    {{difficultStateCount}}
                                                </div>
                                            </v-col>
                                            <v-col cols="6" sm="6" md="6" lg="6" xl="6" style="padding: 0">
                                                <div style="font-weight: bold; font-size: 15px; text-align: center">
                                                    Difficult
                                                </div>
                                                <div style="font-size: 15px; text-align: center">Words</div>
                                            </v-col>
                                        </v-row>

                                    </v-container>
                                </v-card-text>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>

                            </v-card-actions>
                        </v-img>

                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <v-dialog v-model="studyDialog" fullscreen hide-overlay transition="dialog-bottom-transition">
            <StartStudyOverlay @close="studyDialog = false" :height="height"/>
        </v-dialog>
    </div>
</template>

<script>
    import {
        mdiAlertDecagram,
        mdiInboxArrowDown,
        mdiTimerSandEmpty,
        mdiFastForward,
        mdiHistory,
        mdiLeadPencil,
        mdiBookAlphabet,
        mdiArrowRightBold
    } from '@mdi/js';
    import {mapGetters} from 'vuex';
    import StartStudyOverlay from "@/components/MemriseComponents/StartStudyOverlay";
    import {GET_STUDY_WORDS} from "@/store/actions/studyWords";

    export default {
        name: "DashboardComponent",
        components:{StartStudyOverlay},
        props: {
            width: {
                required: true,
                type: Number
            },
            height: {
                required: true,
                type: Number
            }
        },
        created(){
            this.$store.dispatch(GET_STUDY_WORDS);
        },
        computed:{
          ...mapGetters(['studyWordsItems', 'learningStateCount', 'reviewingStateCount', 'difficultStateCount'])
        },
        data() {
            return {
                icons: {
                    mdiAlertDecagram,
                    mdiInboxArrowDown,
                    mdiTimerSandEmpty,
                    mdiFastForward,
                    mdiHistory,
                    mdiLeadPencil,
                    mdiBookAlphabet,
                    mdiArrowRightBold

                },
                studyDialog: false,


            }
        }
    }
</script>

<style scoped>
</style>