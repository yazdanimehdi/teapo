<template>
  <v-app class="main">
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

              <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0"
                     v-if="speakingMode === 'reviewMode' || speakingMode === 'practiceMode'">
                <v-img src="../../assets/back.png" contain max-height="60px" min-height="40px"
                       @click="goToBack"></v-img>
              </v-col>

              <v-col cols="6" md="6" lg="6" sm="6" v-if="volume.enabled">
                <label>
                  <input type="range" v-model="volume_slide">
                </label>
              </v-col>
              <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                <v-img src="../../assets/vol.png" contain max-height="60px"
                       min-height="40px" @click="show_vol"></v-img>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
    <div style="margin: 10%;">
      <v-container>
        <v-row style="text-align: left; font-family: Verdana; font-size: 20px; " v-if="!audio_ended">
          Reading time {{speakingReadingTime}} seconds
        </v-row>

        <v-row style="text-align: left; font-family: Verdana; font-size: 20px; " v-else>
          Reading time {{reading_time}} seconds
        </v-row>
        <audio id="before_read" autoplay v-on:ended="audioEnded">
          <source :src="'data:audio/mp3;base64,' + speakingBeforeReadAudio">
        </audio>
        <v-row class="main" v-show="audio_ended" style="padding-top: 20px">
          <h4 style="text-align: center">{{speakingReadingTitle}}</h4>
        </v-row>
        <v-row v-show="audio_ended">
          <div style="font-size: 17px;">{{speakingReading}}</div>
        </v-row>
      </v-container>
    </div>
  </v-app>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import {GO_TO_NEXT_SPEAKING, GO_TO_PREVIOUS_SPEAKING} from "@/store/actions/speaking";
  export default {
    name: "SpeakingReading",
    data() {
      return {
        reading_time: 0,
        reading_total_time:0,
        volume_slide: 100,
        audio: {
          percentage: 0
        },
        volume: {
          enabled: false,
          value: 0,
        },
        audio_ended: false,
        finished: false,
      }
    },
    watch: {
      volume_slide: function (val) {
        document.getElementById("before_read").volume = parseInt(val) / 100.0;
      }
    },
    computed:{
      ...mapGetters(['speakingBeforeReadAudio', 'speakingReadingTitle', 'speakingReading', 'speakingReadingTime']),
      ...mapState({
        speakingMode: state => state.speaking.speakingMode
      })
    },
    methods: {
      goToBack(){
        this.$store.dispatch(GO_TO_PREVIOUS_SPEAKING)
      },
      audioEnded(){
        this.reading_time = this.speakingReadingTime;
        this.reading_total_time = this.speakingReadingTime;
        this.audio_ended = true;
        let self = this;
        let interval = setInterval(function () {
          if (self.reading_time > 0) {

            self.reading_time--;
          }
        }, 1000);
        setTimeout(function () {
          clearInterval(interval);
          self.$store.dispatch(GO_TO_NEXT_SPEAKING);
        }, self.reading_total_time * 1000)

      },

      show_vol() {
        this.volume.enabled = !this.volume.enabled;
      },
      toggleTimeShow() {
        this.time.enable = !this.time.enable;
      },

    },
  }
</script>

<style scoped>
.toolbar{
    height:110px;
    background: linear-gradient(to right, #4148a2,#822a42) ;

  }
  .btn {
    height: 80px;
    width: auto;

  }

</style>
