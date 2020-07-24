<template>
  <v-app class="main">
    <v-container fluid class="toolbar" style="padding: 0">
      <v-row justify="space-between" align="start"
             style="padding: 0; padding-top: 29px; padding-bottom: 12px">
        <v-col sm="6" lg="6" cols="6" md="6" style="padding: 0; padding-left: 20px">
          <v-container fluid>
            <v-row justify="start" align="start">
              <v-col style="padding: 0">
                <v-btn to="/" dark rounded small style="margin-right: 10px;">Home</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col sm="6" lg="4" cols="6" md="4" style="padding: 0;padding-right: 30px; ">
          <v-container fluid style="padding: 0">
            <v-row justify="end" align="start" style="padding: 0">

              <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0"
                     v-if="speakingMode === 'reviewMode' || speakingMode === 'practiceMode'">
                <v-img src="../../../assets/back.png" contain max-height="60px" min-height="40px"
                       @click="goToBack"></v-img>
              </v-col>

              <v-col cols="6" md="6" lg="6" sm="6" v-if="volume.enabled">
                <label>
                  <input type="range" v-model="volume_slide">
                </label>
              </v-col>
              <v-col cols="2" md="2" lg="2" sm="2" style="padding: 0">
                <v-img src="../../../assets/vol.png" contain max-height="60px"
                       min-height="40px" @click="show_vol"></v-img>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row align="center" justify="center">
        <img :src="'data:image/jpeg;base64,' + speakingImageSource">
      </v-row>
      <v-row align="center" justify="center">
        <audio id="listening" autoplay :controls="(speakingMode === 'reviewMode' || speakingMode === 'practiceMode')" v-on:ended="listeningEnded" v-on:timeupdate="progressListening">
          <source :src="'data:audio/mp3;base64,' + speakingListeningSource">
        </audio>
      </v-row>
      <v-row justify="center" align="center">
        <div style="border: black solid 2px">
          <progress :value="audio.percentage" max="100"></progress>
        </div>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
  import { mapGetters, mapState } from 'vuex'
  import {GO_TO_NEXT_SPEAKING, GO_TO_PREVIOUS_SPEAKING} from "@/store/actions/speaking";

  export default {
    name: 'SpeakingPlayer',
    data: function () {
      return {
        volume_slide : 100,
        audio:{
          percentage: 0
        },
        volume: {
          enabled: false,
          value: 0,
        },
        timerVar : null
      }
    },
    watch: {
      volume_slide: function(val){
        document.getElementById("listening").volume = parseInt(val)/100.0 ;
      }
    },
    computed:{
      ...mapGetters(['speakingImageSource', 'speakingListeningSource']),
      ...mapState({
        speakingMode: state => state.speaking.speakingMode
      })
    },
    methods: {
      goToBack(){
        this.$store.dispatch(GO_TO_PREVIOUS_SPEAKING)
      },

      listeningEnded(){
        this.$store.dispatch(GO_TO_NEXT_SPEAKING);
      },
      progressListening(){
        let listening = document.getElementById('listening');
        let duration = listening.duration;
        this.audio.percentage = (listening.currentTime / duration) * 100;
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
   progress {
    display: block; /* default: inline-block */
    width: 300px;
    height: 27px;
    /*margin: 2em auto;*/
    border: 10px rgb(129, 136, 132) solid;
    background: none;
    box-shadow: inset 0px 1px 1px rgba(0,0,0,0.5), 0px 1px 0px rgba(255,255,255,0.2);
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
  .toolbar{
    height:110px;
    background: linear-gradient(to right, #4148a2,#822a42) ;

  }
  .btn {
    height: 80px;
    width: auto;

  }
</style>
<!--src="http://127.0.0.1:8000/media/listening/listening_toefl.jpeg"-->
