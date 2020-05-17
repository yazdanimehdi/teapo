<template>
    <v-app>
        <v-container fluid class="toolbar" style="padding: 0">
            <v-row justify="space-between" align="start"
                   style="padding: 0; padding-top: 29px; padding-bottom: 12px">
                <v-col sm="6" lg="6" cols="6" md="6" style="padding: 0; padding-left: 20px">
                    <v-container fluid>
                        <v-row justify="start" align="start">
                            <v-col style="padding: 0">
                                <v-btn dark rounded small style="margin-right: 10px;">Home</v-btn>
                            </v-col>
                            <v-col cols="4" md="4" lg="4" sm="4" v-if="volume.enabled" style="padding: 0">
                                <label>
                                    <input type="range" v-model="volume_slide">
                                </label>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-col>
                <v-col sm="6" lg="4" cols="6" md="4" style="padding: 0;padding-right: 30px; ">
                    <v-container fluid style="padding: 0">
                        <v-row justify="end" align="start" style="padding: 0">

                            <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0; padding-right: 6px">
                                <v-img src="../../assets/continue.png" contain max-height="60px"
                                       min-height="40px" @click="goToNext"></v-img>
                            </v-col>

                            <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                <v-img src="../../assets/vol.png" contain max-height="60px"
                                       min-height="40px" @click="show_vol"></v-img>
                            </v-col>
                            <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                <v-img src="../../assets/helpd.png" contain max-height="60px"
                                       min-height="40px"></v-img>

                            </v-col>
                            <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                <v-img src="../../assets/okd.png" contain max-height="60px"
                                       min-height="40px"></v-img>
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
        <div style="background-color: rgb(240, 231, 206); height: 100%">
            <v-container>
                <v-row justify="center" align="center">
                    <div v-if="state === 0">
                        <img src="../../assets/direction_pic.png" height="300" width="350" style="margin-top: 80px">
                        <br>
                        <p class="direction_headset">Now put your headset</p>
                    </div>
                    <div class="direction" v-if="state === 1">
                        <audio autoplay id="listening_direction">
                            <source src="../../assets/listening_direction.mp3">
                        </audio>
                        <div style="height: 10%"></div>
                        <h2 style="text-align: center; text-shadow: 2px 2px rgba(128, 129, 120, 0.4); color: rgb(66,63,91)">
                            Listening Section Directions</h2>
                        <div style="margin: 5%; margin-top: 3%">
                            <p>This section measures your ability to understand conversations and lectures in English.
                                It is
                                divided into <span style="font-weight: bold">{{sectionCount}}</span> separately timed parts. In each
                                part
                                you will listen to {{conversationCount}} conversation and {{lectureCount}} lectures. You will hear each conversation or
                                lecture
                                only <span style="font-weight: bold">one</span> time.
                            <p>After each conversation or lecture, you will answer some questions about it. Answer the
                                questions based on what is stated or implied by the speakers.</p>
                            <p>For each part of the listening section you will have <span style="font-weight: bold">{{initialMinute}}</span> minutes to answer the
                                questions.</p>
                            <p>A clock at the top of the screen will show how much time is remaining. The clock will
                                <span
                                        style="font-weight: bold">not</span> count down while you are listening. The
                                clock will
                                count down only while you are answering questions.</p>
                            <p>You may take notes while you listen. You may use your notes to help you answer the
                                questions.
                                Your notes will <span style="font-weight: bold">not</span> be scored.</p>
                            <p>If you need to change the volume while you listen, click on the <span
                                    style="font-weight: bold">Volume</span> icon at the top of the screen.</p>
                            <p>In some questions, you will see <span style="font-weight: bold">Headphone icon</span>.
                                This
                                means that you will hear, but not see, part of the question.</p>
                            <p>Most questions are worth 1 point. If a question is worth more than 1 point, it will have
                                special directions that indicate how many points you can receive</p>
                            <p>You must answer each question. After you answer, click on <span
                                    style="font-weight: bold">Next</span>.
                                Then click on <span style="font-weight: bold">OK</span> to confirm your answer and go on
                                to
                                the next question. After you click on <span style="font-weight: bold">OK</span>, you
                                cannot
                                return to previous questions.</p>
                            <p>You will now begin the first part of the Listening section</p>
                            <p style="text-align: center; font-weight: bold; font-style: italic;">(Click on Continue at
                                any
                                time to dismiss these directions.)</p>
                        </div>
                    </div>
                </v-row>
            </v-container>
        </div>
    </v-app>
</template>

<script>
    import {GO_TO_NEXT_LISTENING} from "@/store/actions/listening";
    import {mapGetters} from "vuex"

    export default {
        name: "ListeningDirection",
        methods: {
            goToNext: function () {
                switch (this.state) {
                    case 0:
                        this.state = 1;
                        break;
                    case 1:
                        this.$store.dispatch(GO_TO_NEXT_LISTENING);
                        break;
                }
            },
            show_vol() {
                this.volume.enabled = !this.volume.enabled;
            },
        },
        data() {
            return {
                ended: false,
                state: 0,
                volume: {
                    enabled: false
                },
                volume_slide: 50,
            }
        },
        computed:{
            ...mapGetters(['sectionCount', 'initialMinute', 'conversationCount', 'lectureCount']),

        },
        mounted: function () {
            var aud = document.getElementById("listening_direction");
            var self = this;
            if (aud != null) {
                aud.onended = function () {
                    self.$store.dispatch(GO_TO_NEXT_LISTENING);
                };
            }
        },
        watch: {
            volume_slide: function (val) {
                if (document.getElementById("listening_direction")) {
                    document.getElementById("listening_direction").volume = parseInt(val) / 100.0;
                }
            }
        }
    }
</script>

<style scoped>
    .toolbar {
        height: 110px;
        background: linear-gradient(to right, #4148a2, #822a42);
    }

    .btn {
        height: 80px;
        width: auto;

    }

    .btn_new {
        height: 42px;
        width: auto;

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
