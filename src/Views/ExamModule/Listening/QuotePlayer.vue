<template>
    <v-app class="main">
        <v-container fluid class="toolbar" style="padding: 0">
            <v-row justify="space-between" align="start"
                   style="padding: 0; padding-top: 29px; padding-bottom: 12px">
                <v-col sm="6" lg="6" cols="6" md="6" style="padding: 0; padding-left: 20px">
                    <v-container fluid>
                        <v-row justify="start" align="start">
                            <v-col style="padding: 0">
                              <v-btn to="/review" dark rounded small style="margin-right: 10px" v-if="listeningMode === 'reviewMode'">Back</v-btn>
                              <v-btn @click="endDialog = true" dark rounded small style="margin-right: 10px" v-else>End</v-btn>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-col>
                <v-col sm="6" lg="4" cols="6" md="4" style="padding: 0;padding-right: 30px; ">
                    <v-container fluid style="padding: 0">
                        <v-row justify="end" align="start" style="padding: 0">
                            <v-col cols="6" md="6" lg="6" sm="6" v-if="volume.enabled">
                                <label>
                                    <input type="range" v-model="volume_slide">
                                </label>
                            </v-col>
                            <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                                <v-img src="../../../assets/vol.png" contain max-height="60px"
                                       min-height="40px" @click="show_vol"></v-img>
                            </v-col>
                            <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0"
                                   v-if="listeningMode === 'practiceMode'">
                                <v-img src="../../../assets/back.png" contain max-height="60px" @click="goToBack"
                                       min-height="40px"></v-img>

                            </v-col>
                        </v-row>
                    </v-container>
                </v-col>
            </v-row>
        </v-container>
        <v-container fluid>
            <v-row justify="center" align="center">
                <img src="../../../assets/quote_pic.png" height="300vh">
            </v-row>
            <v-row justify="center" align="center">
                <audio id="listening" autoplay v-on:ended="quoteEnded" v-on:timeupdate="progressListening" :controls="(listeningMode === 'reviewMode' || listeningMode === 'practiceMode')">
                    <source :src="quoteAudioFile">
                </audio>
            </v-row>
            <v-row justify="center" align="center">
                <div style="border: black solid 2px">
                    <progress :value="audio.percentage" max="100"></progress>
                </div>
            </v-row>
        </v-container>
      <v-dialog max-width="500" v-model="endDialog">
        <v-card>
          <v-card-title>
            Do You Want To End This Session?
          </v-card-title>
          <v-card-subtitle>
            You can continue this session later.
          </v-card-subtitle>
          <v-card-actions>
            <v-btn @click="endTPO" color="red" style="color: white">Save & End</v-btn>
            <v-btn @click="endDialog = false" color="green" style="color: white">Continue</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app>
</template>

<script>
    import { mapGetters, mapState} from 'vuex'
    import {GO_TO_PREVIOUS_LISTENING, QUOTE_PLAYED} from '@/store/actions/listening'
    import {SAVE_TPO} from "@/store/actions/mainTPO";

    export default {
        name: 'QuotePlayer',
        data: function () {
            return {
              endDialog:false,
                volume_slide: 100,
                audio: {
                    percentage: 0,
                    timerVar: null
                },
                volume: {
                    enabled: false,
                    value: 0,
                },
                time: {
                    enable: true,
                    minutes: 0,
                    seconds: 0,
                }
            }
        },
        watch: {
            volume_slide: function (val) {
                document.getElementById("listening").volume = parseInt(val) / 100.0;
            }
        },
        computed: {
            ...mapGetters(['quoteAudioFile']),
            ...mapState({
                listeningMode: state => state.mainTPO.mode
            })

        },
        methods: {
          endTPO() {
            this.$store.dispatch(SAVE_TPO);
          },
            progressListening(){
                let listening = document.getElementById('listening');
                let duration = listening.duration;
                this.audio.percentage = (listening.currentTime / duration) * 100;
            },
            quoteEnded(){
                this.$store.dispatch(QUOTE_PLAYED);
            },
            show_vol() {
                this.volume.enabled = !this.volume.enabled;
            },
            toggleTimeShow() {
                this.time.enable = !this.time.enable;
            },
            goToBack() {
                this.$store.dispatch(GO_TO_PREVIOUS_LISTENING);
            }

        },
    }


</script>

<style scoped>
    .toolbar {
        height: 115px;
        background: linear-gradient(to right, #4148a2, #822a42);

    }

    progress {
        display: block; /* default: inline-block */
        width: 300px;
        height: 27px;
        /*margin: 2em auto;*/
        border: 10px rgb(129, 136, 132) solid;
        background: none;
        box-shadow: inset 0px 1px 1px rgba(0, 0, 0, 0.5), 0px 1px 0px rgba(255, 255, 255, 0.2);
    }

    progress::-moz-progress-bar {
        border: none;
        background: rgb(115, 245, 253);
        /*box-shadow: inset 0 -2px 4px rgba(0,0,0,0.4), 0 2px 5px 0px rgba(0,0,0,0.3);*/

    }

    progress::-webkit-progress-bar {
        background: black;
    }

    progress::-webkit-progress-value {
        background: rgb(115, 245, 253);
        /*box-shadow: inset 0 -2px 4px rgba(0,0,0,0.4), 0 2px 5px 0px rgba(0,0,0,0.3);*/
    }

    .btn {
        height: 80px;
        width: auto;

    }
</style>
<!--src="http://127.0.0.1:8000/media/listening/listening_toefl.jpeg"-->
