<template>
    <v-app>
        <div style="width: 100%">
            <v-container fluid class="toolbar" style="padding: 0">
                <v-row justify="space-between" align="start"
                       style="padding: 0; padding-top: 29px; padding-bottom: 12px">
                    <v-col sm="6" lg="6" cols="6" md="6" style="padding: 0; padding-left: 20px">
                        <v-container fluid>
                            <v-row justify="start" align="start">
                                <v-col style="padding: 0">
                                    <v-btn dark rounded small style="margin-right: 10px;">Home</v-btn>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-col>
                    <v-col sm="6" lg="4" cols="6" md="4" style="padding: 0;padding-right: 30px; ">
                        <v-container fluid style="padding: 0">
                            <v-row justify="end" align="start" style="padding: 0">

                                <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                    <v-img src="../../assets/continue.png" contain max-height="60px"
                                           min-height="40px" @click="goToNext"></v-img>
                                </v-col>

                                <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                    <v-img src="../../assets/reviewd.png" contain max-height="60px"
                                           min-height="40px"></v-img>
                                </v-col>

                                <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                    <v-img src="../../assets/vold.png" contain max-height="60px"
                                           min-height="40px"></v-img>
                                </v-col>
                                <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                    <v-img src="../../assets/helpd.png" contain max-height="60px"
                                           min-height="40px"></v-img>

                                </v-col>
                                <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                    <v-img src="../../assets/backd.png" contain max-height="60px"
                                           min-height="40px" v-if="!backAvailable"></v-img>
                                    <v-img src="../../assets/back.png" contain max-height="60px"
                                           min-height="40px"
                                           v-else-if="readingMode === 'practiceMode' || readingMode === 'reviewMode'"
                                           @click="goToBack"></v-img>
                                </v-col>

                                <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                    <v-img src="../../assets/nextd.png" contain max-height="60px"
                                           min-height="40px"></v-img>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-col>
                </v-row>
            </v-container>
            <div style="background-color: rgb(240, 231, 206); height: 1000px">
                <v-layout column fill-height>
                    <div style="height: 10%"></div>
                    <div class="direction">
                        <h2 style="text-align: center; text-shadow: 2px 2px rgba(128, 129, 120, 0.4); color: rgb(66,63,91)">
                            Reading Section Directions</h2>
                        <div style="margin: 5%; margin-top: 3%">
                            <p>This section measures your ability to understand academic passages in English. You will
                                have <span style="font-weight: bold">{{parseInt(totalTime/60)}} minutes</span>
                                ({{initialHours}} hour and {{initialMinute}} minutes) to read and answer questions
                                about <span style="font-weight: bold">{{readingLength}} passages</span>. A clock at the
                                top of the screen will display the starting time as <span style="font-weight: bold">{{initialHours | formatTime}} : {{initialMinute | formatTime}} : {{initialSeconds | formatTime}}</span>
                                ({{initialHours}} hour and {{initialMinute}} minutes) and show you how much time is
                                remaining.</p>
                            <p>Most questions are worth 1 point, but the last question of each passage is worth more
                                than 1 point. The directions for the last question indicate how many points you may
                                receive.</p>
                            <p>Some passages include a word or phrase that is <span
                                    style="color: #1A01CC; text-decoration: underline;">underlined in blue</span> Click
                                on the word or phrase to see a definition or an explanation.</p>
                            <p>Within this section you can move to the next question by clicking on <span
                                    style="font-weight: bold">Next</span>. You can skip questions and go back to them
                                later as long as there is time remaining. If you want to return to previous questions,
                                click on <span style="font-weight: bold">Back</span>.</p>
                            <p>You can click on <span style="font-weight: bold">Review</span> at any time and the review
                                screen will show you which questions you have answered and which you have not answered.
                                From the review screen, you may go directly to any question you have already seen.</p>
                            <p>You will now begin the Reading section.</p>
                            <p>Click on <span style="font-weight: bold">Continue</span> to go on.</p>
                        </div>
                    </div>
                </v-layout>

            </div>
        </div>
    </v-app>
</template>

<script>
    import {mapGetters, mapState} from 'vuex'
    import {
        GO_TO_NEXT_READING, GO_TO_PREVIOUS_READING,
    } from "@/store/actions/reading";

    export default {
        name: "ReadingDirection",
        methods: {
            goToNext: function () {
                this.$store.dispatch(GO_TO_NEXT_READING);
            },
            goToBack() {
                this.$store.dispatch(GO_TO_PREVIOUS_READING);
            }
        },
        data() {
            return {
                ended: false,
                state: 0,
            }
        },
        computed: {
            ...mapGetters(['initialMinute', 'initialHours', 'initialSeconds', 'readingLength', 'backAvailable']),
            ...mapState({
                totalTime: state => state.time.totalTime,
                readingMode: state => state.mainTPO.mode,

            })
        }
    }
</script>

<style scoped>
    .toolbar {
        height: 110px;
        width: 100%;
        background: linear-gradient(to right, #4148a2, #822a42);

    }

    .btn_new {
        height: 80px;
        width: auto;
        bottom: 30px;
    }

    .btn {
        height: 42px;
        width: auto;
        bottom: 10px;

    }

    .direction {
        margin: 2em;
        text-align: left;
        font-family: Verdana;
        font-size: 16px;
        font-weight: 400;
    }

    .direction_headset {
        text-align: center;
        font-family: Verdana;
        font-size: 16px;
        font-weight: bold;
    }

</style>
